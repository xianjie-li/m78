export function rubberFactor(overSize: number, maxSize: number, minFactor = 0, initFactor = 1) {
  let d = initFactor - overSize / maxSize;

  d = Math.max(d, minFactor);

  if (d < 0) d = 0;
  if (d > 1) d = 1;

  return d;
}

/**
 * 根据移动的offset和可移动总量计算出一个合理的旋转角度
 * @param offset - 当前距离
 * @param max - 最大移动距离
 * @param allTurn - 可选值的总圈数
 * */
export function offset2Rotate(offset: number, max: number, allTurn = 1.5) {
  const oMax = Math.min(359, max);

  const times = 360 / oMax;
  const oneTurn = max * times;
  const all = oneTurn * allTurn;
  const current = offset * times * allTurn;

  return Math.min(current, all);
}

/** 表示下拉刷新的所有阶段 */
export enum PullDownStatus {
  TIP,
  RELEASE_TIP,
  LOADING,
  ERROR,
  SUCCESS,
}

/** 表示上拉加载的所有阶段 */
export enum PullUpStatus {
  TIP,
  LOADING,
  NOT_DATA,
  ERROR,
  // SUCCESS,
}

/** 下拉刷新各阶段的提示文本 */
export const pullDownText = {
  [PullDownStatus.TIP]: '下拉刷新',
  [PullDownStatus.RELEASE_TIP]: '松开刷新',
  [PullDownStatus.LOADING]: '正在刷新',
  [PullDownStatus.ERROR]: '刷新失败',
  [PullDownStatus.SUCCESS]: '数据已更新',
};

/** 上拉加载各阶段的提示文本 */
export const pullUpText = {
  [PullUpStatus.TIP]: '上拉加载更多',
  [PullUpStatus.LOADING]: '加载中',
  [PullUpStatus.NOT_DATA]: '没有更多了',
  [PullUpStatus.ERROR]: '加载失败,',
  // [PullUpStatus.SUCCESS]: '获取到{num}条新数据',
};
