import { AnyObject, hasScroll } from '@lxjx/utils';
import { DNDProps } from './types';
import { edgeRatio, ignoreReg, raf } from './consts';

/** 计算元光标和指定元素的覆盖状态 */
export function getOverStatus(el: HTMLElement, x: number, y: number, fixedOffset?: number) {
  const bound = el.getBoundingClientRect();
  const { left, top, right, bottom } = bound;

  // 尺寸
  const width = right - left;
  const height = bottom - top;

  // 触发边缘放置的偏移距离
  const triggerXOffset = fixedOffset || width * edgeRatio;
  const triggerYOffset = fixedOffset || height * edgeRatio;

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

/**
 * 计算光标在某个元素四个方向的超出值
 * 不包含滚动条的方向返回值始终为0
 * 元素不包含滚动条时无返回
 * 同时只会有一个方向有值
 * */
export function getAutoScrollStatus(el: HTMLElement, x: number, y: number) {
  if (el === document.documentElement) return;

  const si = hasScroll(el);

  if (!si.x && !si.y) return;

  const { left, top, right, bottom } = el.getBoundingClientRect();

  let t = 0;
  let r = 0;
  let b = 0;
  let l = 0;

  // 在y轴范围内
  if (x > left && x < right) {
    if (y < top) {
      t = top - y;
    }

    if (y > bottom) {
      b = y - bottom;
    }
  }

  // 在x轴范围内
  if (y > top && y < bottom) {
    if (x < left) {
      l = left - x;
    }

    if (x > right) {
      r = x - right;
    }
  }

  return {
    top: si.y ? t : 0,
    bottom: si.y ? b : 0,
    left: si.x ? l : 0,
    right: si.x ? r : 0,
  };
}

/**
 * 根据getAutoScrollStatus的返回值滚动元素
 * 需要传入一个用来保持状态的ctx对象
 * */
export function autoScrollByStatus(
  el: HTMLElement,
  status: ReturnType<typeof getAutoScrollStatus>,
  down: boolean,
  ctx: any,
) {
  ctx.autoScrollDown = down;

  if (!el || !status) return;

  clearTimeout(ctx.autoScrollTimer);

  console.log(status);

  if (status.bottom) {
    raf(() => {
      el.scrollTop += 1 + status.bottom / 100;
    });

    ctx.autoScrollTimer = setTimeout(() => {
      rafaa(() => {
        el.scrollTop += 1 + status.bottom / 100;
      }, ctx);
    }, 50);

    console.log(111, ctx.autoScrollTimer);
  }

  if (status.top) {
    raf(() => {
      el.scrollTop -= 1 + status.top;
    });

    console.log(33);

    ctx.autoScrollTimer = setTimeout(() => {
      rafaa(() => {
        el.scrollTop -= 2;
      }, ctx);
    }, 50);

    console.log(222, ctx.autoScrollTimer);
  }
}

export function rafaa(fn: any, ctx: any) {
  return requestAnimationFrame(() => {
    fn();
    console.log(123);
    if (ctx.autoScrollDown) {
      rafaa(fn, ctx);
    }
  });
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
