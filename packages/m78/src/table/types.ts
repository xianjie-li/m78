import {
  TableBaseConfig,
  TableCell,
  TableCellWithDom,
  TableColumn,
  TableInstance,
  TableMutationEvent,
  TablePersistenceConfig,
  TableReloadOptions,
  TableRow,
} from "../table-vanilla/index.js";
import { _tableOmitConfig } from "./common.js";
import { TableSelectConfig } from "../table-vanilla/plugins/select.js";
import { ComponentBaseProps } from "../common/index.js";
import { AnyObject, EmptyFunction } from "@m78/utils";
import { CustomEventWithHook } from "@m78/hooks";
import React, { ReactElement, ReactNode } from "react";
import { TableDataLists } from "../table-vanilla/plugins/form.js";
import { FormInstance, FormSchema } from "../form/index.js";
import { TablePlugin } from "../table-vanilla/plugin.js";
import { RCTablePlugin } from "./plugin.js";
import { TableFeedbackEvent } from "../table-vanilla/plugins/feedback.js";
import {
  TableConfigPersister,
  TableConfigReader,
} from "./plugins/config-sync.js";
import { FormAdaptors } from "../config/index.js";
import { TablePluginContext } from "../table-vanilla/types/context.js";

/** 忽略的配置 */
type OmitConfig = typeof _tableOmitConfig[number];

/** 重写TableColumnLeafConfig类型 */
declare module "../table-vanilla/index.js" {
  interface TableColumnLeafConfig {
    /** 自定义列单元格渲染 */
    render?: (arg: RCTableRenderArg) => ReactNode | void;
    /** 渲染列头的筛选表单*/
    filterRender?: RCTableFilterColumnRender;
    /** 在表头后方渲染的额外节点 */
    headerExtra?: ReactNode;
    /** TODO: 自定义表头渲染, 设置后会覆盖默认节点, 若要保留, 可根据参数按需渲染 */
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
  /** 当前表单控件 */
  element: ReactElement;
  /** 用于将传入的props绑定到element的助手函数 */
  binder: <Props = AnyObject>(el: ReactElement, props: Props) => ReactElement;
}

/**
 * 桥接现有表单组件为表格行内编辑可用组件
 * */
export interface RCTableEditAdaptor {
  (arg: RCTableEditRenderArg): ReactNode;
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
  /** 如果在其他定制render之后执行, 如插件/config.render/column.render, 接收经过它们处理后的element, 可以选择忽略之前的定制或对其进行合并处理后返回 */
  prevElement: ReactNode | null;
}

/** 表格props */
export interface RCTableProps
  extends ComponentBaseProps,
    Omit<TableBaseConfig, OmitConfig | "render">,
    TableSelectConfig {
  /** 自定义单元格渲染 */
  render?: (arg: RCTableRenderArg) => ReactNode | void;
  /** 自定义空节点 */
  emptyNode?: React.ReactElement;
  /** 最外层容器className */
  wrapClassName?: string;
  /** 最外层容器style */
  wrapStyle?: React.CSSProperties;
  /** 可在此传入表格上下文的状态, 并在column.render和config.render等位置中访问 */
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
  /** 触发筛选 */
  onFilter?: (filterData?: AnyObject) => void;
  /** 用于校验的筛选项schema, 具体用法请参考Form组件 */
  filterSchema?: FormSchema[];
  /** 不与特定字段绑定的filter, 渲染于工具栏的通用 filter 下 */
  commonFilter?: (form: FormInstance) => ReactNode;
  /**
   * filter使用的表单实例, 不传时会使用内部创建的默认实例
   *
   * 通过此项可以更深入的控制筛选项, 使用自定义form实例时,  defaultFilter 和 filterSchema 会被忽略, 请使用form对应的配置(values/schemas)
   *
   * 此外, 还会覆盖默认的 size / layoutType / spacePadding 配置, 若有需求需要重新指定
   * */
  filterForm?: FormInstance;

  /* # # # # # # # 工具栏 # # # # # # # */

  /** 定制toolbar左侧, 可直接更改nodes, 向其中新增或删除节点 */
  toolBarLeadingCustomer?: (nodes: ReactNode[], table: RCTableInstance) => void;
  /** 定制toolbar右侧, 可直接更改nodes, 向其中新增或删除节点 */
  toolBarTrailingCustomer?: (
    nodes: ReactNode[],
    table: RCTableInstance
  ) => void;

  /* # # # # # # # 数据操作 # # # # # # # */

  /**
   * 用于约束表格数据格式或启用单元格编辑的schemas, 需要注意以下几点:
   *
   * - 若要启用编辑功能, schema.element 是必须的, 并且对应的组件必须在table级别或全局注册过, 另外, 还需设置 dataOperations.edit 对编辑功能进行整体启用
   * - 一些针对Form组件的schema在在单元格编辑中是无效的, 比如 list
   * */
  schemas?: FormSchema[];
  /** 表单控件适配器, 优先级高于全局适配器 */
  adaptors?: FormAdaptors;
  /** 数据编辑/新增等功能是否启用, 传入true时全部启用, 可传入一个配置对象来按需启用所需功能 */
  dataOperations?: boolean | TableDataOperationsConfig;
  /** 提交时触发 */
  onSubmit?: (submitData: {
    // 是否需要改为直接收data
    /** 若数据发生了改变, 此项为当前数据信息 */
    data?: TableDataLists;
  }) => void;
  /** 新增数据时, 使用此对象作为默认值, 可以是一个对象或返回对象的函数 */
  defaultNewData?: AnyObject | (() => AnyObject);
  /** 用于持久化配置的唯一key, 默认通过storage api进行配置持久化, 可通过 configPersister/configReader 配置定制持久化逻辑 */
  configCacheKey?: string;
  /**
   * 自定义配置的存储方式, 默认通过storage api进行存储
   *
   * 配置存储的时机是: Table组件卸载 / 页面卸载 / 配置变更后的几秒后
   * */
  configPersister?: TableConfigPersister;
  /** 持久化配置读取器, 返回持久化配置, 自定义了configPersister时需要进行配置 */
  configReader?: TableConfigReader;
  /** true | 启用软删除数据, 删除数据不会从表格消失, 而是显示为禁用, 用户可以在保存前随时对其进行恢复 */
  softRemove?: boolean;

  /* # # # # # # # 其他 # # # # # # # */

  /** 获取内部table实例 */
  instanceRef?: React.Ref<RCTableInstance>;

  /** 插件 */
  plugins?: Array<typeof TablePlugin | typeof RCTablePlugin>;
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
    /** 每次开始前触发 */
    beforeRender: CustomEventWithHook<EmptyFunction>;
    /** 渲染中, 本阶段内部渲染基本上已完成, 可以再次附加自定义的渲染 */
    rendering: CustomEventWithHook<EmptyFunction>;
    /** 每次渲染完成后触发 */
    rendered: CustomEventWithHook<EmptyFunction>;
    /** 重载表格时触发 */
    reload: CustomEventWithHook<(opt: TableReloadOptions) => void>;
    /** 卸载前触发 */
    beforeDestroy: CustomEventWithHook<EmptyFunction>;
    /** 在rendering触发前, 每个单元格渲染后触发 */
    cellRendering: CustomEventWithHook<(cell: TableCell) => void>;
    /** 在rendering触发前触发, 主要用于通知所有该次render显示的行, 触发时并不意味着行内所有单元格均已渲染完成 */
    rowRendering: CustomEventWithHook<(row: TableRow) => void>;
    /** 在rendering触发前触发, 主要用于通知所有该次render显示的列, 触发时并不意味着行内所有单元格均已渲染完成 */
    columnRendering: CustomEventWithHook<(column: TableColumn) => void>;

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
    /** 拖拽移动启用状态变更时触发 */
    dragMoveChange: CustomEventWithHook<(enable: boolean) => void>;
    /** 常规配置(非持久化配置)变更时触发, 接收所有变更key的数组changeKeys, 和isChange, 用于检测key是否包含在该次变更中 */
    configChange: CustomEventWithHook<
      (changeKeys: string[], isChange: (key: string) => boolean) => void
    >;
  };
}

export interface TableDataOperationsConfig {
  /** 允许编辑数据, 请注意, 单元格是否可编辑还与对应列的schema配置有关 */
  edit?: boolean | ((cell: TableCell) => boolean);
  /** 允许新增数据, 新增数据始终可编辑 */
  add?: boolean;
  /** 允许删除数据 */
  delete?: boolean;
  /** 行拖拽排序 */
  sortRow?: boolean;
  /** true | 列拖拽排序 */
  sortColumn?: boolean;
  /** 从xlsx导入数据, 需要同时启用add */
  import?: boolean;
  /** true | 导出数据到xlsx */
  export?: boolean;
}

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
  /** 表格实例 (在未完成创建前会是null) */
  instance: RCTableInstance;
  /** vanilla table内部使用的context */
  vCtx: TablePluginContext;
  /** 组件正在执行初始化操作, 尚未完成实例创建, 通常在instance需要异步创建时使用, 比如从服务器读取持久化配置 */
  initializing: boolean;
  /** initializing为true时显示的提示内容 */
  initializingTip: React.ReactElement | string | null;
  /** 出现阻塞性的错误时, 设置到此处进行显示 */
  blockError: ReactElement | string | null;
  /** 总行数 */
  rowCount: number;
  /** 选中行 */
  selectedRows: TableRow[];
  /** 用于主动更新组件 */
  renderID?: number;
  /** 从缓存或服务器读取到的持久配置 */
  persistenceConfig?: TablePersistenceConfig;
}

/** 实例状态 */
export interface _RCTableSelf {
  /** 
   * 表格实例, 会比state.instance更早初始化(在instance创建, 第一次render执行前)
   * 
   * 某些地方需要在首次render前提前访问, 估提供此项
   * */
  instance: RCTableInstance;
  /** 同state.vCtx, 某些地方需要在首次render前提前访问, 估提供此项 */
  vCtx: TablePluginContext;
  /** 所有自定义渲染项的key map */
  renderMap: Record<string, _CustomRenderItem>;
  /** 所有正在编辑项的key map */
  editMap: Record<string, _CustomEditItem>;
  /** 根据schema生成的form, 用于检测可编辑状态 */
  editCheckForm: FormInstance;
  /** 在进行editCheckForm后将结果缓存到此处, 避免多余的计算 */
  editStatusMap: Record<string, boolean>;
  /** 记录活动的overlayStack, 用于methods.overlayStackChange */
  overlayStackCount: number;
}
