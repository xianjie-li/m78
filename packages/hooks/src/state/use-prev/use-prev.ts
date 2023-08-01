import { useRef } from "react";

/** record prev value */
export function usePrev<T = any>(value: T) {
  const ref = useRef<T>();

  const cur = ref.current;

  ref.current = value;

  return cur;
}
