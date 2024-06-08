import { BoundSize, TupleNumber } from "@m78/utils";
import { _eventImpl } from "./event.js";

/** 存在冲突事件时, 配置事件的覆盖策略 */
export enum TriggerOverrideStrategy {
  /** 持久事件的独占权, 若存在多个possess事件, 取最后注册的 */
  possess,
  /** 跳过当前事件, 转移执行权 */
  transfer,
  /** 允许和其他非possess事件并行执行 */
  parallel,
}

/** 用于配置在特定事件下的光标显示类型 */
export interface TriggerCursorMap {
  /** active触发时 */
  active?: string;
  /**
   * 可拖动节点的active状态, 优先级高于 active
   *
   * 注: 启用active事件后生效
   *  */
  dragActive?: string;
  /** 拖动过程中 */
  drag?: string;
}

/**
 * 事件项的配置对象, 此对象属性均是可变的, 如果你修改了对象内容, 则后续事件中会使用修改后的内容
 * */
export interface TriggerOption {
  /** 事件的触发目标, dom节点或一个虚拟的位置 */
  target: HTMLElement | BoundSize;
  /** 需要绑定的事件类型 */
  type: TriggerType | TriggerType[];
  /** 事件处理程序 */
  handler: TriggerListener;
  /** 控制事件是否启用, 由于会频繁调用, 不应包含复杂逻辑 */
  enable?: boolean | ((data: TriggerTargetData) => boolean);
  /** 0 | 事件级别, 较大的目标会覆盖较小目标的事件, 若最大级别下包含多个target, 则这些target会根据竞争规则触发事件 */
  level?: number;
  /** parallel | 同一level下有多个相同类型的事件触发时, 配置事件的覆盖策略 */
  overrideStrategy?: TriggerOverrideStrategy;
  /** 控制在特定事件下的光标类型 */
  cursor?: TriggerCursorMap;
  /** 可在此存放一些自定义信息, 并在Event中访问 */
  data?: any;
}

/** TriggerOption的包装类型, 包含了一些额外信息 */
export interface TriggerTargetData {
  /** 为true表示该项target是一个虚拟事件目标, 为false时为真实的dom节点 */
  isVirtual: boolean;
  /** 该项的位置 */
  bound: BoundSize;
  /** 事件目标dom, 需断言isVirtual为false时可用 */
  dom: HTMLElement;
  /** 用来便捷的检测指定类型事件是否启用 */
  typeMap: Map<TriggerType, boolean>;
  /** 与默认cursor配置合并后的配置对象 */
  cursor: Required<TriggerCursorMap>;
  /** 原始事件对象, 引用与原始对象一致 */
  option: TriggerOption;
}

/** 支持的事件类型 */
export enum TriggerType {
  /** 点击 */
  click = "click",
  /**
   * 根据不同的事件源, 触发方式不同:
   * - 支持光标的设备, 在鼠标移动到上方时触发
   * - 支持touch的设备, 短暂按住后触发, 与contextMenu在触控设备下触发方式相同, 区别是active会在松开手指后关闭
   * */
  active = "active",
  /** 获取焦点和失去焦点, 仅dom类型的target有效 */
  focus = "focus",
  /**
   * 根据不同的事件源, 触发方式不同:
   * - 支持光标的设备表现为右键点击
   * - 支持touch的设备, 短暂按住后触发, 与active在触控设备下触发方式相同, 区别是active会在松开手指后关闭
   * */
  contextMenu = "contextMenu",
  /** 光标或触摸点在目标上方移动 */
  move = "move",
  /** 对目标进行拖动 */
  drag = "drag",
}

export type TriggerTypeKeys = keyof typeof TriggerType;

export type TriggerTypeUnion = TriggerTypeKeys | TriggerType;

export interface TriggerInstance {
  /** 启用或禁用所有事件 */
  enable: boolean;

  /** 是否正在拖拽中 */
  dragging: boolean;

  /** 当前是否有active状态节点 */
  activating: boolean;

  /** 当前是否有move状态节点 */
  moving: boolean;

  /** 是否有持续性事件正在运行, 即 dragging / activating / moving 任意一项为true */
  running: boolean;

  /**
   * 新增事件配置, 可传入一个唯一的key将配置分组, 并在后续通过相同的key使用off批量移除事件选项
   *
   * - 事件对象的引用是事件本身的标识, 在进行移除事件等操作时, 以引用为准而不是对象值
   * - 每个配置对象在移除前只能通过on添加一次, 重复添加会导致预期外的行为
   *  */
  on(opt: TriggerOption | TriggerOption[], key?: string): void;

  /** 根据key或事件选项移除事件配置, 若事件通过key添加, 则只能通过key移除 */
  off(opt: TriggerOption | TriggerOption[]): void;
  off(key: string): void;

  /** 清空事件配置 */
  clear(): void;

  /** 事件配置总数 */
  size(): number;

  /** 获取可用事件目标的数据 */
  getTargetByXY(args: {
    /** 指定要获取事件的点 */
    xy?: TupleNumber;
    /** 指定事件类型, 非对应类型的事件被过滤 */
    type?: TriggerType | TriggerType[];
    /** 可在确认事件列表前对其进行再次过滤, 使用此参数而不是直接获取返回结果过滤是因为, 其在 overrideStrategy / level 等配置处理前执行, 通过filter能够使这些配置能正常作用 */
    filter?: (data: TriggerTargetData) => boolean;
  }): TriggerTargetData[];
}

export type TriggerListener = (e: TriggerEvent) => void;

/** 事件对象, 特定属性仅在其指定的事件类型中生效, 其他时候会是它们的初始值 */
export interface TriggerEvent {
  /** 事件类型 */
  type: TriggerType;
  /** 原生事件对象 */
  nativeEvent: Event;
  /** 是否是事件开始 */
  first: boolean;
  /** 是否是事件结束 */
  last: boolean;
  /** 事件对应的配置对象 */
  target: TriggerOption;
  /** 与TriggerTargetMeta.data相同 */
  data: any;
  /** 根据事件信息产生的额外信息 */
  eventMeta: TriggerTargetData;

  /* # # # # # # # 通用, 坐标在某些事件下始终为0 # # # # # # # */

  /** 触发位置相对屏幕的x坐标 */
  x: number;
  /** 触发位置相对屏幕的y坐标 */
  y: number;
  /** 触发位置相对目标左上角的x坐标 */
  offsetX: number;
  /** 触发位置相对目标左上角的y坐标 */
  offsetY: number;

  /* # # # # # # # active # # # # # # # */

  /** 是否处于active状态 */
  active: boolean;

  /* # # # # # # # focus # # # # # # # */

  /** 是否处于focus状态 */
  focus: boolean;
  /** 用于检测focus是否是由直接点击触发 */
  isTapFocus: boolean;

  /* # # # # # # # drag # # # # # # # */

  /** 拖动期间移动的总距离 */
  movementX: number;

  /** 拖动期间移动的总距离 */
  movementY: number;

  /** 相对上一次的移动距离 */
  deltaX: number;

  /** 相对上一次的移动距离 */
  deltaY: number;

  [key: string]: any;
}

/** 事件列表, 可为单个事件项或包含key的事件组 */
type OptionItem = TriggerOption | [string, TriggerOption[]];

export interface _TriggerContext {
  /** 存放所有事件的列表 */
  optionList: OptionItem[];
  /** 所有optionList中的group项, 方便查找和修改 */
  groupMap: Map<string, [string, TriggerOption[]]>;
  /** 存储时间线的运行时明细信息 */
  dataMap: Map<TriggerOption, TriggerTargetData>;
  /** 尚未初始化完成的trigger */
  trigger: TriggerInstance;

  /** 在触控设备的active或类似事件中, 需要防止触发默认的上下文菜单, 可通过此标记通知contextMenu事件 */
  shouldPreventDefaultContextMenu: boolean;

  /** event实现对外暴露的内容 */
  event: ReturnType<typeof _eventImpl>;

  /**
   * 获取指定事件坐标的有效事件配置数据
   * - list 所有与type匹配的 _TriggerTargetData
   * - optList 所有与type匹配的 TriggerOption
   * - eventList 所有xy点的 TriggerTargetData 信息, 并且对 level 和 overrideStrategy 进行了处理, 去掉了被覆盖项
   */
  getEventList(args: {
    /** 指定要获取事件的点 */
    xy?: TupleNumber;
    /** 指定事件类型, 非对应类型的事件被过滤 */
    type?: TriggerType | TriggerType[];
    /** 可在确认事件列表前对其进行再次过滤, 使用此参数而不是直接获取返回结果过滤是因为, 其在 overrideStrategy / level 等配置处理前执行, 通过filter能够使这些配置能正常作用 */
    filter?: (data: TriggerTargetData) => boolean;
  }): {
    list: TriggerTargetData[];
    optList: TriggerOption[];
    eventList: TriggerTargetData[];
  };

  /** 根据传入的 TriggerTargetData 获取其最新的 TriggerTargetData, 用于持续性的事件中更新对象本身 */
  updateTargetData(data: TriggerTargetData): TriggerTargetData;

  /** 从 TriggerOption 获取 _TriggerTargetData */
  getDataByOption(
    opt: TriggerOption,
    typeMap?: Map<TriggerType, boolean>
  ): TriggerTargetData;

  /** 清理所有未开始/未完成的事件, 会将conf中类型key为true的未完成事件全部结束 */
  clear: () => void;

  /** 在所有事件触发时调用, 用于统一处理光标样式等场景 */
  handleEvent(e: TriggerEvent): void;
}
