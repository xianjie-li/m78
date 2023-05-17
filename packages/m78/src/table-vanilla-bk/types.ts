import Konva from "konva";
import { AnyObject, BoundSize, TupleNumber } from "@m78/utils";
import { TablePlugin } from "./plugin.js";

/** 表示单元格位置的元组, 分别表示 x轴索引, y轴索引 */
export type TableCellPosition = [number, number];

export type TableKey = string | number;

export interface TableConfig {
  /** 用于挂载表格的div节点 */
  el: HTMLDivElement;
  /** 数据源 */
  data: AnyObject[];
  /** 列配置 */
  columns: TableColumnConfig[];
  /** 数据主键, 用于标识数据的唯一性, 对应的值类型必须为字符串或数字 */
  primaryKey: string;
  /** 行配置, 用于特别指定某些行的配置, 对象的key为行索引 */
  rows?: {
    [index: string]: TableRowConfig;
  };
  /**
   * 单元格配置, 用于特别指定某些单元格的配置, 对象的key为`${rowIndex}_${columnIndex}`
   * - 例: { 5_2: { mergeX: 3 } } 表示第5行第2列的单元格向右合并3格
   * */
  cells?: {
    [index: string]: TableCellConfig;
  };
  /** 表格高度, 不传时使用挂载节点的高度 */
  height?: number | string;
  /** 表格宽度, 不传时使用挂载节点的宽度 */
  width?: number | string;
  /** true | 当数据总高度/宽度不足容器尺寸时, 压缩容器尺寸使其与数据占用尺寸一致 */
  autoSize?: boolean;
  /** 34 | 默认行高 */
  rowHeight?: number;
  /** 100 | 默认列宽 */
  columnWidth?: number;

  /**
   * 自定义单元格渲染, 返回false可以阻止默认text渲染, 主要有两种用途:
   * - 自定义节点样式或属性: 比如cell.dom.style.color = "red", 这种情况不需要返回true来阻止渲染
   * - 自定义子级: 完全定制cell.dom的内部节点, 同时返回true阻止默认渲染
   *
   * 此外, 由于render执行频率很高, 对于更新频率需求不高的节点, 可以设置自定义状态来跳过除第一次以外的渲染, 比如 cell.state.customStyle = true
   * */
  render?: (cell: TableCell) => boolean | void;

  /* # # # # # # # 极少使用 # # # # # # # */
  /** 插件 */
  plugins?: typeof TablePlugin[];
  /** 用于挂载放置dom层节点的容器, 仅在需要自定义滚动容器时使用 */
  viewEl?: HTMLDivElement;
  /** domEl的子级, 用于放置实际的dom内容, 仅在需要自定义滚动容器时使用 */
  viewContentEl?: HTMLDivElement;

  // 待实现
  /** 相邻行显示不同的背景色 */
  stripe?: boolean;

  /** 是否允许拖拽排序行 */
  sortRow?: boolean;
  /** 是否允许拖拽排序列 */
  sortColumn?: boolean;
  /** 是否允许拖拽调整列尺寸 */
  resizeColumn?: boolean;
  /** 是否允许拖拽调整行尺寸 */
  resizeRow?: boolean;
}

export interface TableInstance extends TableGetter {
  /* # # # # # # # 视口相关 # # # # # # # */
  /** 获取x */
  x(): number;

  /** 更新x */
  x(x: number): void;

  /** 获取y */
  y(): number;

  /** 更新y */
  y(y: number): void;

  /** 获取y */
  xy(): [number, number];

  /** 更新y */
  xy(x: number, y: number): void;

  /** 获取缩放值, 区间为 0.8 ~ 1.5 */
  zoom(): number;

  /** 设置缩放值, 区间为 0.8 ~ 1.5 */
  zoom(zoom: number): void;

  /** 获取宽度 */
  width(): number;

  /** 设置宽度 */
  width(width: number | string): void;

  /** 获取高度 */
  height(): number;

  /** 设置高度 */
  height(height: number | string): void;

  /** 内容区域宽度 */
  contentWidth(): number;

  /** 内容区域高度 */
  contentHeight(): number;

  /** 重绘表格, 表格会在需要时进行重绘, 大部分情况不需要手动调用 */
  render(): void;

  /**
   * 重载表格, 清理所有缓存, 重新进行尺寸/位置等数据的预计算
   * - 大部分情况下, 仅需要使用 render() 方法即可, 它拥有更好的性能
   * - 另外, 在必要配置变更后, 会自动调用 reload() 方法, 你只在极少情况下会使用它
   * */
  reload(opt?: TableReloadOptions): void;

  /* # # # # # # # 控制 # # # # # # # */

  /** 销毁表格, 解除所有引用/事件 */
  destroy(): void;

  /** 待实现 */
  /** 获取配置 */
  config(): TableConfig;

  /** 变更传入项对应的配置, 始终只应传入变更项, 因为 data/columns/rows等变更时会额外执行一些初始化操作 */
  config(config: Partial<TableConfig>): void;
}

/** 选择器 */
export interface TableGetter {
  /**
   * 获取指定区域的row/column/cell
   * @param target - 可以是包含区域信息的bound对象, 也可以是表示[x, y]的元组, 参数为元组时, row/column/cell都最多只会包含一个
   * @param skipFixed - false | 是否跳过fixed项获取
   * */
  getBoundItems(
    target: BoundSize | TupleNumber,
    skipFixed?: boolean
  ): TableItems;

  /**
   * 获取当前视口内可见的row/column/cell */
  getViewportItems(): TableItems;

  /** 获取指定行 */
  getRow(index: number): TableRow;

  /** 获取指定列 */
  getColumn(index: number): TableColumn;

  /** 获取指定单元格 */
  getCell(rowIndex: number, columnIndex: number): TableCell;
}

/** 在插件和实例内共享的一组状态 */
export interface TablePluginContext {
  /** 当前zoom */
  zoom: number;
  /** 挂载dom的节点 */
  viewEl: HTMLDivElement;
  /** domElement的子级, 用于实际挂载滚动区的dom节点 */
  viewContentEl: HTMLDivElement;
  /** viewContentEl子级, 用于集中挂载内容, 便于做一些统一控制(比如缩放) */
  stageEL: HTMLDivElement;

  /** 上一帧中在视口中显示的row/cell/column */
  lastViewportItems?: TableItems;

  /** 用于控制内部某些操作是否要自动进行render */
  skipRender?: boolean;

  /** 预计算好的总尺寸 */
  contentWidth: number;
  contentHeight: number;
  /** config.rows 的所有keys, 已经过数字化处理 */
  rowConfigNumberKeys: number[];
  /** data的索引映射, 将fixed项排列到了前/后方, 方便根据一些顺序相关的计算  */
  dataFixedSortList: number[];
  /** columns的索引映射, 将fixed项排列到了前/后方, 方便根据一些顺序相关的计算  */
  columnsFixedSortList: number[];
  /** 固定项占用尺寸 */
  topFixedHeight: number;
  bottomFixedHeight: number;
  leftFixedWidth: number;
  rightFixedWidth: number;
  /** 带位置信息的固定项数据, 若包含值, 说明该项是一个固定项 */
  topFixedMap: FixedMap<TableRowConfig>;
  bottomFixedMap: FixedMap<TableRowConfig>;
  leftFixedMap: FixedMap<TableColumnConfig>;
  rightFixedMap: FixedMap<TableColumnConfig>;
  /** 固定项的索引列表, 有序 */
  topFixedList: number[];
  bottomFixeList: number[];
  leftFixedList: number[];
  rightFixedList: number[];

  /** 记录最后的单元格索引, 用于控制边框显示 */
  lastColumnIndex?: number;
  lastRowIndex?: number;
  lastFixedColumnIndex?: number;
  lastFixedRowIndex?: number;

  /** 合并项信息, key 为 rowInd_colInd */
  mergeMapMain: {
    [ind: string]: {
      width?: number;
      height: number;
    };
  };
  /** 被合并项信息, 结构为 `被合并项: 合并项`, 格式均为 [rowInd, colInd], 合并关系包含起始单元格本身  */
  mergeMapSub: {
    [ind: string]: [number, number];
  };
  /** 记录合并项是否是末尾项, key 为 rowInd_colInd */
  lastMergeXMap: {
    [ind: string]: boolean | undefined;
  };
  lastMergeYMap: {
    [ind: string]: boolean | undefined;
  };

  /** 触发autoSize时, 如果未配置config.width/height, 对当前的wrap尺寸进行记录, 并在配置变更时进行恢复 */
  restoreWidth?: string;
  restoreHeight?: string;

  /** 缓存 */
  rowCache: {
    [ind: string]: TableRow | undefined;
  };
  columnCache: {
    [ind: string]: TableColumn | undefined;
  };
  cellCache: {
    /** key格式为: `${rowIndex}_${columnIndex}` */
    [ind: string]: TableCell | undefined;
  };

  [key: string]: any;
}

export enum TableRowFixed {
  top = "top",
  bottom = "bottom",
}

export type TableRowFixedKeys = keyof typeof TableRowFixed;

export type TableRowFixedUnion = TableRowFixed | TableRowFixedKeys;

export enum TableColumnFixed {
  left = "left",
  right = "right",
}

export type TableColumnFixedKeys = keyof typeof TableColumnFixed;

export type TableColumnFixedUnion = TableColumnFixed | TableColumnFixedKeys;

export interface TableRow {
  /** 该项的唯一key, 通过config.primaryKey 获取 */
  key: string;
  /** 最终高度 */
  height: number;
  /** 行索引 */
  index: number;
  /** 在数据中的实际索引, index会计入自动生成的表头等, 如果需要访问该行在config.data中的索引, 请使用此项 */
  dataIndex?: number;
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

export interface TableColumn {
  /** 该项的唯一key, 与 TableColumnConfig.key 相同 */
  key: string;
  /** 最终宽度 */
  width: number;
  /** 列索引 */
  index: number;
  /** 在数据中的实际索引, index会计入自动生成的行头等, 如果需要访问该行在config.columns中的索引, 请使用此项 */
  dataIndex?: number;
  /** x轴位置 */
  x: number;
  /** 对应的列配置 */
  config: TableColumnConfig;
  /** 是否是固定项 */
  isFixed: boolean;
  /** 如果是固定项, 表示其在视口的偏移位置 */
  fixedOffset?: number;
  /** 是否是偶数列, 由于固定列的存在, index并不能准确的判断, 故提供此属性 */
  isEven: boolean;
}

/**
 * 列配置, 是TableColumn的子集, 用于配置列的部分属性
 */
export interface TableColumnConfig {
  /** 该列对应的唯一key, 用于获取value或显示的文本, 另外也作为表格变异操作的标识, 对应的值类型必须为字符串或数字 */
  key: string;
  /** 列宽度 */
  width?: number;
  /** 控制列固定 */
  fixed?: TableColumnFixedUnion;
}

export interface TableCell {
  /** 所在行 */
  row: TableRow;
  /** 所在列 */
  column: TableColumn;
  /** 单元格对应的dom节点 */
  dom: HTMLDivElement;
  /** 单元格key, 格式为 rowIndex_columnIndex */
  key: string;
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
  /** 用户可在此处挂载自定义状态 */
  state: AnyObject;
}

export interface TableCellConfig {
  /** 向右合并指定数量的单元格 */
  mergeX?: number;
  /** 向下合并指定数量的单元格 */
  mergeY?: number;
  /** 单元格框体配置 */
  rectConfig?: Konva.RectConfig;
  /** 单元格文本配置 */
  textConfig?: Konva.TextConfig;
}

/** 固定项信息 */
type FixedMap<T> = {
  [index: string]: {
    /** 固定项偏移位置 */
    offset: number;
    /** 相对于视口的offset */
    viewPortOffset: number;
    /** 配置 */
    config: T;
  };
};

export interface TableReloadOptions {
  /** 为true时, 保持当前滚动位置 */
  keepPosition?: boolean;
}

/** 包含表格行/列/单元格的结构 */
export interface TableItems {
  rows: TableRow[];
  columns: TableColumn[];
  cells: TableCell[];
}

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
