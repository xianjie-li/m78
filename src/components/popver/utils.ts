import { useEffect, useRef, useState } from 'react';
import { isNumber } from '@lxjx/utils';
import { Bound, PopperTriggerType } from './types';

/** 检测是否为合法的Bound */
export function isPopperBound(arg: any): arg is Bound {
  return arg && 'left' in arg && 'top' in arg && 'width' in arg && 'height' in arg;
}

/** 根据PopperTriggerType获取启用的事件类型 */
export function getTriggerType(type: PopperTriggerType | PopperTriggerType[]) {
  let types: PopperTriggerType[] = [];
  if (typeof type === 'string') {
    types = [type];
  } else {
    types = type;
  }

  return {
    hover: types.includes('hover'),
    click: types.includes('click'),
    focus: types.includes('focus'),
  };
}

interface UseMountExistOption {
  // 当前显示状态
  toggle: boolean;
  /** true | 在第一次show为true时才真正挂载内容 */
  mountOnEnter?: boolean;
  /** false | 在show为false时是否卸载内容 */
  unmountOnExit?: boolean;
  /**
   * 延迟设置非mount状态, 单位ms,
   * - 用于在内容包含动画时，在动画结束后在卸载内容
   * - 此值不用必须精准匹配动画时间，只要大于动画时间即可
   * */
  exitDelay?: number;
}

/**
 * 用于便捷的实现mountOnEnter、unmountOnExit接口
 * */
export function useMountExist({
  toggle,
  mountOnEnter = true,
  unmountOnExit,
  exitDelay,
}: UseMountExistOption) {
  const [mount, set] = useState(toggle);

  const timer = useRef<any>();

  useEffect(() => {
    timer.current && clearTimeout(timer.current);

    if (toggle && mountOnEnter) {
      !mount && set(true);
    }

    if (!toggle && unmountOnExit) {
      if (mount) {
        if (isNumber(exitDelay)) {
          timer.current = setTimeout(() => {
            set(false);
          }, exitDelay);
        } else {
          set(false);
        }
      }
    }
  }, [toggle]);

  return [mount] as const;
}
