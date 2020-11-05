import React, { useImperativeHandle, useRef } from 'react';

import { useScroll, useSelf, useSetState } from '@lxjx/hooks';
import { animated, config, to, useSpring } from 'react-spring';
import cls from 'classnames';
import { ErrorIcon, WindmillIcon } from 'm78/icon';
import Button from 'm78/button';
import { DirectionEnum } from 'm78/types';
import Spin from 'm78/spin';
import { If } from 'm78/fork';
import { Spacer } from 'm78/layout';
import Empty from 'm78/empty';
import Tips from 'm78/tips';
import BackTop from 'm78/back-top';
import { offset2Rotate, PullDownStatus, PullUpStatus } from './common';
import { Share, ScrollerProps, ScrollerRef } from './types';
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
  direction: DirectionEnum.vertical,
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

  const queue = Tips.useTipsController({
    defaultItemOption: {
      duration: 1200,
    },
  });

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
    hasData: false,
  });

  const self = useSelf<Share['self']>({
    memoX: 0,
    memoY: 0,

    upLoadCount: 0,
  });

  // 拖动元素动画
  const [spSty, setSp] = useSpring(() => ({
    y: 0,
    x: 0,
    config: { ...config.stiff },
  }));

  // 额外的设置下拉指示器旋转角度动画(用于下拉已触发时的加载动画)
  const [spPullDownSty, setPullDownSp] = useSpring(() => ({
    r: 0,
    config: { ...config.stiff },
  }));

  // 进度条动画
  const [spPgSty, setPgSp] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { clamp: true },
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
    queue,
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
    triggerPullUp: methods.triggerPullUp,
    slideNext: methods.slideNext,
    slidePrev: methods.slidePrev,
    ...share.sHelper,
  }));

  const hideOffset =
    hideScrollbar && state.scrollBarWidth && !state.hasTouch ? -state.scrollBarWidth : undefined;

  const isVertical = direction === DirectionEnum.vertical;

  const isPullUpIng = methods.isPullUpIng();

  function renderPullUpRetryBtn() {
    return (
      <Button size="small" link color="primary" onClick={() => methods.triggerPullUp(true)}>
        重试
      </Button>
    );
  }

  return (
    <div
      className={cls(
        'm78-scroller',

        props.className,
      )}
      style={{
        backgroundColor: props.bgColor,
        ...props.style,
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
          className={cls('m78-scroller_wrap', {
            'm78-scrollbar': !state.hasTouch && webkitScrollBar,
            __hover: !state.hasTouch && hoverWebkitScrollBar,
          })}
          ref={scrollEl as any}
          style={{
            right: isVertical ? hideOffset : undefined,
            bottom: !isVertical ? hideOffset : undefined,
            [isVertical ? 'overflowY' : 'overflowX']: props.disableScroll ? undefined : 'auto',
          }}
        >
          {props.children}
          {/* 上拉提示区域 */}
          {props.onPullUp && (
            <>
              {/* 优化显示, 主要处理的是无数据、加载失败、加载中三种状态，在初始化加载即为空时，对其进行优化显示 */}
              <If when={!state.hasData}>
                <Spacer height={100} />
                <If when={!isPullUpIng && state.pullUpStatus === PullUpStatus.NOT_DATA}>
                  <Empty
                    desc={
                      <span className="m78-scroller_empty-nodata">
                        <span>暂无数据</span>
                        {renderPullUpRetryBtn()}
                      </span>
                    }
                  />
                </If>
                <If when={!isPullUpIng && state.pullUpStatus === PullUpStatus.ERROR}>
                  <Empty
                    emptyNode={<ErrorIcon />}
                    desc={
                      <span className="m78-scroller_empty-nodata">
                        <span>{methods.getPullUpText()}</span>
                        {renderPullUpRetryBtn()}
                      </span>
                    }
                  />
                </If>
              </If>
              <div className="m78-scroller_pullup">
                <div className="m78-scroller_pullup-wrap">
                  {/* 未传hasData，或者传入且有值hasData */}
                  <If when={!isPullUpIng && state.hasData}>
                    <span className="m78-scroller_pullup-text">
                      <span>{methods.getPullUpText()}</span>
                      <If when={state.pullUpStatus === PullUpStatus.ERROR}>
                        {renderPullUpRetryBtn()}
                      </If>
                    </span>
                  </If>
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
          style={{
            right:
              methods.hasScroll('y') && state.scrollBarWidth ? state.scrollBarWidth : undefined,
          }}
        />
      )}

      {state.topFlag && <div className="m78-scroller_scroll-flag __start __isVertical" />}
      {state.bottomFlag && (
        <div
          className="m78-scroller_scroll-flag __isVertical"
          style={{
            bottom:
              methods.hasScroll('x') && state.scrollBarWidth ? state.scrollBarWidth : undefined,
          }}
        />
      )}

      <Tips controller={queue} />

      {props.backTop && (
        <BackTop target={scrollEl} style={{ position: 'absolute', right: 28, bottom: 38 }} />
      )}

      {props.extraNode}
    </div>
  );
});

Scroller.defaultProps = defaultProps;

export default Scroller;
