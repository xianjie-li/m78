import { Point } from "@m78/utils";

/** 表示单元格位置的元组, 分别表示 x轴索引, y轴索引 */
export type TablePosition = Point;

/** 表示列或行的key */
export type TableKey = string | number;

/** 表格内指定点和其相关属性 */
export interface TablePointInfo {
  x: number;
  y: number;
  xy: TablePosition;
  leftFixed: boolean;
  topFixed: boolean;
  rightFixed: boolean;
  bottomFixed: boolean;
  /** 转换之前的x */
  originX: number;
  /** 转换之前的y */
  originY: number;
}

/** 自定义渲染的上下文对象 */
export interface TableRenderCtx {
  isFirstRender: boolean;
  disableDefaultRender: boolean;
  disableLaterRender: boolean;
}

/** 支持的行固定位置 */
export enum TableRowFixed {
  top = "top",
  bottom = "bottom",
}

export type TableRowFixedKeys = keyof typeof TableRowFixed;
export type TableRowFixedUnion = TableRowFixed | TableRowFixedKeys;

/** 支持的列固定位置 */
export enum TableColumnFixed {
  left = "left",
  right = "right",
}

export type TableColumnFixedKeys = keyof typeof TableColumnFixed;
export type TableColumnFixedUnion = TableColumnFixed | TableColumnFixedKeys;
