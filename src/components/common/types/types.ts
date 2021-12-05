import React from 'react';

/** 通用状态类型 */
export enum StatusEnum {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}

export type StatusKeys = keyof typeof StatusEnum;

export type Status = StatusEnum | StatusKeys;

/** 通用尺寸类型 40 | 32 | 24 */
export enum SizeEnum {
  large = 'large',
  small = 'small',
}

export type SizeKeys = keyof typeof SizeEnum;

export type Size = SizeEnum | SizeKeys;

/** 通用完整尺寸类型 */
export type FullSizeKeys = 'big' | SizeKeys;

/** 通用完整尺寸类型  */
export enum FullSizeEnum {
  large = 'large',
  small = 'small',
  big = 'big',
}

export type FullSize = FullSizeEnum | FullSizeKeys;

/** 通用方向类型 */
export enum PositionEnum {
  left = 'left',
  top = 'top',
  right = 'right',
  bottom = 'bottom',
}

export type PositionKeys = keyof typeof PositionEnum;

export type Position = PositionEnum | PositionKeys;

/** 通用轴类型 */
export enum DirectionEnum {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export type DirectionKeys = 'horizontal' | 'vertical';

export type Direction = DirectionEnum | DirectionKeys;

/** 通用数据源类型 */
export interface DataSourceItem<ValType = any> {
  /** 选项名 */
  label: React.ReactNode;
  /** 选项值, 默认与label相同 */
  value: ValType;
}
