import { useEffect } from 'react';
import { useGesture } from 'react-use-gesture';
import preventTopPullDown from 'prevent-top-pull-down';
import { Direction } from 'm78/util';
import { SetDragPosArg, Share } from './type';
import { useMethods } from './methods';

export function useHooks(methods: ReturnType<typeof useMethods>, share: Share) {
  const { setState, sHelper, self, rootEl, setSp, props } = share;

  // 获取滚动条宽度
  useEffect(methods.getScrollWidth, []);

  // 初始化滚动标识
  useEffect(methods.refreshScrollFlag, []);

  // touch事件监测
  useEffect(() => {
    if ('ontouchstart' in window) {
      setState({
        hasTouch: true,
      });
    }
  }, []);

  /* 禁用一些默认事件，如、qq 微信 ios 的顶部下拉 */
  useEffect(() => preventTopPullDown(sHelper.ref.current!), []);

  // 初始化调用上拉加载
  useEffect(() => {
    methods.triggerPullUp(true);
  }, []);

  // Drag事件处理
  const bind = useGesture(
    {
      onDrag({ event, direction: [dx, dy], delta: [dex, dey], down }) {
        const sMeta = sHelper.get();

        const yPrevent = (dy > 0 && sMeta.touchTop) || (dy < 0 && sMeta.touchBottom);
        const xPrevent = (dx > 0 && sMeta.touchLeft) || (dx < 0 && sMeta.touchRight);

        /* 触边拖动时禁用默认事件 */
        if (yPrevent || xPrevent) {
          if (event) {
            event.cancelable && event.preventDefault();
          }
        }

        const preventDefaultUp = methods.pullDownHandler({ down });

        /* 松开时，还原位置 */
        if (!down) {
          // cancel!();

          if (preventDefaultUp) return;

          self.memoX = 0;
          self.memoY = 0;

          setSp({
            y: self.memoY,
            x: self.memoX,
          });

          return;
        }

        /* 根据拖动信息设置元素位置 */
        const dragPosArg: SetDragPosArg = {
          dey,
          dex,
          touchBottom: sMeta.touchBottom,
          touchLeft: sMeta.touchLeft,
          touchRight: sMeta.touchRight,
          touchTop: sMeta.touchTop,
        };

        if (sMeta.touchTop || sMeta.touchBottom) {
          methods.setDragPos({ isVertical: true, ...dragPosArg });
        } else if (sMeta.touchLeft || sMeta.touchRight) {
          methods.setDragPos(dragPosArg);
        }
      },
    },
    {
      domTarget: rootEl,
      eventOptions: { passive: false },
      drag: {
        axis: props.direction === Direction.vertical ? 'y' : 'x',
        filterTaps: true,
      },
    },
  );

  useEffect(bind as any, [bind]);
}
