import { BoundSize, CustomEvent } from "@m78/utils";
import { _eventImpl } from "./event.js";

/**
 * 表示一个触发目标, 可以是包含关联信息的对象, 或是一个dom节点, 或是一个虚拟位置
 *
 * 相同的目标只能存在一个, BoundSize类型的target, 即使所有属性完全相同也会被视为不同的target
 * */
export type TriggerTarget = TriggerTargetMeta | HTMLElement | BoundSize;

/**
 * 包含额外信息的触发目标
 * */
export interface TriggerTargetMeta {
  /** 触发目标, 可以是一个dom节点或通过BoundSize表示的虚拟位置 */
  target: BoundSize | HTMLElement;
  /**
   * 0 | 层级, 层级较大的目标会覆盖较小目标的事件, 若最大层级包含多个target, 则这些target都会触发事件
   *
   * 通常只在target为虚拟位置时使用
   * */
  zIndex?: number;
  /** 控制active状态时, 光标的显示类型 */
  cursor?: string;
  /** 同创建时的同名配置, 可单独控制事件项的active事件行为 */
  active?: TriggerConfig["active"];
  /** 可在此存放一些跟target关联的信息, 并在Event中使用 */
  data?: any;
}

/** 创建配置 */
export interface TriggerConfig {
  /** 触发目标 */
  target?: TriggerTarget | TriggerTarget[];
  /** 需要绑定的事件类型 */
  type: TriggerType | TriggerType[];
  /** 事件绑定的代理节点, 在执行向上查找的操作是, 也作为查找的终止点, 若未传入, 则使用document节点 */
  container?: HTMLElement;
  /** active事件特有配置 */
  active?: {
    /** 80 | 触发延迟 */
    firstDelay?: number;
    /** 140 | 关闭延迟 */
    lastDelay?: number;
  };
  /** 事件触发前进行预校验, 返回false时阻止触发 */
  preCheck?: (type: TriggerType, e: Event) => boolean;
}

/**
 * 支持的事件类型
 * - 在触控设备上, 会自动添加css到目标dom并使用preventEvent来阻止一些默认行为
 * */
export enum TriggerType {
  /** 点击 */
  click = "click",
  /**
   * 根据不同的事件源, 触发方式不同:
   * - 支持光标的设备, 在鼠标悬浮时触发
   * - 支持touch的设备, 按住并轻微移动后触发
   *
   * 默认在开始和结束都包含了短暂的延迟, 开始延迟在某些提示类组件快速划过时可以避免触发, 结束延迟可以在气泡渲染等场景下在鼠标移动到内容区前避免关闭
   * */
  active = "active",
  /** 获取焦点和失去焦点, 仅dom类型的target有效 */
  focus = "focus",
  /** 通常是鼠标的右键点击, 在移动设备按下一段时间后触发 */
  contextMenu = "contextMenu",
  /** 光标或触摸点在目标上方移动 */
  move = "move",
  /** 目标拖动 */
  drag = "drag",
}

export type TriggerTypeKeys = keyof typeof TriggerType;

export type TriggerTypeUnion = TriggerTypeKeys | TriggerType;

export interface TriggerInstance {
  /** (可写) | 事件类型 */
  type: TriggerType | TriggerType[];

  /** (可写) | 是否启用 */
  enable: boolean; // 设置为false时, 要关闭现有事件

  /** (可写) | 设置光标类型 */
  cursor: string;

  /** 是否正在拖拽中 */
  dragging: boolean;

  /** 当前是否有active节点 */
  activating: boolean;

  /** 新增target */
  add(target: TriggerTarget | TriggerTarget[]): void;

  /** 移除指定的target */
  delete(target: TriggerTarget | TriggerTarget[]): void;

  /** 清空target */
  clear(): void;

  /** 事件目标总数 */
  size(): number;

  /** 销毁实例 */
  destroy(): void;

  /** 检测指定点是否有事件目标 */
  hasTargetByXY(x: number, y: number, triggerTarget?: HTMLElement): boolean;

  /** 获取指定点上的事件目标, 传入zIndexCheck时会根据覆盖关系获取 */
  getTargetByXY(x: number, y: number, zIndexCheck?: boolean): TriggerTarget[];

  getTargetByXY(opt: {
    x: number;
    y: number;
    /** 是否检测目标的zIndex */
    zIndexCheck?: boolean;
    /** triggerTarget是target本身或其子级dom时才会获取 */
    triggerTarget?: HTMLElement;
  }): TriggerTarget[];

  /** 事件订阅*/
  event: CustomEvent<TriggerListener>;
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
  /** 事件的触发目标 */
  target: TriggerTarget;
  /** 与TriggerTargetMeta.data相同 */
  data: any;

  /* # # # # # # # 通用, 在某些事件下可能为0, 比如focus/move事件结束等 # # # # # # # */

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
  isInteractiveFocus: boolean;

  /* # # # # # # # drag # # # # # # # */

  /** 总的移动距离 */
  movementX: number;
  movementY: number;

  /* # # # # # # # drag & move # # # # # # # */

  /** 相对上一次的移动距离 */
  deltaX: number;
  deltaY: number;

  [key: string]: any;
}

// 记录move&active的一些信息
export interface _MoveActiveRecord {
  /** 最后的位置 */
  clientX: number;
  clientY: number;
  /** 是否已触发了active */
  isActivating: boolean;
  /** 延迟开启计时器 */
  delayTimer?: any;
  delayLeaveTimer?: any;
  /** 当前项 */
  target: TriggerTarget;
  /** target对应的meta配置 */
  meta: TriggerTargetMeta;
}

// 记录drag的一些信息
export interface _DragRecord {
  /** 最后的位置 */
  clientX: number;
  clientY: number;
  /** 最后的offset */
  offsetX: number;
  offsetY: number;
  /** 记录的总移动距离 */
  movementX: number;
  movementY: number;
  /** 事件目标 */
  target: TriggerTarget;
  /** 其他信息 */
  data: _TriggerTargetData;
}

export interface _TriggerContext {
  /** 接收的配置 */
  config: TriggerConfig;
  /** 存放所有事件 */
  eventMap: Map<TriggerTarget, _TriggerTargetData>;
  /** eventMap.values的快照, 每次eventMap变更时更新 */
  targetList: _TriggerTargetData[];
  /** 尚未初始化完成的trigger */
  trigger: TriggerInstance;
  /** 经过处理后的container, 若为设置则时document对象 */
  container: HTMLElement;
  /** 事件类型 */
  type: TriggerType[];
  /** 是否启用 */
  enable: boolean;
  /** 拖动中 */
  dragging: boolean;
  /** 是否有active事件正在触发 */
  activating: boolean;
  /** 用于便捷的检测对应类型事件是否启用 */
  typeEnableMap: Record<string, boolean | void>;
  /** 当前focus的节点 */
  currentFocus: _TriggerTargetData[];
  /** 记录move项 */
  moveRecord: Map<TriggerTarget, _MoveActiveRecord>;
  /** 记录active项 */
  activeRecord: Map<TriggerTarget, _MoveActiveRecord>;
  /** 记录drag项 */
  dragRecord: Map<TriggerTarget, _DragRecord>;
  /** event实现对外暴露的内容 */
  event: ReturnType<typeof _eventImpl>;

  /** 清理尚未结束的事件, 会将key为true的事件未完成的事件结束 */
  clearPending: (conf: Record<string, boolean>) => void;

  /** 清理所有未完成的事件 */
  clearAllPending: () => void;

  /** getTargetByXY但是获取_TriggerTargetData */
  getTargetDataByXY: (
    x: number,
    y: number,
    zIndexCheck?: boolean,
    triggerTarget?: HTMLElement
  ) => _TriggerTargetData[];
}

/** 仅处理后的TriggerTarget */
export interface _TriggerTargetData {
  /** 根据传入TriggerTarget组合成的meta */
  meta: TriggerTargetMeta;
  /** 若为true, 表示该项target是一个虚拟位置, 否则target为dom节点 */
  isBound: boolean;
  /** 该项的位置 */
  bound: BoundSize;
  /** 事件目标dom, isBound为false时可用 */
  dom: HTMLElement;
  /** 原始项, 可作为key使用 */
  origin: TriggerTarget;
}
