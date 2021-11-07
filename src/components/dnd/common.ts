import { AnyObject, checkElementVisible, hasScroll } from '@lxjx/utils';
import { DNDProps } from './types';
import { edgeRatio, ignoreReg, raf } from './consts';

/** 自动滚动加速度，此值越小, 超出时自动滚动的速度越快 */
const AutoScrollDiffSpeed = 10;

/** 在距离边缘此偏移时即开始滚动 */
const AutoScrollOffset = 16;

/** 在多个滚动帮助函数间共享 */
interface AutoScrollCtx {
  /** 是否按下 */
  autoScrollDown: boolean;
  /** 自动滚动的开关 */
  autoScrollToggle: boolean;
  /** 要设置的key */
  autoScrollPosKey: 'scrollLeft' | 'scrollTop';
  /** 每次滚动距离 */
  autoScrollVal: number;
  /** 增加还是减少 1增加 2减少 */
  autoScrollType: 1 | 2;
}

/** 计算元光标和指定元素的覆盖状态 */
export function getOverStatus(
  el: HTMLElement,
  x: number,
  y: number,
  firstScrollParent?: HTMLElement,
) {
  const bound = el.getBoundingClientRect();
  const { left, top, right, bottom } = bound;

  // 尺寸
  const width = right - left;
  const height = bottom - top;

  // 触发边缘放置的偏移距离
  const triggerXOffset = width * edgeRatio;
  const triggerYOffset = height * edgeRatio;

  // 元素是否可见，不可见时视为未覆盖
  let visible = true;

  // 检测元素可见性
  if (firstScrollParent) {
    const vs = checkElementVisible(el, {
      fullVisible: true,
      wrapEl: firstScrollParent,
    });
    visible = vs.visible;
  }

  // 各方向上的拖动状态
  const dragOver = visible && isBetween(bound, x, y);
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

/**
 * 计算光标在某个元素四个方向的超出值
 * 不包含滚动条的方向返回值始终为0
 * 元素不包含滚动条时无返回
 * 同时只会有一个方向有值
 * */
export function getAutoScrollStatus(el: HTMLElement, x: number, y: number) {
  const si = hasScroll(el);

  if (!si.x && !si.y) return;

  let { left, top, right, bottom } = el.getBoundingClientRect();

  /** 只在drag时触发，所以这里可以安全调用window而不用担心ssr的问题 */

  // 取最小、最大触发位置
  left = Math.max(left, 0);
  top = Math.max(top, 0);
  right = Math.min(right, window.innerWidth);
  bottom = Math.min(bottom, window.innerHeight);

  // 计算偏移
  left += AutoScrollOffset;
  top += AutoScrollOffset;
  right -= AutoScrollOffset;
  bottom -= AutoScrollOffset;

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
 * */
export function autoScrollByStatus(
  el: HTMLElement & { ctx: AutoScrollCtx },
  status: ReturnType<typeof getAutoScrollStatus>,
  down: boolean,
) {
  // 滚动元素本身是一个非常理想的存储局部滚动状态的对象
  if (!el.ctx) {
    el.ctx = {} as AutoScrollCtx;
  }

  el.ctx.autoScrollDown = down;

  if (!el || !status) return;

  // 基础滚动距离
  el.ctx.autoScrollVal = 1;

  if (status.bottom) {
    el.ctx.autoScrollPosKey = 'scrollTop';
    el.ctx.autoScrollType = 1;
    el.ctx.autoScrollVal += status.bottom / AutoScrollDiffSpeed;
  }

  if (status.left) {
    el.ctx.autoScrollPosKey = 'scrollLeft';
    el.ctx.autoScrollType = 2;
    el.ctx.autoScrollVal += status.left / AutoScrollDiffSpeed;
  }

  if (status.top) {
    el.ctx.autoScrollPosKey = 'scrollTop';
    el.ctx.autoScrollType = 2;
    el.ctx.autoScrollVal += status.top / AutoScrollDiffSpeed;
  }

  if (status.right) {
    el.ctx.autoScrollPosKey = 'scrollLeft';
    el.ctx.autoScrollType = 1;
    el.ctx.autoScrollVal += status.right / AutoScrollDiffSpeed;
  }

  // 根据状态开关滚动动画
  if (!(status.bottom || status.top || status.left || status.right)) {
    el.ctx.autoScrollToggle = false;
  } else {
    if (!el.ctx.autoScrollToggle) {
      autoScroll(el);
    }
    el.ctx.autoScrollToggle = true;
  }
}

/** 根据当前的AutoScrollCtx来自动滚动目标元素 */
export function autoScroll(el: HTMLElement & { ctx: AutoScrollCtx }) {
  raf(() => {
    if (el.ctx.autoScrollType === 1) {
      el[el.ctx.autoScrollPosKey] += el.ctx.autoScrollVal;

      // 处理浏览器兼容
      if (el === document.documentElement) {
        document.body[el.ctx.autoScrollPosKey] += el.ctx.autoScrollVal;
      }
    } else {
      el[el.ctx.autoScrollPosKey] -= el.ctx.autoScrollVal;

      // 处理浏览器兼容
      if (el === document.documentElement) {
        document.body[el.ctx.autoScrollPosKey] -= el.ctx.autoScrollVal;
      }
    }

    if (!el.ctx.autoScrollDown || !el.ctx.autoScrollToggle) return;

    autoScroll(el);
  });
}

/** 检测boolean为key的对象是否包含属性值为true的项 */
export function allPropertyHasTrue(obj: AnyObject) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(obj).some(([_, _enable]) => _enable);
}

/** 检测boolean为key对象是否所有项都为true */
export function allPropertyAllTrue(obj: AnyObject) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return Object.entries(obj).every(([_, _enable]) => _enable);
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
