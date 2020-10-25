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
/** 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined */
export function getRefDomOrDom(target?: any): HTMLElement | undefined {
  if (!target) return undefined;
  if (isDom(target)) return target as HTMLElement;
  if (isDom(target.current)) return target.current as HTMLElement;
  return undefined;
}

export function throwError(errorMsg: string, type?: string): never {
  throw new Error((type ? `${type} -> ` : '') + errorMsg);
}

export { stopPropagation };

export * from './types';
