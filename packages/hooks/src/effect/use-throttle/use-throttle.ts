import { useEffect } from "react";
import { AnyFunction, __GLOBAL__ } from "@m78/utils";
import { useFn, useSelf } from "../../index.js";

export interface UseThrottleOption {
  /** true | 在节流开始前调用 */
  leading?: boolean;
  /** true | 在节流结束后调用 */
  trailing?: boolean;
}

const defaultOption = {
  leading: true,
  trailing: true,
};

/**
 * 传入一个函数，经过节流处理后返回, 返回函数的内存地址会一直保持不变
 * @param fn - 待节流的函数
 * @param wait - 节流延迟时间
 * @param options
 * @param options.leading - true | 在节流开始前调用
 * @param options.trailing - true | 在节流结束后调用
 * @returns throttleFn - 经过节流处理后的函数
 * @returns throttleFn.cancel() - 取消节流调用
 */
export function useThrottle<T extends AnyFunction>(
  fn: T,
  wait = 300,
  options?: UseThrottleOption
) {
  const self = useSelf({
    last: 0,
    timer: undefined as any,
  });

  const opt = {
    ...defaultOption,
    ...options,
  };

  const cancel = useFn(() => {
    if (self.timer) {
      __GLOBAL__.clearTimeout(self.timer);
    }
  });

  useEffect(() => {
    return cancel;
  });

  const memoFn = useFn((...args) => {
    const now = Date.now();
    const diff = now - self.last;

    cancel();

    if (diff > wait) {
      // last = 0 时视为初次调用
      if (opt.leading || self.last !== 0) {
        fn(...args);
      }
      self.last = now;
    } else if (opt.trailing) {
      self.timer = __GLOBAL__.setTimeout(() => {
        fn(...args);
        self.last = 0; // 标记下次调用为leading调用
        __GLOBAL__.clearTimeout(self.timer);
      }, wait);
    }
  });

  const bundle = Object.assign(memoFn as T, {
    cancel,
  });

  return bundle;
}
