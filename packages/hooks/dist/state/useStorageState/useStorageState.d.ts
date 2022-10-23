import { StateInitState, SetStateBase } from "../../";
/** 配置 */
export interface UseStorageStateOptions {
    /** 缓存类型 */
    type?: "local" | "session";
    /** false | 是否禁用缓存 */
    disabled?: boolean;
    /** 缓存有效时间(ms) */
    validTime?: number;
}
declare function setStorage(key: string, val: any, type?: "local" | "session" | undefined): void;
declare function getStorage(key: string, type?: "local" | "session" | undefined, validTime?: number): any;
declare function remove(key: string, type?: "local" | "session" | undefined): void;
/**
 * 基础缓存逻辑实现
 * */
declare function useStorageBase<T = undefined>(key: string, initState?: StateInitState<T>, options?: UseStorageStateOptions): [T, SetStateBase<T>];
/**
 * useState的storage版本
 * */
export declare const useStorageState: typeof useStorageBase & {
    get: typeof getStorage;
    set: typeof setStorage;
    remove: typeof remove;
};
export {};
//# sourceMappingURL=useStorageState.d.ts.map