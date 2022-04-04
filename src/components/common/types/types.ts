import React from 'react';

/** 通用状态类型 */
export enum Status {
  info = 'info',
  success = 'success',
  warning = 'warning',
  error = 'error',
}

export type StatusKeys = keyof typeof Status;

export type StatusUnion = Status | StatusKeys;

/** 通用尺寸类型 40 | 32 | 24 */
export enum Size {
  large = 'large',
  small = 'small',
}

export type SizeKeys = keyof typeof Size;

export type SizeUnion = Size | SizeKeys;

/** 通用完整尺寸类型 */
export type FullSizeKeys = 'big' | SizeKeys;

/** 通用完整尺寸类型  */
export enum FullSize {
  large = 'large',
  small = 'small',
  big = 'big',
}

export type FullSizeUnion = FullSize | FullSizeKeys;

/** 通用方向类型 */
export enum Position {
  left = 'left',
  top = 'top',
  right = 'right',
  bottom = 'bottom',
}

export type PositionKeys = keyof typeof Position;

export type PositionUnion = Position | PositionKeys;

/** 通用轴类型 */
export enum Direction {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export type DirectionKeys = keyof typeof Direction;

export type DirectionUnion = Direction | DirectionKeys;

/** 通用数据源类型 */
export interface DataSourceItem<ValType = any> {
  /** 选项名 */
  label: React.ReactNode;
  /** 选项值, 默认与label相同 */
  value: ValType;
}
