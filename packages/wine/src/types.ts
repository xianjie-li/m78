import React, { MutableRefObject, RefObject } from "react";
import { PickAnimated, SpringRef, SpringValues } from "react-spring";
import { SetState } from "@m78/hooks";
import { TupleNumber, Bound } from "@m78/utils";
import { DEFAULT_PROPS } from "./consts.js";
import type { RenderApiComponentProps } from "@m78/render-api";

/**
 * wine接收的state
 * */
export interface WineState
  extends RenderApiComponentProps<WineState, WineInstance> {
  /** 内容 */
  content: React.ReactNode;

  /* ##### 顶栏配置 ##### */
  /** 顶栏显示内容 */
  header?: React.ReactNode;
  /** 完全自定义顶栏，需要确保将props展开到header根节点上, .eg (<div {...props} className="myHeader" />) */
  headerCustomer?: (
    props: any,
    state: WineState,
    instance: WineInstance,
    isFull: boolean
  ) => React.ReactNode;

  /* ##### 位置、尺寸 ##### */
  /** [0.5, 0.5] | 弹窗在屏幕上的位置, 取值为0 ~ 1 */
  alignment?: TupleNumber;
  /** 0.84 | 以浏览器窗口大小的一定比例来设置一个适合的窗口尺寸, 取值为0 ~ 1 */
  sizeRatio?: number;
  /** 宽度, 会覆盖sizeRatio对应方向的配置 */
  width?: number;
  /** 高度, 会覆盖sizeRatio对应方向的配置 */
  height?: number;
  /** WineBound.safeArea | 设置可拖动区域的类型 */
  bound?: WineBound;
  /** 根据此限定对象进行屏幕可用边界修正, 影响全屏窗口大小和自动调整窗口大小的各种操作 */
  limitBound?: Partial<Bound>;
  /** 初始化时最大化显示 */
  initFull?: boolean;

  /* ##### 其他 #####  */
  /** 根节点额外类名 */
  className?: string;
  /** 根节点额外样式 */
  style?: React.CSSProperties;
  /** 1000 | zIndex层级 */
  zIndex?: number;

  /* ##### 事件 #####  */
  /** 置顶/活动事件 */
  onActive?: () => void;
}

/** 对外扩展的实例属性和方法 */
export interface WineInstance {
  /** 对应的html节点 */
  el: RefObject<HTMLElement>;
  /** 置顶 */
  top: () => void;
  /** 最大化 */
  full: () => void;
  /** 重置大小 */
  resize: () => void;
  /** 刷新节点(渲染的组件会被卸载并重绘) */
  refresh: () => void;
  /** 将窗口设置到指定的预设位置 */
  setPresetPosition: (pos: WineDragPosition) => void;
  /** 一些内部使用的实例变量，某些复杂场景可能会用到 */
  meta: WineSelf;
}

/** 描述可拖动范围 */
export enum WineBound {
  /** 窗口范围内 */
  window = "window",
  /** 安全区域内, 确保不会因为误操作导致无法拖动 */
  safeArea = "safeArea",
  /** 不限制 */
  noLimit = "noLimit",
}

/** 描述可拖动控制大小的方向和可快速布局的位置 */
export enum WineDragPosition {
  L,
  T,
  R,
  B,
  LT,
  RT,
  RB,
  LB,
}

/** 内部实例属性 */
export interface WineSelf {
  /** y轴位置，从动画中同步 */
  x: number;
  /** x轴位置，从动画中同步 */
  y: number;
  /** 窗口尺寸信息 */
  winSize: TupleNumber;
  /** 窗口内可用的x/y */
  availableSize: TupleNumber;
  /** 全屏大小 */
  fullSize: TupleNumber;
  /** 容器尺寸信息 */
  wrapSize: TupleNumber;
  /** 顶栏尺寸信息 */
  headerSize: TupleNumber;
  /** 各方向的最大可拖动区域 */
  bound: Bound;
  /** 在浏览器窗口的可用区域 (即使使用safeArea，依然会在其他地方用到windowBound, 所以单独将其抽离出来) */
  windowBound: Bound;
  /** 记录窗口位置尺寸等信息，全屏时设置，窗口大小切换时移除 */
  memoWrapSize?: TupleNumber;
  /** 最后的xy坐标 */
  memoXY?: TupleNumber;
  /** 用于resize提示的节点 */
  tipNode?: HTMLDivElement;
  /** 组件是否已卸载 */
  unmounted?: boolean;
}

/** 动画属性 */
export interface _WineAnimateProps {
  opacity?: number;
  x?: number;
  y?: number;
  width?: number | string;
  height?: number | string;

  [key: string]: any;
}

/** 在各个位置共享的上下文状态 */
export interface _WineContext {
  wrapElRef: MutableRefObject<HTMLDivElement>;
  headerElRef: MutableRefObject<HTMLDivElement>;
  dragLineRRef: MutableRefObject<HTMLDivElement>;
  dragLineLRef: MutableRefObject<HTMLDivElement>;
  dragLineBRef: MutableRefObject<HTMLDivElement>;
  dragLineTRef: MutableRefObject<HTMLDivElement>;
  dragLineLTRef: MutableRefObject<HTMLDivElement>;
  dragLineRTRef: MutableRefObject<HTMLDivElement>;
  dragLineRBRef: MutableRefObject<HTMLDivElement>;
  dragLineLBRef: MutableRefObject<HTMLDivElement>;

  state: WineState & typeof DEFAULT_PROPS;
  /**
   * 几个内部状态
   * */
  insideState: _WineInsideState;
  setInsideState: SetState<_WineInsideState>;
  self: WineSelf;
  spProps: SpringValues<PickAnimated<_WineAnimateProps>>;
  /** 更新动画 */
  spApi: SpringRef<_WineAnimateProps>;
}

/** wine内部状态 */
export interface _WineInsideState {
  /** 是否全屏, 应该在任何可能导致切换到非全屏状态的操作后还原此值 */
  isFull?: boolean;
  /** 是否置顶、活动 */
  isTop?: boolean;
  /** 顶栏高度，只在顶部与内置高度不同时设置 */
  headerHeight?: number;
  /** 用于手动重置节点 */
  refreshKey?: string;
  /** 窗口id, 整个生命周期保持变 */
  id: string;
}
