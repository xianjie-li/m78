import React, { RefObject, useMemo } from "react";
import { _Context, ScrollProps } from "./types.js";
import {
  _defaultProps,
  _getScrollStyleByDirection,
  _RESERVE_BAR_SIZE,
} from "./common.js";
import clsx from "clsx";
import {
  useMeasure,
  useScroll,
  UseScrollMeta,
  useSelf,
  useSetState,
} from "@m78/hooks";
import { _useBar } from "./use-bar.js";
import { _useLifeCycle } from "./use-life-cycle.js";
import { _useMethod } from "./use-method.js";
import _useIndicator from "./use-indicator.js";
import _usePullActions from "./use-pull-actions.js";
import { animated } from "react-spring";

export const _Scroll = (p: ScrollProps) => {
  const props = p as _Context["props"];
  const { direction } = props;

  /** 组件状态 */
  const [state, setState] = useSetState<_Context["state"]>({
    enableStatus: {
      x: false,
      y: false,
    },
    xVisible: false,
    yVisible: false,
    xPadding: _RESERVE_BAR_SIZE,
    yPadding: _RESERVE_BAR_SIZE,
    touchTop: false,
    touchBottom: false,
    touchLeft: false,
    touchRight: false,
    xMax: 0,
    yMax: 0,
    pullDownRunning: false,
  });

  /** 组件实例属性 */
  const self = useSelf<_Context["self"]>({
    delayHiddenTimer: 0,
    delayHiddenLock: false,
  });

  /** 滚动容器样式 */
  const directionStyle = useMemo(() => {
    return _getScrollStyleByDirection(direction);
  }, [direction]);

  /** 滚动控制器 */
  const scroller = useScroll({
    throttleTime: 0,
    onScroll,
  });

  /** 监听滚动容器变更 */
  const [bound, contRef] = useMeasure(undefined, 200);

  /** 上下文对象, 用于切分代码 */
  const ctx: _Context = {
    props,
    scroller,
    state,
    setState,
    self,
    directionStyle,
    bound,
    pullDownEnabled: !!props.onPullDown,
  };

  /** 滚动条相关 */
  const bar = _useBar(ctx);

  /** 方法 */
  const methods = _useMethod(ctx);

  /** 钩子 */
  const lifeCycle = _useLifeCycle(ctx, methods, bar);

  /** 滚动标记 */
  const indicator = _useIndicator(ctx, methods);

  const pull = _usePullActions(ctx);

  function onScroll(meta: UseScrollMeta) {
    lifeCycle.onScroll(meta);
  }

  return (
    <div
      className={clsx(
        "m78 m78-scroll",
        props.className,
        `__${direction}`,
        props.miniBar && "__mini-bar"
      )}
      style={props.style}
    >
      {/* 滚动容器, 多这一层是为了能在滚动容器以外放置和显示内容 */}
      <animated.div
        className="m78-scroll_wrap"
        style={{
          ...directionStyle,
          ...bar.offsetStyle,
          y: pull.springStyle.y,
          userSelect: ctx.pullDownEnabled ? "none" : undefined,
        }}
        ref={scroller.ref as RefObject<HTMLDivElement>}
      >
        {/* 内容容器 */}
        <div
          className="m78-scroll_cont"
          ref={contRef as RefObject<HTMLDivElement>}
        >
          {props.children}
        </div>
      </animated.div>
      {/* 额外节点 */}
      {props.wrapExtra}
      {bar.barNode}
      {indicator}
      {pull.pullDownNode}
    </div>
  );
};

_Scroll.displayName = "Scroll";
_Scroll.defaultProps = _defaultProps;
