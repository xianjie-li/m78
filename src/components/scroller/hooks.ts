import { useEffect } from 'react';
import { useGesture } from 'react-use-gesture';
import preventTopPullDown from 'prevent-top-pull-down';
import _clamp from 'lodash/clamp';
import { DirectionEnum } from 'm78/types';
import { isNumber } from '@lxjx/utils';
import { SetDragPosArg, Share } from './types';
import { useMethods } from './methods';

export function useHooks(methods: ReturnType<typeof useMethods>, share: Share) {
  const { setState, sHelper, self, rootEl, setSp, setPgSp, props } = share;

  // 获取滚动条宽度
  useEffect(methods.getScrollWidth, []);

  // 手动控制进度条宽度
  useEffect(() => {
    const xHas = isNumber(props.xProgress);
    const yHas = isNumber(props.yProgress);

    if (!isNumber(props.xProgress) && !isNumber(props.yProgress)) return;

    const aniTo: any = {};

    if (xHas) {
      aniTo.x = _clamp(props.xProgress! * 100, 0, 100);
    }

    if (yHas) {
      aniTo.y = _clamp(props.yProgress! * 100, 0, 100);
    }

    setPgSp(aniTo);
  }, [props.xProgress, props.yProgress]);

  // 初始化滚动标识
  useEffect(methods.refreshScrollFlag, []);

  // touch事件监测
  useEffect(() => {
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      setState({
        hasTouch: true,
      });
    }
  }, []);

  /* 禁用一些默认事件，如、qq 微信 ios 的顶部下拉 */
  useEffect(() => {
    if (props.direction !== DirectionEnum.vertical) {
      return;
    }

    return preventTopPullDown(sHelper.ref.current!);
  }, []);

  // 初始化调用上拉加载
  useEffect(() => {
    methods.triggerPullUp(true);
  }, []);

  // Drag事件处理
  const bind = useGesture(
    {
      onDrag({ event, direction: [dx, dy], delta: [dex, dey], down }) {
        if (!props.onPullDown && !props.onPullUp) return;

        const sMeta = sHelper.get();

        const yPrevent =
          props.direction === DirectionEnum.vertical &&
          ((dy > 0 && sMeta.touchTop) || (dy < 0 && sMeta.touchBottom));
        const xPrevent =
          props.direction === DirectionEnum.horizontal &&
          ((dx > 0 && sMeta.touchLeft) || (dx < 0 && sMeta.touchRight));

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

        if (props.direction === DirectionEnum.vertical) {
          if (sMeta.touchTop || sMeta.touchBottom) {
            methods.setDragPos({ isVertical: true, ...dragPosArg });
          }
        }

        if (props.direction === DirectionEnum.horizontal) {
          if (sMeta.touchLeft || sMeta.touchRight) {
            methods.setDragPos(dragPosArg);
          }
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      onWheel({ direction: [_, dr] }) {
        if (props.direction === DirectionEnum.vertical) return;
        if (dr !== 1 && dr !== -1) return; // 这段代码刚好能解决笔记本触控板高频触发的问题，测试用的触控板dr始终为0, 保持观望
        sHelper.set({
          x: dr > 0 ? 80 : -80,
          raise: true,
        });
      },
    },
    {
      domTarget: rootEl,
      eventOptions: { passive: false },
      drag: {
        axis: props.direction === DirectionEnum.vertical ? 'y' : 'x',
        filterTaps: true,
      },
    },
  );

  useEffect(bind as any, [bind]);
}
