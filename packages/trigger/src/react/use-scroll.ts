import { RefObject, useEffect, useMemo, useRef } from "react";

import { dumpFn } from "@m78/utils";
import {
  createScrollTrigger,
  type ScrollTriggerInstance,
  type ScrollTriggerOption,
  type ScrollTriggerState,
} from "../scroll/scroll.js";
import { getRefDomOrDom, useFn } from "@m78/hooks";
import { isArray } from "lodash";

/** 用于use-scroll的创建配置 */
export interface UseScrollTriggerOption
  extends Omit<ScrollTriggerOption, "target" | "handle"> {
  /** 传入要绑定的滚动元素或ref, 也可以通过useScroll返回的instance.ref绑定到dom */
  el?: HTMLElement | RefObject<any>;
  /** 滚动时触发 */
  onScroll?(meta: ScrollTriggerState): void;
}

/** use-scroll扩展后的ScrollTrigger实例 */
export interface UseScrollTriggerInstance<ElType extends HTMLElement>
  extends ScrollTriggerInstance {
  /** 可使用此项代替option.el进行绑定 */
  ref: RefObject<ElType>;
}

export function useScroll<ElType extends HTMLElement>(
  option: UseScrollTriggerOption
) {
  // 用于返回的节点获取ref
  const ref = useRef<ElType>(null);

  const instance = useMemo(() => {
    return {
      ref,
      scroll: dumpFn,
      scrollToE: dumpFn,
      scrollToElement: dumpFn,
      get: dumpFn,
      destroy: dumpFn,
    } as any as UseScrollTriggerInstance<ElType>;
  }, []);

  const handle = useFn((e: ScrollTriggerState) => {
    option.onScroll?.(e);
  });

  // 在满足条件时重载实例
  const getDeps = () => {
    const _offset = option.offset;
    const offset = isArray(_offset) ? _offset : [_offset, _offset];

    const _touchOffset = option.touchOffset;
    const touchOffset = isArray(_touchOffset)
      ? _touchOffset
      : [_touchOffset, _touchOffset];

    return [
      option.el,
      ref.current,
      (option.el as any)?.current,
      offset[0],
      offset[1],
      touchOffset[0],
      touchOffset[1],
    ];
  };

  useEffect(() => {
    const curEl = getRefDomOrDom(option.el, ref);

    if (curEl) {
      Object.assign(
        instance,
        createScrollTrigger({
          ...option,
          target: curEl,
          handle,
        })
      );
    }

    return () => {
      instance.destroy?.();
    };
  }, getDeps());

  return instance;
}
