import { RefObject, useEffect, useRef, useState } from "react";
import { UseMeasureBound } from "./use-measure.js";
import { useFn } from "../../effect/use-fn/use-fn.js";
import debounce from "lodash/debounce.js";
import { useIsUnmountState } from "../../state/use-Is-unmount-state/use-Is-unmount-state.js";
import ResizeObserver from "resize-observer-polyfill";
import { getRefDomOrDom } from "../../utils/utils.js";

/**
 * 原始尺寸/位置 变更时进行通知
 * */
export function useMeasureNotify<T extends Element = HTMLElement>(props: {
  /** 目标节点 */
  target?: HTMLElement | RefObject<HTMLElement>;
  /** 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能 */
  debounceDelay?: number;
  /** 发生变更时触发 */
  onChange: (bounds: UseMeasureBound) => void;
}) {
  const ref = useRef<T>(null!);
  const { debounceDelay, target } = props;

  const isUnmount = useIsUnmountState();

  const cb = useFn(
    ([entry]) => {
      const rect = entry.contentRect;

      if (!isUnmount()) {
        props.onChange({
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
      }
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
  }, [target, ref.current]);

  return ref;
}
