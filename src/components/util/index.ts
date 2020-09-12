import * as React from 'react';
import { isDom } from '@lxjx/utils';

/** 与@lxjx/sass-base同步，用于js代码的常用屏幕尺寸 */
export const SM = 576;
export const MD = 768;
export const LG = 992;
export const XL = 1200;

/** 与@lxjx/sass-base同步，用于js代码的z-index预设值 */
export const Z_INDEX = 1000;
export const Z_INDEX_DRAWER = 1400;
export const Z_INDEX_MODAL = 1800;
export const Z_INDEX_MESSAGE = 2200;

/** 禁止冒泡的便捷扩展对象 */
const stopPropagation = {
  onClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  },
};

/** 占位函数 */
const dumpFn = (...arg: any[]): any => arg;

/** 获取指定dom元素的指定样式值 */
function getStyle(obj: HTMLElement, attr: keyof CSSStyleDeclaration) {
  if (!obj) return;
  // @ts-ignore
  if (!obj.currentStyle && !window.getComputedStyle) return null;
  // @ts-ignore currentStyle非标准属性
  return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj)[attr];
}

function getFirstScrollParent(ele: HTMLElement): HTMLElement | null {
  let node: Element | null = null;

  function handle(el: HTMLElement) {
    const parent = el.parentNode;

    if (parent) {
      const e = parent as HTMLElement;
      const h = e.offsetHeight;
      const sH = e.scrollHeight;

      if (sH > h) {
        const overflow = getStyle(e, 'overflow');

        if (overflow === 'scroll' || overflow === 'auto') {
          node = e;
          return;
        }
      }

      handle(e);
    } else {
      // 无匹配
    }
  }

  handle(ele);

  return node;
}

/**
 * 元素是否在视口可见位置
 * @param el - 待检测元素
 * @param option
 * @param option.fullVisible - 默认完全不可见时才算不可见，设置为true只要元素有部分遮挡即视为不可见
 * @param option.wrapEl - 默认以视口计算可见性，通过此项指定元素
 * */
function checkElementVisible(
  el: HTMLElement,
  option?: {
    fullVisible?: boolean;
    wrapEl?: HTMLElement;
  },
) {
  const { fullVisible = false, wrapEl } = option || {};
  let yMin = 0;
  let xMin = 0;
  let yMax = window.innerHeight;
  let xMax = window.innerWidth;

  if (wrapEl) {
    const { top, left, bottom, right } = wrapEl.getBoundingClientRect();
    yMin += top;
    xMin += left;
    yMax -= yMax - bottom;
    xMax -= xMax - right; // 减去元素右边到视口右边
  }

  const { top, left, bottom, right } = el.getBoundingClientRect();

  const bottomPass = (fullVisible ? bottom : top) < yMax;
  const topPass = (fullVisible ? top : bottom) > yMin;
  const leftPass = (fullVisible ? left : right) > xMin;
  const rightPass = (fullVisible ? right : left) < xMax;

  return topPass && rightPass && bottomPass && leftPass;
}

/** 如果入参为truthy或0则返回，否则返回false */
function isTruthyOrZero(arg: any): boolean {
  return !!arg || arg === 0;
}

/** 返回入参中第一个truthy值或0 */
function getFirstTruthyOrZero(...args: any): any {
  for (const arg of args) {
    if (isTruthyOrZero(arg)) {
      return arg;
    }
  }
  return false;
}

/**
 * 根据传入的node节点查询其所有父节点中是否存在指定节点
 * @param node - 待查询的节点
 * @param matcher - 匹配器，递归接收父节点，返回值决定是否匹配
 * @param depth - 询深度
 * */
function getCurrentParent(node: Element, matcher: (node: Element) => boolean, depth: number) {
  let hasMatch = false;

  let cDepth = 0;

  function recur(n: Element) {
    if (depth) {
      cDepth++;
      if (cDepth === depth) return;
    }

    if (!n) {
      return;
    }
    const pNode = n.parentNode as Element;

    if (pNode) {
      const res = matcher(pNode);
      if (res) {
        hasMatch = true;
        return;
      }
    }

    recur(pNode);
  }

  recur(node);

  return hasMatch;
}

function triggerHighlight(target: HTMLElement, color?: string): void;
function triggerHighlight(selector: string, color?: string): void;
function triggerHighlight(t: string | HTMLElement, color?: string) {
  if (isDom(t)) {
    mountHighlight(t, color);
  } else {
    const temp = document.querySelectorAll(t);
    if (temp.length) {
      Array.from(temp).forEach(item => mountHighlight(item as HTMLElement, color));
    }
  }
}

function mountHighlight(target: HTMLElement, color = '#1890ff') {
  target.style.boxShadow = `0 0 0 4px ${color}`;

  function clickHandle() {
    target.style.boxShadow = '';

    document.removeEventListener('click', clickHandle);
  }

  document.addEventListener('click', clickHandle);
}

export {
  stopPropagation,
  dumpFn,
  getStyle,
  getFirstScrollParent,
  checkElementVisible,
  isTruthyOrZero,
  getFirstTruthyOrZero,
  getCurrentParent,
  triggerHighlight,
};
