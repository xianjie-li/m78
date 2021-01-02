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
    /** 开启延迟，默认为delay的值 */
    leadingDelay?: number;
    /** 离场延迟，默认为delay的值 */
    trailingDelay?: number;
    /** true | 启用入场延迟 */
    leading?: boolean;
    /** false | 启用离场延迟 */
    trailing?: boolean;
  },
): boolean {
  const {
    disabled,
    deps = [],
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
  }, [toggle, ...deps]);

  return isDisabled ? toggle : innerState;
}

/**
 * 用于便捷的实现mountOnEnter/unmountOnExit接口
 * monkeySet会在何时的情况下才进行更新，可以在直接调用而不用编写验证代码
 * */
export function useMountInterface(init: boolean, { mountOnEnter = true, unmountOnExit = false }) {
  const [mount, setMount] = useState(() => {
    // mountOnEnter为false时，强制渲染, 否则取init
    if (!mountOnEnter) return true;
    return init;
  });

  function monkeySet(isMount: boolean) {
    // 需要挂载但未挂载时对其进行挂载
    if (isMount && !mount) {
      setMount(true);
      return;
    }

    // 需要离场卸载且收到卸载通知且当前已挂载
    if (unmountOnExit && !isMount && mount) {
      setMount(false);
    }
  }

  return [mount, monkeySet] as const;
}
