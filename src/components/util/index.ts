import * as React from 'react';

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

/** 指定错误消息和组件命名空间来抛出一个错误 */
export function throwError(errorMsg: string, namespace?: string): never {
  throw new Error((namespace ? `${namespace} -> ` : '') + errorMsg);
}

export { stopPropagation };

export * from './types';
