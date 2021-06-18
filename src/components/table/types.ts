import { AnyObject } from '@lxjx/utils';
import React from 'react';
import { SizeEnum, SizeKeys } from 'm78/types';

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

/**
 * 一个元信息，可以代表表格中的某行、某列、或某一个特定的单元格
 * */
export interface TableMeta {
  /** 当前列, 用于表示行数据时，值为`{}` */
  column: TableColumn;
  /** 当前记录, 用于表示非表格体的行时，值为`{}` */
  record: AnyObject;
  /** 当前列索引 */
  colIndex: number;
  /** 当前行索引 */
  rowIndex: number;
  /** 是否是表格体 */
  isBody: boolean;
  /** 是否是表头 */
  isHead: boolean;
  /** 是否是表尾(summary) */
  isFoot: boolean;
}

export type TableColumnFixedKeys = 'left' | 'right';

export enum TableColumnFixedEnum {
  left = 'left',
  right = 'right',
}

export type TableDivideStyleKeys = 'border' | 'regular';

export enum TableDivideStyleEnum {
  border = 'border',
  regular = 'regular',
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
  render?: (cellMeta: TableMeta) => React.ReactNode;
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
    | ((cellMeta: TableMeta) => React.PropsWithoutRef<JSX.IntrinsicElements['td']>);
  /** 在列头渲染的额外内容 */
  extra?: React.ReactNode | ((cellMeta: TableMeta) => React.ReactNode);
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
   * key/id | 表格中的每一条记录都应该有一个能表示该条记录的字段, primaryKey用于配置获取这个字段的key
   * - 在启用了选择等功能时，primaryKey对应的值会作为选中项的value
   * - 由于id和key是非常常见的记录主键，所以会默认进行获取， 如果是key/id 以外的键(如uid)，需要特别指定
   * */
  primaryKey?: string;
  width?: string | number;
  height?: string | number;
  /**
   * 'regular' | 表格的数据分割类型:
   * - border: 边框型
   * - regular: 常规型，行直接带分割线
   * */
  divideStyle?: TableDivideStyleKeys | TableDivideStyleEnum;
  /** true | 显示条纹背景 */
  stripe?: boolean;
  /** 表格尺寸 */
  size?: SizeKeys | SizeEnum;
  /** 设置加载中状态 */
  loading?: boolean;
  /**
   * 根据传入坐标对行进行合并
   * - 对于被合并的行，必须为其返回0来腾出位置, 否则会导致表格排列异常
   * - fixed列和普通列不能进行合并
   * - 不作用于表头、总结栏
   * */
  rowSpan?: (cellMeta: TableMeta) => number | undefined;
  /**
   * 根据传入坐标对列进行合并
   * - 对于被合并的列，必须为其返回0来腾出位置, 否则会导致表格排列异常
   * - fixed列和普通列不能进行合并
   * - 不作用于表头
   * */
  colSpan?: (cellMeta: TableMeta) => number | undefined;
  /** 300px 单元格最大宽度, 用于防止某一列内容过长占用大量位置导致很差的显示效果 */
  cellMaxWidth?: string | number;
  /**
   * 单元格未获取到有效值时(checkValid()返回false), 用于显示的回退内容, 默认显示 “-”
   * - 作用于表头
   * */
  fallback?: React.ReactNode | ((cellMeta: TableMeta) => React.ReactNode);
  /** 开启总结栏并根据此函数返回生成每列的值 */
  summary?: (colMeta: TableMeta) => React.ReactNode | void;
  /**
   * 开启行展开并根据返回生成行的展开内容
   * - 此功能与虚拟滚动不兼容，因为虚拟滚动需要项具有明确的高度
   * */
  expand?: (rowMeta: TableMeta) => React.ReactNode | void;
  expandIcon?: React.ReactNode;
}
