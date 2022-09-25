import { StateInitState, SetStateBase } from "../../";
export interface UseStorageStateOptions {
    /** 缓存类型 */
    type?: "local" | "session";
    /** false | 是否禁用缓存 */
    disabled?: boolean;
}
declare function setStorage(key: string, val: any, type?: "local" | "session" | undefined): void;
declare function getStorage(key: string, type?: "local" | "session" | undefined): any;
declare function remove(key: string, type?: "local" | "session" | undefined): void;
declare function useStorageBase<T = undefined>(
/** 缓存key */
key: string, 
/** 初始状态 */
initState?: StateInitState<T>, 
/** 其他选项 */
options?: UseStorageStateOptions): [T, SetStateBase<T>];
export declare const useStorageState: typeof useStorageBase & {
    get: typeof getStorage;
    set: typeof setStorage;
    remove: typeof remove;
};
export {};
//# sourceMappingURL=useStorageState.d.ts.map