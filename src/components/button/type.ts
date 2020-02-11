import React from 'react';
import { ComponentBasePropsWithAny } from '../types/types';

export interface ButtonProps
  extends
    ComponentBasePropsWithAny,
    React.PropsWithoutRef<JSX.IntrinsicElements['button']> {
  /** 按钮颜色 */
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'primary';
  /** 大小 */
  size?: 'large' | 'small' | 'mini';
  /** 圆形按钮 */
  circle?: boolean;
  /** 边框按钮 */
  outline?: boolean;
  /** 块级按钮 */
  block?: boolean;
  /** link按钮 */
  link?: boolean;
  /** icon按钮, children可以是Icon或文字 */
  icon?: boolean;
  /** 设置禁用状态 */
  disabled?: boolean;
  /** 设置加载状态 */
  loading?: boolean;
  /** 仅启用md风格的点击效果 */
  md?: boolean;
  /** 仅启用win风格的点击效果 */
  win?: boolean;
  /** 为link按钮时，href所指向的地址 */
  href?: string;
}
