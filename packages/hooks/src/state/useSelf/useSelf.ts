import { useRef } from "react";

/**
 * 返回一个实例对象
 * @param init - 初始值
 * @return self - 实例对象
 * */
export function useSelf<T extends object>(init = {} as T) {
  const self = useRef<T>(init);
  return self.current as T;
}
