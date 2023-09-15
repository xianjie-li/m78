/* # # # # # # # # # # # # # # # # #
 * - 对于被拖动原始, 称为拖动点/拖动节点
 * - 对于放置拖动原始的目标, 称为放置点
 * # # # # # # # # # # # # # # # # # */

import React from "react";
import { Bound, TupleNumber } from "@m78/utils";
import { SetState } from "@m78/hooks";
import { SpringRef } from "react-spring";

/** 表示一个DND实例作为拖动点、放置点时的相关状态 */
export interface DNDStatus extends DNDPosition {
  /* # # # # # # # 作为拖动元素时 # # # # # # # */
  /** 是否正在拖动 */
  dragging: boolean;
  /* # # # # # # # 作为放置目标时 # # # # # # # */
  /** 当拖动节点位于上方时 */
  over: boolean;
  /** 未处于拖动或放置状态 */
  regular: boolean;
  /** 有节点正在拖动, 为了避免不必要的更新, 仅开启了props.draggingListen的DND节点会更新此状态 */
  hasDragging: boolean;
}

/** DND组件的render children接收对象 */
export interface DNDRenderProps {
  /** 传递给拖动目标的ref */
  ref: React.MutableRefObject<any>;
  /** 传递给拖动把手的ref, 只在需要单独绑定拖动位置的时候使用 */
  handleRef: React.MutableRefObject<any>;
  /** 拖动状态 */
  status: DNDStatus;
  /** 放置点的启用信息 */
  enables: DNDEnableInfos;
}

/** 表示一个唯一的DND节点 */
export interface DNDNode<Data = any> {
  /** 该项的id */
  id: string;
  /** 该项的data */
  data: Data;
}

/** DND事件通用对象, 部分信息只存在于拖动点位于放置点上方时 */
export interface DNDPartialEvent<Data = any> {
  /** 拖动目标 */
  source: DNDNode<Data>;
  /** 目标距文档左上角x轴坐标 */
  x: number;
  /** 目标距文档左上角y轴坐标 */
  y: number;
  /** 放置目标 */
  target?: DNDNode<Data>;
  /** 当前的位置状态 */
  status?: DNDStatus;
}

/** 包含了放置点相关信息的完整事件对象 */
export type DNDFullEvent<Data = any> = Required<DNDPartialEvent<Data>>;

/**
 * 放置的位置是否可用
 * */
export interface DNDPosition {
  left: boolean;
  right: boolean;
  bottom: boolean;
  top: boolean;
  center: boolean;
}

/**
 * 放置的位置是否可用
 * */
export interface DNDEnableInfos extends DNDPosition {
  /** 至少有一个方向启用 */
  enable: boolean;
  /** 任意方向都可放置 */
  all: boolean;
}

/** 放置目标允许放置的位置 */
type DNDMixAllowDrop = boolean | Partial<DNDPosition>;

export interface DNDProps<Data = any> {
  /* # # # # # # # 常用 # # # # # # # */
  /** 绑定到该拖动/放置目标的数据，会在目标拖动、放置等操作中传递，通常是能表示该DND实例的唯一值(索引、id、数据对象等) */
  data: Data;
  /**
   * 用于绑定拖动元素的render children, 接收用于绑定拖动点的ref, 启用信息, 放置点信息等 */
  children: (props: DNDRenderProps) => React.ReactElement;
  /** 是否可拖动，可以是返回状态的函数, 接收当前节点 */
  enableDrag?: boolean | ((node: DNDNode<Data>) => boolean);
  /**
   * 是否可放置，可以是返回此状态的函数, 接收当前的拖动和放置目标
   * - 值为boolean时，true表示任意位置都可放置，false表示任意位置都不可放置, 作为对象时, 所有方向默认值都为false
   * */
  enableDrop?:
    | DNDMixAllowDrop
    | ((meta: {
        current: DNDNode<Data>;
        source: DNDNode<Data>;
      }) => DNDMixAllowDrop);
  /** 对dnd进行分组, 只有同组的dnd可以互相拖动, 不传groupId的dnd均在一个默认分组中 */
  group?: string;

  /* # # # # # # # 作为放置点的事件 # # # # # # # */
  /** 拖动节点进入时 */
  onSourceEnter?: (event: DNDFullEvent<Data>) => void;
  /** 拖动节点离开时 */
  onSourceLeave?: (event: DNDPartialEvent<Data>) => void;
  /** 拖动节点在上方移动时 */
  onSourceMove?: (event: DNDFullEvent<Data>) => void;
  /** 成功接收到一个拖动节点时 */
  onSourceAccept?: (event: DNDFullEvent<Data>) => void;

  /* # # # # # # # 作为拖动点的事件 # # # # # # # */
  /** 开始拖动时触发 */
  onDrag?: (event: DNDPartialEvent<Data>) => void;
  /** 开始拖动并移动, 如果在放置点上移动，事件对象会包含target */
  onMove?: (event: DNDPartialEvent<Data>) => void;
  /** 已经开始拖动并放开拖动点, 如果在放置点上放开，事件对象会包含target等信息 */
  onDrop?: (event: DNDPartialEvent<Data>) => void;

  /* # # # # # # # 杂项 # # # # # # # */
  /** 拖动时显示在指针下方的dom节点 */
  feedback?: () => HTMLElement;
  /** 拖动反馈节点的基础样式 */
  feedbackStyle?: React.CSSProperties;
  /**
   * 额外添加要禁止触发拖动的元素, 返回true表示禁止拖动
   * - 默认情况下，会禁止tagName为INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO的元素或设置了contenteditable的元素
   * */
  ignore?: (el: HTMLElement) => boolean;
  /** 启用后, 该DND节点会触发 DNDStatus.hasDragging 变更 */
  draggingListen?: boolean;
}

/** 内部共享的状态 */
export interface _Context {
  state: {
    /** 拖动状态 */
    status: DNDStatus;
    /** 放置点的启用信息 */
    enables: DNDEnableInfos;
    /** 用于拖动的实际节点, 可能是dnd容器, 也可以能自定义拖动把手 */
    dragEl?: HTMLElement;
  };
  setState: SetState<_Context["state"]>;
  self: {
    /** 记录最后触发onEnter的dnd, 用于实现onSourceLeave  */
    lastEntryDND?: _DNDMapEntry;
    /** 用于防止groupID变更 */
    lastGroupId?: string;
    /** 反馈节点 */
    feedbackEl?: HTMLElement | null;
    /** 反馈节点初始化时的offset(相对节点左上角偏移) */
    feedbackInitOffset?: TupleNumber;
  };
  /** 拖动容器节点ref */
  dragNodeRef: React.MutableRefObject<HTMLElement | undefined>;
  /** 拖动把手ref */
  handleRef: React.MutableRefObject<HTMLElement | undefined>;
  /** 存储当前组dnd的上下文 */
  group: _GroupState;
  /** 当前dnd唯一id */
  id: string;
  /** 当前节点 */
  node: DNDNode;
  /** 组件接收的原始props */
  props: DNDProps;
  /** 当前节点层级 */
  level: number;
  /** 组件挂载时间 */
  mountTime: number;
  /** 反馈节点动画控制 */
  feedbackSpApi: SpringRef<{ x: number; y: number }>;
}

/** dndMap的一项, 表示的dnd的位置, 尺寸, 可见性等 */
export interface _DNDMapEntry extends Bound {
  node: DNDNode;
  /** 是否可见 */
  visible: boolean;
  /** 组件的接收的原始props */
  props: DNDProps;
  /** 组件的共享上下文数据 */
  ctx: _Context;
}

/** 存储当前组dnd的状态 */
export interface _GroupState {
  /** 所有DND的滚动父级 */
  scrollParents: HTMLElement[];
  /** 所有DND的位置信息, 在开始拖动和拖动中(间歇)进行更新 */
  dndMap: {
    [key: string]: _DNDMapEntry;
  };
}

/** 用于为dnd标记层级关系的context */
export interface _LevelContext {
  /** 所属层级 */
  level: number;
  /** 是否是默认context */
  isDefault: boolean;
}

/** 表示已经过启用和触发检测, 待下一步处理的dnd放置节点 */
export type _PendingItem = Omit<DNDRenderProps, "ref" | "handleRef"> & {
  dnd: _DNDMapEntry;
};

/** 在多个滚动帮助函数间共享 */
export interface _AutoScrollCtx {
  /** 是否按下 */
  autoScrollDown: boolean;
  /** 自动滚动的开关 */
  autoScrollToggle: boolean;
  /** 要设置的key */
  autoScrollPosKey: "scrollLeft" | "scrollTop";
  /** 每次滚动距离 */
  autoScrollVal: number;
  /** 增加还是减少 1增加 2减少 */
  autoScrollType: 1 | 2;
}
