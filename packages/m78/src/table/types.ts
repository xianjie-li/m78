import {
  TableBaseConfig,
  TableCell,
  TableCellWithDom,
  TableInstance,
  TableInteractiveCoreConfig,
  TableMutationEvent,
  TableReloadOptions,
  TableRow,
} from "../table-vanilla/index.js";
import { _tableOmitConfig } from "./common.js";
import { TableSelectConfig } from "../table-vanilla/plugins/select.js";
import { TableDragSortConfig } from "../table-vanilla/plugins/drag-sort.js";
import { ComponentBaseProps } from "../common/index.js";
import { AnyObject, CustomEvent, EmptyFunction } from "@m78/utils";
import { CustomEventWithHook, SetState } from "@m78/hooks";
import { ReactNode } from "react";
import { _UseEditRender } from "./use-edit-render.js";
import { _UseCustomRender } from "./use-custom-render.js";
import { TableFormConfig } from "../table-vanilla/plugins/form.js";

/** 忽略的配置 */
type OmitConfig = typeof _tableOmitConfig[number];

/** 重写TableColumnLeafConfig类型 */
declare module "../table-vanilla/index.js" {
  interface TableColumnLeafConfig {
    /** 自定义该列单元格渲染 */
    render?: (arg: RCTableRenderArg) => React.ReactNode;
    /** 渲染筛选表单 */
    filterRender?: RCTableFilterColumnRender;
    /** 渲染编辑组件 */
    editRender?: RCTableEditWidgetImpl;
    /** 控制排序启用或设置排序默认值 */
    sort?: true | TableSort;
  }
}

export interface RCTableEditRenderArg extends RCTableRenderArg {
  /** 表单控件应使用此字段作为默认值 */
  value: any;
  /** 在value变更时, 通过此方法通知, 变更后的值会临时存储, 并由submit()/cancel()决定提交还是取消 */
  change: (value: any) => void;
  /** 录入完成, 将变更值提交, 提交时会进行校验, 若失败则会中断提交 */
  submit: EmptyFunction;
  /** 取消录入 */
  cancel: EmptyFunction;
  /** 若编辑组件包含关闭动画或需要延迟关闭, 可以调用此方法设置延迟关闭的时间, 若未设置, 编辑组件所在dom会在关闭后被直接清理 */
  delayClose: (time: number) => void;
  /** 当前使用的表单实例 */
  form: any;
}

/**
 * 桥接现有表单组件为表格行内编辑可用组件
 * */
export interface RCTableEditWidgetImpl {
  (arg: RCTableEditRenderArg): ReactNode;
}

/** 一个返回RCTableEditWidgetImpl的函数, 用于为其提供可选的配置项 */
export interface RCTableEditWidgetCreator<T = any> {
  (conf?: T): RCTableEditWidgetImpl;
}

/**
 * 列筛选表单渲染器
 * */
export interface RCTableFilterColumnRender {
  (form: any): ReactNode;
}

/**
 * 自定义任意单元格渲染
 * */
export interface RCTableRenderArg {
  /** 当前单元格 */
  cell: TableCellWithDom;
  /** 表格实例 */
  table: RCTableInstance;
  /** 传入给props.context的上下文信息 */
  context: AnyObject;
}

/** 表格props */
export interface RCTableProps
  extends ComponentBaseProps,
    Omit<TableBaseConfig, OmitConfig | "render">,
    TableSelectConfig,
    TableDragSortConfig,
    TableInteractiveCoreConfig,
    TableFormConfig {
  /** 自定义单元格渲染 */
  render?: (arg: RCTableRenderArg) => React.ReactNode | void;
  /** 自定义空节点 */
  emptyNode?: React.ReactElement;
  /** 最外层容器className */
  wrapClassName?: string;
  /** 最外层容器style */
  wrapStyle?: React.CSSProperties;
  /**
   * 表格内的自定义内容会通过react进行渲染, 由于渲染不是同步的, 在快速滚动时, 自定义渲染内容可能会有短暂的空白, 可以启用此项来强制react同步渲染这些内容
   * - 注意: 延迟渲染大部分情况下是可接受的, 而开启同步渲染回造成一定的性能影响
   * */
  syncRender?: boolean;
  /** 可在此传入表格上下文的状态, 并在column.render和config.render等函数中访问 */
  context?: AnyObject;

  /**
   * 内部抛出的一些提示性错误, 比如 "粘贴内容与选中单元格不匹配" 等
   * - 注意: 某些运行时错误, 比如未正确配置key等会直接crash而不是通过error提示
   * */
  onError?: (msg: string) => void;
  /** 点击, event为原始事件对象, 可能是MouseEvent/PointerEvent */
  onClick?: (cell: TableCell, event: Event) => void;
  /** 任意选中项变更 */
  onSelect?: EmptyFunction;
  /** 配置/数据等变更, 通常意味需要持久化的一些信息发生了改变 */
  onMutation?: (event: TableMutationEvent) => void;
  /** 触发筛选, 通常触发于 点击查询按钮/筛选/重置/排序 */
  onFilter?: (params: any) => void;
  /** true | 查询参数变更后是否自动触发onQuery */
  autoFilter?: boolean;
  /** 不与特定字段绑定的filter, 渲染于工具栏的 filter icon */
  commonFilter?: (form: any) => ReactNode;
  /** 默认查询参数 */
  defaultParams?: AnyObject;
  /** 定制toolbar左侧, 应使用React.Fragment避免内容被渲染到嵌套的容器中, 避免排版混乱 */
  toolBarLeadingCustomer?: (
    nodes: RCTableToolbarLeadingBuiltinNodes,
    table: RCTableInstance
  ) => ReactNode;
  /** 定制toolbar右侧, 应使用React.Fragment避免内容被渲染到嵌套的容器中, 避免排版混乱 */
  toolBarTrailingCustomer?: (
    nodes: RCTableToolbarTrailingBuiltinNodes,
    table: RCTableInstance
  ) => ReactNode;
  /** true | 启用导出功能 */
  dataImport?: boolean;
  /** false | 启用导入功能, 需要编辑功能开启 */
  dataExport?: boolean;
  /** 查询表单schema */
  filterSchema?: any;
}

/** 表格实例 */
export interface RCTableInstance extends Omit<TableInstance, "event"> {
  /** 所有可用事件 */
  event: {
    /**
     * 内部抛出的一些提示性错误, 比如 "粘贴内容与选中单元格不匹配" 等
     * - 注意: 某些运行时错误, 比如未正确配置key等会直接crash而不是通过error提示
     * */
    error: CustomEventWithHook<(msg: string) => void>;
    /** 点击, event为原始事件对象, 可能是MouseEvent/PointerEvent */
    click: CustomEventWithHook<(cell: TableCell, event: Event) => void>;
    /** 表格容器尺寸/所在窗口位置变更时, 这对插件作者应该会有用 */
    resize: CustomEventWithHook<ResizeObserverCallback>;
    /** 任意选中项变更 */
    select: CustomEventWithHook<EmptyFunction>;
    /** 开始选取 */
    selectStart: CustomEventWithHook<EmptyFunction>;
    /** 行选中变更 */
    rowSelect: CustomEventWithHook<EmptyFunction>;
    /** 单元格选中变更 */
    cellSelect: CustomEventWithHook<EmptyFunction>;
    /** 配置/数据等的变更事件 */
    mutation: CustomEventWithHook<(event: TableMutationEvent) => void>;
    /** 单元格的挂载状态变更 (mount状态可以理解为单元格是否在表格视口内并被渲染) */
    mountChange: CustomEventWithHook<
      (cell: TableCell, mounted: boolean) => void
    >;
    /** 单元格交互状态发生变更, show - 显示还是关闭, isSubmit - 提交还是取消 */
    interactiveChange: CustomEventWithHook<
      (cell: TableCell, show: boolean, isSubmit: boolean) => void
    >;

    //* # # # # # # # 以下为部分对外暴露的插件生命周期事件 # # # # # # # */
    /** 初始化阶段触发 */
    init: CustomEventWithHook<EmptyFunction>;
    /** 初始化完成触发 */
    initialized: CustomEventWithHook<EmptyFunction>;
    /** 首次渲染完成 */
    mounted: CustomEventWithHook<EmptyFunction>;
    /** 渲染中, 本阶段内部渲染基本上已完成, 可以再次附加自定义的渲染 */
    rendering: CustomEventWithHook<EmptyFunction>;
    /** 每次渲染完成后触发 */
    rendered: CustomEventWithHook<EmptyFunction>;
    /** 重载表格时触发 */
    reload: CustomEventWithHook<(opt: TableReloadOptions) => void>;
    /** 卸载前触发 */
    beforeDestroy: CustomEventWithHook<EmptyFunction>;
  };
}

/** 左侧预置节点 */
export interface RCTableToolbarLeadingBuiltinNodes {
  /** 所有节点的组合 */
  nodes: ReactNode;
  searchBtn: ReactNode;
  resetFilterBtn: ReactNode;
  filterBtn: ReactNode;
  redoBtn: ReactNode;
  undoBtn: ReactNode;
  countText: ReactNode;
}

/** 右侧预置节点 */
export interface RCTableToolbarTrailingBuiltinNodes {
  /** 所有节点的组合 */
  nodes: ReactNode;
  exportBtn: ReactNode;
  importBtn: ReactNode;
  deleteBtn: ReactNode;
  editBtn: ReactNode;
  addBtn: ReactNode;
  saveBtn: ReactNode;
}

export enum TableSort {
  asc = "asc",
  desc = "desc",
}

export type TableSortKeys = keyof typeof TableSort;

export type TableSortUnion = TableSort | TableSortKeys;

/** renderMap的项, 代表一个渲染项 */
export interface _CustomRenderItem {
  cell: TableCellWithDom;
  element: React.ReactNode;
}

/** editMap的项, 代表一个渲染的表单项 */
export interface _CustomEditItem {
  cell: TableCellWithDom;
  node: HTMLElement;
  element: React.ReactNode;
}

/** 组件状态 */
export interface _RCTableState {
  /** 定制空节点 */
  emptyNode?: HTMLDivElement;
  /** 表格实例 */
  instance: RCTableInstance;
  /** 总行数 */
  rowCount: number;
  /** 选中行 */
  selectedRows: TableRow[];
  /** 用于主动更新组件 */
  renderID?: number;
}

/** 实例状态 */
export interface _RCTableSelf {
  /** 所有自定义渲染项的key map */
  renderMap: Record<string, _CustomRenderItem>;
  /** 所有编辑项的key map */
  editMap: Record<string, _CustomEditItem>;
}

/** 上下文状态 */
export interface _RCTableContext {
  props: RCTableProps;
  state: _RCTableState;
  setState: SetState<_RCTableState>;
  self: _RCTableSelf;
  ref: React.MutableRefObject<HTMLDivElement>;
  scrollRef: React.MutableRefObject<HTMLDivElement>;
  scrollContRef: React.MutableRefObject<HTMLDivElement>;
  editRender: _UseEditRender;
  customRender: _UseCustomRender;
}
