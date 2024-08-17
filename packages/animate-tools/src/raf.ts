import { __GLOBAL__, type EmptyFunction } from "@m78/utils";

/** requestAnimationFrame的简单兼容性包装，返回一个清理函数而不是一个清理标记 */
export function raf(frameRequestCallback: FrameRequestCallback): EmptyFunction {
  const _raf =
    __GLOBAL__.requestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.webkitRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.mozRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.oRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.msRequestAnimationFrame;

  const clearFn = _raf
    ? __GLOBAL__.cancelAnimationFrame
    : __GLOBAL__.clearTimeout;

  const flag = _raf
    ? _raf(frameRequestCallback)
    : setTimeout(() => frameRequestCallback(Date.now()), 60); // 约等于s/60fps

  return () => clearFn(flag);
}

export type RafFunction = typeof raf;

/** 用于将requestAnimationFrame使用在指令式用法中, 比如拖拽移动dom的场景, rafCaller能确保每帧只会对最新一次回调进行调用, 其他回调会被直接忽略 */
export function rafCaller() {
  let last: FrameRequestCallback | undefined;

  return function rafCall(frameRequestCallback: FrameRequestCallback) {
    last = frameRequestCallback;

    return raf((arg) => {
      if (last) {
        last(arg);
        last = undefined;
      }
    });
  };
}
