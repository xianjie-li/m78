import { AnyObject, NamePath } from "@m78/utils";

import {
  TableColumnFixedUnion,
  TableKey,
  TableRowFixedUnion,
} from "./base-type.js";

/** 表示table中的一列 */
export interface TableColumn {
  /** 该项的唯一key, 与 TableColumnConfig.key 相同 */
  key: TableKey;
  /** 最终宽度 */
  width: number;
  /** 列索引. 注意, 该索引对应列在表格中的实际显示位置, 可能与config.columns中的索引不同 */
  index: number;
  /** 在数据中的实际索引, 若为表头, 值为固定的-1 */
  dataIndex: number;
  /** 在内部data中的实际位置 */
  realIndex: number;
  /** x轴位置 */
  x: number;
  /** 对应的列配置 */
  config: TableColumnLeafConfigFormatted;
  /** 是否是固定项 */
  isFixed: boolean;
  /** 如果是固定项, 表示其在视口的偏移位置 */
  fixedOffset?: number;
  /** 是否是偶数列, 由于固定列的存在, index并不能准确的判断, 故提供此属性 */
  isEven: boolean;
  /** 是否是行头 */
  isHeader: boolean;
  /** 是否是内部创建的行/列, 该项是表头时值也为true */
  isFake: boolean;
}

/**
 * 列配置
 */
export type TableColumnConfig = TableColumnLeafConfig | TableColumnBranchConfig;

/** 包含子项的列配置, 用于生成合并表头 */
export interface TableColumnBranchConfig {
  /** 表头文本 */
  label: string;
  /** 生成嵌套表头 */
  children?: TableColumnConfig[];
  /** 控制列固定, 所有合并子项会以最顶层列的fixed配置为准 */
  fixed?: TableColumnFixedUnion;
}

/** 常规列配置项 */
export interface TableColumnLeafConfig {
  /** 该列对应的唯一key, 用于获取value或显示的文本, 另外也作为表格变异操作的标识, 从key获取到的值类型必须为字符串或数字 */
  key: NamePath;
  /** 表头文本 */
  label: string;
  /** 列宽度 */
  width?: number;
  /** 控制列固定, 如果该列是被合并列, 会以最上层的列fixed配置为准 */
  fixed?: TableColumnFixedUnion;
}

/** 常规列配置项, key由namePath转换为了string */
export interface TableColumnLeafConfigFormatted
  extends Omit<TableColumnLeafConfig, "key"> {
  /** 字符串化后的TableColumnLeafConfig.key */
  key: string;
  /** 未字符串化前的key */
  originalKey: NamePath;
}

/** 表示table中的一个行 */
export interface TableRow {
  /** 该项的唯一key, 通过config.primaryKey 获取 */
  key: TableKey;
  /** 最终高度 */
  height: number;
  /** 行索引, 该索引对应行在表格中的实际显示位置, 根据表头/固定项等会根实际数据索引有出入 */
  index: number;
  /** 在数据中的实际索引, 若为表头, 值为固定的-1 */
  dataIndex: number;
  /** 在内部data中的实际位置 */
  realIndex: number;
  /** y轴位置 */
  y: number;
  /** 对应的行配置 */
  config: TableRowConfig;
  /** 行对应的数据 */
  data: any;
  /** 是否是固定项 */
  isFixed: boolean;
  /** 如果是固定项, 表示其在视口的偏移位置 */
  fixedOffset?: number;
  /** 是否是偶数行, 由于固定列的存在, index并不能准确的判断, 故提供此属性 */
  isEven: boolean;
  /** 是否是表头 */
  isHeader: boolean;
  /** 是否是内部创建的行/列, 该项是表头时值也为true */
  isFake: boolean;
}

/**
 * 行配置
 */
export interface TableRowConfig {
  /** 行高 */
  height?: number;
  /** 控制行固定 */
  fixed?: TableRowFixedUnion;
}

/** 表示table中的一个单元格 */
export interface TableCell {
  /** 所在行 */
  row: TableRow;
  /** 所在列 */
  column: TableColumn;
  /** 单元格对应的dom节点 */
  dom?: HTMLDivElement;
  /** 单元格key, 格式为 rowIndex_columnIndex */
  key: TableKey;
  /** 根据columnConfig.key取到的单元格文本, 非实时, 仅在render时更新 */
  text: string;
  /** 单元格配置 */
  config: TableCellConfig;
  /** 单元格是否挂载 */
  isMount: boolean;
  /** 是否在任意轴固定 */
  isFixed: boolean;
  /** 是否在xy轴上都是固定 */
  isCrossFixed: boolean;
  /** 是否是X轴最后一项 */
  isLastX: boolean;
  /** 是否是Y轴最后一项 */
  isLastY: boolean;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 用户可在此处挂载自定义状态 */
  state: AnyObject;
}

export interface TableCellWithDom extends TableCell {
  dom: HTMLDivElement;
}

export interface TableCellConfig {
  /** 向右合并指定数量的单元格 */
  mergeX?: number;
  /** 向下合并指定数量的单元格 */
  mergeY?: number;
}

/** 包含表格行/列/单元格的结构 */
export interface TableItems {
  rows: TableRow[];
  columns: TableColumn[];
  cells: TableCell[];
}

/* # # # # # # # # # # # # # # # # #
 * row/column/cell相关类型
 * # # # # # # # # # # # # # # # # # */
/** 包含表格行/列/单元格和区域信的结构 */
export interface TableItemsFull {
  rows: TableRow[];
  columns: TableColumn[];
  cells: TableCell[];
  /** 区域开始/结束索引 */
  startRowIndex?: number;
  endRowIndex?: number;
  startColumnIndex?: number;
  endColumnIndex?: number;
}
