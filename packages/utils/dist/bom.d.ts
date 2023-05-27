import { EmptyFunction } from "./types.js";
/** shortcut to the localStorage api, including automatic JSON.stringify and a spliced unique prefix */
export declare function setStorage(key: string, val: any): void;
/** shortcut of localStorage api, automatic JSON.parse, can only take the value set by setStorage */
export declare function getStorage(key: string): any;
/** get os platform */
export declare function getPlatform(): {
    mac: boolean;
    iphone: boolean;
    ipad: boolean;
    windows: boolean;
    android: boolean;
    linux: boolean;
};
/** Detect if is mobile device */
export declare function isMobileDevice(): boolean;
/** Get command key by system, apple series: command,  other: control */
export declare function getCmdKeyStatus(e: Event): boolean;
/** A simple compatibility wrapper for requestAnimationFrame and returns a cleanup function instead of a cleanup tag */
export declare function raf(frameRequestCallback: FrameRequestCallback): EmptyFunction;
export declare type RafFunction = typeof raf;
/** 用于将requestAnimationFrame使用在指令式用法中, 比如拖拽移动dom的场景, rafCaller能确保每帧只会对最新一次回调进行调用, 其他回调会被直接忽略 */
export declare function rafCaller(): (frameRequestCallback: FrameRequestCallback) => EmptyFunction;
//# sourceMappingURL=bom.d.ts.map