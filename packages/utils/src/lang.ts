import { AnyFunction } from "./common-type.js";

/**
 * return the 'global' object according to different JS running environments
 * */
export function getGlobal(): any {
  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== "undefined") {
    // eslint-disable-next-line no-restricted-globals
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  // @ts-ignore
  if (typeof global !== "undefined") {
    // @ts-ignore
    return global;
  }

  throw new Error("unable to locate global object");
}

export const __GLOBAL__ = getGlobal();

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
export function createEvent<
  Listener extends AnyFunction = AnyFunction
>(): CustomEvent<Listener> {
  const listeners: Listener[] = [];

  function on(listener) {
    listeners.push(listener);
  }

  function off(listener) {
    const ind = listeners.indexOf(listener);
    if (ind !== -1) listeners.splice(ind, 1);
  }

  function emit(...args) {
    listeners.forEach((listener) => listener(...args));
  }

  return {
    on,
    off,
    emit,
  };
}

/** 抛出错误 */
export function throwError(msg: string, prefix?: string): never {
  throw new Error(`${prefix ? `${prefix}:: ` : ""}${msg}`);
}
