import { RefObject, useState } from "react";
import { useMeasureNotify } from "./useMeasureNotify.js";

export interface UseMeasureBound extends Omit<DOMRectReadOnly, "toJSON"> {
  /** entry.contentRect中的宽高为contentSize, 所以额外提供此项 */
  offsetHeight: number;
  /** entry.contentRect中的宽高为contentSize, 所以额外提供此项 */
  offsetWidth: number;
}

/**
 * 实时测量一个元素的尺寸
 * @param target - 目标节点
 * @param debounceDelay - 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能
 * @return
 *  - return[0] - 元素的尺寸, 位置等信息
 *  - return[1] - 用于直接绑定的ref
 * */
export function useMeasure<T extends Element = HTMLElement>(
  target?: HTMLElement | RefObject<HTMLElement>,
  debounceDelay?: number
) {
  const [bounds, set] = useState<UseMeasureBound>({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    right: 0,
    bottom: 0,
    offsetHeight: 0,
    offsetWidth: 0,
  });

  const ref = useMeasureNotify<T>({
    target,
    debounceDelay,
    onChange: (bounds) => {
      set(bounds);
    },
  });

  return [bounds as UseMeasureBound, ref] as const;
}
