import { __GLOBAL__, dumpFn, isEmpty, isFunction, isObject } from "@m78/utils";
import _debounce from "lodash/debounce.js";
import _throttle from "lodash/throttle.js";
import React, { useEffect } from "react";
import {
  useEffectEqual,
  useFn,
  useSelf,
  useSetState,
  useStorageState,
  SetStateBase,
} from "../../index.js";

const GLOBAL = __GLOBAL__ as Window;

interface UseFetchOptions<Data, Payload> {
  /** 传递给请求函数的参数, 当发生改变时，会以新值发起调用请求。传递此项时，payload会被忽略。 */
  param?: Payload;
  /** [] | 类似useEffect(fn, deps)，当依赖数组内的值发生改变时，会以当前payload进行更新请求, 请勿传入未memo的引用类型值 */
  deps?: any[];
  /** false | 只能通过send来手动触发请求 */
  manual?: boolean;
  /** 10000 | 超时时间(ms) */
  timeout?: number;
  /** true | 只有为true时才会发起请求, 可以用来实现串联请求 */
  pass?: boolean;
  /** 初始data */
  initData?: (() => Data) | Data;
  /** 初始payload, 在不存在param配置时，作为参数传递给请求方法 */
  initPayload?: (() => Payload) | Payload;
  /** 成功回调, 当为更新请求(无参调用send、deps/param等配置发起请求)时，isUpdate为true */
  onSuccess?: (result: Data, isUpdate: boolean) => void;
  /** 错误回调, error为请求函数中抛出的错误 */
  onError?: (error: any) => void;
  /** 无论成功与否都会调用。在旧的请求被新的请求覆盖掉时, 不会触发。 */
  onFinish?: () => void;
  /** 请求超时的回调 */
  onTimeout?: () => void;
  /** 用于缓存的key，传递后，会将(payload, data, arg)缓存到session中，下次加载时将读取缓存数据作为初始值 */
  cacheKey?: string;
  /** true | 当传入了cacheKey且存在缓存数据时，是否进行swr(stale-while-revalidate)请求 */
  stale?: boolean;
  /** 节流间隔时间，传入时，开启节流, 只有初始化时的配置会生效 */
  throttleInterval?: number;
  /** 防抖间隔时间，传入时，开启防抖, 只有初始化时的配置会生效, 当存在throttleInterval时，此配置不会生效 */
  debounceInterval?: number;
}

interface UseFetchReturns<Data, Payload> {
  /** 是否正在请求 */
  loading: boolean;
  /** method方法reject时，error为它reject的值。 */
  error: any;
  /** 请求超时设置为true */
  timeout: boolean;
  /** method方法resolve的值或initData */
  data: Data;
  /** 当前用于请求的payload或initPayload */
  payload: Payload;
  /** 当前用于请求的param */
  param: Payload;
  /** 设置当前的data */
  setData: SetStateBase<Data>;
  /** 取消请求 */
  cancel: () => void;
  /**
   * 根据参数类型不同，会有不同效果:
   * - 带参数: 以新的payload发起请求并设置payload
   * - 无参数/参数为react合成事件: 以当前参数发起更新请求
   * - 传入了param配置项: 当存在param配置，一律视为更新并以当前param的值发起更新. 此时，传入的payload会被忽略
   *
   * 返回一个promise对象, 请求结果的结果决定其状态
   * */
  send: (
    newPayload?:
      | Payload
      | React.SyntheticEvent /* SyntheticEvent是为了直接将send绑定给onClick等时不出现类型错误 */
  ) => Promise<Data>;
}

/** 简单的判断是否为合成事件 */
function isSyntheticEvent(arg: any) {
  if (!arg) return false;

  return (
    isObject(arg) && "nativeEvent" in arg && "target" in arg && "type" in arg
  );
}

/**
 * 以hooks的方式来发起数据请求
 * - <Data> 响应值的类型
 * - <Payload> 参数类型
 * @param method - 获取数据的函数, 其必须返回一个Promise对象, useFetch会根据promise的状态决定请求的结果, 如果此项不为函数时不会走请求流程, 表现与options.pass相似, 可以用来实现简短的串联请求
 * @param options - 请求配置
 * */
function useFetch<Data = any, Payload = any>(
  method?: any,
  options = {} as UseFetchOptions<Data, Payload>
) {
  const self = useSelf({
    /** 请求的唯一标示，在每一次请求开始前更新，并作为请求有效性的凭据 */
    fetchID: 0,
    /** 完成请求次数 */
    fetchCount: 0,
    /** 超时计时器 */
    timeoutTimer: 0,
    /** 保持返回对象引用不变 */
    returnValues: {} as UseFetchReturns<Data, Payload>,
  });

  const {
    initData,
    initPayload,
    deps = [],
    param,
    manual = false,
    timeout = 10000,
    onSuccess,
    onError,
    onFinish,
    onTimeout,
    cacheKey,
    stale = true,
    throttleInterval,
    debounceInterval,
    pass: aPass = true,
  } = options;

  const cacheEnable = !!cacheKey;

  const pass = aPass && isFunction(method);

  const [state, setState] = useSetState({
    loading: !manual && pass,
    error: undefined as any,
    timeout: false,
  });

  // 防止卸载后赋值
  useEffect(() => {
    return () => {
      self.fetchID = 0; // 超时后阻止后续赋值操作
      self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
    };
  }, []);

  const [payload, setPayload] = useStorageState(
    `${cacheKey}_FETCH_PAYLOAD`,
    initPayload,
    {
      disabled: !cacheEnable,
    }
  );

  const [data, setData] = useStorageState(`${cacheKey}_FETCH_DATA`, initData, {
    disabled: !cacheEnable,
  });

  const fetchHandel = useFn(
    async function _fetchHandel(args: any, isUpdate = false) {
      if (!pass) {
        throw new Error("the request has been ignored");
      }

      // self.lastFetch = Date.now();

      const cID = Math.random();
      self.fetchID = cID;

      // 清除上一个计时器
      self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
      self.timeoutTimer = GLOBAL.setTimeout(() => {
        cancel();
        onTimeout?.();
        setState(getResetState("timeout", true));
      }, timeout);

      // 记录当前计时器
      const cTimeoutTimer = self.timeoutTimer;

      // 减少更新次数
      if (!state.loading) {
        setState(getResetState("loading", true));
      }

      try {
        const res = await method(args);
        if (cID === self.fetchID) {
          setData(res);
          setState(getResetState("loading", false));
          onSuccess?.(res, isUpdate);
          return res;
        }
      } catch (err) {
        if (cID === self.fetchID) {
          setState(getResetState("error", err));
          onError?.(err);
          throw err;
        }
      } finally {
        // 清理当前计时器
        cTimeoutTimer && GLOBAL.clearTimeout(cTimeoutTimer);

        if (cID === self.fetchID) {
          onFinish?.();
          self.fetchCount++;
        }
      }
    },
    (fn) => {
      if (throttleInterval) {
        return _throttle(fn, throttleInterval);
      }

      if (debounceInterval) {
        return _debounce(fn, debounceInterval);
      }

      return fn as any;
    }
  );

  /** 手动发起请求 */
  const send = useFn((newPayload?: Payload) => {
    const isUpdate = isSyntheticEvent(newPayload) || newPayload === undefined;
    return fetchHandel(getActualPayload(newPayload), isUpdate);
  });

  /** 监听param改变并执行缓存更新，发起请求 */
  useEffectEqual(() => {
    if (!("param" in options)) return;
    if (self.fetchCount === 0 || manual) return;
    fetchHandel(getActualPayload(), false).catch(dumpFn); // 走到这里说明参数已经改变了
  }, [param]);

  /** 一些自动触发请求的操作 */
  useEffect(() => {
    if (manual || !pass) return;
    // 初次请求时，如果有数据且禁用了stale，取消请求
    if (!stale && self.fetchCount === 0 && !isEmpty(data)) {
      setState({
        loading: false,
      });
      return;
    }
    fetchHandel(getActualPayload(), self.fetchCount !== 0).catch(dumpFn);
  }, [pass, ...deps]);

  /** 接受可选的新payload，并根据条件返回传递给fetchHandel的参数(使用param或payload) */
  function getActualPayload(newPayload?: Payload) {
    // 包含param配置项，使用当前param更新
    if ("param" in options) {
      return param;
    }

    // 参数为合成事件或未传，视为更新请求，使用当前payload进行更新请求
    if (isSyntheticEvent(newPayload) || newPayload === undefined) {
      return payload;
    }

    // 包含新的payload，更新payload值并使用新的payload更新请求
    setPayload(newPayload as Payload); // 同步新的payload
    return newPayload;
  }

  /** 返回一个将互斥的状态还原的对象，并通过键值覆盖设置某个值 */
  function getResetState(key?: string, value?: any) {
    const resetState: any = {
      loading: false,
      error: undefined,
      timeout: false,
    };

    if (key) {
      resetState[key] = value;
    }

    return resetState;
  }

  /** 取消请求 */
  function cancel() {
    self.fetchID = 0; // 超时后阻止后续赋值操作
    self.timeoutTimer && GLOBAL.clearTimeout(self.timeoutTimer);
    setState({
      loading: false,
    });
  }

  return Object.assign(self.returnValues, {
    ...state,
    send,
    data,
    payload,
    param,
    setData,
    cancel,
  });
}

export { useFetch, UseFetchOptions, UseFetchReturns };
