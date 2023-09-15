import {
  TableBaseConfig,
  TableCell,
  TableCellWithDom,
  TableInstance,
  TableInteractiveCoreConfig,
  TableMutationEvent,
  TablePersistenceConfig,
  TableReloadOptions,
  TableRow,
} from "../table-vanilla/index.js";
import { _tableOmitConfig } from "./common.js";
import { TableSelectConfig } from "../table-vanilla/plugins/select.js";
import { TableDragSortConfig } from "../table-vanilla/plugins/drag-sort.js";
import { ComponentBaseProps } from "../common/index.js";
import { AnyObject, EmptyFunction } from "@m78/utils";
import { CustomEventWithHook } from "@m78/hooks";
import { ReactNode } from "react";
import { TableDataLists } from "../table-vanilla/plugins/form.js";
import { TableFeedbackEvent } from "../table-vanilla/plugins/event.js";
import { FormInstance, FormSchema } from "../form/index.js";

/** 忽略的配置 */
type OmitConfig = typeof _tableOmitConfig[number];

/** 重写TableColumnLeafConfig类型 */
declare module "../table-vanilla/index.js" {
  interface TableColumnLeafConfig {
    /** 自定义该列单元格渲染 */
    render?: (arg: RCTableRenderArg) => React.ReactNode;
    /** 渲染编辑组件 */
    editRender?: RCTableEditWidgetImpl;
    /** 渲染筛选表单*/
    filterRender?: RCTableFilterColumnRender;
    /** 在表头后方渲染的额外节点 */
    headerExtra?: ReactNode;
    /** 自定义表头渲染, 设置后会覆盖默认节点, 若要保留, 可根据参数按需渲染 */
    headerRender?: () => ReactNode;
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
  /** 当前行的form实例 */
  form: FormInstance;
}

/**
 * 桥接现有表单组件为表格行内编辑可用组件
 * */
export interface RCTableEditWidgetImpl {
  (arg: RCTableEditRenderArg): ReactNode;
}

/** 用于将表单控件适配到可用于单元格内编辑的适配器 */
export interface RCTableEditWidgetAdapter<T = any> {
  (conf?: T): RCTableEditWidgetImpl;
}

/**
 * 列筛选表单渲染器
 * */
export interface RCTableFilterColumnRender {
  (form: FormInstance): ReactNode;
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
    TableInteractiveCoreConfig {
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

  /** 点击, event为原始事件对象, 可能是MouseEvent/PointerEvent */
  onClick?: (cell: TableCell, event: Event) => void;
  /** 任意选中项变更 */
  onSelect?: EmptyFunction;
  /** 配置/数据等变更, 通常意味需要持久化的一些信息发生了改变 */
  onMutation?: (event: TableMutationEvent) => void;
  /**
   * 内部抛出的一些提示性错误, 比如 "粘贴内容与选中单元格不匹配" 等
   * - 注意: 某些运行时错误, 比如未正确配置key等会直接crash而不是通过error提示
   * */
  onError?: (msg: string) => void;

  /* # # # # # # # 筛选 # # # # # # # */

  /** 默认查询条件 */
  defaultFilter?: AnyObject;
  /** 用于校验的筛选项schema, 具体用法请参考Form组件 */
  filterSchema?: FormSchema[];
  /** 不与特定字段绑定的filter, 渲染于工具栏的通用 filter 下 */
  commonFilter?: (form: FormInstance) => ReactNode;
  /** 触发筛选 */
  onFilter?: (filterData?: AnyObject) => void;
  /**
   * filter使用的表单实例, 不传时会使用内部创建的默认实例
   *
   * 通过此项可以更深入的控制筛选项, 使用自定义form实例时,  defaultFilter 和 filterSchema 会被忽略, 请使用form对应的配置(defaultValue/schemas)
   * */
  filterForm?: FormInstance;

  /* # # # # # # # 工具栏 # # # # # # # */

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

  /* # # # # # # # 数据操作 # # # # # # # */

  /** 用于校验字段的schema, 需要注意, 大部分schema配置都只对Form组件渲染有意义, 在单元格渲染中是无效的, 比如 label/list 等 */
  schema?: FormSchema[];
  /** 启用ediByDialog时, 可通过此项来手动进行Form渲染, 默认会使用根据schema生成的预设样式 */
  dialogFormRender?: (form: FormInstance) => ReactNode;
  /** 编辑功能是否启用, 传入true时全部启用, 可传入一个配置对象来按需启用所需功能 */
  dataOperations?:
    | boolean
    | {
        /** 允许编辑数据 */
        edit?: boolean;
        /** 允许新增数据 */
        new?: boolean;
        /** 允许删除数据 */
        delete?: boolean;
        /** 允许在独立窗口编辑行 */
        ediByDialog?: boolean;
      };
  /** 提交时触发, 接收当前数据和当前配置 */
  onSubmit?: (submitData: {
    /** 若数据发生了改变, 此项为当前数据信息 */
    data?: TableDataLists;
    /** 若配置发生了改变, 此项为完整的配置信息 */
    config?: TablePersistenceConfig;
    /** 发生了变更的配置key */
    changedConfigKeys?: string[];
  }) => void;
  /** 新增数据时, 使用此对象作为默认值, 可以是一个对象或返回对象的函数 */
  defaultNewData?: AnyObject | (() => AnyObject);
  /** true | 启用导出功能 */
  dataImport?: boolean;
  /** false | 启用导入功能, 需要dataOperation.new启用 */
  dataExport?: boolean;
  /** 传入后, 配置变更将存储到本地, 并在下次加载时读取 */
  localConfigStorageKey?: string;

  /* # # # # # # # 其他 # # # # # # # */

  /** 获取内部table实例 */
  instanceRef?: React.Ref<RCTableInstance>;
}

/** 表格实例 */
export interface RCTableInstance extends Omit<TableInstance, "event"> {
  /** 所有可用事件 */
  event: {
    /** 点击, event为原始事件对象, 可能是MouseEvent/PointerEvent */
    click: CustomEventWithHook<(cell: TableCell, event: Event) => void>;
    /** 任意选中项变更 */
    select: CustomEventWithHook<EmptyFunction>;
    /** 开始选取 */
    selectStart: CustomEventWithHook<EmptyFunction>;
    /** 行选中变更 */
    rowSelect: CustomEventWithHook<EmptyFunction>;
    /** 单元格选中变更 */
    cellSelect: CustomEventWithHook<EmptyFunction>;
    /** 配置/数据等变更, 通常意味需要持久化的一些信息发生了改变 */
    mutation: CustomEventWithHook<(event: TableMutationEvent) => void>;

    //* # # # # # # # 以下为部分对外暴露的插件生命周期事件或仅对库开发者有用的事件 # # # # # # # */
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

    /** 单元格的挂载状态变更 (mount状态可以理解为单元格是否在表格视口内并被渲染, 可通过cell.isMount获取) */
    mountChange: CustomEventWithHook<(cell: TableCell) => void>;
    /** 单元格交互状态发生变更, show - 显示还是关闭, isSubmit - 提交还是取消 */
    interactiveChange: CustomEventWithHook<
      (cell: TableCell, show: boolean, isSubmit: boolean) => void
    >;
    /** 表格容器尺寸/所在窗口位置变更时, 这对插件作者应该会有用 */
    resize: CustomEventWithHook<ResizeObserverCallback>;
    /**
     * 内部抛出的一些提示性错误, 比如 "粘贴内容与选中单元格不匹配" 等
     * - 注意: 某些运行时错误, 比如未正确配置key等会直接crash而不是通过error提示
     * */
    error: CustomEventWithHook<(msg: string) => void>;
    /** 需要进行一些反馈操作时触发, 比如点击了包含验证错误/禁用/内容不能完整显示的行, 如果项包含多个反馈, 则event包含多个事件项 */
    feedback: CustomEventWithHook<(event: TableFeedbackEvent[]) => void>;
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
  addBtn: ReactNode;
  saveBtn: ReactNode;
  editByDialogBtn: ReactNode;
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
  /** 记录活动的overlayStack, 用于methods.overlayStackChange */
  overlayStackCount: number;
}
