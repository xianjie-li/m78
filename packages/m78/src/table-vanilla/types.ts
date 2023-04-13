import Konva from "konva";
import { AnyObject, BoundSize, TupleNumber } from "@m78/utils";
import { TablePlugin } from "./plugin.js";

export interface TableConfig {
  /** 用于挂载表格的dom元素 */
  el: HTMLDivElement;
  /** 数据源 */
  data: AnyObject[];
  /** 列配置 */
  columns: TableColumnConfig[];
  /**
   * 行配置, 可用于特别指定某些行的配置, 其中key为行索引,
   * 也可传入函数来实现动态行配置, 函数参数为当前行数据
   * */
  rows?:
    | {
        [key: string]: TableRowConfig;
      }
    | ((data: any, index: number) => TableRowConfig | void);
  /** 表格高度, 不传时使用挂载节点的高度 */
  height?: number | string;
  /** true | 数据总高度/宽度不足容器尺寸时, 压缩容器尺寸与数据占用尺寸一致 */
  autoSize?: boolean;
  /** 表格宽度, 不传时使用挂载节点的宽度 */
  width?: number | string;
  /** 34 | 默认行高 */
  rowHeight?: number | ((data: any) => number);
  /** 100 | 默认列宽 */
  columnWidth?: number | ((index: number) => number);
  /** 插件 */
  plugins?: typeof TablePlugin[];
  /** #000 | 边框颜色 */
  borderColor?: string;
  /** 0.5px | 边框厚度 */
  borderWidth?: number;
  /** 背景色 */
  backgroundColor?: string;
  /** 用于挂载放置dom层节点的容器 */
  domEl?: HTMLDivElement;
  /** domEl的子级, 用于放置实际的dom内容 */
  domContentEl?: HTMLDivElement;
  /** 初始缩放比例 */
  scale?: number;
  /** 初始x轴 */
  x?: number;
  /** 初始y轴 */
  y?: number;
}

export interface TableItems {
  rows: TableRow[];
  columns: TableColumn[];
  cells: TableCell[];
}

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

export interface TableInstance {
  /** 创建配置 */
  config: TableConfig;

  /* # # # # # # # 基础 # # # # # # # */

  /** 所有行 */
  rows: TableRow[];
  /** 所有列 */
  columns: TableColumn[];
  /** 所有单元格 */
  cells: TableCell[];
  /** 固定项 */
  topFixed: TableRow[];
  bottomFixed: TableRow[];
  leftFixed: TableColumn[];
  rightFixed: TableColumn[];

  /* # # # # # # # 视口相关 # # # # # # # */

  /** 表格所在的stage实例 */
  stage: Konva.Stage;
  /** 表格所在的layer实例 */
  layer: Konva.Layer;
  /** 挂载canvas的节点 */
  canvasElement: HTMLDivElement;

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

  /** 获取缩放值, 区间为 0.5 ~ 2 */
  zoom(): number;

  /** 设置缩放值, 有效区间为 0.5 ~ 2 */
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

  /**
   * 获取指定区域的row/column/cell,
   * @param target - 可以是包含区域信息的bound对象, 也可以是表示[x, y]的元组, 参数为元组时, row/column/cell都最多只会包含一个
   * @param skipFixed - 是否跳过固定项获取
   * */
  getBoundItems(
    target: BoundSize | TupleNumber,
    skipFixed?: boolean
  ): TableItemsFull;

  /**
   * 获取当前视口内可见的row/column/cell */
  getViewportItems(): TableItems;

  /** 根据当前状态对表格进行绘制 */
  render(): void;

  /* # # # # # # # 控制 # # # # # # # */

  /** 还原除了当前配置以外的其他状态, 并重载表格 */
  reload(): void;

  /** 销毁表格, 解除所有引用/事件 */
  destroy(): void;
}

export interface TablePluginContext {
  // /** 表格外边框 */
  // borderShape: Konva.Shape;
  /** 挂载dom的节点 */
  domEl: HTMLDivElement;
  /** domElement的子级, 用于实际挂载滚动区的dom节点 */
  domContentEl: HTMLDivElement;
  /** 上一帧中在视口中显示的row/cell/column */
  lastViewportItems?: TableItems;
  /** 固定项占用尺寸 */
  topFixedHeight: number;
  bottomFixedHeight: number;
  leftFixedWidth: number;
  rightFixedWidth: number;
  /** 最后一个不为固定项的row */
  lastNoFixedRow: TableRow | undefined;
  /** 最后一个不为固定项的column */
  lastNoFixedColumn: TableColumn | undefined;

  /** 触发autoSize时, 如果未配置config.width/height, 对当前的wrap尺寸进行记录, 并在配置变更时进行恢复 */
  restoreWidth?: string;
  restoreHeight?: string;

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
  /** 名称, 可用于选择器获取 */
  name?: string;
  /** 行高度 */
  height: number;
  /** 行索引 */
  index: number;
  /** y轴位置 */
  y: number;
  /** 当前行的所有cell实例 */
  cells: TableCell[];
  /** 对应的列配置 */
  rowConfig: TableRowConfig;
  /** 如果是固定项, 表示其固定位置 */
  fixedY?: number;
  /** 行对应的数据 */
  data: any;
}

/**
 * 行配置, 是TableRow的子集, 用于配置行的部分属性
 */
export interface TableRowConfig {
  name?: TableRow["name"];
  height?: TableRow["height"];
  /** 控制行固定 */
  fixed?: TableRowFixedUnion;
}

export interface TableColumn {
  /** 名称, 可用于选择器获取 */
  name?: string;
  /** 列宽度 */
  width: number;
  /** 列索引 */
  index: number;
  /** x轴位置 */
  x: number;
  /** 控制如何获取显示的文本 */
  textGetter?: (data: any) => string;
  /** 当前列的所有cell实例 */
  cells: TableCell[];
  /** 对应的列配置 */
  columnConfig: TableColumnConfig;
  /** 如果是固定项, 表示其固定位置 */
  fixedX?: number;
}

/**
 * 列配置, 是TableColumn的子集, 用于配置列的部分属性
 */
export interface TableColumnConfig {
  name?: TableColumn["name"];
  width?: TableColumn["width"];
  textGetter?: TableColumn["textGetter"];
  /** 控制列固定 */
  fixed?: TableColumnFixedUnion;
}

export interface TableCell {
  /** 所在行 */
  row: TableRow;
  /** 所在列 */
  column: TableColumn;
  /**
   * 单元格图形, 默认包含text建, 即当前文本, 可在此处挂载自定义shape
   * - 所有shape都是惰性加载的, 如果不存在于可视区域内, 可能不会被创建
   * */
  shapes: {
    /** 单元格文本 */
    text?: Konva.Text;
    /** 单元格形状 */
    rect?: Konva.Rect;
    /** 用户挂载的其他形状 */
    [key: string]: Konva.Shape | undefined;
  };
  /** 用于附加的dom节点 */
  dom?: HTMLElement;
  /** 单元格文本 */
  text: string;
}
