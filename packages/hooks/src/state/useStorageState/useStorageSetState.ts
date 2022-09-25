import { useState, useCallback } from "react";
import {
  StateInitState,
  UseSetStateTuple,
  UseStorageStateOptions,
  useStorageState,
} from "../../";
import { AnyObject } from "@m78/utils";

export const useStorageSetState = <T extends AnyObject>(
  /** 缓存key */
  key: string,
  /** 初始状态 */
  initState = {} as StateInitState<T>,
  /** 其他选项 */
  options?: UseStorageStateOptions
): UseSetStateTuple<T> => {
  const [, update] = useState(0);
  const [state, set] = useStorageState<T>(key, initState, options);
  const setState = useCallback(
    (patch: any) => {
      // 关键是使用Object.assign保证引用不变
      set(
        Object.assign(state, patch instanceof Function ? patch(state) : patch)
      );
      // 引用相同useState是不会更新的，需要手动触发更新
      update((prev) => prev + 1);
    },
    [set]
  );

  return [state, setState];
};
