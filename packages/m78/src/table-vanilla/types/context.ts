/* # # # # # # # # # # # # # # # # #
 * 插件上下文相关类型
 * # # # # # # # # # # # # # # # # # */

import { AnyObject, CacheTick } from "@m78/utils";
import { TableKey } from "./base-type.js";
import { TableConfig, TablePersistenceConfig } from "./config.js";

import {
  TableCell,
  TableColumn,
  TableColumnConfig,
  TableColumnLeafConfigFormatted,
  TableItems,
  TableRow,
  TableRowConfig,
} from "./items.js";
import { TableReloadOptions } from "../plugins/life.js";
import { tableDefaultTexts } from "../common.js";
import { TablePlugin } from "../plugin.js";
import { _MetaMethods } from "../plugins/meta-data.js";
import { _ContextGetters } from "../plugins/getter.js";
import { _ContextSetter } from "../plugins/setter.js";
import { _GetterCacheKey } from "./cache.js";

import { _SchemaData } from "../plugins/form/types.js";

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

/** 在插件和实例内共享的一组状态 */
export interface TablePluginContext
  extends _MetaMethods,
    _ContextGetters,
    _ContextSetter {
  /** 挂载dom的节点, 也是滚动容器节点 */
  viewEl: HTMLDivElement;
  /** domElement的子级, 用于实际挂载滚动区的dom节点 */
  viewContentEl: HTMLDivElement;
  /** viewContentEl子级, 用于集中挂载内容, 便于做一些统一控制(比如缩放) */
  stageEL: HTMLDivElement;

  /** 浅拷贝后的数据, 在数据项第一次需要改写时再对应的项进行拷贝(copy in write), 从而实现超大数据量的按需高速复制 */
  data: AnyObject[];

  /** 本地化后的行配置, 注入了表头相关的行/列配置 */
  rows: NonNullable<TableConfig["rows"]>;

  /** 本地化后的列配置, 扁平化并处理了合并表头等 */
  columns: TableColumnLeafConfigFormatted[];

  /** 本地化后的cells配置, 注入了表头合并单元格相关的配置 */
  cells: NonNullable<TableConfig["cells"]>;

  /** 合并默认值后的提示文本 */
  texts: typeof tableDefaultTexts;

  /** 本地化后的persistenceConfig */
  persistenceConfig: TablePersistenceConfig;

  /** 上一帧中在视口中显示的row/cell/column */
  lastViewportItems?: TableItems;

  /** 最后一次挂载的rows */
  lastMountRows: Record<TableKey, true>;

  /** 最后一次挂载的所有columns */
  lastMountColumns: Record<TableKey, true>;

  /** 预计算好的总尺寸 */
  contentWidth: number;
  contentHeight: number;

  /** X轴忽略项索引 */
  ignoreXList: number[];
  /** Y轴忽略项索引 */
  ignoreYList: number[];

  /**
   * data的key映射, 用于快速查找key的索引
   * */
  dataKeyIndexMap: {
    [key: string]: number;
  };
  /**
   * columns的key映射, 用于快速查找key的索引
   * */
  columnKeyIndexMap: {
    [key: string]: number;
  };

  /** 用于历史操作时记录前一个持久化配置 */
  backupColumns: TablePersistenceConfig["columns"];
  backupRows: NonNullable<TableConfig["rows"]>;
  backupCells: NonNullable<TableConfig["cells"]>;
  /** 用于历史操作时记录首个原始选项配置 */
  backupFirstColumns: TablePersistenceConfig["columns"];
  backupFirstRows: NonNullable<TableConfig["rows"]>;
  backupFirstCells: NonNullable<TableConfig["cells"]>;

  /** config.rows 的所有keys */
  rowConfigNumberKeys: TableKey[];
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
  topFixedList: TableKey[];
  bottomFixeList: TableKey[];
  leftFixedList: TableKey[];
  rightFixedList: TableKey[];

  /** 记录最后的单元格索引, 用于控制边框显示 */
  lastColumnKey?: TableKey;
  lastRowKey?: TableKey;
  lastFixedColumnKey?: TableKey;
  lastFixedRowKey?: TableKey;

  /** 合并项信息, key 为 rowInd_colInd */
  mergeMapMain: {
    [key: string]: TableMergeData;
  };
  /** 被合并项信息, 结构为 `被合并项: 合并项`, 格式均为 [rowInd, colInd], 合并关系包含起始单元格本身  */
  mergeMapSub: {
    [key: string]: [TableKey, TableKey];
  };
  /** 记录合并项是否是末尾项, key 为 rowKey_colKey */
  lastMergeXMap: {
    [key: string]: boolean | undefined;
  };
  lastMergeYMap: {
    [key: string]: boolean | undefined;
  };

  /** 触发autoSize时, 如果未配置config.width/height, 对当前的wrap尺寸进行记录, 并在配置变更时进行恢复 */
  restoreWidth?: string;
  restoreHeight?: string;

  /** 缓存 */
  rowCache: {
    [key: string]: TableRow | undefined;
  };
  columnCache: {
    [key: string]: TableColumn | undefined;
  };
  cellCache: {
    /** key格式为: `${rowIndex}_${columnIndex}` */
    [key: string]: TableCell | undefined;
  };

  /** 所有表头项的key */
  yHeaderKeys: TableKey[];
  /** 行头的key(仅有一项) */
  xHeaderKey: TableKey;
  yHeaderHeight: number;
  xHeaderWidth: number;

  /** 是否包含合并表头 */
  hasMergeHeader: boolean;

  /** 记录表头项和其合并头的关系, 指定key是某个合并头的子级时, 值为true */
  mergeHeaderRelationMap: {
    [key: string]: boolean | undefined;
  };

  /** 所有非表头行的key */
  allRowKeys: TableKey[];
  /** 所有非行头列的key */
  allColumnKeys: TableKey[];

  /**
   * 实现table.takeover(), takeKey持有值的时候, render/reload会被阻止, 并在解除时统一执行一次更新
   * - 用于防止 takeover() 期间的代码再次调用takeover()或解除对父级操作影响
   * */
  takeKey?: string;
  /** takeover启用期间, 如果发生reload, 通过此项进行标记, 并将统一更新的操作由render改为reload */
  takeReload?: boolean;
  /** 存在takeReload时, 若包含配置项, 存储于此处 */
  takeReloadOptions?: TableReloadOptions;
  /** 是否进行了sync reload */
  takeSyncReload?: boolean;
  /** 是否进行了sync render */
  takeSyncRender?: boolean;

  /** 每次reload时生成的唯一key, 可用于在某些场景判断是否需要更新 */
  lastReloadKey?: string;

  /** 执行xy(xy)时, 是否应该触发内部的onScroll */
  xyShouldNotify?: boolean;

  /** 所有插件实例 */
  plugins: TablePlugin[];

  /** 被自动移动的行(固定项), 需要在首次触发move事件时进行通知 */
  autoMovedRows: { key: TableKey; from: number }[];

  /** 通用的getterCache */
  getterCache: CacheTick<_GetterCacheKey>;

  // form plugin 内向外暴露的同名方法
  getSchemas(row: TableRow | TableKey, update?: boolean): _SchemaData;

  /** 用户插件自定义的属性, 自定义插件应该集中属性名到额外的命名空间下, 防止和内部冲突,比如context.myPlugin.xxx */
  // [key: string]: any;
}

export interface TableMergeData {
  /** 合并后占用的宽度 */
  width: number;
  /** 合并后占用的高度 */
  height: number;
  /** 被合并的列数 */
  xLength: number;
  /** 被合并的行数 */
  yLength: number;
}
