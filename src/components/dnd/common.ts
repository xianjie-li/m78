import { AnyObject } from '@lxjx/utils';
import { DNDProps } from './types';
import { edgeRatio, ignoreReg } from './consts';

/** 计算元光标和指定元素的覆盖状态 */
export function getOverStatus(el: HTMLElement, x: number, y: number) {
  const bound = el.getBoundingClientRect();
  const { left, top, right, bottom } = bound;

  // 尺寸
  const width = right - left;
  const height = bottom - top;

  // 触发边缘放置的偏移距离
  const triggerXOffset = width * edgeRatio;
  const triggerYOffset = height * edgeRatio;

  // 各方向上的拖动状态
  const dragOver = isBetween(bound, x, y);
  const dragTop = dragOver && y < top + triggerYOffset;
  const dragBottom = dragOver && !dragTop && y > bottom - triggerYOffset;

  const nextShouldPass = dragOver && !dragTop && !dragBottom;

  const dragRight = nextShouldPass && x > right - triggerXOffset;
  const dragLeft = nextShouldPass && x < left + triggerXOffset;
  const dragCenter = nextShouldPass && !dragRight && !dragLeft;

  return {
    dragOver,
    dragTop,
    dragBottom,
    dragLeft,
    dragRight,
    dragCenter,
    left,
    top,
  };
}

/** 判断x, y 是否在指定的DOMRect区间中 */
export function isBetween({ left, top, right, bottom }: DOMRect, x: number, y: number) {
  return x > left && x < right && y > top && y < bottom;
}

/** 对象是否包含属性值都为true的项 */
export function allPropertyHasTrue(obj: AnyObject) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(obj).some(([_, _enable]) => _enable);
}

/** 左侧对象的所有值是否都与右侧对象相等 */
export function allPropertyIsEqual(obj: AnyObject, obj2: AnyObject) {
  return Object.entries(obj).every(([key, val]) => val === obj2[key]);
}

/**  根据事件元素类型决定是否禁止拖动 */
export function isIgnoreEl(event?: any, ignoreElFilter?: DNDProps['ignoreElFilter']) {
  const el = event?.target;

  if (!el) return false;

  const tagName = el.tagName || '';

  if (ignoreReg.test(tagName)) return true;

  const editable = el.getAttribute && el.getAttribute('contenteditable');

  if (editable) return true;

  if (ignoreElFilter) {
    return ignoreElFilter(el);
  }

  return false;
}
