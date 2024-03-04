import { AnyFunction } from "./types";
import { getNamePathValue, setNamePathValue } from "./object.js";
import { isArray, isObject } from "./is.js";

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
  on: (
    /** event listener */
    listener: Listener,
    /** accept emit argument, and skip event if return false */
    filter?: (...args: Parameters<Listener>) => boolean
  ) => void;
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
export function createEvent<
  Listener extends AnyFunction = AnyFunction
>(): CustomEvent<Listener> {
  const listeners: Listener[] = [];

  function on(listener, filter) {
    setNamePathValue(listener, "__eventFilter", filter);
    listeners.push(listener);
  }

  function off(listener) {
    const ind = listeners.indexOf(listener);
    if (ind !== -1) {
      const del = listeners.splice(ind, 1);

      setNamePathValue(del[0], "__eventFilter", undefined);
    }
  }

  function emit(...args) {
    listeners.forEach((listener) => {
      const filter = getNamePathValue(listener, "__eventFilter");
      if (filter && !filter(...args)) return;
      listener(...args);
    });
  }

  function empty() {
    listeners.length = 0;
  }

  return {
    on,
    off,
    emit,
    empty,
    get length() {
      return listeners.length;
    },
  };
}

/** 抛出错误 */
export function throwError(msg: string, prefix?: string): never {
  throw new Error(`${prefix ? `${prefix}:: ` : ""}${msg}`);
}

/** Deep cloning implemented using JSON.parse/stringify */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * "Deep clone" given value
 *
 * All arrays/objects will be expanded and cloned, while all other types of values will remain unchanged.
 * */
export function simplyDeepClone<T = any>(value: any): T {
  if (isObject(value)) {
    const newObj: any = {};

    Object.keys(value).forEach((k) => {
      newObj[k] = simplyDeepClone(value[k]);
    });

    return newObj;
  }

  if (isArray(value)) {
    const newArr: any[] = value.slice();

    newArr.forEach((i, ind) => {
      newArr[ind] = simplyDeepClone(i);
    });

    return newArr as T;
  }

  return value;
}

/**
 * Deep check values is equal
 *
 * All arrays/objects will be expanded and check, while all other types of values will just check reference.
 * */
export function simplyEqual(value: any, value2: any): boolean {
  if (isObject(value)) {
    const keys1 = Object.keys(value);

    if (!isObject(value2)) return false;

    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) return false;

    for (const k of keys1) {
      const v = value[k];
      const v2 = value2[k];
      const equal = simplyEqual(v, v2);
      if (!equal) return false;
    }
    return true;
  }

  if (isArray(value)) {
    if (!isArray(value2)) return false;

    if (value.length !== value2.length) return false;

    for (let i = 0; i < value.length; i++) {
      const v = value[i];
      const v2 = value2[i];
      const equal = simplyEqual(v, v2);
      if (!equal) return false;
    }
    return true;
  }

  return value === value2;
}
