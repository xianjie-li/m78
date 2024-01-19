import { EmptyFunction } from "./types.js";
/** Simple wrap of storage.setItem api */
export declare function setStorage(key: string, val: any): void;
/** Simple wrap of storage.getItem api */
export declare function getStorage(key: string): any;
/** Simple wrap of storage.removeItem api */
export declare function removeStorage(key: string): void;
/** Run setStorage / getStorage / removeStorage with specified storage object */
export declare function withStorage(storage: Storage, cb: EmptyFunction): void;
/** Get os platform */
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
/** Get command key by system, apple series: metaKey,  other: ctrlKey */
export declare function getCmdKey(): "metaKey" | "ctrlKey";
/** Get command key status by system, apple series: metaKey,  other: ctrlKey */
export declare function getCmdKeyStatus(e: Event): boolean;
/** A simple compatibility wrapper for requestAnimationFrame and returns a cleanup function instead of a cleanup tag */
export declare function raf(frameRequestCallback: FrameRequestCallback): EmptyFunction;
export type RafFunction = typeof raf;
/** 用于将requestAnimationFrame使用在指令式用法中, 比如拖拽移动dom的场景, rafCaller能确保每帧只会对最新一次回调进行调用, 其他回调会被直接忽略 */
export declare function rafCaller(): (frameRequestCallback: FrameRequestCallback) => EmptyFunction;
//# sourceMappingURL=bom.d.ts.map