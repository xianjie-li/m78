import _clamp from 'lodash/clamp';
import { Share, SetDragPosArg } from './type';
import { getScrollBarWidth, rubberFactor } from './common';

export function useMethods(share: Share) {
  const { self, state, setState, props, setSp, setPgSp, sHelper, rootEl } = share;
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
  };
}
