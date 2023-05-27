import {
  ActionHistory,
  AnyObject,
  BoundSize,
  CustomEvent,
  EmptyFunction,
} from "@m78/utils";
import { TablePlugin } from "./plugin.js";
import { _configCanNotChange } from "./common.js";

/** 表示单元格位置的元组, 分别表示 x轴索引, y轴索引 */
export type TablePosition = [number, number];

/** 表示列或行的key */
export type TableKey = string | number;

/** 重载级别, 更高的级别会包含低级别的重载内容 */
export enum TableReloadLevel {
  /** 基础信息计算, 比如固定/合并/尺寸等信息, 计算比较快速 */
  base,
  /** 重新计算索引, 通常在组件内部备份的data和columns顺序变更时使用, 组件使用者很少会使用到此级别, 由于包含了对data/column的遍历, 性能消耗会更高 */
  index,
  /** 重要配置发生了变更, 比如data/column完全改变, 会执行初始化阶段的大部分操作 */
  full,
}

export type TableReloadLevelKeys = keyof typeof TableReloadLevel;

export type TableReloadLevelUnion = TableReloadLevel | TableReloadLevelKeys;

export interface TableRenderCtx {
  isFirstRender: boolean;
  disableDefaultRender: boolean;
  disableLaterRender: boolean;
}

/** 内部会向data/column中注入的一些私有标记 */
export enum _TablePrivateProperty {
  /** 表示是由table注入的数据 */
  fake = "__M78TableFake",
  /** 表示该条数据需要在计算时被忽略 */
  ignore = "__M78TableIgnore",
  /** 表示对关联数据的引用 */
  ref = "__M78TableRef",
}

/** 不能通过table.config()变更的配置 */
export type TableConfigCanNotChanges = typeof _configCanNotChange[number];

export interface TableConfig {
  /** 用于挂载表格的div节点 */
  el: HTMLDivElement;
  /** 数据主键, 用于标识数据的唯一性, 对应的值类型必须为字符串或数字 */
  primaryKey: string;
  /** 数据源 */
  data: AnyObject[];
  /** 列配置 */
  columns: TableColumnConfig[];
  /** 行配置, 用于特别指定某些行的配置 */
  rows?: {
    [key: string]: TableRowConfig;
  };
  /** 单元格配置, 用于特别指定某些单元格的配置, 对象的key为`${rowKey}##${columnKey}` */
  cells?: {
    [key: string]: TableCellConfig;
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
  /** true | 相邻行显示不同的背景色 */
  stripe?: boolean;

  /**
   * 自定义单元格渲染, 主要有两种用途:
   * - 自定义节点样式或属性: 比如cell.dom.style.color = "red"
   * - 自定义子级: 完全定制cell.dom的内部节点, 同时设置ctx.disableDefaultRender为true来阻止默认的文本渲染
   *
   * 插件和配置都会注入render, 所以渲染回调额外接收了ctx作为上下文对象, 用于控制渲染行为.
   * ctx.isFirstRender 表示是否初次渲染, 由于render频率是很高的, 所以很多情况我们只需要在第一次render时插入节点, 后续只需要在已有节点上更新即可
   * ctx.disableDefaultRender 表示是否阻止默认的文本渲染, 通常用于自定义子级时使用
   * ctx.disableLaterRender 设置为true, 将会组织后面的一切render函数调用
   *
   * 可以通过cell.state.xx来保存一些针对当前单元格的渲染状态
   * */
  render?: (cell: TableCellWidthDom, ctx: TableRenderCtx) => void;

  /* # # # # # # # 选中 # # # # # # # */
  /** 配置行选中, 可传boolean进行开关控制或传入函数根据行单独控制 */
  rowSelectable?: boolean | ((row: TableRow) => boolean);
  /** 配置单元格选中, 可传boolean进行开关控制或传入函数根据单元格单独控制 */
  cellSelectable?: boolean | ((cell: TableCell) => boolean);

  /* # # # # # # # 极少使用 # # # # # # # */
  /** 插件 */
  plugins?: typeof TablePlugin[];
  /** 用于挂载放置dom层节点的容器, 仅在需要自定义滚动容器时使用 */
  viewEl?: HTMLDivElement;
  /** domEl的子级, 用于放置实际的dom内容, 仅在需要自定义滚动容器时使用 */
  viewContentEl?: HTMLDivElement;
  /** 传入定制的createEvent, 内部事件将使用此工厂函数创建 */
  eventCreator?: any;

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
  /* # # # # # # # 视口&渲染相关 # # # # # # # */
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

  /** 获取x最大值 */
  maxX(): number;

  /** 过去y最大值 */
  maxY(): number;

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

  /* # # # # # # # 事件 # # # # # # # */
  event: TableEvent;

  /* # # # # # # # 控制 # # # # # # # */
  /** 重绘表格. 注: 表格会在需要时自动进行重绘, 大部分情况不需要手动调用 */
  render(): void;
  /** render()的同步版本, 没有requestAnimationFrame调用 */
  renderSync(): void;

  /**
   * 重载表格
   * - 大部分情况下, 仅需要使用 render() 方法即可, 它有更好的性能
   * - 另外, 在必要配置变更后, 会自动调用 reload() 方法, 你只在极少情况下会使用它
   * - reload包含一个level概念, 不同的配置项变更会对应不同的级别, 在渲染十万以上级别的数据时尤其值得关注, 然而, 通过table.config()修改配置时会自动根据修改内容选择重置级别
   * */
  reload(opt?: TableReloadOptions): void;
  /** reload()的同步版本, 没有requestAnimationFrame调用 */
  reloadSync(opt?: TableReloadOptions): void;

  /** 销毁表格, 解除所有引用/事件 */
  destroy(): void;

  /** processing为true时, 后续的mutation操作会被阻止 */
  processing(): boolean;

  /** 设置processing */
  processing(processing: boolean): void;

  /**
   * 启用后, 所有的render/reload操作会被暂时拦截, 并在解除后进行单次更新, 在编写插件或表格功能进行扩展时可能会有用
   *
   * ## example
   * ```ts
   * const trigger = table.takeover()
   * doSomething();    // 这里的操作不会触发更新
   * trigger(); // 触发更新. 若没有调用, 会导致后续所有更新失效
   * ```
   * */
  takeover(): EmptyFunction;

  /* # # # # # # # 历史记录 # # # # # # # */
  /** 记录数据和配置的所有变更操作 */
  history: ActionHistory;

  /* # # # # # # # 配置管理 # # # # # # # */
  /** 获取配置 */
  config(): TableConfig;

  /**
   * 更改配置, 可单个或批量传入, 配置更新后会自动reload(), 另外, 像 el, primaryKey, plugins 这类的配置项不允许更新
   * - 可传入keepPosition保持当前滚动位置
   * - 此外, 每调用只应传入发生变更的配置项, 因为不同的配置有不同的重置级别, 某些配置只需要部分更新, 而另一些则需要完全更新
   *
   * ## example
   * ```ts
   * table.config({ rowHeight: 40, columnWidth: 150 }); // 批量更改
   * table.config({ rowHeight: 40 }); // 单个更改
   * ```
   * */
  config(
    config: Omit<Partial<TableConfig>, TableConfigCanNotChanges>,
    keepPosition?: boolean
  ): void;

  /* # # # # # # # 选中 # # # # # # # */

  /** 指定行是否选中 */
  isSelectedRow(key: TableKey): boolean;

  /** 指定单元格是否选中 */
  isSelectedCell(key: TableKey): boolean;

  /** 获取选中的行 */
  getSelectedRows(): TableRow[];

  /** 获取选中的单元格 */
  getSelectedCells(): TableCell[][];

  /** 设置选中的行, 传入merge可保留之前的行选中 */
  selectRows(rowKeys: TableKey[], merge?: boolean): void;

  /** 设置选中的单元格, 传入merge可保留之前的单元格选中 */
  selectCells(cellKeys: TableKey[], merge?: boolean): void;
}

/** 选择器 */
export interface TableGetter {
  /**
   * 获取指定区域的row/column/cell, 点的取值区间为[0, 内容总尺寸]
   * @param target - 可以是包含区域信息的bound对象, 也可以是表示[x, y]的位置元组
   * @param skipFixed - false | 是否跳过fixed项获取
   * */
  getBoundItems(
    target: BoundSize | TablePosition,
    skipFixed?: boolean
  ): TableItems;

  /**
   * 获取当前视口内可见的row/column/cell */
  getViewportItems(): TableItems;

  /** 获取两个点区间内的元素, 点的区间为: [0, 内容总尺寸] */
  getAreaBound(p1: TablePosition, p2?: TablePosition): TableItems;

  /**
   * 根据表格视区内的点获取基于内容尺寸的点, 传入点的区间为: [0, 表格容器尺寸].
   * - 可传入fixedOffset来修改fixed项的判定区域增加或减少
   * - 包含了对缩放的处理
   * */
  transformViewportPoint(
    [x, y]: TablePosition,
    fixedOffset?: number
  ): TablePointInfo;

  /**
   * 转换内容区域的点为表格视区内的点, 传入点的区间为: [0, 表格内容尺寸].
   * 包含了对缩放的处理
   * */
  transformContentPoint([x, y]: TablePosition): TablePointInfo;

  /** 获取指定行 */
  getRow(key: TableKey): TableRow;

  /** 获取指定列 */
  getColumn(key: TableKey): TableColumn;

  /** 获取指定单元格 */
  getCell(rowKey: TableKey, columnKey: TableKey): TableCell;

  /** 获取指定索引记录的key. 注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.data中项的索引 */
  getKeyByRowIndex(ind: number): TableKey;

  /** 获取指定column的key.  注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.columns中项的索引 */
  getKeyByColumnIndex(ind: number): TableKey;

  /** 获取key的row索引. 注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.data中项的索引 */
  getIndexByRowKey(key: TableKey): number;

  /** 获取key的column索引.  注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.columns中项的索引 */
  getIndexByColumnKey(key: TableKey): number;

  /** 指定key的数据是否存在 */
  isRowExist(key: TableKey): boolean;

  /** 指定key的列是否存在 */
  isColumnExist(key: TableKey): boolean;
}

export interface TableEvent {
  /**
   * 内部抛出的一些提示性错误, 比如 "粘贴内容与选中单元格不匹配" 等
   * - 注意: 不包含运行时错误, 比如未正确配置key等会直接crash而不是通过error提示
   * */
  error: CustomEvent<(msg: string) => void>;
  /** 点击, event为原始事件对象, 可能是MouseEvent/PointerEvent */
  click: CustomEvent<(cell: TableCell, event: Event) => void>;
  /** zoom变更 */
  zoom: CustomEvent<(zoom: number) => void>;
  /** 表格容器尺寸变更时, 这对插件作者应该会有用 */
  resize: CustomEvent<ResizeObserverCallback>;
  /** 任意选中项变更 */
  select: CustomEvent<EmptyFunction>;
  /** 行选中变更 */
  rowSelect: CustomEvent<EmptyFunction>;
  /** 单元格选中变更 */
  cellSelect: CustomEvent<EmptyFunction>;
  /** 容器尺寸/位置变更 */
  // bound: ...
  mutation: CustomEvent<(mutation: any) => void>;
}

/** 在插件和实例内共享的一组状态 */
export interface TablePluginContext {
  /** 当前zoom */
  zoom: number;
  /** 挂载dom的节点, 也是滚动容器节点 */
  viewEl: HTMLDivElement;
  /** domElement的子级, 用于实际挂载滚动区的dom节点 */
  viewContentEl: HTMLDivElement;
  /** viewContentEl子级, 用于集中挂载内容, 便于做一些统一控制(比如缩放) */
  stageEL: HTMLDivElement;

  /** 浅拷贝后的数据, 在数据项第一次需要改写时需对对应的项进行浅拷贝, 从而实现超大数据量的按需高速复制 */
  data: AnyObject[];

  /** 本地化后的行配置, 注入了表头相关的行/列配置 */
  rows: NonNullable<TableConfig["rows"]>;

  /** 本地化后的列配置, 扁平化并处理了合并表头等 */
  columns: TableColumnLeafConfig[];

  /** 本地化后的cells配置, 注入了表头合并单元格相关的配置 */
  cells: NonNullable<TableConfig["cells"]>;

  /** 上一帧中在视口中显示的row/cell/column */
  lastViewportItems?: TableItems;

  /** 预计算好的总尺寸 */
  contentWidth: number;
  contentHeight: number;

  ignoreDataLength: number;
  ignoreColumnLength: number;
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
    [key: string]: {
      /** 合并后占用的宽度 */
      width: number;
      /** 合并后占用的高度 */
      height: number;
      /** 被合并的列数 */
      xLength: number;
      /** 被合并的行数 */
      yLength: number;
    };
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

  /** 用户插件自定义的属性, 自定义插件应该集中属性名到额外的命名空间下, 防止和内部冲突,比如context.myPlugin.xxx */
  // [key: string]: any;
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

/** 表示table中的一个行 */
export interface TableRow {
  /** 该项的唯一key, 通过config.primaryKey 获取 */
  key: string;
  /** 最终高度 */
  height: number;
  /** 行索引. 注意, 该索引对应行在表格中的实际显示位置, 可能与config.data中的索引不同 */
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
  /** 是否是表头 */
  isHeader: boolean;
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

/** 表示table中的一列 */
export interface TableColumn {
  /** 该项的唯一key, 与 TableColumnConfig.key 相同 */
  key: string;
  /** 最终宽度 */
  width: number;
  /** 列索引. 注意, 该索引对应列在表格中的实际显示位置, 可能与config.columns中的索引不同 */
  index: number;
  /** 在数据中的实际索引, index会计入自动生成的行头等, 如果需要访问该行在config.columns中的索引, 请使用此项 */
  dataIndex?: number;
  /** x轴位置 */
  x: number;
  /** 对应的列配置 */
  config: TableColumnLeafConfig;
  /** 是否是固定项 */
  isFixed: boolean;
  /** 如果是固定项, 表示其在视口的偏移位置 */
  fixedOffset?: number;
  /** 是否是偶数列, 由于固定列的存在, index并不能准确的判断, 故提供此属性 */
  isEven: boolean;
  /** 是否是行头 */
  isHeader: boolean;
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
  key: string;
  /** 表头文本 */
  label: string;
  /** 列宽度 */
  width?: number;
  /** 控制列固定, 如果该列是被合并列, 会以最上层的列fixed配置为准 */
  fixed?: TableColumnFixedUnion;
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

export interface TableCellWidthDom extends TableCell {
  dom: HTMLDivElement;
}

export interface TableCellConfig {
  /** 向右合并指定数量的单元格 */
  mergeX?: number;
  /** 向下合并指定数量的单元格 */
  mergeY?: number;
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
  /** TableReloadLevel.base | 重置级别 */
  level?: TableReloadLevelUnion;
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

export interface TableAction {
  /** 执行操作 */
  redo(): void;

  /** 重做 */
  undo(): void;
}
