import * as React from 'react';
import { FullSize } from 'm78/common';

/** 与style库同步，用于js代码的常用屏幕尺寸 */
export const SM = 576;
export const MD = 768;
export const LG = 992;
export const XL = 1200;

/** 与style库同步，用于js代码的z-index预设值 */
export const Z_INDEX = 1000; // 基准显示层级, 所有弹层层级应不低于/等于1000, 因为1000是m78约定的内容和弹层中间的层级, 用于放置mask等
export const Z_INDEX_DRAWER = 1400;
export const Z_INDEX_MODAL = 1800;
export const Z_INDEX_MESSAGE = 2200;

/** size */
export const SIZE_MAP = {
  default: 32,
  [FullSize.small]: 24,
  [FullSize.large]: 40,
  [FullSize.big]: 60,
};

/** 禁止冒泡的便捷扩展对象 */
export const stopPropagation = {
  onClick(e: React.SyntheticEvent) {
    e.stopPropagation();
  },
};

/** throw error */
export function throwError(errorMsg: string, namespace?: string): never {
  throw new Error(`M78💥 -> ${namespace ? `${namespace} -> ` : ''} ${errorMsg}`);
}

export function sendWarning(msg: string, namespace?: string) {
  console.log(`M78💢 -> ${namespace ? `${namespace} -> ` : ''} ${msg}`);
}
