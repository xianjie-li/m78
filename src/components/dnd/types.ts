import React from 'react';
import { SetState } from '@lxjx/hooks';
import { FullGestureState } from 'react-use-gesture/dist/types';

/*
 * 只有id对应的才触发事件
 * 便捷的方向识别(上下左右中心)， 启用方向
 * 自动滚动
 * 是否启用
 * 指定把手
 * 无入侵
 * 拖动到拖动目标、拖动到放置目标
 * 占位符
 * 冒泡机制，如果 DND内部包含其他DND，则内部DND触发时不会触发它的事件
 *
 * 通过context标识组
 *
 * 通过context检测子树, 当子树包含正在拖放的元素时，禁用该组件的拖动行为
 * */

/** 表示一个DND实例的拖动相关状态 */
export interface DragStatus {
  /* ####### 作为拖动元素时 ####### */
  /** 是否正在拖动 */
  dragging: boolean;
  /* ####### 作为放置目标时 ####### */
  /** 是否有目标拖动到其上方 */
  dragOver: boolean;
  dragLeft: boolean;
  dragRight: boolean;
  dragBottom: boolean;
  dragTop: boolean;
  dragCenter: boolean;
}

/** 传递给DND组件render children的对象 */
interface DragBonus {
  /** 传递给拖动目标的ref */
  innerRef: React.Ref<any>;
  /** 传递给拖动把手的ref, 未在此项上获取到节点时，会以innerRef作为拖动节点 */
  handleRef: React.Ref<any>;
  /** 拖动状态 */
  status: DragStatus;
  /** 扩展传递给目标元素的props */
  props: {
    /** 传递给组件的样式 */
    style: React.CSSProperties;
  };
  /** 作为拖动目标时，位于目标上方的拖动元素data */
  targetWith?: any;
  /** 作为拖动元素时，其正处于的目标元素上方的data */
  targetFor?: any;
}

/** 表示一个唯一的DND节点 */
export interface DNDNode {
  /** 该项的id */
  id: string;
  /** 该项的data */
  data: any;
}

/** 仅包含部分必要信息的拖动事件对象，非必要信息会根据事件执行情况传入(通常是拖动到放置目标上时) */
export interface DragPartialEvent {
  /** 拖动目标 */
  source: DNDNode;
  /** 放置目标 */
  target?: DNDNode;
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
export interface DragFullEvent extends Required<DragPartialEvent> {}

/** 响应某个DND拖动的事件 */
export interface ChangeHandle {
  (dragE: FullGestureState<'drag'>): void;
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
export interface DNDContext extends Required<DNDContextProps> {
  /** 所有子DND实例的changeHandle挂载位置 */
  listeners: {
    handler: ChangeHandle;
    id: string;
  }[];
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

/**
 * 放置目标允许放置的位置，值为boolean同时设置所有方向，否则表示对应方向，未设置的方向默认不可放置
 * */
export type AllowPosition =
  | boolean
  | {
      left?: boolean;
      right?: boolean;
      bottom?: boolean;
      top?: boolean;
      center?: boolean;
    };

export interface DNDProps<Data = any> {
  /** 绑定到该拖动/放置目标的数据，会在目标拖动、放置等行中传递，通常是能表示该DND实例的唯一值(索引、id、描述对象等) */
  data: Data;
  /**
   * 用于绑定拖动元素的dragProps
   * 包含5个方向上的拖动信息和是否位于元素上信息
   * 拖动信息
   * */
  children: (bonus: DragBonus) => React.ReactElement;
  /** 拖动时显示的节点, 可以获取到节点尺寸等信息 */
  feedback?: (bonus: DragBonus) => React.ReactNode;
  /** 拖动时显示在指针下方的元素, 可以获取到节点尺寸等信息 */
  dragFeedback?: React.ReactNode;

  /* ####### 作为拖动目标的事件 ####### */
  /** 开始拖动的第一帧触发 */
  onDrag?: (event: DragPartialEvent) => void;
  /** 开始拖动并移动, 如果在放置目标上拖动，会传入偏移位置、放置目标信息 */
  onMove?: (event: DragPartialEvent) => void;
  /** 拖动结束但是未拖动到目标 */
  onCancel?: (event: DragPartialEvent) => void;
  /** 拖动到目标并放置, 传入data、位置等 */
  onDrop?: (event: DragFullEvent) => void;

  /* ####### 作为放置目标的事件 ####### */
  /** 拖动目标进入时 */
  onSourceEnter?: (event: DragFullEvent) => void;
  /** 拖动目标离开时 */
  onSourceLeave?: (event: DragPartialEvent) => void;
  /** 拖动目标在上方移动时 */
  onSourceMove?: (event: DragFullEvent) => void;
  /** 成功接收到一个拖动目标时 */
  onSourceAccept?: (event: DragFullEvent) => void;

  /** 禁用拖放 */
  disabled?: boolean;
  /** 是否可拖动，可以是返回此状态的函数 */
  enableDrag?: boolean | (() => boolean);
  /** 是否可放置，可以是返回此状态的函数 */
  enableDrop?: AllowPosition | (() => AllowPosition);

  /** 长按时才允许拖动 */
  longPress?: boolean;
  /** 拖动时阻止互动 */
  preventDefault?: boolean;
  /** 标识当前拖动元素的唯一id, 不传时组件内部会随机指定一个 */
  id?: string;
}

export interface Share {
  props: DNDProps;
  elRef: React.MutableRefObject<HTMLElement>;
  status: DragStatus;
  setStatus: SetState<Share['status']>;
  self: {
    /** 保存克隆节点 */
    cloneNode: HTMLElement | null;
    /** 清理克隆节点的计时器 */
    clearCloneTimer: any;
    /** 保存在上一次事件中的dragOver状态 */
    lastOverStatus: boolean;
  };
  id: string;
  ctx: DNDContext;
  /** 表示当前节实例的DND节点对象 */
  currentNode: DNDNode;
}
