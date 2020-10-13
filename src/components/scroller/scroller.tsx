import React, { useEffect, useRef } from 'react';

import { useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { useGesture } from 'react-use-gesture';
import { config, useSpring, animated, interpolate } from 'react-spring';
import _clamp from 'lodash/clamp';
import { Direction } from 'm78/util';
import { ComponentBaseProps, Size } from '../types/types';

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

const bounceThreshold = 80;

const zeroPosition = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

export interface ScrollerProps extends ComponentBaseProps {
  /** 启用下拉刷新并在触发时通过回调通知 */
  onPullDown?: () => void;
  /** 启用上拉加载并在触发时通过回调通知 */
  onPullUp?: () => void;
  /** 滚动时触发 */
  onScroll?: () => void;
  /** false | 是否显示滚动条 */
  hideScrollbar?: () => void;
  /** true | 在支持::-webkit-scrollbar且非移动端的情况下，使用其定制滚动条 */
  webkitScrollBar?: boolean;
  /** 是否显示返回顶部按钮 */
  backTop?: boolean;
  /** 提供整页滚动能力 */
  slide?: boolean;
  /** 滚轮增强 */
  /** 无限滚动 */
  /** 方向 */
  direction?: Direction;
}

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

function Scroller(props: ScrollerProps) {
  const { hideScrollbar = false } = props;

  const rootEl = useRef<HTMLDivElement>(null!);

  const [state, setState] = useSetState({
    scrollBarWidth: 0,
    tempThreshold: zeroPosition,
  });

  const self = useSelf({
    memoScrollMeta: undefined as any,
    memoTriggerOffset: {} as any,
  });

  useEffect(() => {
    if (!hideScrollbar) return;

    const w = getScrollBarWidth(rootEl.current);

    if (!w || w === state.scrollBarWidth) return;

    setState({
      scrollBarWidth: w,
    });
  }, []);

  const { ref: scrollEl, ...sHelper } = useScroll<HTMLDivElement>({});

  const [spSty, setSp] = useSpring(() => ({
    y: 0,
    x: 0,
    over: 0,
    scroll: 1,
    config: config.stiff,
  }));

  const bind = useGesture(
    {
      onDrag({ movement: [moveX, moveY], offset: [ox, oy], down, cancel }) {
        const sMeta = sHelper.get();

        const prevSMeta = self.memoScrollMeta;

        self.memoScrollMeta = sMeta;

        let yOffset = moveY;
        const xOffset = moveX;

        if (prevSMeta) {
          if (!prevSMeta.touchTop && sMeta.touchTop) {
            self.memoTriggerOffset.top = moveY;
            console.log('trigger');
          }
        }

        if (self.memoTriggerOffset.top) {
          // console.log(moveY, self.memoTriggerOffset.top);
          yOffset -= self.memoTriggerOffset.top;
        }

        if (!sMeta.touchTop && !sMeta.touchBottom && !sMeta.touchLeft && !sMeta.touchRight) {
          cancel!();
          return;
        }

        // if (yOffset > 0 && !sMeta.touchTop) {
        //   cancel!();
        //   return;
        // }

        if (!down) {
          self.memoScrollMeta = undefined;
          self.memoTriggerOffset = {};

          setState({
            tempThreshold: zeroPosition,
          });

          cancel!();
          setSp({
            y: 0,
            x: 0,
          });
          return;
        }

        if ((yOffset > 0 && sMeta.touchTop) || (yOffset < 0 && sMeta.touchBottom)) {
          setSp({
            y: yOffset,
          });
          return;
        }

        if ((xOffset > 0 && sMeta.touchLeft) || (xOffset < 0 && sMeta.touchRight)) {
          setSp({
            x: xOffset,
          });
        }
      },
    },
    {
      domTarget: rootEl,
      eventOptions: { passive: false },
      drag: {
        // bounds: {
        //   top: -(bounceThreshold + state.tempThreshold.top),
        //   bottom: bounceThreshold + state.tempThreshold.bottom,
        //   left: -(bounceThreshold + state.tempThreshold.left),
        //   right: bounceThreshold + state.tempThreshold.right,
        // },
        lockDirection: true,
        filterTaps: true,
        rubberband: true,
      },
    },
  );

  console.log(bounceThreshold + state.tempThreshold.top, state.tempThreshold.top);

  useEffect(bind as any, [bind]);

  function sendMsg() {}

  const hideOffset = hideScrollbar && state.scrollBarWidth ? -state.scrollBarWidth : undefined;

  return (
    <div className="m78-scroller m78-scroll-bar" ref={rootEl}>
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

export default Scroller;
