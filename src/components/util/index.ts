import * as React from 'react';
import { isDom } from '@lxjx/utils';
import { useEffect, useState, useLayoutEffect } from 'react';

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

/** 获取窗口的滚动位置 */
export function getDocScrollOffset() {
  const doc = document.documentElement;
  const body = document.body;

  return {
    x: doc.scrollLeft + body.scrollLeft,
    y: doc.scrollTop + body.scrollTop,
  };
}

/** 指定错误消息和组件命名空间来抛出一个错误 */
export function throwError(errorMsg: string, namespace?: string): never {
  throw new Error((namespace ? `${namespace} -> ` : '') + errorMsg);
}

/* TODO: 提到hooks中 */
/**
 * 是否是服务端
 * 这是一个伪判断, 因为某些SSR环境会模拟window和document对象, 所以仅仅是提高判断层次来增加正确命中率
 * - 即使判断失效了，在提供了兼容环境的服务端应该也不会有太大影响
 * */
const isServer = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement &&
  window.localStorage &&
  window.history &&
  window.location
);

const useEffectDiff = isServer ? useEffect : useLayoutEffect;

/**
 * 获取一个用于识别并跳过SSR渲染的变量
 * @param force - 开启执行环境监测
 * 这会减少一次render的触发，但是由于执行`hydrate()`时服务端节点和客户端节点不一致，会触发`Warning: Expected server HTML to contain a matching <*> in <*>`警告, 如果对render次数很敏感且不在意开此警告可开启(此警告不会影响生产环境)。
 * @return - 一个用于标识并跳过服务端渲染的变量
 * */
export function useNoSSR(force = false) {
  const [noSSR, set] = useState(() => (force ? !isServer : false));

  useEffectDiff(() => {
    !noSSR && set(true);
  }, []);

  return noSSR;
}

/** 是否是服务端, 在服务端引入了shim代码时可能会检测失效 */
useNoSSR.isServer = isServer;

export { stopPropagation };

export * from './types';
