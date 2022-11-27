import { RefObject, useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import debounce from "lodash/debounce.js";
import { getRefDomOrDom, useFn, useIsUnmountState } from "../../index.js";

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
  const ref = useRef<T>(null!);

  const isUnmount = useIsUnmountState();

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

  const cb = useFn(
    ([entry]) => {
      const rect = entry.contentRect;
      !isUnmount() &&
        set({
          // rect属性不可遍历, 所以这里用蠢一点的办法逐个复制
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
          x: rect.x,
          y: rect.y,
          right: rect.right,
          bottom: rect.bottom,
          offsetHeight: (entry.target as HTMLElement).offsetHeight,
          offsetWidth: (entry.target as HTMLElement).offsetWidth,
        });
    },
    (fn) => {
      if (debounceDelay) {
        return debounce(fn, debounceDelay);
      }
      return fn;
    },
    [debounceDelay]
  );

  const [ro] = useState(() => new ResizeObserver(cb));

  function getEl() {
    const el = getRefDomOrDom(target);
    if (el) return el;
    return ref.current;
  }

  useEffect(() => {
    const el = getEl();

    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [bounds as UseMeasureBound, ref] as const;
}
