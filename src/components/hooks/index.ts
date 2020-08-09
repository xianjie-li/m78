import { useEffect, useState } from 'react';
import { useSelf } from '@lxjx/hooks';

/**
 * 将转入的开关状态在指定延迟后转为本地状态并在变更后同步
 * */
export function useDelayDerivedToggleStatus(
  toggle: boolean,
  delay = 300,
  options?: {
    /** 禁用延迟功能 */
    disabled?: boolean;
    /** 当数组值改变时，更新state */
    deps?: any[];
    /** 额外的延迟时间，用于对动画等消费的时间进行修正 */
    extraDelay?: number;
    /** true | 启用入场延迟 */
    leading?: boolean;
    /** false | 启用离场延迟 */
    trailing?: boolean;
  },
): boolean {
  const { disabled, deps = [], extraDelay = 0, trailing, leading = true } = options || {};

  const isDisabled = !delay || disabled || (!trailing && !leading);

  // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
  const [innerState, setInnerState] = useState(isDisabled || !leading ? toggle : false);

  const self = useSelf({
    toggleTimer: null as any,
  });

  useEffect(() => {
    if (isDisabled || toggle === innerState) {
      return;
    }

    if ((toggle && !leading) || (!toggle && !trailing)) {
      setInnerState(toggle);
      return;
    }

    self.toggleTimer = setTimeout(() => {
      setInnerState(toggle);
    }, delay + extraDelay);

    return () => {
      self.toggleTimer && clearTimeout(self.toggleTimer);
    };
  }, [toggle, ...deps]);

  return isDisabled ? toggle : innerState;
}
