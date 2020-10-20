import _clamp from 'lodash/clamp';
import { UseScrollMeta } from '@lxjx/hooks';
import { isNumber } from '@lxjx/utils';
import Button from 'm78/button';
import Message from 'm78/message';
import React from 'react';
import { Direction } from 'm78/util';
import { SetDragPosArg, Share } from './type';
import {
  decimalPrecision,
  getScrollBarWidth,
  PullDownStatus,
  pullDownText,
  PullUpStatus,
  pullUpText,
  rubberFactor,
} from './common';

export function useMethods(share: Share) {
  const { self, state, setState, props, setSp, setPgSp, setPullDownSp, rootEl } = share;
  const { soap, threshold, rubber, progressBar, scrollFlag, hideScrollbar } = props;

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

    /** 橡皮滑动最小开始点 */
    const minRubberFactor = threshold - rubber;

    // 根据滚动距离和方向等状态设置拖动位置, 并在达到阈值时通过rubberFactor设置橡皮筋效果
    if (startTouch) {
      self[posKey] +=
        cDelta *
        (self[posKey] > minRubberFactor && cDelta > 0 /* 只在向下/右滑时 */
          ? rubberFactor(self[posKey] - minRubberFactor, threshold, 0.1, soap)
          : soap);

      self[posKey] = _clamp(decimalPrecision(self[posKey]), 0, threshold + rubber);

      setSp({
        [spKey]: self[posKey],
      });
    } else if (endTouch) {
      self[posKey] +=
        cDelta *
        (self[posKey] < -minRubberFactor && cDelta < 0 /* 只在向上/左滑时 */
          ? rubberFactor(Math.abs(self[posKey]) - minRubberFactor, threshold, 0.1, soap)
          : soap);

      self[posKey] = _clamp(self[posKey], -threshold - rubber, 0);

      setSp({
        [spKey]: self[posKey],
      });
    }
  }

  /** 容器滚动处理函数 */
  function scrollHandle(meta: UseScrollMeta) {
    props.onScroll?.(meta);

    refreshProgressBar('x');
    refreshProgressBar('y');

    refreshScrollFlag();

    pullUpHandler(meta);
  }

  /** 如果启用，刷新进度条状态 */
  function refreshProgressBar(type: 'x' | 'y') {
    if (!progressBar) return;

    const thresholdSize = typeof progressBar === 'number' ? progressBar : 500;

    const meta = share.sHelper.get();

    const current = meta[type];
    const max = meta[`${type}Max` as 'xMax'];

    if (max < thresholdSize) return;

    const percentage = _clamp((current / max) * 100, 0, 100);

    setPgSp({
      [type]: percentage,
    });
  }

  /** 如果启用，刷新标识状态 */
  function refreshScrollFlag() {
    if (!scrollFlag) return;

    const meta = share.sHelper.get();

    const xHas = hasScroll('x');
    const yHas = hasScroll('y');

    // 有滚动内容才计算
    if (xHas || yHas) {
      const topFlag = yHas && !meta.touchTop;
      const bottomFlag = yHas && !meta.touchBottom;
      const leftFlag = xHas && !meta.touchLeft;
      const rightFlag = xHas && !meta.touchRight;

      const isAllEqual =
        topFlag === state.topFlag &&
        leftFlag === state.leftFlag &&
        bottomFlag === state.bottomFlag &&
        rightFlag === state.rightFlag;

      if (!isAllEqual) {
        setState({
          topFlag,
          bottomFlag,
          leftFlag,
          rightFlag,
        });
      }
      // 午滚动内容且包含了flag，全部重置
    } else if (state.topFlag || state.bottomFlag || state.leftFlag || state.rightFlag) {
      setState({
        topFlag: false,
        bottomFlag: false,
        leftFlag: false,
        rightFlag: false,
      });
    }
  }

  /** 指定轴是否包含滚动区域 */
  function hasScroll(type: 'x' | 'y') {
    const meta = share.sHelper.get();

    const max = type === 'x' ? meta.xMax : meta.yMax;

    return !!max;
  }

  /** 获取滚动条宽度并设置到state */
  function getScrollWidth() {
    if (!hideScrollbar && !scrollFlag) return;

    const w = getScrollBarWidth(rootEl.current);

    if (!w || w === state.scrollBarWidth) return;

    setState({
      scrollBarWidth: w,
    });
  }

  /**
   * 处理下拉刷新逻辑，down表示是否按下
   * @return 可以返回true来在事件绑定器中阻止默认的松开还原操作
   * */
  function pullDownHandler({ down }: { down: boolean }) {
    if (!props.onPullDown) return;

    const inThreshold = self.memoY >= threshold;

    // 正在加载时不走后续逻辑
    if (isPullActioning()) {
      if (isPullDowning()) {
        if (!down) {
          if (inThreshold) {
            pullDownToThreshold();
          } else {
            stopPullDown();
          }
        }
      }

      if (isPullUpIng()) return;

      return true;
    }

    // 小于触发距离且状态还在松开刷新提示中，将其还原
    if (!inThreshold && state.pullDownStatus === PullDownStatus.RELEASE_TIP) {
      setState({
        pullDownStatus: PullDownStatus.TIP,
      });
    }

    // 按下且已达到触发刷新距离
    if (down && inThreshold && state.pullDownStatus !== PullDownStatus.RELEASE_TIP) {
      setState({
        pullDownStatus: PullDownStatus.RELEASE_TIP,
      });
    }

    // 按下时不走后续逻辑
    if (down) return;

    if (!inThreshold) return;

    triggerPullDown();

    return true;
  }

  /** 触发下拉刷新, 处于任意加载状态时无效 */
  function triggerPullDown() {
    if (isPullActioning() || !props.onPullDown) return;

    setState({
      pullDownStatus: PullDownStatus.LOADING,
    });

    pullDownToThreshold();

    setPullDownSp({
      from: { r: 0 },
      to: { r: 360 },
      immediate: false,
      loop: isPullDowning,
      config: { duration: 1000 },
    });

    props
      .onPullDown()
      .then(() => {
        console.log('成功'); /* TODO: 添加消息提示组件 */
        if (props.pullDownTips) {
          Message.tips({
            content: pullDownText[PullDownStatus.SUCCESS],
          });
        }

        // 刷新成功时，还原上拉加载状态、触发上拉加载
        if (props.onPullUp) {
          setTimeout(() => {
            setState({
              pullUpStatus: PullUpStatus.TIP,
            });
          }, 50);
        }
      })
      .catch(() => {
        console.log('失败'); /* TODO: 添加消息提示组件 */
        if (props.pullDownTips) {
          Message.tips({
            content: React.createElement('span', null, [
              pullDownText[PullDownStatus.ERROR],
              React.createElement(
                Button,
                {
                  color: 'primary',
                  size: 'small',
                  link: true,
                  key: 'actionBtn',
                  onClick: triggerPullDown,
                },
                '重试',
              ),
            ]),
          });
        }
      })
      .finally(() => {
        stopPullDown();
      });
  }

  /** 设置到下拉位置到threshold处 */
  function pullDownToThreshold() {
    setSp({
      y: self.memoY = threshold,
    });
  }

  /** 停止下拉并还原动画和状态文本 */
  function stopPullDown() {
    setSp({
      y: self.memoY = 0,
    });

    setState({
      pullDownStatus: PullDownStatus.TIP,
    });
  }

  /** 根据下拉状态获取当前的下拉文本 */
  function getPullDownText() {
    return pullDownText[state.pullDownStatus] || '';
  }

  function isPullDowning() {
    return state.pullDownStatus === PullDownStatus.LOADING;
  }

  function isPullUpIng() {
    return state.pullUpStatus === PullUpStatus.LOADING;
  }

  /** 正在上拉或下拉操作中 */
  function isPullActioning() {
    return isPullUpIng() || isPullDowning();
  }

  /** 处理上拉加载逻辑 */
  function pullUpHandler(meta: UseScrollMeta) {
    if (!props.onPullUp) return;
    // 未达到触发距离
    if (meta.y + props.pullUpThreshold < meta.yMax) return;

    // 不在提示阶段时阻止滚动触发加载(依然可以手动触发)
    if (state.pullUpStatus !== PullUpStatus.TIP) return;

    triggerPullUp();
  }

  /** 获取当前上拉状态的文本 */
  function getPullUpText() {
    return pullUpText[state.pullUpStatus] || '';
  }

  /** 触发上拉加载, 参数见props */
  function triggerPullUp(isRefresh?: boolean) {
    // 正在进行其他操作/未开启上拉
    if (isPullActioning() || !props.onPullUp) return;

    setState({
      pullUpStatus: PullUpStatus.LOADING,
    });

    props
      .onPullUp({ isRefresh })
      .then(num => {
        if (isNumber(num) && num > 0) {
          /* TODO: 加载提示 */
          Message.tips({
            content: pullUpText[PullUpStatus.SUCCESS].replace('{num}', String(num)),
          });

          setState({
            pullUpStatus: PullUpStatus.TIP,
          });
        } else {
          setState({
            pullUpStatus: PullUpStatus.NOT_DATA,
          });
        }
      })
      .catch(() => {
        setState({
          pullUpStatus: PullUpStatus.ERROR,
        });
      });
  }

  /** 向前或向后滚动整页 */
  function slide(isPrev?: boolean) {
    const isVertical = props.direction === Direction.vertical;
    const pos = isVertical ? 'y' : 'x';
    const sizeKey = isVertical ? 'height' : 'width';

    const meta = share.sHelper.get();

    let pageSize = meta[sizeKey];

    if (isPrev) {
      pageSize = -pageSize;
    }

    share.sHelper.set({ [pos]: pageSize, raise: true });
  }

  function slidePrev() {
    slide(true);
  }

  function slideNext() {
    slide();
  }

  return {
    setDragPos,
    scrollHandle,
    refreshScrollFlag,
    hasScroll,
    getScrollWidth,
    pullDownHandler,
    getPullDownText,
    getPullUpText,
    isPullUpIng,
    triggerPullDown,
    triggerPullUp,
    slidePrev,
    slideNext,
  };
}
