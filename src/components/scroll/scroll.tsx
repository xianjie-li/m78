import React, { useEffect, useCallback, useImperativeHandle } from 'react';
import { useGesture } from 'react-use-gesture';
import { Coordinates, FullGestureState } from 'react-use-gesture/dist/types';

import { animated, useSpring, interpolate, config } from 'react-spring';

import { isNumber } from '@lxjx/utils';
import { Transition } from '@lxjx/react-transition-spring';
import { useSelf, useSyncState, useScroll } from '@lxjx/hooks';
import preventTopPullDown from 'prevent-top-pull-down';

import { If, Toggle, Switch } from '@lxjx/fr/lib/fork';
import Spin from '@lxjx/fr/lib/spin';
import Empty from '@lxjx/fr/lib/empty';
import Button from '@lxjx/fr/lib/button';
import { dumpFn } from '@lxjx/fr/lib/util';
import _debounce from 'lodash/debounce';

import cls from 'classnames';

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

export interface ScrollProps extends ComponentBaseProps {
  /** 下拉刷新开关, 默认关闭 */
  pullDown?: boolean;
  /** 下拉刷新触发回调 */
  onPullDown?: (pullDownFinish: ScrollRef['pullDownFinish']) => void;
  /** 上拉加载开关, 默认关闭 */
  pullUp?: boolean;
  /** 上拉事件触发回调, 当skip为true，说明该操作由内部触发(失败、空数据重试等), 并且不期望执行增加页码等操作，应仅仅执行数据更新 */
  onPullUp?: (pullUpFinish: ScrollRef['pullUpFinish'], skip?: boolean) => void;
  /** 触发上拉加载的距离， 默认160 */
  threshold?: number;
  /** 滚动事件 TODO: 引入正确类型 */
  onScroll?: (meta: any) => void;
  /** 指定onScroll的防抖时间, 注意这会导致onScroll内部不能引用到最新的组件状态，可以理解为防抖后，onScroll回调永远指向你第一次传入的那个函数 */
  throttleTime?: number;
  /**
   * hasData 当前是否有数据. 通常会传入data.length。用于实现更好的首次加载、无数据时的反馈等。
   * 因为Scroll内部是不知道数据总量的， */
  hasData?: boolean;
  /** 是否显示返回顶部 */
  backTop?: boolean;

  children: React.ReactNode;
}

const pullDownThreshold = 160; // 触发下拉刷新的阈值
const baseIndicatorPos = 50; // 下拉刷新指示器的基准y轴位置
const pullDownSuccessText = '数据已更新';
const pullDownFailText = '更新数据失败, 请重试!';
const pullUpNoDataText = '没有更多了';
const pullUpLoadMoreText = '加载更多';
const pullUpErrorText = '数据加载失败';

const Scroll = React.forwardRef<ScrollRef, ScrollProps>(
  (
    {
      children,
      pullDown = false,
      onPullDown = dumpFn,
      pullUp = false,
      threshold = 80,
      onPullUp = dumpFn,
      onScroll = dumpFn,
      throttleTime,
      hasData = true,
      backTop = true,
      className,
      style,
    },
    fRef,
  ) => {
    /* 滚动容器 */
    const { ref, ...scrollHelps } = useScroll<HTMLDivElement>({
      onScroll,
      throttleTime,
    });

    /* 实例属性 */
    const self = useSelf({
      pullDownTimer: 0, // 提示框需要延迟关闭，存储timer返回
      pullUpTimer: 0, // 提示框需要延迟关闭，存储timer返回
      loadCount: 0, // 加载总次数, 每次请求后递增, 在为0时不会渲染"没有数据"节点
      pullUpTriggerFlag: false, // 标记用于在同一次进入触底区域只会触发一次touchBottom
    });

    /* 状态 */
    const [state, setState] = useSyncState({
      pullDownLoading: false, // 正在下拉加载中，当处于此状态时无法触发下一次下拉或上拉
      pullDownSuccess: false, // 刷新成功时标记
      pullDownFail: false, // 刷新失败时标记

      pullUpLoading: false, // 正在上拉加载中，当处于此状态时无法触发下一次下拉或上拉
      dataLength: undefined as number | undefined, // 是否有更多数据 为0时代表已没有更多
      pullUpHasError: false, // 是否有错误

      toTopShow: false,
    });

    /* 下拉刷新提示器控制 */
    const [spPullDown, set] = useSpring(() => ({ y: 0, over: 0, scroll: 1, config: config.stiff }));

    /* 进行初始化的pullDown调用 */
    useEffect(() => {
      touchBottom(true);
      // eslint-disable-next-line
    }, []);

    /* 禁用一些默认事件，如、qq 微信 ios 的顶部下拉 */
    useEffect(
      function preventDefault() {
        let destroy: any;
        if (pullDown) {
          destroy = preventTopPullDown(ref.current!);
        }

        return () => {
          pullDown && destroy();
        };
        // eslint-disable-next-line
      },
      [pullDown],
    );

    /* 标记下拉刷新结束，此函数对外暴露, 由用户触发 */
    const pullDownFinish: ScrollRef['pullDownFinish'] = (isSuccess = true) => {
      if (!state.pullDownLoading) return; // 未在请求中时忽略
      setState({
        [isSuccess ? 'pullDownSuccess' : 'pullDownFail']: true,
        dataLength: undefined, // 也重置上拉状态
        pullUpHasError: false,
      });
      scrollHelps.set({ y: 0 });
      resetPullDown();
      resetPullDownStatus();
    };

    /* 标记上拉刷新结束，此函数对外暴露, 由用户触发 */
    const pullUpFinish: ScrollRef['pullUpFinish'] = (dataLength = 0, hasError = false) => {
      if (!state.pullUpLoading || !pullUp) return;
      setState({
        pullUpLoading: false,
        dataLength: hasError ? undefined : dataLength,
        pullUpHasError: hasError,
      });
      // 有数据则验证还原上拉状态
      if (dataLength && !hasError) {
        autoClosePullUpTips();
      }
    };

    /* 滚动到指定位置 */
    const scrollTo: ScrollRef['scrollTo'] = (to, immediate) => {
      scrollHelps.set({
        y: to,
        immediate,
      });
    };

    /* 根据当前位置滚动指定距离 */
    const scrollBy: ScrollRef['scrollBy'] = (offset, immediate) => {
      scrollHelps.set({
        y: offset,
        raise: true,
        immediate,
      });
    };

    /* 根据当前位置滚动指定距离 */
    const scrollToElement: ScrollRef['scrollToElement'] = el => {
      scrollHelps.scrollToElement(el as string);
    };

    /* ref */
    useImperativeHandle(fRef, () => ({
      pullDownFinish,
      triggerPullDown,
      pullUpFinish,
      resetPullUp,
      scrollTo,
      scrollBy,
      scrollToElement,
      triggerPullUp: touchBottom,
      el: ref.current!,
    }));

    /* 控制返回顶部开关 */
    const debounceOnScroll = useCallback(
      _debounce((event: FullGestureState<Coordinates>) => {
        const y = event.offset[1];
        if (y > 800 && !state.toTopShow) {
          setState({
            toTopShow: true,
          });
        }
        if (y < 800 && state.toTopShow) {
          setState({
            toTopShow: false,
          });
        }
      }, 1000),
      [],
    );

    const bind = useGesture(
      {
        onDrag({ event, down, cancel, first, movement: [, moveY] }) {
          event?.preventDefault();
          const scrollMeta = scrollHelps.get();
          if (state.pullDownLoading || !pullDown || state.pullUpLoading) return;
          const atTop = scrollMeta.touchTop;

          /* 处理拖动 */
          if (atTop && down) {
            if (first && self.pullDownTimer) {
              // 如果存在time id则清除
              clearTimeout(self.pullDownTimer);
            }

            let over = 0;
            if (moveY > pullDownThreshold) {
              over = (moveY - pullDownThreshold) * 0.8;
              moveY = pullDownThreshold;
            }
            set({ y: moveY, over });
          }

          /* 处理松开 */
          if (atTop && !down) {
            cancel!();

            // 大于阈值触发刷新动作
            if (spPullDown.y.getValue() >= pullDownThreshold - 10) {
              // 使用实时值进行判断防止快速滑动导致的误触, -10可以增强体验，因为动画存在一定的延迟
              // if (moveY >= pullDownThreshold) {

              triggerPullDown();

              return;
            }

            set({ y: 0, over: 0 });
          }

          /* 不在顶部时直接停止drag事件, 处理PC上下拉同时滑动滚动导致的异常 */
          if (!atTop && down) {
            cancel!();
            if (spPullDown.y.getValue() !== 0) {
              resetPullDown();
            }
          }
        },
        onScroll(event) {
          const {
            offset: [, scrollTop],
          } = event;
          const { yMax } = scrollHelps.get();

          /* 过低的throttleTime性能反而会更差，直接视为无节流 */
          backTop && debounceOnScroll(event);

          if (!pullUp) return;
          const elHeight = yMax - threshold;
          if (elHeight - scrollTop <= 0) {
            if (self.pullUpTriggerFlag) return;
            self.pullUpTriggerFlag = true;
            touchBottom();
          } else {
            self.pullUpTriggerFlag = false;
          }
        },
      },
      {
        domTarget: ref,
        event: { passive: false },
      },
    );

    useEffect(bind, [bind]);

    /* ================= 下拉相关 ================== */

    /** 延迟1500ms后还原下拉状态, (更好的视觉效果) */
    function resetPullDownStatus() {
      if (self.pullDownTimer) {
        clearTimeout(self.pullDownTimer);
      }
      self.pullDownTimer = window.setTimeout(() => {
        setState({
          pullDownLoading: false,
          pullDownSuccess: false,
          pullDownFail: false,
        });
      }, 1500);
    }

    /** 重置下拉控制器位置 */
    function resetPullDown() {
      set({ y: 0, over: 0 });
    }

    /** 主动触发下拉 */
    function triggerPullDown() {
      if (state.pullDownLoading || !pullDown || state.pullUpLoading) return;
      // 回传事件
      onPullDown(pullDownFinish);
      // 设置状态
      setState({
        pullDownLoading: true,
        pullDownSuccess: false,
        pullDownFail: false,
      });
      set({
        y: baseIndicatorPos + 40,
        over: 0,
      });
    }

    /* ================= 上拉相关 ================== */

    /** 触底事件 */
    function touchBottom(skip = false) {
      if (
        !pullUp ||
        state.dataLength === 0 ||
        state.pullUpHasError ||
        state.pullUpLoading ||
        state.pullDownLoading
      )
        return;
      setState({
        pullUpLoading: true,
        pullUpHasError: false,
        dataLength: undefined,
      });

      if (self.pullUpTimer) {
        clearTimeout(self.pullUpTimer);
      }
      self.loadCount += 1;

      onPullUp(pullUpFinish, skip);
    }

    /** 1500ms后关闭上拉提示并还原状态 */
    function autoClosePullUpTips() {
      self.pullUpTimer = window.setTimeout(resetPullUp, 1500);
    }

    function resetPullUp() {
      setState({
        dataLength: undefined,
        pullUpHasError: false,
      });
    }

    /* 触发onPullUp并且传入 skip: true，提示用户需要进行数据更新 */
    function onReTry() {
      resetPullUp();
      touchBottom(true);
    }

    return (
      <div className={cls('fr-scroll_wrap', className)} style={style}>
        {/* 顶部文字提示框 */}
        <Transition
          type="slideTop"
          toggle={state.pullDownSuccess || state.pullDownFail || !!state.dataLength}
          className={cls('fr-scroll_tips', { __fail: state.pullDownFail })}
        >
          <If when={state.pullDownSuccess}>{pullDownSuccessText}</If>
          <If when={state.pullDownFail}>{pullDownFailText}</If>
          <If when={isNumber(state.dataLength) && state.dataLength > 0}>
            获取到{state.dataLength}条{self.loadCount === 1 ? '' : '新'}数据
          </If>
        </Transition>
        {/* 返回顶部按钮 */}
        <Transition
          className="fr-scroll_scroll-top"
          type="slideRight"
          toggle={state.toTopShow}
          alpha={false}
        >
          <Button
            circle
            onClick={() => {
              scrollTo(0);
            }}
          >
            <span className="fs-20">↑</span>
          </Button>
        </Transition>
        {/* 下拉刷新提示器 */}
        <Toggle when={pullDown}>
          <div className="fr-scroll_pulldown-wrap">
            <animated.div
              className="fr-scroll_icon"
              style={{
                transform: interpolate(
                  [spPullDown.y, spPullDown.over],
                  (y, over) => `translateY(${y * 0.8}px) rotate3d(0,0,1,${-(y * 3 + over)}deg)`,
                ),
              }}
            >
              <svg
                className={cls('fr-svg-icon', { __animation: state.pullDownLoading })}
                aria-hidden="true"
              >
                <use xlinkHref="#icon-fengche" />
              </svg>
            </animated.div>
          </div>
        </Toggle>
        {/* ios滑动时绝对定位的元素会抖动，多套一层方便放一些其他的挂件 */}
        <animated.div ref={ref} className="fr-scroll">
          {/* 实际内容 */}
          <div>{children}</div>
          {/* 上拉加载相关 */}
          <If when={pullUp}>
            <If when={!hasData}>
              <div style={{ height: '26%' }} />
            </If>{' '}
            {/* 撑开高度以优化显示 */}
            <If
              when={
                !hasData && self.loadCount !== 0 && !state.pullUpLoading && !state.pullUpHasError
              }
            >
              <Empty desc="暂无数据" size="large">
                <Button size="small" onClick={onReTry}>
                  再试试
                </Button>
              </Empty>
            </If>
            <div className="fr-scroll_pullup-wrap">
              <Switch>
                <If when={state.pullUpLoading}>
                  <Spin size="small" inline show={state.pullUpLoading} />
                </If>
                <If when={state.pullUpHasError}>
                  <span className="fr-scroll_tip-base fr-scroll_error">
                    {pullUpErrorText}
                    <span onClick={onReTry}> 重试</span>
                  </span>
                </If>
                <If when={state.dataLength === 0 && hasData}>
                  <span className="fr-scroll_no-data fr-scroll_tip-base">{pullUpNoDataText}</span>
                </If>
                <If
                  when={
                    state.dataLength !== 0 &&
                    hasData &&
                    !state.pullUpLoading &&
                    !state.pullDownLoading
                  }
                >
                  <span
                    className="fr-scroll_loadmore fr-scroll_tip-base"
                    onClick={() => touchBottom()}
                  >
                    <Button size="small">{pullUpLoadMoreText}</Button>
                  </span>
                </If>
              </Switch>
            </div>
          </If>
        </animated.div>
      </div>
    );
  },
);

export default Scroll;
