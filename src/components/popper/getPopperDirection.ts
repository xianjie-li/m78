import React from 'react';
import { getRefDomOrDom } from '@lxjx/hooks';
import { isPopperBound } from './utils';
import { Size, Bound, DirectionKeys, PopperDirectionInfo } from './types';

/**
 * 根据popper尺寸，目标的位置信息计算气泡位置
 * @param popperSize - 包含气泡宽高信息的对象
 * @param target - 目标, 可以是描述位置尺寸的Bound对象、dom节点、指向dom节点的ref
 * @param options
 * @param options.offset - 0 | 偏移位置
 * @return - 包含所有方向气泡位置<Bound>的对象, 这些位置对于的是整个页面左上角开始
 * */
export function getPopperDirection(
  popperSize: Size,
  target: Bound | React.RefObject<HTMLElement> | HTMLElement,
  options = {} as { offset: number },
): PopperDirectionInfo | null {
  const { offset = 0 } = options;

  const size = popperSize;

  /** 目标元素 */
  let tg: Bound;

  const winSt = document.documentElement.scrollTop + document.body.scrollTop;
  const winSl = document.documentElement.scrollLeft + document.body.scrollLeft;

  if (isPopperBound(target)) {
    tg = target;
  } else {
    const domTarget = getRefDomOrDom(target);
    if (domTarget) {
      tg = domTarget.getBoundingClientRect();
    } else {
      // throwError('target resolve error', 'popper');
      return null;
    }
  }

  /** 目标元素的宽 */
  const targetW = tg.right - tg.left;
  /** 目标元素的高 */
  const targetH = tg.bottom - tg.top;

  /** 气泡大于目标元素的宽 */
  const overW = size.width - targetW;
  /** 气泡大于目标元素的高 */
  const overH = size.height - targetH;

  /* ############# 可以在多个反向复用的基准线 ############# */

  /** 顶部基准线, 用于top系位置 */
  const topY = tg.top - size.height + winSt - offset;
  /** 中部基准线, 用于left、right */
  const centerY = tg.top - overH / 2 + winSt;
  /** 底部基准线, 用于left、right */
  const bottomY = tg.bottom + winSt + offset;

  /** 顶部起第二根基准线, 用于leftEnd、rightEnd */
  const topSecondY = tg.bottom - size.height + winSt;
  /** 顶部起第二根基准线, 用于leftStart、rightStart */
  const bottomSecondY = tg.bottom - targetH + winSt;
  /** x轴的左侧基准线, 用于所有left系的左侧 */
  const leftX = tg.left - size.width + winSl - offset;

  /** x轴的左侧第二根基准线, 用于topEnd、bottomEnd */
  const leftSecondX = tg.right - size.width + winSl;
  /** x轴中心基准线，用于 top、bottom */
  const centerX = tg.left - overW / 2 + winSl;
  /** x轴的右侧第二根基准线, 用于topStart、bottomStart */
  const rightSecondX = tg.left + winSl;
  /** x轴的右侧基准线, 用于所有right系的左侧 */
  const rightX = tg.right + winSl + offset;

  return getRBObjForLTObj(
    {
      top: {
        top: topY,
        left: centerX,
      },
      topStart: {
        top: topY,
        left: rightSecondX,
      },
      topEnd: {
        top: topY,
        left: leftSecondX,
      },
      left: {
        top: centerY,
        left: leftX,
      },
      leftStart: {
        top: bottomSecondY,
        left: leftX,
      },
      leftEnd: {
        top: topSecondY,
        left: leftX,
      },
      right: {
        top: centerY,
        left: rightX,
      },
      rightStart: {
        top: bottomSecondY,
        left: rightX,
      },
      rightEnd: {
        top: topSecondY,
        left: rightX,
      },
      bottom: {
        top: bottomY,
        left: centerX,
      },
      bottomStart: {
        top: bottomY,
        left: rightSecondX,
      },
      bottomEnd: {
        top: bottomY,
        left: leftSecondX,
      },
    },
    size,
  );
}

/** 将一组包含left、top的方向对象值根据尺寸信息转换为包含left, top, right, bottom的值(改变原对象) */
function getRBObjForLTObj(
  obj: { [key in DirectionKeys]: { top: number; left: number } },
  { width, height }: Size,
) {
  const o = {} as PopperDirectionInfo;

  Object.entries(obj).forEach(([key, item]) => {
    o[key as DirectionKeys] = {
      ...item,
      right: item.left + width,
      bottom: item.top + height,
    };
  });

  return o;
}
