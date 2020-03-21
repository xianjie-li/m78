import React from 'react';

export interface ComponentBasePropsWithAny extends ComponentBaseProps {
  /** 透传到包裹元素上的属性 */
  [key: string]: any;
}

export interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}

export type Status = 'info' | 'success' | 'warn' | 'error';

export type Size = 'large' | 'small';

export type AnyObject = {
  [key: string]: any;
};

export type AnyFunction = (...args: Array<any>) => any;

export type PlainFn = () => void;
