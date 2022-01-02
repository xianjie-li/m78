import { useEffect, useRef, useState } from 'react';
import { isNumber } from '@lxjx/utils';

/**
 * TODO: 临时使用, 出新的popper组件后移除
 * 用于便捷的实现mountOnEnter、unmountOnExit接口
 * */
export function useMountExist({ toggle, mountOnEnter = true, unmountOnExit, exitDelay }: any) {
  const [mount, set] = useState(() => {
    // mountOnEnter为false时，强制渲染, 否则取init
    if (!mountOnEnter) return true;
    return toggle;
  });

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
