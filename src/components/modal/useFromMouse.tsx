import { useSpring } from 'react-spring';
import { useDelayDerivedToggleStatus, useMountInterface } from 'm78/hooks';
import { useEffect } from 'react';
import { getLastXKey, getLastYKey } from './commons';
import { useMethods } from './methods';
import { Share } from './types';

/** ======== fromMouse实现 ======== */
export function useFromMouse(
  share: Share,
  methods: ReturnType<typeof useMethods>,
  isFromMouse: boolean,
) {
  const { show, mountOnEnter, unmountOnExit, contRef, self, animationConfig } = share;

  const [sp, set] = useSpring(() => ({ x: 0, y: 0, scale: 0, opacity: 1 }));

  /** 为animationType = fromMouse 单独实现mountOnEnter、unmountOnExit */
  const [mount, unmount] = useMountInterface(show, { mountOnEnter, unmountOnExit });

  /** 用于确保fromMouse的useEffect()能访问到以挂载的contRef.current，类似nextTick */
  const show2 = useDelayDerivedToggleStatus(show, 1, {
    trailing: false,
    leading: true,
    disabled: !isFromMouse,
  });
  //
  // // 通知useMountInterface
  // useEffect(() => {
  //   if (!isFromMouse) return;
  //
  //   if (show) {
  //     setMount(true);
  //   }
  // }, [show]);

  // 处理fromMouse的show change
  useEffect(() => {
    if (!isFromMouse) return;

    if (!contRef.current) return;

    if (show) {
      // 先执行一次计算可以避免错位
      methods.calcPos();

      const pointX = getLastXKey();
      const pointY = getLastYKey();

      self.pointX = pointX;
      self.pointY = pointY;

      // 缓存最后点击位置
      self.x = pointX || self.px || 0;
      self.y = pointY || self.px || 0;

      // 计算和缓存起点位置
      self.startXPos = self.x - self.px - contRef.current.offsetWidth / 2;
      self.startYPos = self.y - self.py - contRef.current.offsetHeight / 2;

      // 是否有最后点击点
      const notPoint = !pointY && !pointX;

      // 无动画设置起始位置 + 动画到显示位置
      set({
        to: async next => {
          await next({
            x: notPoint ? 0 : self.startXPos,
            y: notPoint ? -100 : self.startYPos,
            scale: notPoint ? 1 : 0,
            opacity: notPoint ? 0 : 1,
            immediate: true,
            default: true,
          });
          await next({
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            immediate: false,
            config: { ...animationConfig, clamp: false },
            reset: false,
            default: true,
          });
        },
      });
    } else {
      // 是否有最后点击点
      const notPoint = !self.pointY && !self.pointX;

      // 动画到初始位置
      set({
        x: notPoint ? 0 : self.startXPos,
        y: notPoint ? -100 : self.startYPos,
        scale: notPoint ? 1 : 0,
        opacity: notPoint ? 0 : 1,
        immediate: false,
        config: { ...animationConfig, clamp: true },
        reset: false,
        default: true,
        onRest() {
          // 通知useMountInterface
          if (!share.refState.show) {
            unmount();
          }
        },
      });

      self.x = 0;
      self.y = 0;
    }
    // eslint-disable-next-line
  }, [show2]);

  return [sp, mount] as const;
}
