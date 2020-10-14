import React, { useRef } from 'react';

import { useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { config, useSpring, animated, interpolate } from 'react-spring';
import cls from 'classnames';
import { WindmillIcon } from 'm78/icon';
import { Share } from './type';
import { useMethods } from './methods';
import { useHooks } from './hooks';

export const defaultProps = {
  soap: 0.5,
  threshold: 80,
  rubber: 30,
  hideScrollbar: false,
  webkitScrollBar: true,
  progressBar: false,
  scrollFlag: false,
};

function Scroller(props: Share['props']) {
  const { hideScrollbar, webkitScrollBar, hoverWebkitScrollBar } = props;

  /** 根元素 */
  const rootEl = useRef<HTMLDivElement>(null!);

  const [state, setState] = useSetState<Share['state']>({
    scrollBarWidth: 0,
    hasTouch: false,
    topFlag: false,
    rightFlag: false,
    bottomFlag: false,
    leftFlag: false,
  });

  const self = useSelf<Share['self']>({
    memoX: 0,
    memoY: 0,
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

  // 共享状态
  const share: Share = {
    sHelper: null as any,
    props,
    rootEl,
    self,
    setPgSp,
    setSp,
    setState,
    state,
  };

  // 方法拆分
  const methods = useMethods(share);

  share.sHelper = useScroll<HTMLDivElement>({
    throttleTime: 40,
    onScroll: methods.scrollHandle,
  });

  const { ref: scrollEl } = share.sHelper;

  // 事件绑定/声明周期
  useHooks(methods, share);

  const hideOffset =
    hideScrollbar && state.scrollBarWidth && !state.hasTouch ? -state.scrollBarWidth : undefined;

  return (
    <div
      className={cls('m78-scroller', {
        'm78-scrollbar': !state.hasTouch && webkitScrollBar,
        __hideScrollBar: hideScrollbar,
        __hover: !state.hasTouch && hoverWebkitScrollBar,
      })}
      ref={rootEl}
    >
      {/* 滚动容器 */}
      <animated.div
        className="m78-scroller_inner"
        style={{
          transform: interpolate([spSty.x, spSty.y], (x, y) => `translate3d(${x}px, ${y}px, 0)`),
        }}
      >
        {/* 下拉指示器 */}
        <animated.div className="m78-scroller_pulldown">
          <div className="m78-scroller_pulldown-wrap">
            <span className="m78-scroller_pulldown-icon">
              <WindmillIcon />
            </span>
            <span className="m78-scroller_pulldown-text">下拉刷新</span>
          </div>
        </animated.div>

        <div
          className="m78-scroller_wrap"
          ref={scrollEl as any}
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

      {/* 滚动进度 */}
      <animated.div
        style={{ width: spPgSty.y.interpolate(width => `${width}%`) }}
        className="m78-scroller_progress-bar"
      />
      <animated.div
        style={{ height: spPgSty.x.interpolate(height => `${height}%`) }}
        className="m78-scroller_progress-bar __left"
      />

      {/* 滚动标识 */}
      {state.leftFlag && <div className="m78-scroller_scroll-flag __start" />}
      {state.rightFlag && (
        <div
          className="m78-scroller_scroll-flag"
          style={{ right: state.scrollBarWidth ? state.scrollBarWidth : undefined }}
        />
      )}

      {state.topFlag && <div className="m78-scroller_scroll-flag __start __isVertical" />}
      {state.bottomFlag && (
        <div
          className="m78-scroller_scroll-flag __isVertical"
          style={{ bottom: state.scrollBarWidth ? state.scrollBarWidth : undefined }}
        />
      )}
    </div>
  );
}

Scroller.defaultProps = defaultProps;

export default Scroller;
