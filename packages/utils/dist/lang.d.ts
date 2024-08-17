import { AnyFunction } from "./types.js";
/**
 * return the 'global' object according to different JS running environments
 * */
export declare function getGlobal(): any;
export declare const __GLOBAL__: any;
/**
 * custom event
 * */
export interface CustomEvent<Listener extends AnyFunction> {
    /** register a listener */
    on: (
    /** event listener */
    listener: Listener, 
    /** accept emit argument, and skip event if return false */
    filter?: (...args: Parameters<Listener>) => boolean) => void;
    /** destroy a listener */
    off: (listener: Listener) => void;
    /** trigger listeners */
    emit: (...args: Parameters<Listener>) => void;
    /** empty all listener */
    empty: () => void;
    /** 订阅的listener总数 */
    length: number;
}
/**
 * create a CustomEvent
 * */
export declare function createEvent<Listener extends AnyFunction = AnyFunction>(): CustomEvent<Listener>;
/** 抛出错误 */
export declare function throwError(msg: string, prefix?: string): never;
/** Deep cloning implemented using JSON.parse/stringify */
export declare function deepClone<T>(obj: T): T;
/**
 * "Deep clone" given value
 *
 * All arrays/objects will be expanded and cloned, while all other types of values will remain unchanged.
 * */
export declare function simplyDeepClone<T = any>(value: any): T;
/**
 * Deep check values is equal
 *
 * All arrays/objects will be expanded and check, while all other types of values will just check reference.
 * */
export declare function simplyEqual(value: any, value2: any): boolean;
//# sourceMappingURL=lang.d.ts.map