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

export type Status = 'info' | 'success' | 'warning' | 'error';

export enum StatusEnum {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}

export type Size = 'large' | 'small' /* 40 | 32 | 24 */;

/* 40 | 32 | 24 */
export enum SizeEnum {
  large = 'large',
  small = 'small',
}

export type FullSize = 'big' | Size;

export enum FullSizeEnum {
  large = 'large',
  small = 'small',
  big = 'big',
}

export enum PositionEnum {
  left = 'left',
  top = 'top',
  right = 'right',
  bottom = 'bottom',
}

export enum DirectionEnum {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export interface DataSourceItem<ValType = any> {
  /** 选项名 */
  label: React.ReactNode;
  /** 选项值, 默认与label相同 */
  value: ValType;
}
