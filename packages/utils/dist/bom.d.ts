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
//# sourceMappingURL=bom.d.ts.map