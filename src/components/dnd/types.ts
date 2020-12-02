import React from 'react';
import { SetState } from '@lxjx/hooks';
import { FullGestureState } from 'react-use-gesture/dist/types';

/* TODO: 可以简单的作为HTML5 drag的目标容器 */

/** 表示一个DND实例作为拖动目标、防止目标时的相关状态 */
export interface DragStatus {
  /* ####### 作为拖动元素时 ####### */
  /** 是否正在拖动 */
  dragging: boolean;
  /* ####### 作为放置目标时 ####### */
  /** 左侧有可用拖动目标 */
  dragLeft: boolean;
  /** 右侧有可用拖动目标 */
  dragRight: boolean;
  /** 下方有可用拖动目标 */
  dragBottom: boolean;
  /** 上方有可用拖动目标 */
  dragTop: boolean;
  /** 中间部分有可用拖动目标, 一般用于合并项 */
  dragCenter: boolean;
  /** 未指定其他特定的方向时，当拖动元素位于上方时此项为true */
  dragOver: boolean;
  /** 未处于拖动或放置状态 */
  regular: boolean;
}

/** DND组件的render children接收对象 */
export interface DragBonus {
  /** 传递给拖动目标的ref */
  innerRef: React.MutableRefObject<any>;
  /** 传递给拖动把手的ref, 未在此项上获取到节点时，会以innerRef作为拖动节点 */
  handleRef: React.MutableRefObject<any>;
  /** 拖动状态 */
  status: DragStatus;
  /** 允许放置的信息 */
  enables: EnableInfos;
}

/** 表示一个唯一的DND节点 */
export interface DNDNode<Data = any> {
  /** 该项的id */
  id: string;
  /** 该项的data */
  data: Data;
}

/** 仅包含部分必要信息的拖动事件对象，非必要信息会根据事件执行情况传入(通常是拖动到放置目标上时) */
export interface DragPartialEvent<Data = any, TData = Data> {
  /** 拖动目标 */
  source: DNDNode<Data>;
  /** 放置目标 */
  target?: DNDNode<TData>;
  /** 相对于目标左上角的x坐标 */
  offsetX?: number;
  /** 相对于目标左上角的y坐标 */
  offsetY?: number;
  /** 当前的位置状态 */
  status?: DragStatus;
  /** 目标距文档左上角x轴坐标 */
  x: number;
  /** 目标距文档左上角y轴坐标 */
  y: number;
}

/** 包含拖拽目标、放置目标、放置状态、位置等的完整事件对象 */
export interface DragFullEvent<Data = any, TData = Data>
  extends Required<DragPartialEvent<Data, TData>> {}

/** 响应某个DND拖动的事件 */
export interface ChangeHandle {
  // 传入isCancel时，表示这是一个取消事件，只进行状态还原
  (dragE: FullGestureState<'drag'>, isCancel?: boolean): void;
}

/** 监听内部所有的所有未被其他Context接管的DND的拖动开始、移动、接收事件 */
export interface DNDContextProps {
  /** 拖动开始 */
  onStart?: (event: DragPartialEvent) => void;
  /** 拖动过程中持续触发 */
  onMove?: (event: DragPartialEvent) => void;
  /** 成功拖动到目标后触发 */
  onAccept?: (event: DragFullEvent) => void;
}

/** 内部使用的完整context对象 */
export interface DNDContextValue extends Required<DNDContextProps> {
  /** 所有子DND实例的changeHandle挂载位置 */
  listeners: {
    handler: ChangeHandle;
    id: string;
  }[];
  /** 所有被监听的滚动父级 */
  scrollerList: any[];
  /** 当前拖动目标 */
  currentSource?: DNDNode;
  /** 当前放置目标 */
  currentTarget?: DNDNode;
  /** 当前相对于目标左上角的x坐标 */
  currentOffsetX?: number;
  /** 当前相对于目标左上角的y坐标 */
  currentOffsetY?: number;
  /** 当前拖动位置状态 */
  currentStatus?: DragStatus;
}

/** 用于关联父子关系的Context对象  */
export interface DNDRelationContext {
  /** 用于某个子级触发over时，通知所有父级移除自身的lockDropID */
  onLockDrop?: () => void;
  /** 锁定状态发生改变 */
  onLockChange?: (lock: boolean) => void;
  /** 该组件的所有子级id */
  childrens: string[];
}

/**
 * 放置目标允许放置的位置
 * */
export interface AllowPosition {
  left: boolean;
  right: boolean;
  bottom: boolean;
  top: boolean;
  center: boolean;
}

/**
 * 可用防止位置位置信息
 * */
export interface EnableInfos extends AllowPosition {
  /** 至少有一个方向启用 */
  enable: boolean;
  /** 任意方向都可放置，设置后其他方向配置值都会为false */
  all: boolean;
}

/**
 * 放置目标允许放置的位置，值为boolean时，true表示任意位置都可放置，false表示任意位置都不可放置
 * */
type MixAllowDrop = boolean | Partial<AllowPosition>;

export interface DNDProps<Data = any, TData = Data> {
  /* ####### 常用 ####### */
  /** 绑定到该拖动/放置目标的数据，会在目标拖动、放置等操作中传递，通常是能表示该DND实例的唯一值(索引、id、描述对象等) */
  data: Data;
  /**
   * 用于绑定拖动元素的render children, 接收:
   * - 拖放元素、拖动把手的ref(默认为拖放元素)
   * - 拖动中、当前拖动位置、是否正被拖动元素覆盖等
   * - 某个方向上的启用信息等
   * */
  children: (bonus: DragBonus) => React.ReactElement;
  /** 是否可拖动，可以是返回此状态的函数, 接收当前节点 */
  enableDrag?: boolean | ((node: DNDNode<Data>) => boolean);
  /** 是否可放置，可以是返回此状态的函数, 接收当前的拖动和放置目标 */
  enableDrop?:
    | MixAllowDrop
    | ((dragNode?: DNDNode<Data>, dropNode?: DNDNode<TData>) => MixAllowDrop);

  /* ####### 作为放置目标的事件 ####### */
  /** 拖动目标进入时 */
  onSourceEnter?: (event: DragFullEvent<Data, TData>) => void;
  /** 拖动目标离开时 */
  onSourceLeave?: (event: DragPartialEvent<Data, TData>) => void;
  /** 拖动目标在上方移动时 */
  onSourceMove?: (event: DragFullEvent<Data, TData>) => void;
  /** 成功接收到一个拖动目标时 */
  onSourceAccept?: (event: DragFullEvent<Data, TData>) => void;

  /* ####### 作为拖动目标的事件 ####### */
  /** 开始拖动的第一帧触发 */
  onDrag?: (event: DragPartialEvent<Data, TData>) => void;
  /** 开始拖动并移动, 如果在放置目标上拖动，事件对象会包含target */
  onMove?: (event: DragPartialEvent<Data, TData>) => void;
  /** 已经开始拖动并放开目标, 如果在放置目标上放开，事件对象会包含target */
  onDrop?: (event: DragPartialEvent<Data, TData>) => void;

  /** 标识当前拖动元素的唯一id, 不传时组件内部会随机指定一个, 通常会在debug的时候使用 */
  id?: string;
  /** 拖动时显示在指针下方的元素 */
  dragFeedback?: React.ReactNode;
  /** 拖动反馈节点的基础样式 */
  dragFeedbackStyle?: React.CSSProperties;
  /**
   * 额外添加要禁止拖动的元素, 返回true表示禁止拖动
   * 默认情况下，会禁止 tagName为INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO的元素或设置了contenteditable的元素
   * */
  ignoreElFilter?: (el: HTMLElement) => boolean;
}

export interface Share {
  props: DNDProps;
  elRef: React.MutableRefObject<HTMLElement>;
  handleRef: React.MutableRefObject<HTMLElement | undefined>;
  status: DragStatus;
  setStatus: SetState<Share['status']>;
  self: {
    /** 保存拖拽过程中显示的反馈节点 */
    dragFeedbackEl: HTMLElement | null;
    /** 清理克隆节点的计时器 */
    clearCloneTimer: any;
    /** 保存在上一次事件中的dragOver状态 */
    lastOverStatus: boolean;
    /** 锁定并禁止drop */
    lockDrop?: boolean;
    /** 导致lockDrop锁定的节点id */
    lockDropID?: string | null;
    /** 组件已卸载，阻止某些延迟触发的状态更新 */
    ignore: boolean;
    /** 最后一次drag事件时指针位置是否位于拖动元素内部 */
    lastIsOverBetween?: boolean;
    /** 目标的第一个滚动父级 */
    firstScrollParent?: HTMLElement;
  };
  state: {
    /** 节点的挂载元素 */
    nodeEl: HTMLElement;
    /** 节点的拖拽元素, 默认为nodeEl */
    handleEl: null | HTMLElement;
  };
  setState: SetState<Share['state']>;
  id: string;
  ctx: DNDContextValue;
  relationCtx: DNDRelationContext;
  relationCtxValue: DNDRelationContext;
  /** 表示当前节实例的DND节点对象 */
  currentNode: DNDNode;
}
