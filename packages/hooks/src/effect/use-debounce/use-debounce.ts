import { useEffect } from "react";
import { __GLOBAL__, AnyFunction } from "@m78/utils";
import { useFn, useSelf } from "../../index.js";

/**
 * 传入一个函数，经过防抖处理后返回, 返回函数的内存地址会一直保持不变
 * @param fn - 待防抖的函数
 * @param wait - 防抖延迟时间
 * @returns debounceFn - 经过防抖处理后的函数
 * @returns debounceFn.cancel() - 取消防抖调用
 */
export function useDebounce<T extends AnyFunction>(fn: T, wait = 300) {
  const self = useSelf({
    timer: undefined as any,
  });

  const cancel = useFn(() => {
    if (self.timer) {
      __GLOBAL__.clearTimeout(self.timer);
    }
  });

  useEffect(() => {
    return cancel;
  });

  const memoFn = useFn((...args) => {
    cancel();

    self.timer = __GLOBAL__.setTimeout(() => {
      fn(...args);
      __GLOBAL__.clearTimeout(self.timer);
    }, wait);
  });

  return Object.assign(memoFn as T, {
    cancel,
  });
}
