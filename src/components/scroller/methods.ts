import _clamp from 'lodash/clamp';
import { SetDragPosArg, Share } from './type';
import { getScrollBarWidth, PullDownStatus, pullDownText, rubberFactor } from './common';

export function useMethods(share: Share) {
  const { self, state, setState, props, setSp, setPgSp, setPullDownSp, sHelper, rootEl } = share;
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

      setSp({
        [spKey]: _clamp(self[posKey], 0, threshold + rubber),
      });
    } else if (endTouch) {
      self[posKey] +=
        cDelta *
        (self[posKey] < -minRubberFactor && cDelta < 0 /* 只在向上/左滑时 */
          ? rubberFactor(Math.abs(self[posKey]) - minRubberFactor, threshold, 0.1, soap)
          : soap);

      setSp({
        [spKey]: _clamp(self[posKey], -threshold - rubber, 0),
      });
    }
  }

  /** 容器滚动处理函数 */
  function scrollHandle() {
    refreshProgressBar('x');
    refreshProgressBar('y');

    refreshScrollFlag();
  }

  /** 如果启用，刷新进度条状态 */
  function refreshProgressBar(type: 'x' | 'y') {
    if (!progressBar) return;

    const thresholdSize = typeof progressBar === 'number' ? progressBar : 500;

    const meta = sHelper.get();

    const current = meta[type];
    const max = meta[`${type}Max` as 'xMax'];

    if (max < thresholdSize) return;

    const percentage = _clamp((current / max) * 100, 0, 100);

    setPgSp({
      [type]: percentage,
    });
  }

  /** 如果启用，滚动表示状态 */
  function refreshScrollFlag() {
    if (!scrollFlag) return;

    const meta = sHelper.get();

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
    const meta = sHelper.get();

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
   * 处理下拉刷新逻辑
   * @return 可以返回true来在事件绑定器中阻止默认的松开还原操作
   * */
  function pullDownHandler({ down }: { down: boolean }) {
    if (!props.onPullDown) return;

    const inThreshold = self.memoY >= threshold;

    // 正在加载时不走后续逻辑
    if (state.pullDownStatus === PullDownStatus.LOADING) {
      if (!down) {
        if (inThreshold) {
          pullDownToThreshold();
        } else {
          stopPullDown();
        }
      }

      return true;
    }

    // 小于触发距离且状态还在松开刷新提示中，将其还原
    if (!inThreshold && state.pullDownStatus === PullDownStatus.RELEASE_TIP) {
      setState({
        pullDownStatus: PullDownStatus.TIP,
      });
    }

    // 按下且已达到触发刷新距离
    if (down && inThreshold) {
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

  /** 触发下拉刷新、设置位置到threshold、下拉icon启用旋转动画、设置下拉状态为加载中, 并触发onPullDown */
  function triggerPullDown() {
    pullDownToThreshold();

    if (state.pullDownStatus !== PullDownStatus.LOADING) {
      setPullDownSp({
        to: async (next: any) => {
          while (state.pullDownStatus === PullDownStatus.LOADING) {
            await next({ r: 360, immediate: false, config: { duration: 1000 } });
            await next({ r: 1, immediate: true });
          }
        },
      });
    }

    if (state.pullDownStatus !== PullDownStatus.LOADING) {
      setState({
        pullDownStatus: PullDownStatus.LOADING,
      });
    }

    props.onPullDown!()
      .then(() => {
        stopPullDown();
        console.log('成功');
      })
      .catch(() => {
        stopPullDown();
        console.log('失败');
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

  /** 推送一条消息 */
  function sendMsg() {}

  return {
    setDragPos,
    scrollHandle,
    refreshProgressBar,
    refreshScrollFlag,
    hasScroll,
    getScrollWidth,
    sendMsg,
    pullDownHandler,
    getPullDownText,
  };
}
