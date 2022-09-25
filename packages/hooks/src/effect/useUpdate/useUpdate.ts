import { useRef, useState } from "react";
import { useFn } from "../../";

/**
 * 用于手动触发组件更新, 如果设置了nextTickCall, 多次触发的update会在下一个事件周期统一触发
 * */
export const useUpdate = (nextTickCall = false) => {
  const [, setCount] = useState(0);
  const timerRef = useRef<any>();

  const nextTickUpdate = useFn(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCount((prev) => prev + 1);
    });
  });

  const update = useFn(() => setCount((prev) => prev + 1));

  return nextTickCall ? nextTickUpdate : update;
};
