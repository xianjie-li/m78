import { useEffect, useMemo, useRef } from "react";
import { createRandString, isArray } from "@m78/utils";
import { createEvent, useUpdateEffect, useUpdate } from "../../index.js";

/** 单个组件实例 */
export interface SameItem<Meta = any> {
  /** 该组件的唯一key */
  id: string;
  /** 该组件的递增值, 用于排序, 组件挂载得越早, 值越小 */
  sort: number;
  /** 该组件需要共享给其他组件的元信息 */
  meta: Meta;
  /** 是否启用 */
  enable: boolean;
}

interface Same {
  [key: string]: Array<SameItem>;
}

type Returns<Meta> = readonly [number, Array<SameItem<Meta>>, string];

/** 所有共享数据 */
const sameMap: Same = {};

/** 所有事件对象 */
const events: {
  [key: string]: ReturnType<typeof createEvent>;
} = {};

const defaultConfig = {
  deps: [],
  enable: true,
  updateDisabled: false,
};

/** 递增值, 用于存储组件第一次挂载的时间点 */
let increment = 0;

/** 以指定key获取事件对象，不存在时创建并返回 */
function getEvent(key: string) {
  const e = events[key];
  if (e) return e;
  events[key] = createEvent();
  return events[key];
}

// 通过list来生成状态, 组件一直保持list为最新状态

/**
 * 用于对同组件的不同实例进行管理，获取其他已渲染组件的共享数据以及当前处在启用实例中的顺序
 *
 * `常见用例有`:
 * - 获取Modal等组件的实例关系，根据组件渲染顺序设置zIndex，隐藏多余的mask等
 * - 对于Drawer等组件，根据渲染顺序调整显示的层级
 * @param key - 标识该组件的唯一key
 * @param config - 额外配置
 * @param config.meta - 用于共享的组件源数据，可以在同组件的其他实例中获取到
 * @param config.deps - [] | 出于性能考虑, 只有index和instances变更才会通知其他组件更新, meta是不会通知的, 可以通过配置此项使deps任意一项变更后都通知其他组件
 * @param config.enable - true | 只有在enable的值为true时，该实例才算启用并被钩子接受, 通常为Modal等组件的toggle参数 * @return state - 同类型启用组件共享的状态
 * @param config.updateDisabled - false | 发生变更时, 是否通知enable为false的组件更新
 * @return state[0] index - 该组件实例处于所有实例中的第几位，未启用的组件返回-1
 * @return state[1] instances - 所有启用状态的组件<Item>组成的数组，正序
 * @return state[2] id - 该组件实例的唯一标识
 * */
export function useSame<Meta = any>(
  key: string,
  config?: {
    meta?: Meta;
    deps?: any[];
    enable?: boolean;
    updateDisabled?: boolean;
  }
): Returns<Meta> {
  const conf = {
    ...defaultConfig,
    ...config,
  };

  const id = useMemo(() => createRandString(2), []);
  const sort = useMemo(() => ++increment, []);
  /** 最后一次返回的信息, 用于对比验证是否需要更新 */
  const lastReturn = useRef<Returns<Meta> | undefined>();

  /* 在某个组件更新了sameMap后，需要通知其他相应的以最新状态更新组件 */
  const update = useUpdate(true);
  const { emit, useEvent } = useMemo(
    () => getEvent(`${key}_same_custom_event`),
    []
  );

  useMemo(() => {
    // 创建item
    const item: SameItem = {
      id,
      sort,
      meta: conf.meta || {},
      enable: conf.enable,
    };

    const [current] = getCurrent();

    current.push(item);

    current.sort((a, b) => a.sort - b.sort);
  }, []);

  // 将最新状态实时设置到当前的item上
  useMemo(() => {
    setCurrentState(conf.enable, conf.meta);
  }, [conf.meta, conf.enable]);

  // cIndex变更时，通知其他钩子进行更新
  useUpdateEffect(() => emit(id, true), [...conf.deps]);

  // enable变更时通知更新
  useEffect(() => {
    if (conf.enable) emit(id);

    return () => {
      const [, index] = getCurrent();
      index !== -1 && emit(id);
    };
  }, [conf.enable]);

  // unmount时通知其他组件并移除当前项
  useEffect(() => {
    return () => {
      // 卸载时移除item
      const [cur, index] = getCurrent();
      if (index !== -1) {
        const item = cur[index];
        cur.splice(index, 1);
        item.enable && emit(id);
      }
    };
  }, []);

  /** 获取过滤掉非enable项的所有item, 当前index和id */
  function get() {
    const [current] = getCurrent();

    const filter = current.filter((item) => item.enable);
    const index = filter.findIndex((item) => item.id === id);

    return [index, filter, id] as const;
  }

  /** 获取当前组件在sameMap中的实例组和该组件在实例中的索引并确保sameMap[key]存在 */
  function getCurrent() {
    // 无实例存在时赋初始值
    if (!isArray(sameMap[key])) {
      sameMap[key] = [];
    }

    const index = sameMap[key].findIndex((item) => item.id === id);

    return [sameMap[key], index] as const;
  }

  /** 接收组件更新通知 */
  useEvent((_id: string, force?: boolean) => {
    // 触发更新的实例不更新
    if (_id === id) return;

    if (!conf.updateDisabled && !conf.enable) return;

    // 强制更新, 不添加额外条件, 主要目的是同步meta
    if (force) {
      update();
      return;
    }

    if (!lastReturn.current) return;

    const [index, current] = get();
    const [lastIndex, lastCurrent] = lastReturn.current;

    if (index !== lastIndex || current.length !== lastCurrent.length) {
      update();
    }
  });

  /* 设置当前实例的状态 */
  function setCurrentState(_enable: boolean, _meta?: Meta) {
    const [current, index] = getCurrent();

    if (index !== -1) {
      current[index].enable = _enable;
      current[index].meta = _meta;
    }
  }

  const returns = get();

  lastReturn.current = [
    returns[0],
    [...returns[1]] /* 需要存储拷贝 */,
    returns[2],
  ];

  return returns;
}
