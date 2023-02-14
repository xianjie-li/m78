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
/** 检测是否是移动设备 */
export declare function isMobileDevice(): boolean;
/** 对requestAnimationFrame的简单兼容性包装, 并且返回清理函数而不是清理标记 */
export declare const raf: (frameRequestCallback: FrameRequestCallback) => EmptyFunction;
//# sourceMappingURL=bom.d.ts.map