import * as React from 'react';

export const stopPropagation = {
  onClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  },
};

/* 占位函数 */
export const dumpFn = (...arg: any[]): any => arg;

export function getGlobal() {
  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== 'undefined') {
    // eslint-disable-next-line no-restricted-globals
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
  throw new Error('unable to locate global object');
}

export const __GLOBAL__ = getGlobal();

export function getStyle(obj: HTMLElement, attr: keyof CSSStyleDeclaration) {
  if (!obj) return;
  // @ts-ignore
  if (!obj.currentStyle && !window.getComputedStyle) return null;
  // @ts-ignore currentStyle非标准属性
  return obj.currentStyle ? obj.currentStyle[attr] : window.getComputedStyle(obj)[attr];
}
