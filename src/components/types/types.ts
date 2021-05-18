import React from 'react';

/** 通用基础props */
export interface ComponentBasePropsWithAny extends ComponentBaseProps {
  /** 透传到包裹元素上的属性 */
  [key: string]: any;
}

/** 通用基础props */
export interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}

/** 通用状态类型 */
export type StatusKeys = 'info' | 'success' | 'warning' | 'error';

/** 通用状态类型 */
export enum StatusEnum {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}

/** 通用尺寸类型 */
export type SizeKeys = 'large' | 'small';

/** 通用尺寸类型 40 | 32 | 24 */
export enum SizeEnum {
  large = 'large',
  small = 'small',
}

/** 通用完整尺寸类型 */
export type FullSizeKeys = 'big' | SizeKeys;

/** 通用完整尺寸类型  */
export enum FullSizeEnum {
  large = 'large',
  small = 'small',
  big = 'big',
}

/** 通用方向类型 */
export type PositionKeys = 'left' | 'top' | 'right' | 'bottom';

/** 通用方向类型 */
export enum PositionEnum {
  left = 'left',
  top = 'top',
  right = 'right',
  bottom = 'bottom',
}

/** 通用轴类型 */
export type DirectionKeys = 'horizontal' | 'vertical';

/** 通用轴类型 */
export enum DirectionEnum {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

/** 通用尺寸类型 */
export interface Size {
  width: number;
  height: number;
}

/** 通用数据源类型 */
export interface DataSourceItem<ValType = any> {
  /** 选项名 */
  label: React.ReactNode;
  /** 选项值, 默认与label相同 */
  value: ValType;
}
