import { isDom } from '@lxjx/utils';
import {
  Bound,
  DirectionKeys,
  PopperDirectionInfo,
  PopperDirectionInfoWidthVisibleInfo,
} from './types';

/**
 * 将PopperDirectionInfo的每个方向进行检测并转换为PopperDirectionInfoWidthVisible，返回转换后的原对象
 * */
export function patchVisible(
  directionInfo: PopperDirectionInfo,
  wrapEl?: HTMLElement,
): PopperDirectionInfoWidthVisibleInfo {
  const dv = directionInfo as PopperDirectionInfoWidthVisibleInfo;

  Object.entries(dv).forEach(([key, item]) => {
    // 可见信息不能包含滚动位置，手动清除
    const removeScrollOffsetItem = decreaseScrollOffset(item);

    const { visible } = checkElementVisible(removeScrollOffsetItem, {
      wrapEl,
      fullVisible: true,
    });

    const { visible: fullVisible } = checkElementVisible(removeScrollOffsetItem, {
      wrapEl,
      fullVisible: false,
    });

    dv[key as DirectionKeys] = {
      ...item,
      visible,
      hidden: !fullVisible,
    };
  });

  return dv;
}

/** 将Bound对象的四个方向信息减去对应方向的滚动位置 */
function decreaseScrollOffset(b: Bound): Bound {
  const bound = {} as Bound;

  const st = document.documentElement.scrollTop;
  const sl = document.body.scrollLeft;

  Object.entries(b).forEach(([key, item]) => {
    bound[key as keyof Bound] = key === 'left' || key === 'right' ? item - sl : item - st;
  });

  return bound;
}

/**
 * 检测元素或目标位置是否在视口中可见
 * */
function checkElementVisible(
  target: HTMLElement | Bound,
  option = {} as { fullVisible?: boolean; wrapEl?: HTMLElement },
) {
  const { fullVisible = false, wrapEl } = option;

  /** 基础边界(用于窗口) */
  const yMinBase = 0;
  const xMinBase = 0;
  const yMaxBase = window.innerHeight;
  const xMaxBase = window.innerWidth;

  /** 元素边界(用于指定元素边界) */
  let yMin = yMinBase;
  let xMin = xMinBase;
  let yMax = yMaxBase;
  let xMax = xMaxBase;

  if (wrapEl) {
    const { top, left, bottom, right } = wrapEl.getBoundingClientRect();
    yMin += top;
    xMin += left;
    yMax -= yMax - bottom;
    xMax -= xMax - right; // 减去元素右边到视口右边
  }

  const { top, left, bottom, right } = isDom(target) ? target.getBoundingClientRect() : target;

  /** fullVisible检测 */
  const topPos = fullVisible ? top : bottom;
  const bottomPos = fullVisible ? bottom : top;
  const leftPos = fullVisible ? left : right;
  const rightPos = fullVisible ? right : left;

  const elTopVisible = topPos > yMin;
  const winTopVisible = topPos > yMinBase;

  const elLeftVisible = leftPos > xMin;
  const winLeftVisible = leftPos > xMinBase;

  const elBottomVisible = bottomPos < yMax;
  const winBottomVisible = bottomPos < yMaxBase;

  const elRightVisible = rightPos < xMax;
  const winRightVisible = rightPos < xMaxBase;

  const topVisible = elTopVisible && winTopVisible;
  const leftVisible = elLeftVisible && winLeftVisible;
  const bottomVisible = elBottomVisible && winBottomVisible;
  const rightVisible = elRightVisible && winRightVisible;

  return {
    visible: topVisible && leftVisible && rightVisible && bottomVisible,
    top: topVisible,
    left: leftVisible,
    right: rightVisible,
    bottom: bottomVisible,
  };
}
