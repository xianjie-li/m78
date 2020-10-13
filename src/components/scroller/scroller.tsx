import React, { useEffect, useRef } from 'react';

import { useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { useGesture } from 'react-use-gesture';
import { config, useSpring, animated, interpolate } from 'react-spring';
import _clamp from 'lodash/clamp';
import cls from 'classnames';
import { ScrollerProps } from './type';

type UseScrollMeta = ReturnType<ReturnType<typeof useScroll>['get']>;

export interface ScrollRef {
  /** 结束下拉刷新，将刷新是否成功作为第一个参数传入, 默认成功 */
  pullDownFinish(isSuccess?: boolean): void;
  /** 手动触发下拉刷新，当正在进行下拉或上拉中的任意操作时，调用无效 */
  triggerPullDown(): void;
  /** 结束下拉加载，请求到数据时，将数据长度作为第一个参数传入(用于更友好的反馈，默认为0), 发生错误时，传入参数二, 此时第一个参数会被忽略 */
  pullUpFinish(dataLength?: number, hasError?: boolean): void;
  /** 重置上拉加载, 当没有数据时，上拉加载会被禁用，通过此方法可重新开启 */
  resetPullUp(): void;
  /** 手动触发加载，一般用于首次进入时在合适的时机调用加载数据。
   * skip会传入onPullUp函数用于识别是否需要执行增加页码等操作，在
   * 组件内部，当进行重试、初始化onPullUp调用等操作时会传入true
   * */
  triggerPullUp(skip?: boolean): void;
  /** 滚动到指定位置, 传immediate则跳过动画 */
  scrollTo(to: number, immediate?: boolean): void;
  /** 根据当前位置滚动指定距离, 正数或负数, 传immediate则跳过动画  */
  scrollBy(offset: number, immediate?: boolean): void;
  /** 滚动到指定元素位置，如果是字符，会调用querySelector进行获取，没有找到时不会执行任何操作 */
  scrollToElement(el: HTMLElement | string): void;
  /** 对滚动节点的引用 */
  el: HTMLDivElement;
}

/* TODO: 提到utils包中 */
function getScrollBarWidth(nodeTarget: HTMLElement) {
  const node = nodeTarget || document.body;

  // Create the measurement node
  const scrollDiv = document.createElement('div');
  scrollDiv.style.overflow = 'scroll';
  node.appendChild(scrollDiv);

  // Get the scrollbar width
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

  // Delete the DIV
  node.removeChild(scrollDiv);

  return scrollbarWidth;
}

/* TODO: 提到utils包中 */
function decimalPrecision(num: number, precision = 1) {
  const mid = +`1${Array.from({ length: precision })
    .map(() => '0')
    .join('')}`;

  return Math.round(num * mid) / mid;
}

/**
 * 拖动位置超过threshold时，会出现橡皮效果，此函数用于计算出一个合理的弹性值
 * @param overSize - 超出threshold的值
 * @param maxSize - 允许超出的最大值
 * @param minFactor - 0 | 允许的最小弹性系数
 * @param initFactor - 初始弹性系数
 * */
function rubberFactor(overSize: number, maxSize: number, minFactor = 0, initFactor = 1) {
  let d = initFactor - overSize / maxSize;

  d = Math.max(d, minFactor);

  if (d < 0) d = 0;
  if (d > 1) d = 1;

  return d;
}

const defaultProps = {
  soap: 0.5,
  threshold: 80,
  rubber: 30,
  hideScrollbar: false,
  webkitScrollBar: true,
  progressBar: 500,
};

function Scroller(props: ScrollerProps & typeof defaultProps) {
  const { hideScrollbar, webkitScrollBar, soap, threshold, rubber, progressBar } = props;

  /** 根元素 */
  const rootEl = useRef<HTMLDivElement>(null!);

  const [state, setState] = useSetState({
    // 当前环境下的滚动条宽度
    scrollBarWidth: 0,
  });

  const self = useSelf({
    // 记录最后一次设置的x轴拖动位置, 拖动松开后重置为0
    memoX: 0,
    // 记录最后一次设置的y轴拖动位置, 拖动松开后重置为0
    memoY: 0,
  });

  // 计算被设置滚动条位置
  useEffect(() => {
    if (!hideScrollbar) return;

    const w = getScrollBarWidth(rootEl.current);

    if (!w || w === state.scrollBarWidth) return;

    setState({
      scrollBarWidth: w,
    });
  }, []);

  const { ref: scrollEl, ...sHelper } = useScroll<HTMLDivElement>({
    throttleTime: 40,
    onScroll: scrollHandle,
  });

  // 拖动元素动画
  const [spSty, setSp] = useSpring(() => ({
    y: 0,
    x: 0,
    over: 0,
    scroll: 1,
    config: { ...config.stiff, precision: 0.1 },
  }));

  // 进度条动画
  const [spPgSty, setPgSp] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { clamp: true, precision: 0.1 },
  }));

  const bind = useGesture(
    {
      onDrag({ event, direction: [dx, dy], delta: [dex, dey], down, cancel }) {
        const sMeta = sHelper.get();

        const yPrevent = (dy > 0 && sMeta.touchTop) || (dy < 0 && sMeta.touchBottom);
        const xPrevent = (dx > 0 && sMeta.touchLeft) || (dx < 0 && sMeta.touchRight);

        /* 触边拖动时禁用默认事件 */
        if (yPrevent || xPrevent) {
          event?.preventDefault();
        }

        /* 松开时，还原位置 */
        if (!down) {
          cancel!();

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
          setDragPos({ isVertical: true, ...dragPosArg });
        }

        if (sMeta.touchLeft || sMeta.touchRight) {
          setDragPos(dragPosArg);
        }
      },
    },
    {
      domTarget: rootEl,
      eventOptions: { passive: false },
      drag: {
        lockDirection: true,
        filterTaps: true,
      },
    },
  );

  useEffect(bind as any, [bind]);

  /** 根据drag信息设置元素的拖动状态 */
  function setDragPos({
    isVertical,
    dey,
    dex,
    touchTop,
    touchLeft,
    touchBottom,
    touchRight,
  }: SetDragPosArg) {
    const cDelta = isVertical ? dey : dex;
    const startTouch = isVertical ? touchTop : touchLeft;
    const endTouch = isVertical ? touchBottom : touchRight;

    const posKey = isVertical ? 'memoY' : 'memoX';

    const spKey = isVertical ? 'y' : 'x';

    const minRubberFactor = threshold - rubber;

    // 根据滚动距离和方向等状态设置拖动位置, 并在达到阈值时通过rubberFactor设置橡皮筋效果
    if (cDelta > 0 && startTouch) {
      self[posKey] +=
        cDelta *
        (self[posKey] > minRubberFactor
          ? rubberFactor(self[posKey] - minRubberFactor, threshold, 0.1, soap)
          : soap);

      setSp({
        [spKey]: _clamp(self[posKey], 0, threshold + rubber),
      });
    } else if (cDelta < 0 && endTouch) {
      self[posKey] +=
        cDelta *
        (self[posKey] < -minRubberFactor
          ? rubberFactor(Math.abs(self[posKey]) - minRubberFactor, threshold, 0.1, soap)
          : soap);

      setSp({
        [spKey]: _clamp(self[posKey], -threshold - rubber, 0),
      });
    }
  }

  function scrollHandle(meta: UseScrollMeta) {
    console.log(meta);

    if (progressBar) {
      const thresholdSize = typeof progressBar === 'number' ? progressBar : 300;

      if (meta.xMax >= thresholdSize) {
        setProgressBar('x', meta.x, meta.xMax);
      }

      if (meta.yMax >= thresholdSize) {
        setProgressBar('y', meta.y, meta.yMax);
      }
    }
  }

  function setProgressBar(type: 'x' | 'y', current: number, max: number) {
    const percentage = _clamp((current / max) * 100, 0, 100);

    setPgSp({
      [type]: percentage,
    });
  }

  /** 推送一条消息 */
  function sendMsg() {}

  const hideOffset = hideScrollbar && state.scrollBarWidth ? -state.scrollBarWidth : undefined;

  return (
    <div
      className={cls('m78-scroller', {
        'm78-scroll-bar': webkitScrollBar,
        __hideScrollBar: hideScrollbar,
      })}
      ref={rootEl}
    >
      <animated.div
        style={{ width: spPgSty.y.interpolate(width => `${width}%`) }}
        className="m78-scroller_progress-bar"
      />
      <animated.div
        style={{ height: spPgSty.x.interpolate(height => `${height}%`) }}
        className="m78-scroller_progress-bar __left"
      />
      <animated.div
        className="m78-scroller_inner"
        style={{
          transform: interpolate([spSty.x, spSty.y], (x, y) => `translate3d(${x}px, ${y}px, 0)`),
        }}
      >
        <div
          className="m78-scroller_wrap"
          ref={scrollEl}
          style={{ right: hideOffset, bottom: hideOffset }}
        >
          {Array.from({ length: 100 }).map((item, ind) => (
            <div key={ind}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias aliquid dolorem
              excepturi iure laboriosam magnam modi, sequi. Accusantium ad exercitationem, fugiat
              illo labore, necessitatibus officiis optio quas repudiandae sequi temporibus.
            </div>
          ))}
        </div>
      </animated.div>
    </div>
  );
}

Scroller.defaultProps = defaultProps;

export default Scroller;
