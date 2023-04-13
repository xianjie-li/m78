import React, { useEffect, useRef } from "react";
import { _ScrollContext, ScrollPullDownAnimateValues } from "./types.js";
import { preventTopPull } from "./prevent-top-pull.js";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "react-spring";
import { IconAutorenew } from "@m78/icons/icon-autorenew.js";
import { _PULL_DOWN_SWIPE_RATIO, _PULL_DOWN_TRIGGER_RATIO } from "./common.js";
import { Column } from "../layout/index.js";
import clsx from "clsx";
import { isFunction } from "@m78/utils";
import { useDestroy, UseScrollMeta } from "@m78/hooks";

export const _usePullActions = (ctx: _ScrollContext) => {
  const { scroller, setState, state, pullDownEnabled, props, self } = ctx;

  const [sp, api] = useSpring<ScrollPullDownAnimateValues>(() => ({
    from: {
      y: 0,
      rotate: 0,
      ratio: 0,
    },
  }));

  const pullDownRef = useRef<HTMLDivElement>(null!);

  useDrag(
    ({ direction, movement: [, moveY], down }) => {
      if (state.pullDownRunning) return;

      const meta = scroller.get();
      const isPullDown = direction[1] === 1;
      const maxOffset = pullDownRef.current.clientHeight;
      // 最大旋转圈数
      const maxTurn = 2 * 360;
      const maxY = maxOffset / _PULL_DOWN_SWIPE_RATIO;
      // 旋转比例
      const ratio = moveY / maxY;

      if (!down) {
        if (self.pullDownFlag) {
          self.pullDownFlag = false;

          if (ratio >= _PULL_DOWN_TRIGGER_RATIO) {
            onPullDown();
          } else {
            api.start({
              y: 0,
              rotate: 0,
              ratio: 0,
            });
          }
        }
      }

      if (down && meta.touchTop) {
        // 起始位置只能下拉
        if (!isPullDown && moveY <= 0) return;

        self.pullDownFlag = true;

        const y = moveY * _PULL_DOWN_SWIPE_RATIO;
        const rotate = maxTurn * ratio;

        api.start({
          y,
          rotate,
          ratio,
          immediate: true,
        });
      }
    },
    {
      target: ctx.innerWrapRef,
      enabled: pullDownEnabled,
      bounds: () => {
        return {
          bottom: pullDownRef.current.clientHeight / _PULL_DOWN_SWIPE_RATIO,
        };
      },
      from: [0, 0],
      rubberband: true,
    }
  );

  /** 阻止部分浏览器的顶部下拉bounce效果(不完美) */
  useEffect(() => {
    if (!ctx.innerWrapRef.current || !pullDownEnabled) return;

    return preventTopPull(ctx.innerWrapRef.current);
  }, [ctx.innerWrapRef.current, pullDownEnabled]);

  // 清除上拉定时器
  useDestroy(() => clearTimeout(self.pullUpTimer));

  /** 触发下拉 */
  async function onPullDown() {
    setState({ pullDownRunning: true });

    const maxOffset = pullDownRef.current.clientHeight;

    await Promise.all(
      api.start({
        y: maxOffset,
        ratio: 1,
      })
    );

    await props.onPullDown!();

    await Promise.all(
      api.start({
        y: 0,
        ratio: 0,
      })
    );
    api.start({
      rotate: 0,
      immediate: true,
    });

    setState({ pullDownRunning: false });
  }

  const customerValues: ScrollPullDownAnimateValues = {
    ...sp,
    running: state.pullDownRunning,
  };

  /** 渲染下拉主内容 */
  function renderPullDownNode() {
    if (!pullDownEnabled) return null;

    // 默认节点
    let defNode: React.ReactNode = (
      <Column crossAlign="center" className="m78-scroll_pull-down_cont">
        <animated.div
          style={{
            rotate: props.pullDownIndicatorRotate ? sp.rotate : undefined,
          }}
          className="m78-scroll_pull-down_indicator"
        >
          <span
            className={clsx(
              "m78-scroll_pull-down_indicator-icon",
              state.pullDownRunning &&
                props.pullDownIndicatorRotate &&
                "m78-animate-spin-fast"
            )}
          >
            {renderPullDownIndicator()}
          </span>
        </animated.div>
        {props.pullDownText && (
          <div className="m78-scroll_pull-down_text">
            {isFunction(props.pullDownText)
              ? props.pullDownText(customerValues)
              : props.pullDownText}
          </div>
        )}
      </Column>
    );

    // 定制节点
    if (props.pullDownNode) {
      defNode = isFunction(props.pullDownNode)
        ? props.pullDownNode(customerValues)
        : props.pullDownNode;
    }

    return (
      <div className="m78-scroll_pull-down" ref={pullDownRef}>
        <animated.div style={{ y: sp.y }}>{defNode}</animated.div>
      </div>
    );
  }

  /** 渲染下拉图标 */
  function renderPullDownIndicator() {
    if (!props.pullDownIndicator) return <IconAutorenew />;

    return isFunction(props.pullDownIndicator)
      ? props.pullDownIndicator(customerValues)
      : props.pullDownIndicator;
  }

  /** 滚动, 主要用于上拉加载处理 */
  async function onScroll(meta: UseScrollMeta) {
    if (!props.onPullUp) return;
    const ratio = meta.y / meta.yMax;

    if (ratio >= props.pullUpTriggerRatio) {
      if (self.pullUpLock) return;

      self.pullUpLock = true;

      await props.onPullUp();

      self.pullUpLock = false;
    }
  }

  return {
    springStyle: sp,
    pullDownNode: renderPullDownNode(),
    onPullDown,
    onScroll,
  };
};

export type _UsePullActionsReturns = ReturnType<typeof _usePullActions>;
