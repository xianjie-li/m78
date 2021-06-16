import { AnyObject } from '@lxjx/utils';
import React from 'react';

export interface _InnerSelf {
  /** 存放列位置, 用于fixed列定位 */
  fixedSizeMap: {
    [ind: string]: number;
  };
}

export interface _InnerState {
  touchLeft: boolean;
  touchRight: boolean;
  fixedMetas: {
    left: number;
    right: number;
  }[];
}

export interface _Share {
  state: _InnerState;
  self: _InnerSelf;
  props: TableProps;
}

export interface TableCellMeta {
  /** 当前列 */
  column: TableColumn;
  /** 当前记录, 当为表头行时，值为 `{}` */
  record: AnyObject;
  /** 当前列索引 */
  colIndex: number;
  /** 当前行索引 */
  rowIndex: number;
}

export type TableColumnFixedKeys = 'left' | 'right';

export enum TableColumnFixedEnum {
  left = 'left',
  right = 'right',
}

export interface TableColumn {
  /** 列名 */
  label: string;
  /**
   * 该列对应的数据字段
   * - 传入字符数组时可以嵌套获取值, 如:
   *    - ['user', 'name'] => user.name
   *    - ['things', '1', 'name'] => things['1'].name
   * */
  field?: string | string[];
  /** 自定义渲染内容, 会覆盖field配置 */
  render?: (meta: TableCellMeta) => React.ReactNode;
  /** 列的固定宽度, 不传时列宽取决于其内容的宽度 */
  width?: string | number;
  /**
   * 列的最大宽度, 此配置会覆盖width配置
   * - 具体表现为，内容宽度未超过maxWidth时根据内容决定列宽，内容宽度超过列宽时取maxWidth
   * - 通常此配置能实现比width更好的显示效果
   * */
  maxWidth?: string | number;
  /** 固定列到左侧或右侧, 如果声明了fixed的列在常规列中间，它会根据固定方向移动到表格两侧渲染 */
  fixed?: TableColumnFixedKeys | TableColumnFixedEnum;
  /**
   * 为该列所有单元格设置的props, 支持td标签的所有props
   * - 可通过该配置为整列同时设置样式、对齐、事件等
   * - 部分被内部占用的props会被覆盖
   * */
  props?:
    | React.PropsWithoutRef<JSX.IntrinsicElements['td']>
    | ((meta: TableCellMeta) => React.PropsWithoutRef<JSX.IntrinsicElements['td']>);
  /** 在列头渲染的额外内容 */
  extra?: React.ReactNode | ((meta: TableCellMeta) => React.ReactNode);
}

/** 内部使用的扩展TableColumn */
export interface _TableColumnInside extends TableColumn {
  /** 是否为左侧固定列的最后一个 */
  fixedLeftLast?: boolean;
  /** 是否为右侧固定列的第一个 */
  fixedRightFirst?: boolean;
}

export type TableColumns = TableColumn[];

export interface TableProps {
  dataSource: AnyObject[];
  columns: TableColumns;
  /**
   * key/id | 表示dataSource中一条记录的唯一值
   * - 如果是key | id 以外的键(如uid)，需要特别指定
   * - 在启用了选择等功能时，primaryKey对应的值会作为选中项的value
   * */
  primaryKey?: string;
  width?: string | number;
  height?: string | number;
  /**
   * 根据传入坐标对行进行合并
   * - 对于被合并的行，必须为其返回0来腾出位置, 否则会导致表格排列异常
   * - fixed列和普通列不能进行合并
   * */
  rowSpan?: (meta: TableCellMeta) => number | undefined;
  /**
   * 根据传入坐标对列进行合并
   * - 对于被合并的列，必须为其返回0来腾出位置, 否则会导致表格排列异常
   * - fixed列和普通列不能进行合并
   * */
  colSpan?: (meta: TableCellMeta) => number | undefined;
  /**
   * 单元格未获取到有效值时(checkValid()返回false), 用于显示的回退内容, 默认是 “-”
   * */
  fallback?: React.ReactNode | ((meta: TableCellMeta) => React.ReactNode);
}
