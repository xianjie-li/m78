/**
 * 将转入的开关状态在指定延迟后转为本地状态并在变更后同步
 * */
import { useState, useEffect } from "react";
import { useSelf } from "../../";

export function useDelayToggle(
  toggle: boolean,
  delay = 300,
  options?: {
    /** 禁用延迟功能 */
    disabled?: boolean;
    /** 开启延迟，默认为delay的值 */
    leadingDelay?: number;
    /** 离场延迟，默认为delay的值 */
    trailingDelay?: number;
    /** true | 启用入场延迟 */
    leading?: boolean;
    /** false | 启用离场延迟 */
    trailing?: boolean;
  }
): boolean {
  const {
    disabled,
    leadingDelay = delay,
    trailingDelay = delay,
    trailing,
    leading = true,
  } = options || {};

  const isDisabled = !delay || disabled || (!trailing && !leading);

  // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
  const [innerState, setInnerState] = useState(toggle);

  const self = useSelf({
    toggleTimer: null as any,
  });

  useEffect(() => {
    if (isDisabled) return;

    if ((toggle && !leading) || (!toggle && !trailing)) {
      toggle !== innerState && setInnerState(toggle);
      return;
    }

    const d = toggle ? leadingDelay : trailingDelay;

    self.toggleTimer = setTimeout(() => {
      setInnerState(toggle);
    }, d);

    return () => {
      self.toggleTimer && clearTimeout(self.toggleTimer);
    };
  }, [toggle]);

  return isDisabled ? toggle : innerState;
}
