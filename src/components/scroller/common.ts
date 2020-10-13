/* TODO: 提到utils包中 */
export function decimalPrecision(num: number, precision = 1) {
  const mid = +`1${Array.from({ length: precision })
    .map(() => '0')
    .join('')}`;

  return Math.round(num * mid) / mid;
}

/* TODO: 提到utils包中 */
export function getScrollBarWidth(nodeTarget: HTMLElement) {
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

/**
 * 拖动位置超过threshold时，会出现橡皮效果，此函数用于计算出一个合理的弹性值
 * @param overSize - 超出threshold的值
 * @param maxSize - 允许超出的最大值
 * @param minFactor - 0 | 允许的最小弹性系数
 * @param initFactor - 初始弹性系数
 * */
export function rubberFactor(overSize: number, maxSize: number, minFactor = 0, initFactor = 1) {
  let d = initFactor - overSize / maxSize;

  d = Math.max(d, minFactor);

  if (d < 0) d = 0;
  if (d > 1) d = 1;

  return d;
}
