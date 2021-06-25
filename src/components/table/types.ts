import { ComponentBaseProps } from '@lxjx/utils';
import React from 'react';
import { SizeEnum, SizeKeys } from 'm78/types';
import { useStates } from 'm78/table/useStates';
import {
  TreeBaseDataSourceItem,
  TreeBaseMultipleChoiceProps,
  TreeBaseNode,
  TreeBaseProps,
  TreeBaseSingleChoiceProps,
} from 'm78/tree';
import { useTreeStates } from 'm78/tree/use-tree-states';
import { defaultProps } from './common';

/*
 * ############################
 * 枚举
 * ############################
 * */

/** 列固定方向 */
export type TableColumnFixedKeys = 'left' | 'right';

/** 列固定方向 */
export enum TableColumnFixedEnum {
  left = 'left',
  right = 'right',
}

/**
 * 表格单元格分割风格:
 *
 * border - 边框,
 * regular - 单元格
 * */
export type TableDivideStyleKeys = 'border' | 'regular';

/**
 * 表格单元格分割风格:
 *
 * border - 边框,
 * regular - 单元格
 * */
export enum TableDivideStyleEnum {
  border = 'border',
  regular = 'regular',
}

/** 表格排序方式  */
export type TableSortKeys = 'asc' | 'desc';

/** 表格排序方式  */
export enum TableSortEnum {
  asc = 'asc',
  desc = 'desc',
}

/*
 * ############################
 * 主要类型
 * ############################
 * */

export type TableSortValue = [string, TableSortEnum | TableSortKeys];

/**
 * 一个元信息，可以用来表示表格中的某行、某列、或某一个特定的单元格
 * */
export interface TableMeta {
  /** 传递给table的ctx对象 */
  ctx: any;
  /** 当前列, 用于表示行数据时会设置一个无效值 */
  column: _TableColumnInside;
  /** 当前记录, 用于表示非表格体的行时会设置一个无效值 */
  record: TableDataSourceItem;
  /** 树节点信息, 用于表示非表格体的行时会设置一个无效值 */
  treeNode: TableTreeNode;
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

/**
 * 表格列配置
 * */
export interface TableColumn {
  /** 列名 */
  label: string;
  /**
   * 该列对应的数据字段
   * - 传入字符数组时可以嵌套获取值, 如:
   * @example
   * - ['user', 'name'] => user.name
   * - ['things', '1', 'name'] => things[1].name
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
   * 为该列所有单元格设置的props, 支持td标签的所有prop
   * - 可通过该配置为整列同时设置样式、对齐、事件等
   * - 部分被内部占用的props无效
   * */
  props?:
    | React.PropsWithoutRef<JSX.IntrinsicElements['td']>
    | ((cellMeta: TableMeta) => React.PropsWithoutRef<JSX.IntrinsicElements['td']>);
  /** 在列头渲染的额外内容 */
  extra?: React.ReactNode | ((cellMeta: TableMeta) => React.ReactNode);
  /**
   * 如果开启了过滤和排序, 需要通过此项来对列进行标识
   * - 如果未明确传入此值，且field为string类型的话，会将filed作为key使用
   * - 如果未明确传入此值，且field为array类型的话，会将起转换为字段字符串并作为key使用，如user.name、news[0].title
   * */
  key?: string;
  /**
   * 开启过滤并通过onSort进行回调:
   * - 如果为boolean值true，则表示同时开启asc和desc两种类型的排序
   * - 如果为string类型，则表示只开启该类型的排序
   * */
  sort?: boolean | TableSortKeys | TableSortEnum;

  /** 其他任意的键值 */
  [key: string]: any;
}

export type TableColumns = TableColumn[];

/**
 * 表格类型
 * */
export interface TableProps
  extends ComponentBaseProps,
    Omit<TreeBaseProps<TableDataSourceItem, TableTreeNode>, 'labelGetter'> {
  /** 表格列配置 */
  columns: TableColumns;
  /**
   * key/id | 表格中的每一条记录都应该有一个能表示该条记录的字段, primaryKey用于配置获取这个字段的key
   * - 在启用了选择等功能时，primaryKey对应的值会作为选中项的value
   * - 由于id和key是非常常见的记录主键，所以会默认进行获取， 如果是key/id 以外的键(如uid)，需要特别指定
   * */
  // valueGetter?: string;
  /** 表格宽度，默认为容器宽度 */
  width?: string | number;
  /** 表格高度 */
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
  /** 单元格未获取到有效值时(checkValid()返回false), 用于显示的回退内容, 默认显示 “-” */
  fallback?: React.ReactNode | ((cellMeta: TableMeta) => React.ReactNode);
  /** 通过column.filed获取到字段值后，会通过此函数检测字段值是否有效，无效时会显示回退值, 默认只有truthy和0会通过检测 */
  checkFieldValid?: (val: any) => boolean;
  /** 开启总结栏并根据此函数返回生成每列的值 */
  summary?: (colMeta: TableMeta) => React.ReactNode | void;
  /**
   * 开启行展开并根据返回生成行的展开内容
   * - 此功能与虚拟滚动不兼容，因为虚拟滚动需要项具有明确的高度
   * TODO: expand重做
   * */
  expand?: (rowMeta: TableMeta) => React.ReactNode | void;
  expandIcon?: React.ReactNode;
  /**
   * 所有单元格设置的props, 支持td标签的所有prop
   * - 可通过该配置为所有单元格同时设置样式、对齐、事件等
   * - 部分被内部占用的props无效
   * */
  props?:
    | React.PropsWithoutRef<JSX.IntrinsicElements['td']>
    | ((cellMeta: TableMeta) => React.PropsWithoutRef<JSX.IntrinsicElements['td']>);
  /** 默认的排序值 */
  defaultSort?: TableSortValue;
  /** 受控的排序值 */
  sort?: TableSortValue;
  /**
   * 触发排序的回调, 无sort传入时表示取消排序
   * */
  onSortChange?: (sort: TableSortValue | []) => void;
  /** 如果传入，则控制要显示的列, 数组项为 columns.key 或 字符类型的columns.field */
  showColumns?: string[];
  /** true | 是否开启webkit下的自定义滚动条，部分新版浏览器使用默认滚动条时自带了滚动优化，可以关闭此定制来提升性能 */
  customScrollbar?: boolean;
}

/** 单选props */
export interface TablePropsSingleChoice
  extends TableProps,
    TreeBaseSingleChoiceProps<TableTreeNode> {}

/** 多选props */
export interface TablePropsMultipleChoice
  extends TableProps,
    TreeBaseMultipleChoiceProps<TableTreeNode> {}

/** 表格数据源的可选结构，一般在使用选择模式和tree模式时使用 */
export interface TableDataSourceItem extends TreeBaseDataSourceItem {}

/** 树中的一个节点 */
export interface TableTreeNode extends TreeBaseNode<TableTreeNode, TableDataSourceItem> {}

/*
 * ############################
 * 内部类型
 * ############################
 * */

export interface _TableCellProps {
  /** 当前列 */
  column: _TableColumnInside;
  /** 当前记录, 为表头时可不传 */
  record: TableDataSourceItem;
  /** 树节点信息 */
  treeNode: TableTreeNode;
  /** 列索引 */
  colIndex: number;
  /** 行索引 */
  rowIndex: number;
  /** 是否是表头单元格 */
  isHead?: boolean;
  /** 是否是表尾单元格 */
  isFoot?: boolean;
  /** 表格节点 */
  tableElRef: React.MutableRefObject<HTMLTableElement>;
  /** 共享数据 */
  ctx: _Context;
  /** 自行指定单元格内容 */
  content?: React.ReactNode;
  /** 单元格前置节点 */
  prefix?: React.ReactNode;
}

/** 内部使用的扩展TableColumn */
export interface _TableColumnInside extends TableColumn {
  /** 因为要根据是否固定拆分为多个列表，所以列索引一律使用这个 */
  index: number;
}

/** 内部实例对象 */
export interface _InnerSelf {}

/** 内部状态 */
export interface _InnerState {
  /** x轴滚动到最左侧 */
  touchLeft: boolean;
  /** x轴滚动到最右侧 */
  touchRight: boolean;
  /** 标记表格是否渲染完毕，反正向用户呈现抖动的渲染帧 */
  mounted: boolean;
}

export interface _Context {
  /** 状态 */
  states: ReturnType<typeof useStates>;
  /** Table组件接收的props */
  props: TablePropsSingleChoice & TablePropsMultipleChoice & typeof defaultProps;
  /** 通用tree状态 */
  treeState: ReturnType<typeof useTreeStates>;
}
