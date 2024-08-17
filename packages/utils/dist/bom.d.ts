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
//# sourceMappingURL=bom.d.ts.map