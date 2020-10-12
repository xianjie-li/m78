import React, { useEffect, useRef } from 'react';

import { useScroll, useSetState } from '@lxjx/hooks';
import { useGesture } from 'react-use-gesture';
import { config, useSpring, animated, interpolate } from 'react-spring';
import _clamp from 'lodash/clamp';
import { ComponentBaseProps } from '../types/types';

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
  const { hideScrollbar = true } = props;

  const rootEl = useRef<HTMLDivElement>(null!);

  const [state, setState] = useSetState({
    scrollBarWidth: 0,
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
      onDrag({ memo, movement: [, moveY], direction: [xD, yD], down, cancel }) {
        const sMeta = sHelper.get();

        const [ox, oy] = memo || [0, 0];

        const atTop = sMeta.touchTop;
        const atBottom = sMeta.touchBottom;
        const atRight = sMeta.touchRight;

        let yOffset = oy;
        let xOffset = ox;

        // if (targetOffset > bounceThreshold) {
        // targetOffset = _clamp(
        //   targetOffset * (1 - targetOffset / bounceThreshold),
        //   0,
        //   bounceThreshold,
        // );

        // const gg = yD > 0 && yOffset > bounceThreshold / 3 ? 0.3 : 0.6;
        //
        yOffset = yD > 0 ? yOffset + 1 : yOffset - 1;
        xOffset = xD > 0 ? xOffset + 1 : xOffset - 1;
        //
        // if (yOffset > bounceThreshold) {
        //   yOffset = bounceThreshold;
        // }

        if (!down) {
          cancel!();
          yOffset = 0;
          xOffset = 0;
        }

        //
        // const diff = 1 - targetOffset / bounceThreshold;

        // if (targetOffset > bounceThreshold) {
        //   targetOffset = bounceThreshold;
        // }

        // console.log(moveY, targetOffset);

        if (atTop || atBottom) {
          setSp({
            y: yOffset,
            x: xOffset,
          });
        }

        return [xOffset, yOffset];
      },
    },
    {
      domTarget: rootEl,
      event: { passive: false },
    },
  );

  useEffect(bind, [bind]);

  const hideOffset = hideScrollbar && state.scrollBarWidth ? -state.scrollBarWidth : undefined;

  return (
    <div className="m78-scroller" ref={rootEl}>
      <animated.div
        className="m78-scroller_inner"
        style={{
          transform: interpolate([spSty.x, spSty.y], (x, y) => `translate3d(${0}px, ${y}px, 0)`),
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
