import React, { useImperativeHandle, useRef } from 'react';

import { useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { animated, config, to, useSpring } from 'react-spring';
import cls from 'classnames';
import { WindmillIcon } from 'm78/icon';
import Button from 'm78/button';
import { Direction } from 'm78/util';
import Spin from 'm78/spin';
import { If } from 'm78/fork';
import { isBoolean } from '@lxjx/utils';
import { Spacer } from 'm78/layout';
import { offset2Rotate, PullDownStatus, PullUpStatus } from './common';
import { ScrollerProps, ScrollerRef, Share } from './type';
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
  direction: Direction.vertical,
  pullUpThreshold: 120,
  pullDownTips: true,
};

const Scroller = React.forwardRef<ScrollerRef, ScrollerProps>((props, ref) => {
  const {
    hideScrollbar,
    webkitScrollBar,
    hoverWebkitScrollBar,
    direction,
    threshold,
    rubber,
  } = props as Share['props'];

  /** 根元素 */
  const rootEl = useRef<HTMLDivElement>(null!);

  const [state, setState] = useSetState<Share['state']>({
    scrollBarWidth: 0,
    hasTouch: false,

    topFlag: false,
    rightFlag: false,
    bottomFlag: false,
    leftFlag: false,

    pullDownStatus: PullDownStatus.TIP,
    pullUpStatus: PullUpStatus.TIP,
  });

  const self = useSelf<Share['self']>({
    memoX: 0,
    memoY: 0,
  });

  // 拖动元素动画
  const [spSty, setSp] = useSpring(() => ({
    y: 0,
    x: 0,
    config: { ...config.stiff, precision: 0.1 },
  }));

  // 额外的设置下拉指示器旋转角度动画(用于下拉已触发时的加载动画)
  const [spPullDownSty, setPullDownSp] = useSpring(() => ({
    r: 0,
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
    props: props as Share['props'],
    rootEl,
    self,
    setPgSp,
    setSp,
    setState,
    state,
    setPullDownSp,
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

  useImperativeHandle(ref, () => ({
    triggerPullDown: methods.triggerPullDown,
  }));

  const hideOffset =
    hideScrollbar && state.scrollBarWidth && !state.hasTouch ? -state.scrollBarWidth : undefined;

  const isPullUpIng = methods.isPullUpIng();

  return (
    <div
      className={cls('m78-scroller', {
        'm78-scrollbar': !state.hasTouch && webkitScrollBar,
        __hideScrollBar: hideScrollbar,
        __hover: !state.hasTouch && hoverWebkitScrollBar,
      })}
      style={{
        backgroundColor: props.bgColor,
      }}
      ref={rootEl}
    >
      {/* 滚动容器 */}
      <animated.div
        className="m78-scroller_inner"
        style={{
          transform: to([spSty.x, spSty.y], (x, y) => `translate3d(${x}px, ${y}px, 0)`),
        }}
      >
        {/* 下拉指示器 */}
        {props.onPullDown && (
          <animated.div
            className="m78-scroller_pulldown"
            style={{ padding: props.pullDownNode ? 0 : undefined }}
          >
            <div className="m78-scroller_pulldown-wrap">
              {props.pullDownNode || (
                <>
                  <animated.div
                    className="m78-scroller_pulldown-icon"
                    style={{
                      transform: to(
                        [spSty.y, spPullDownSty.r],
                        (y, r) =>
                          `rotate3d(0, 0, 1, ${-(offset2Rotate(y, threshold + rubber) + r)}deg)`,
                      ),
                    }}
                  >
                    {props.pullDownIndicator || <WindmillIcon />}
                  </animated.div>
                  <span className="m78-scroller_pulldown-text">{methods.getPullDownText()}</span>
                </>
              )}
            </div>
          </animated.div>
        )}

        <div
          className="m78-scroller_wrap"
          ref={scrollEl as any}
          style={{
            right: hideOffset,
            bottom: hideOffset,
            [direction === Direction.vertical ? 'overflowY' : 'overflowX']: 'auto',
          }}
        >
          {props.children}
          {/* 上拉提示区域 */}
          {props.onPullUp && (
            <>
              {/* 优化显示 */}
              <If when={isBoolean(props.hasData) && !props.hasData}>
                <Spacer height={100} />
              </If>
              <div className="m78-scroller_pullup">
                <div className="m78-scroller_pullup-wrap">
                  {!isPullUpIng && (
                    <span className="m78-scroller_pullup-text">
                      {methods.getPullUpText()}
                      <If when={state.pullUpStatus === PullUpStatus.ERROR}>
                        <Button
                          size="small"
                          link
                          color="primary"
                          onClick={() => methods.triggerPullUp(true)}
                        >
                          重试
                        </Button>
                      </If>
                    </span>
                  )}
                  {isPullUpIng && <Spin inline size="small" />}
                </div>
              </div>
            </>
          )}
        </div>
      </animated.div>

      {/* 滚动进度 */}
      <animated.div
        style={{ width: spPgSty.y.to(width => `${width}%`) }}
        className="m78-scroller_progress-bar"
      />
      <animated.div
        style={{ height: spPgSty.x.to(height => `${height}%`) }}
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
});

Scroller.defaultProps = defaultProps;

export default Scroller;
