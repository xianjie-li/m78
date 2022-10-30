import { useEffect, useRef } from "react";

export function usePrev<T = any>(value: T) {
  const ref = useRef<T>();
  useEffect(() => void (ref.current = value), [value]);
  return ref.current;
}
