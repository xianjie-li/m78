import React, { useEffect, useMemo, useState } from "react";
import { createEvent } from "@m78/hooks";
import { createRandString, getPortalsNode, isFunction, omit } from "@m78/utils";
import ReactDom, { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import {
  RenderApiComponentInstance,
  RenderApiInstance,
  RenderApiOption,
  _ComponentItem,
  RenderApiComponentBaseProps,
  RenderApiOmitBuiltState,
} from "./types.js";

// 改动
// - 去掉延迟相关的内容
// - 初次render时使用flushSync进行同步渲染, 未设置挂载点时默认挂载点也需要使用flushSync同步渲染
//
// 概念
// react root render是同步的
// 17/18兼容性处理

// RenderApiInstance.setOption()的有效值
const updateOptionWhiteList = ["defaultState", "wrap", "maxInstance"];

// RenderApiComponentProps.setState()调用中应排除的值, open/onChange应动态从changeKey获取
const setStateBlackList = ["onDispose", "onUpdate", "instanceRef"];

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

  const {
    component: Component,
    namespace = "RENDER__BOX",
    openKey = "open",
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
    /** 实例列表 */
    list: [] as _ComponentItem[],
    /** target是否已渲染, 未渲染时调用render会渲染默认Target */
    targetIsRender: false,
  };

  function close(id: string) {
    const current = getItemById(id);

    if (!current) return;
    if (!current.state[openKey]) return;

    setStateByCurrent(current, {
      [openKey]: false,
    } as any);
  }

  function open(id: string) {
    const current = getItemById(id);

    if (!current) return;
    if (current.state[openKey]) return;

    setStateByCurrent(current, {
      [openKey]: true,
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
  function setAllOpen(open: boolean) {
    ctx.list.forEach((item) =>
      setStateByCurrent(
        item,
        {
          [openKey]: open,
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
    const it = getItemById(id);
    if (!it) return;
    setStateByCurrent(it, nState);
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
    const omitKeys = [...setStateBlackList, changeKey].join(",");

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

    if (isFunction(option.omitState)) {
      state = option.omitState(state);
    }

    const instance: RenderApiComponentInstance<S, any> = {};

    /** 创建组件state */
    const _state: RenderApiComponentBaseProps<S, I> = {
      // S
      ...option.defaultState,
      ...state,

      // RenderApiComponentProps
      [openKey]: true,
      [changeKey]: (cur: boolean) => {
        setStateById(id, { [openKey]: cur } as any);
        changeEvent.emit();
      },

      // below RenderApiComponentBaseProps
      onDispose: dispose.bind(null, id),
      onUpdate: setStateById.bind(null, id),
      instanceRef: (extIns: I | null) => {
        if (extIns === null) {
          // 清空占用
          for (const instanceKey in instance) {
            delete instance[instanceKey];
          }
        } else {
          Object.assign(instance, extIns);
        }
      },
    };

    const instanceBase: RenderApiComponentInstance<S, any> = {
      close: close.bind(null, id),
      open: open.bind(null, id),
      dispose: dispose.bind(null, id),
      state: _state as any,
      setState: _state.onUpdate!,
    };

    Object.assign(instance, instanceBase);

    ctx.list.push({
      id,
      state: _state,
      instance: instance as any,
      updateFlag: 0,
    });

    shakeOverInstance();

    if (!ctx.targetIsRender) {
      ctx.targetIsRender = true;
      mountDefaultTarget();
    }

    // 同步渲染, 否则在扩展了实例时不能马上获取到
    flushSync(() => {
      changeEvent.emit();
    });

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

    return ReactDom.createPortal(
      node,
      getPortalsNode(namespace, {
        className: "m78-root m78",
      })
    );
  }

  return {
    RenderTarget,
    render,
    closeAll: () => setAllOpen(false),
    openAll: () => setAllOpen(true),
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
