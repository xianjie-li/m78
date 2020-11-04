import { checkElementVisible } from '@lxjx/utils';

import {
  Bound,
  PopperDirectionKeys,
  PopperDirectionInfo,
  PopperDirectionInfoWidthVisible,
} from './types';

/**
 * 将PopperDirectionInfo的每个方向进行检测并转换为PopperDirectionInfoWidthVisible，返回转换后的原对象
 * */
export function patchVisible(
  directionInfo: PopperDirectionInfo,
  wrapEl?: HTMLElement,
): PopperDirectionInfoWidthVisible {
  const dv = directionInfo as PopperDirectionInfoWidthVisible;

  Object.entries(dv).forEach(([key, item]) => {
    // 可见信息不能包含滚动位置，手动清除
    const removeScrollOffsetItem = decreaseScrollOffset(item);

    const { visible } = checkElementVisible(removeScrollOffsetItem, {
      offset: 0,
      wrapEl,
      fullVisible: true,
    });

    const { visible: fullVisible } = checkElementVisible(removeScrollOffsetItem, {
      offset: 0,
      wrapEl,
      fullVisible: false,
    });

    dv[key as PopperDirectionKeys] = {
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
