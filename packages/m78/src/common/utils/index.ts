import React, { useState, useEffect } from "react";
import { useSelf } from "@m78/hooks";

/** 禁止冒泡的便捷扩展对象 */
export const stopPropagation = {
  onClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  },
};

/** throw error */
export function throwError(errorMsg: string, namespace?: string): never {
  throw new Error(
    `M78💥 -> ${namespace ? `${namespace} -> ` : ""} ${errorMsg}`
  );
}

export function sendWarning(msg: string, namespace?: string) {
  console.log(`M78💢 -> ${namespace ? `${namespace} -> ` : ""} ${msg}`);
}

export function useDelayToggle(
  toggle: boolean,
  options?: {
    /** 300 | 开启延迟，默认为delay的值, 设置为0禁用 */
    leading?: number;
    /** 600 | 离场延迟，默认为delay的值, 设置为0禁用 */
    trailing?: number;
  }
): boolean {
  const { leading = 300, trailing = 600 } = options || {};

  const isDisabled = !trailing && !leading;

  // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
  const [innerState, setInnerState] = useState(!leading ? toggle : false);

  const self = useSelf({
    toggleTimer: null as any,
  });

  useEffect(() => {
    if (isDisabled) return;

    if ((toggle && !leading) || (!toggle && !trailing)) {
      toggle !== innerState && setInnerState(toggle);
      return;
    }

    const d = toggle ? leading : trailing;

    self.toggleTimer = setTimeout(() => {
      setInnerState(toggle);
    }, d);

    return () => {
      self.toggleTimer && clearTimeout(self.toggleTimer);
    };
  }, [toggle]);

  return isDisabled ? toggle : innerState;
}
