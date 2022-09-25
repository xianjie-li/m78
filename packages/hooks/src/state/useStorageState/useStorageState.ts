import { StateInitState, SetStateBase, useFn } from "../../";
import { __GLOBAL__ } from "@m78/utils";
import { useState } from "react";

export interface UseStorageStateOptions {
  /** 缓存类型 */
  type?: "local" | "session";
  /** false | 是否禁用缓存 */
  disabled?: boolean;
}

const BASE_KEY = "USE_STORAGE_CACHE";

const storagMethod = {
  local: (__GLOBAL__ as Window).localStorage,
  session: (__GLOBAL__ as Window).sessionStorage,
};

function setStorage(
  key: string,
  val: any,
  type = "session" as UseStorageStateOptions["type"]
) {
  if (val === undefined) return;
  const method = storagMethod[type!];
  if (!method) return;
  method.setItem(`${BASE_KEY}_${key.toUpperCase()}`, JSON.stringify(val));
}

function getStorage(
  key: string,
  type = "session" as UseStorageStateOptions["type"]
) {
  const method = storagMethod[type!];
  if (!method) return;
  const cache = method.getItem(`${BASE_KEY}_${key.toUpperCase()}`);
  return cache === null ? cache : JSON.parse(cache);
}

function remove(
  key: string,
  type = "session" as UseStorageStateOptions["type"]
) {
  const method = storagMethod[type!];
  if (!method) return;
  method.removeItem(`${BASE_KEY}_${key.toUpperCase()}`);
}

const defaultOptions: Required<UseStorageStateOptions> = {
  type: "session",
  disabled: false,
};

function useStorageBase<T = undefined>(
  /** 缓存key */
  key: string,
  /** 初始状态 */
  initState?: StateInitState<T>,
  /** 其他选项 */
  options?: UseStorageStateOptions
): [T, SetStateBase<T>] {
  const opt = {
    ...defaultOptions,
    ...options,
  };

  const [state, setState] = useState<T>(() => {
    if (!opt.disabled) {
      const cache = getStorage(key, opt.type);
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

export const useStorageState = Object.assign(useStorageBase, {
  get: getStorage,
  set: setStorage,
  remove,
});
