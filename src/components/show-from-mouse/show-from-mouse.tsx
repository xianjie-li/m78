import React, { useEffect } from 'react';

import { useSpring, animated, interpolate, config } from 'react-spring';
import { useSelf } from '@lxjx/hooks';

import Mask, { MaskProps } from '@lxjx/flicker/lib/mask';
import { stopPropagation } from '@lxjx/flicker/lib/util';

import cls from 'classnames';

interface ShowFromMouseProps extends MaskProps {
  contClassName?: string;
  contStyle?: React.CSSProperties;
}

/**
 * 实现与Mask组件完全相同，区别是它的内容区域会从鼠标点击区域开始进入和离开并且固定显示于页面中间
 * 作为base模块的依赖，使用此组件必须引入base模块
 * */
const ShowFromMouse: React.FC<ShowFromMouseProps> = ({
  children,
  className,
  contClassName,
  contStyle,
  ...props
}) => {
  const { show } = props;

  const self = useSelf({
    x: 0,
    y: 0,
  });

  const [sp, set] = useSpring(() => ({ x: 0, y: 0, scale: 0 }));

  /* 处理内容区域动画 */
  useEffect(() => {
    if (show) {
      self.x = (window as any).FR_LAST_CLICK_POSITION_X || 0;
      self.y = (window as any).FR_LAST_CLICK_POSITION_Y || 0;
      (set as any)({
        to: async (next: any) => {
          await next({ x: self.x, y: self.y, scale: 0, immediate: true, reset: true });
          await next({ x: 0, y: 0, scale: 1, immediate: false, config: config.stiff, reset: false });
        },
      });
    } else {
      set({ x: self.x, y: self.y, scale: 0, immediate: false, config: config.stiff, reset: false });
      self.x = 0;
      self.y = 0;
    }
    // eslint-disable-next-line
  }, [show]);

  return (
    <Mask className={cls('fr-sfm', className)} {...props}>
      <animated.div
        className={cls(contClassName, 'fr-sfm_cont')}
        style={{
          transform:
            interpolate(
              //  @ts-ignore
              [sp.x, sp.y, sp.scale],
              (x: number, y: number, scale: number) => `translate3d(${x}px,${y}px, 0px) scale3d(${scale},${scale},${scale})`,
            ),
          opacity: sp.scale,
          ...contStyle,
        }}
        {...stopPropagation}
      >{children}
      </animated.div>
    </Mask>
  );
};

/** 保存鼠标最后点击相对中心点的偏移位置 */
function windowClickHandle(e: MouseEvent) {
  const x = e.x || e.screenX; // screenX会有导航栏高度的偏移
  const y = e.y || e.screenY;

  // 页面中心点
  const winHalfH = window.innerHeight / 2;
  const winHalfW = window.innerWidth / 2;

  (window as any).FR_LAST_CLICK_POSITION_X = x - winHalfW;
  (window as any).FR_LAST_CLICK_POSITION_Y = y - winHalfH;
}

/**
 * 在组件内记忆位置会导致以api形式调用时组件未装载从而无法获得鼠标位置，故将记忆位置的逻辑放到Base中, 也可以减少事件绑定
 * 如果不提前调用此方法，ShowFromMouse永远都只会从页面中心出现
 * */
export function registerPositionSave() {
  window.removeEventListener('click', windowClickHandle, true);
  // 启用事件捕获防止某个元素事件冒泡导致事件不触发
  window.addEventListener('click', windowClickHandle, true);
}

export default ShowFromMouse;
