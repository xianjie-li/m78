import { AnyFunction } from "./common-type.js";
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
    on: (listener: Listener) => void;
    /** destroy a listener */
    off: (listener: Listener) => void;
    /** trigger listeners */
    emit: (...args: Parameters<Listener>) => void;
}
/**
 * create a CustomEvent
 * */
export declare function createEvent<Listener extends AnyFunction = AnyFunction>(): CustomEvent<Listener>;
/** 抛出错误 */
export declare function throwError(msg: string, prefix?: string): never;
//# sourceMappingURL=lang.d.ts.map