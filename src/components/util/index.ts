import * as React from 'react';

/** 禁止冒泡的便捷扩展对象 */
export const stopPropagation = {
  onClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  },
};

/** 占位函数 */
export const dumpFn = (...arg: any[]): any => arg;

/** 获取指定dom元素的指定样式值 */
export function getStyle(obj: HTMLElement, attr: keyof CSSStyleDeclaration) {
  if (!obj) return;
  // @ts-ignore
  if (!obj.currentStyle && !window.getComputedStyle) return null;
  // @ts-ignore currentStyle非标准属性
  return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj)[attr];
}

/** TODO: 更改为同步 */
export function getFirstScrollParent(ele: HTMLElement): Promise<HTMLElement> {
  return new Promise<HTMLElement>((res, rej) => {
    handle(ele);

    function handle(el: HTMLElement) {
      const parent = el.parentNode;

      if (parent) {
        const e = parent as HTMLElement;
        const h = e.offsetHeight;
        const sH = e.scrollHeight;

        if (sH > h) {
          const overflow = getStyle(e, 'overflow');

          if (overflow === 'scroll' || overflow === 'auto') {
            res(e);
            return;
          }

          if (e === document.documentElement || e === document.body) {
            res(e);
          }
        }

        handle(e);
      } else {
        rej('getFirstScrollParent(): no parent node containing scroll bar is captured');
      }
    }
  });
}

/**
 * 元素是否在视口可见位置 TODO: 提到utils中
 * @param el - 待检测元素
 * @param option
 * @param option.fullVisible - 默认完全不可见时才算不可见，设置为true只要元素有部分遮挡即视为不可见
 * @param option.wrapEl - 默认以视口计算可见性，通过此项指定元素
 * */
export function checkElementVisible(
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
export function isTruthyOrZero(arg: any): boolean {
  return !!arg || arg === 0;
}

/** 返回入参中第一个truthy值或0 */
export function getFirstTruthyOrZero(...args: any): any {
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
export function getCurrentParent(
  node: Element,
  matcher: (node: Element) => boolean,
  depth: number,
) {
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
