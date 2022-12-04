import { useEffect } from "react";
import { EmptyFunction } from "@m78/utils";

/**
 * 组件卸载时执行销毁操作
 */
export function useDestroy(cb: EmptyFunction) {
  useEffect(() => cb, []);
}
