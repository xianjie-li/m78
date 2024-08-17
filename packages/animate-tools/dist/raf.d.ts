import { type EmptyFunction } from "@m78/utils";
/** requestAnimationFrame的简单兼容性包装，返回一个清理函数而不是一个清理标记 */
export declare function raf(frameRequestCallback: FrameRequestCallback): EmptyFunction;
export type RafFunction = typeof raf;
/** 用于将requestAnimationFrame使用在指令式用法中, 比如拖拽移动dom的场景, rafCaller能确保每帧只会对最新一次回调进行调用, 其他回调会被直接忽略 */
export declare function rafCaller(): (frameRequestCallback: FrameRequestCallback) => EmptyFunction;
//# sourceMappingURL=raf.d.ts.map