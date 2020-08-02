import { useEffect, useState } from 'react';
import { useSelf } from '@lxjx/hooks';

/* TODO: 将所有延迟显示、关闭更换为 显示时间未达到delay时，延迟至该时间再关闭 */
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
  },
): boolean {
  const { disabled, deps = [], extraDelay = 0 } = options || {};

  const [innerState, setInnerState] = useState(disabled ? toggle : false); // 默认一定要为false

  const self = useSelf({
    toggleTimer: null as any,
  });

  useEffect(() => {
    if (!delay || disabled) {
      setInnerState(toggle);
      return;
    }

    if (toggle === innerState) {
      return;
    }

    self.toggleTimer = setTimeout(() => {
      setInnerState(toggle);
    }, delay + extraDelay);

    return () => {
      self.toggleTimer && clearTimeout(self.toggleTimer);
    };
  }, [toggle, ...deps]);

  return innerState;
}
