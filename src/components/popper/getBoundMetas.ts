/** 在该方向应设置的左上偏移 */
interface GetBoundDirectionData {
  left: number;
  top: number;
}

interface GetBoundArgs {}

interface GetBoundMetasReturns {
  topLeft?: GetBoundDirectionData;
  top?: GetBoundDirectionData;
  topRight?: GetBoundDirectionData;
  left?: GetBoundDirectionData;
  right?: GetBoundDirectionData;
  bottomLeft?: GetBoundDirectionData;
  bottom?: GetBoundDirectionData;
  bottomRight?: GetBoundDirectionData;
  /**  当元素不可见时为true，可以作为性能优化点 */
  overflow: boolean;
}

// { width: number; height: number }
// { width: number; height: number; left: number; top: number }

export function getBoundMetas(source: HTMLElement, target: HTMLElement, wrap: HTMLElement) {
  const wrapB = wrap.getBoundingClientRect();

  const wH = window.innerHeight;
  const wW = window.innerWidth;

  const sourceB = source.getBoundingClientRect();
  const targetB = target.getBoundingClientRect();

  console.log(targetB.left, targetB.bottom, wH - targetB.bottom);

  const allHeight = targetB.height + sourceB.height;
  const allWidth = targetB.width + sourceB.width;

  // 包裹元素距离窗口底部的距离
  const WrapOffsetToBottom = wH - wrapB.top - wrapB.height;

  // 包裹元素距离窗口右边的距离
  const WrapOffsetToRight = wW - wrapB.left - wrapB.width;

  /* 下面两个变量用来处理左右和上下的联动判断 */
  // 启用left、right的额外条件
  const enableLR =
    /* 目标顶边距 - 包裹顶边距 > 0 */
    targetB.top - wrapB.top > 0 &&
    /* 目标定边距 + 包裹低边距 + 目标高度 < 窗口高 */
    targetB.top + WrapOffsetToBottom + targetB.height < wH;

  // 启用top、bottom的额外条件
  const enableTB =
    /*  */
    targetB.left - wrapB.left > 0 &&
    /*  */
    targetB.left + WrapOffsetToRight + targetB.width < wW;

  const res = {
    /* 目标元素距离顶部高度大于传入元素高度 且 目标元素距顶高度 - 窗口高度 < 元素总高度 */
    top:
      /* 目标顶边距 - 容器顶边距 > 气泡高度 */
      targetB.top - wrapB.top > sourceB.height &&
      /* 目标顶边距 - 包裹元素底边距 - 窗口高度 */
      targetB.top + WrapOffsetToBottom - wH < sourceB.height &&
      enableTB,
    /* 窗口高 - 目标上边距 > 总高度 且 目标上边距 + 总高度 > 0 */
    bottom:
      /* 窗口高 - 目标上边距 - 包裹元素低边距 > 总高度 */
      wH - targetB.top - WrapOffsetToBottom > allHeight &&
      /* 目标上边距 - 包裹元素上边距 + 总高度 */
      targetB.top - wrapB.top + allHeight > 0 &&
      enableTB,
    left:
      /*  */
      targetB.left - wrapB.left > sourceB.width &&
      /*  */
      targetB.left + WrapOffsetToRight - wW < sourceB.width &&
      enableLR,
    right:
      /*  */
      wW - targetB.left - WrapOffsetToRight > allWidth &&
      /*  */
      targetB.left - wrapB.left + allWidth > 0 &&
      enableLR,
    topOverflow: targetB.height + sourceB.height + targetB.top < 0,
    bottomOverflow: wH - targetB.top < 0,
  };

  console.log(res);
}
