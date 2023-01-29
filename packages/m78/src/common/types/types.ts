import React, { CSSProperties } from "react";

/** 通用状态类型 */
export enum Status {
  info = "info",
  success = "success",
  warning = "warning",
  error = "error",
}

export type StatusKeys = keyof typeof Status;

export type StatusUnion = Status | StatusKeys;

/** 通用尺寸类型 40 | 32 | 24 */
export enum Size {
  large = "large",
  small = "small",
}

export type SizeKeys = keyof typeof Size;

export type SizeUnion = Size | SizeKeys;

/** 通用完整尺寸类型  */
export enum FullSize {
  large = "large",
  small = "small",
  big = "big",
}

/** 通用完整尺寸类型 */
export type FullSizeKeys = keyof typeof FullSize;

export type FullSizeUnion = FullSize | FullSizeKeys;

/** 通用方向类型 */
export enum Position {
  left = "left",
  top = "top",
  right = "right",
  bottom = "bottom",
}

export type PositionKeys = keyof typeof Position;

export type PositionUnion = Position | PositionKeys;

/** 通用轴类型 */
export enum Direction {
  horizontal = "horizontal",
  vertical = "vertical",
}

export type DirectionKeys = keyof typeof Direction;

export type DirectionUnion = Direction | DirectionKeys;

/** 通用的value类型 */
export type ValueType = string | number;

/** 通用数据源类型 */
export interface DataSourceItem<T = any> {
  /** 选项名 */
  label?: React.ReactNode;
  /** 选项值, 默认与label相同 */
  value?: ValueType;
  /** 子项 */
  children?: T[];
  /** 用于使用DataSourceItemCustom定制的情况 */
  [key: string]: any;
}

/** 用于DataSourceItem 建定制 */
export interface DataSourceItemCustom {
  /** 自定义获取label的key */
  labelKey?: string;
  /** 自定义获取value的key */
  valueKey?: string;
  /** 自定义获取children的key */
  childrenKey?: string;
}

export type DIVProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

/** Component common props */
export interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: CSSProperties;
}

/** Component common props */
export interface ComponentBasePropsWithAny extends ComponentBaseProps {
  /** 透传到包裹元素上的属性 */
  [key: string]: any;
}
