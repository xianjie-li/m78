import { StateInitState, SetStateBase, useFn } from "../../";
import { __GLOBAL__ } from "@m78/utils";
import { useState } from "react";

/** 配置 */
export interface UseStorageStateOptions {
  /** 缓存类型 */
  type?: "local" | "session";
  /** false | 是否禁用缓存 */
  disabled?: boolean;
  /** 缓存有效时间(ms) */
  validTime?: number;
}

/** 缓存key前缀 */
const BASE_KEY = "USE_STORAGE_CACHE";

const getCacheKey = (key: string) => `${BASE_KEY}_${key.toUpperCase()}`;
const getCacheTimeKey = (key: string) => `${BASE_KEY}_${key.toUpperCase()}_AT`;

/** 用于缓存的环境api */
const storageMethod = {
  local: (__GLOBAL__ as Window).localStorage,
  session: (__GLOBAL__ as Window).sessionStorage,
};

function setStorage(
  key: string,
  val: any,
  type = "session" as UseStorageStateOptions["type"]
) {
  if (val === undefined) return;
  const method = storageMethod[type!];
  if (!method) return;
  method.setItem(getCacheKey(key), JSON.stringify(val));
  method.setItem(getCacheTimeKey(key), String(Date.now()));
}

function getStorage(
  key: string,
  type = "session" as UseStorageStateOptions["type"],
  validTime = 0
) {
  const method = storageMethod[type!];
  if (!method) return null;
  const cache = method.getItem(getCacheKey(key));

  if (cache === null) return null;

  const cacheTime = Number(method.getItem(getCacheTimeKey(key)));

  const data = JSON.parse(cache);

  if (!validTime || Number.isNaN(cacheTime) || !cacheTime) return data;

  const diff = Date.now() - (validTime + cacheTime);

  if (diff > 0) {
    remove(key, type);
    return null;
  }

  return data;
}

function remove(
  key: string,
  type = "session" as UseStorageStateOptions["type"]
) {
  const method = storageMethod[type!];
  if (!method) return;
  method.removeItem(getCacheKey(key));
  method.removeItem(getCacheTimeKey(key));
}

const defaultOptions: Required<UseStorageStateOptions> = {
  type: "session",
  disabled: false,
  validTime: 0,
};

/**
 * 基础缓存逻辑实现
 * */
function useStorageBase<T = undefined>(
  key: string,
  initState?: StateInitState<T>,
  options?: UseStorageStateOptions
): [T, SetStateBase<T>] {
  const opt = {
    ...defaultOptions,
    ...options,
  };

  const [state, setState] = useState<T>(() => {
    if (!opt.disabled) {
      const cache = getStorage(key, opt.type, options?.validTime);
      if (cache !== null) {
        // null以外的值都视为缓存
        return cache;
      }
    }

    if (initState instanceof Function) {
      const _initState = initState();
      !opt.disabled && setStorage(key, _initState, opt.type);
      return _initState;
    }
    !opt.disabled && setStorage(key, initState, opt.type);
    return initState;
  });

  const memoSetState: SetStateBase<T> = useFn((patch) => {
    if (patch instanceof Function) {
      setState((prev) => {
        const patchRes = patch(prev);
        !opt.disabled && setStorage(key, patchRes, opt.type);
        return patchRes;
      });
    } else {
      !opt.disabled && setStorage(key, patch, opt.type);
      setState(patch);
    }
  });

  return [state, memoSetState];
}

/**
 * useState的storage版本
 * */
export const useStorageState = Object.assign(useStorageBase, {
  get: getStorage,
  set: setStorage,
  remove,
});
