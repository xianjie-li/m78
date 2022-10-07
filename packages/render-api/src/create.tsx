import React, { useEffect, useMemo, useState } from "react";
import { createEvent } from "@m78/hooks";
import {
  AnyFunction,
  createRandString,
  defer,
  getPortalsNode,
  isFunction,
  omit,
} from "@m78/utils";
import ReactDom from "react-dom";
import { createRoot } from "react-dom/client";
import {
  RenderApiComponentInstance,
  RenderApiInstance,
  RenderApiOption,
  _ComponentItem,
  RenderApiComponentBaseProps,
  RenderApiOmitBuiltState,
} from "./types";

// RenderApiInstance.setOption()的有效值
const updateOptionWhiteList = ["defaultState", "wrap", "maxInstance"];
// RenderApiComponentProps.setState()的有效值onChange应动态从changeKey获取
const setStateWhiteList = ["onDispose", "onUpdate", "instanceRef"];

/**
 * 接收配置并创建一个api实例
 * - S - 组件能够接收的状态, 对应实现组件的扩展props
 * - I - 组件扩展api
 * @param opt - 创建配置
 * */
function create<S extends object, I = null>(
  opt: RenderApiOption<S>
): RenderApiInstance<S, I> {
  const option = { ...opt };

  // updateOptionWhiteList类的配置是可更改的, 必须在使用时实时获取
  const {
    component: Component,
    namespace = "RENDER__BOX",
    showKey = "show",
    changeKey = "onChange",
  } = option;

  /** 对组件进行强缓存, 只允许在_updateFlag变更时更新 */
  const MemoComponent = React.memo(
    Component,
    (prev, next) => prev._updateFlag === next._updateFlag
  );

  /** 实例长度变更 */
  const changeEvent = createEvent();

  /** 在内部共享的状态对象 */
  const ctx = {
    list: [] as _ComponentItem[],
    /** target是否已渲染, 未渲染时调用render会渲染默认Target */
    targetIsRender: false,
  };

  function hide(id: string) {
    const current = getItemById(id);

    if (!current) return;
    if (!current.state[showKey]) return;

    setStateByCurrent(current, {
      [showKey]: false,
    } as any);
  }

  function show(id: string) {
    const current = getItemById(id);

    if (!current) return;
    if (current.state[showKey]) return;

    setStateByCurrent(current, {
      [showKey]: true,
    } as any);
  }

  function dispose(id: string) {
    const ind = getIndexById(id);

    if (ind === -1) return;

    ctx.list.splice(ind, 1);

    changeEvent.emit();
  }

  function disposeAll() {
    ctx.list = [];
    changeEvent.emit();
  }

  /** 设置所有实例的开启或关闭状态 */
  function setAllShow(open: boolean) {
    ctx.list.forEach((item) =>
      setStateByCurrent(
        item,
        {
          [showKey]: open,
        } as any,
        false
      )
    );
    changeEvent.emit();
  }

  /** 设置指定id的实例状态, 不更新状态 */
  function setStateById(
    id: string,
    nState: Partial<RenderApiOmitBuiltState<S>>
  ) {
    const ind = getIndexById(id);
    if (ind === -1) return;
    setStateByCurrent(ctx.list[ind], nState);
  }

  /**
   * 根据实例信息设置其状态并更新updateFlag, autoUpdate = true时才会触发更新
   * 这是更新组件的唯一途径
   * */
  function setStateByCurrent(
    current: _ComponentItem,
    nState: Partial<RenderApiOmitBuiltState<S>>,
    autoUpdate = true
  ) {
    const omitKeys = [...setStateWhiteList, changeKey].join(",");

    Object.assign(current.state, omit(nState, omitKeys));

    current.updateFlag += 1;

    autoUpdate && changeEvent.emit();
  }

  /** 获取指定id的实例 */
  function getItemById(id: string) {
    return ctx.list.find((item) => item.id === id);
  }

  /** 获取指定id实例所在的索引位置 */
  function getIndexById(id: string) {
    return ctx.list.findIndex((item) => item.id === id);
  }

  /** 创建并渲染一个实例 */
  function render(state: Partial<RenderApiOmitBuiltState<S>>) {
    const id = createRandString();

    let innerInstance: any = null;
    /** 存储所有safe操作, 并在RenderApiComponentInstance.current存在时调用 */
    const unsafeCallQueue: AnyFunction[] = [];

    if (isFunction(option.omitState)) {
      state = option.omitState(state);
    }

    /** 创建组件state */
    const _state: RenderApiComponentBaseProps<S, I> = {
      // S
      ...option.defaultState,
      ...state,

      // RenderApiComponentProps
      [showKey]: true,
      [changeKey]: (cur: boolean) => {
        setStateById(id, { [showKey]: cur } as any);
        changeEvent.emit();
      },

      // below RenderApiComponentBaseProps
      onDispose: dispose.bind(null, id),
      onUpdate: setStateById.bind(null, id),
      instanceRef: (instance: I | null) => {
        innerInstance = instance;
        // 在实例可用后, 如果unsafeCallQueue存在内容, 则全部进行处理
        if (innerInstance && unsafeCallQueue.length) {
          unsafeCallQueue
            .splice(0, unsafeCallQueue.length)
            .forEach((cb) => cb());
        }
      },
    };

    const instance: RenderApiComponentInstance<S, any> = {
      hide: hide.bind(null, id),
      show: show.bind(null, id),
      dispose: dispose.bind(null, id),
      state: _state as any,
      setState: _state.onUpdate!,
      current: null,
      safe: (cb) => {
        if (!cb) return;
        if (innerInstance) {
          cb();
          return;
        }
        unsafeCallQueue.push(cb);
      },
    };

    // 实例被设置时接收通知
    Object.defineProperty(instance, "current", {
      get() {
        return innerInstance;
      },
    });

    ctx.list.push({
      id,
      state: _state,
      instance: instance as any,
      updateFlag: 0,
    });

    shakeOverInstance();

    if (!ctx.targetIsRender) {
      ctx.targetIsRender = true;
      // 可能会在瞬间接收到多个render请求, 延迟渲染target以同时处理初始化的多个render
      defer(mountDefaultTarget);
    }

    changeEvent.emit();

    return instance as RenderApiComponentInstance<S, I>;
  }

  // 将超出maxInstance的实例移除, 不会主动触发更新
  function shakeOverInstance() {
    if (option.maxInstance && ctx.list.length > option.maxInstance) {
      ctx.list.splice(0, ctx.list.length - option.maxInstance);
    }
  }

  const setOption: RenderApiInstance<any, any>["setOption"] = (_opt) => {
    const o: any = {};
    const keys = Object.keys(_opt);
    // 是否需要更新ui
    let needUpdate = false;

    keys.forEach((key) => {
      if (updateOptionWhiteList.includes(key)) {
        o[key] = _opt[key as "wrap"];
      }

      if (key === "wrap" || key === "maxInstance") {
        needUpdate = true;
      }
    });
    Object.assign(option, o);

    if (needUpdate) {
      changeEvent.emit();
    }
  };

  function mountDefaultTarget() {
    const container = document.createElement("div");
    container.setAttribute("data-describe", "RENDER-API DEFAULT TARGET");
    document.body.appendChild(container);

    const root = createRoot(container);

    root.render(<RenderTarget />);
  }

  /** 挂载点 */
  function RenderTarget() {
    useMemo(() => (ctx.targetIsRender = true), []);

    const [, update] = useState(0);

    changeEvent.useEvent(() => {
      update((p) => p + 1);
    });

    useEffect(() => {
      // 在默认target渲染完成之前可能会有状态变更, 渲染完成后统一更新一次
      update((p) => p + 1);
    }, []);

    function renderList() {
      return ctx.list.map(({ id, instance, state, updateFlag }) => {
        return (
          <MemoComponent
            {...state}
            key={id}
            instance={instance}
            _updateFlag={updateFlag}
          />
        );
      });
    }

    const Wrap = option.wrap;

    const node = Wrap ? <Wrap>{renderList()}</Wrap> : renderList();

    return ReactDom.createPortal(node, getPortalsNode(namespace));
  }

  return {
    RenderTarget,
    render,
    hideAll: () => setAllShow(false),
    showAll: () => setAllShow(true),
    disposeAll,
    getInstances: () => ctx.list.map((item) => item.instance),
    events: {
      change: changeEvent,
    },
    setOption,
    getOption: () => ({ ...option }),
  };
}

export default create;
