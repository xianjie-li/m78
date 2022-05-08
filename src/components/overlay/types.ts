import { AnyFunction, BoundSize, ComponentBaseProps, TupleNumber } from '@lxjx/utils';
import React from 'react';
import { SetFormState, SetState, UseMeasureBound, UseMountStateConfig } from '@lxjx/hooks';
import { RenderApiComponentProps } from '@m78/render-api';
import { useTrigger, UseTriggerConfig } from 'm78/hooks';
import { TransitionBaseProps, TransitionTypeUnion } from 'm78/transition';
import { SpringValues } from '@react-spring/core/dist/declarations/src/types';
import { SpringRef } from 'react-spring';
import { defaultProps, useOverlaysClickAway, useOverlaysMask } from './common';

/** 在使用api调用时所有应该剔除的props */
export const omitApiProps = [
  'defaultShow',
  'show',
  'onChange',
  'children',
  'childrenAsTarget',
  'triggerType',
  'onUpdate',
  'onDispose',
  'innerRef',
  'instanceRef',
] as const;

/** 创建api时需要排除的所有props类型 */
export type OverlayApiOmitKeys = typeof omitApiProps[number];

/** 可用的目标类型 */
export type OverlayTarget = BoundSize | React.RefObject<HTMLElement> | HTMLElement;

export enum OverlayDirection {
  topStart = 'topStart',
  top = 'top',
  topEnd = 'topEnd',
  leftStart = 'leftStart',
  left = 'left',
  leftEnd = 'leftEnd',
  bottomStart = 'bottomStart',
  bottom = 'bottom',
  bottomEnd = 'bottomEnd',
  rightStart = 'rightStart',
  right = 'right',
  rightEnd = 'rightEnd',
}

export type OverlayDirectionKeys = keyof typeof OverlayDirection;

/** 方向 */
export type OverlayDirectionUnion = OverlayDirection | OverlayDirectionKeys;

/** 自定义渲染器的参数 */
export interface OverlayCustomMeta {
  props: OverlayProps;
  show: boolean;
  setShow: SetFormState<boolean>;
}

/** overlay props */
export interface OverlayProps
  extends ComponentBaseProps,
    UseMountStateConfig,
    RenderApiComponentProps<OverlayProps, OverlayInstance> {
  /** 内容, 可以通过传入渲染器来便捷的进行一些显示控制操作 */
  content: React.ReactNode | ((meta: OverlayCustomMeta) => React.ReactNode);
  /**
   * 传入children时, 将其作为控制开关, 在非受控时会直接代理show的值，受控时通过onChange回传最新状态
   * children包含以下限制:
   * - children的渲染结果必须是一个正常的dom节点, 不能是文本等特殊节点
   * - 渲染的dom必须位于组件声明的位置, 即不能使用 ReactDOM.createPortal() 这类会更改渲染位置的api
   *
   * 通过设置childrenAsTarget, 可以将children渲染结果作为target使用, 实现挂载overlay到children的效果
   * */
  children?: React.ReactElement;
  /** 'click' | 设置了children来触发开关时, 配置触发方式 */
  triggerType?: UseTriggerConfig['type'];

  /**
   * ########## 显示控制/性能 ##########
   * - 除了defaultShow外, 还有继承至RenderApiComponentProps的show/onChange
   * - 以及继承至UseMountStateConfig的mountOnEnter/unmountOnExit用来控制overlay显示/未显示时的内容是否挂载
   * */
  /** 是否非受控显示 */
  defaultShow?: boolean;

  /**
   * ########## 位置 ##########
   * 设置位置有三种种方式:
   * - xy: 通过窗口绝对坐标直接定位
   * - alignment: 通过窗口相对坐标定位, 常用于modal等组件
   * - target: 通过dom或一个描述位置的对象定位, 常用于气泡类组件
   *
   * - 同时传入时, 会按这个顺序覆盖: xy > alignment > target (使用实例方法更新无此限制)
   * - 如果需要频繁更新位置, 请使用OverlayInstance, 直接在render节点频繁更新会非常影响性能
   * */
  /** 通过窗口绝对坐标直接定位 */
  xy?: TupleNumber;
  /**
   * 通过窗口相对坐标定位, 取值为 0 ~ 1
   * 例：[0.5, 0.5] -> 居中， [1, 0] -> 右上， [1, 1] -> 右下
   * */
  alignment?: TupleNumber;
  /**
   * 通过dom或一个描述位置的对象定位, 支持以下类型:
   * - BoundSize    一个描述位置和尺寸的对象,
   * - RefObject<HTMLElement> 一个包含了dom节点的ref对象
   * - HTMLElement  一个dom节点
   *
   * 此外, 可以通过childrenAsTarget来将children渲染的dom作为target, 这个特性对气泡组件定位非常有效
   * */
  target?: OverlayTarget;
  /** 将通过children获取到的节点作为target使用 */
  childrenAsTarget?: boolean;

  // ######## 其他 ########
  /** 1800 | overlay显示层级, 所有弹层层级应不低于/等于1000, 因为1000是m78约定的内容和弹层中间的层级, 用于放置mask等组件 */
  zIndex?: number;
  /** 'OVERLAY' | 自定义挂载点的命名空间, 不同命名空间的overlay将被挂载到不同的容器中 */
  namespace?: string;
  /** 是否启用mask */
  mask?: boolean;
  /** 透传给mask节点的任意props */
  maskProps?: any;
  /** true | 点击内容或触发区域外时是否关闭 */
  clickAwayClosable?: boolean;
  /** true | 存在多个开启了clickAwayClosable的overlay时, 如果启用此项, 每次触发会逐个关闭而不是一次性全部关闭 */
  clickAwayQueue?: boolean;
  /** true | 出现时是否锁定滚动条 */
  lockScroll?: boolean;
  /** 获取内部wrap dom的ref */
  innerRef?: React.Ref<HTMLDivElement>;
  /**
   * 0 | 气泡的偏移位置, 如果包含arrow, 偏移 = offset + 箭头高度 + 4 , 其中4为补白
   * - 未设置direction时offset无效
   * - 通过children + active模式控制开关时, 过大的offset会影响触发体验
   * */
  offset?: number;
  /** 禁用 */
  disabled?: boolean;
  /** true | 弹层出现时, 会自动获取焦点, 便于后续的tab控制, 如果不需要此行为可通过传入false关闭 */
  autoFocus?: boolean;

  // ######## 动画 ########
  /** 'zoom' | 指定内置动画类型 */
  transitionType?: TransitionTypeUnion;
  /** 自定义进出场动画, 此项会覆盖transitionType配置 */
  transition?: Pick<TransitionBaseProps, 'to' | 'from'>;
  /**
   * 接收react-spring动画配置, 用于对react-spring进行深度定制, 传入to、from等内部占用配置无效
   * - 可用来更改动画表现、设置事件回调、延迟和循环动画等
   * */
  springProps?: any;

  // ######## 气泡 ########
  /** 挂载方向 */
  direction?: OverlayDirectionUnion;
  /** 显示箭头, 仅在指定了direction时生效 */
  arrow?: boolean;
  /** [36, 10] | 箭头尺寸 */
  arrowSize?: TupleNumber;
  /**
   * 透传给arrow节点的props, 可以通过此项来设置className/style等
   * 部分内部使用的属性会被忽略, 传入children来自定义svg节点, 用来添加边框, 阴影等
   * */
  arrowProps?: any;
}

/** overlay实例, 通过instanceRef或api用法使用 */
export interface OverlayInstance {
  /** 更新xy */
  updateXY(xy: TupleNumber, immediate?: boolean): void;

  /** 更新alignment */
  updateAlignment(alignment: TupleNumber, immediate?: boolean): void;

  /** 更新气泡目标 */
  updateTarget(target: OverlayTarget, immediate?: boolean): void;

  /** 以最后的更新类型刷新overlay定位 */
  update(immediate?: boolean): void;
}

/**
 * 通过api调用时的配置, 移除了一些非必要参数
 * */
export type OverlayRenderOption = Omit<OverlayProps, OverlayApiOmitKeys>;

/** 更新类型 */
export enum OverlayUpdateType {
  xy,
  alignment,
  target,
}

/** 多个部分间共享的状态 */
export interface _Context {
  show: boolean;
  setShow: AnyFunction;
  state: {
    /** 最后使用的方向 */
    lastDirection?: OverlayDirectionUnion;
    /** 所有滚动父级 */
    scrollParents: HTMLElement[];
  };
  setState: SetState<_Context['state']>;
  self: {
    /** 最后更新类型 */
    lastUpdateType?: OverlayUpdateType;
    /** 最后更新使用的xy, 无论是手动还是钩子更新, 都应提前更新此值然后以此值为基准触发update */
    lastXY: OverlayProps['xy'];
    /** 最后更新使用的alignment, 无论是手动还是钩子更新, 都应提前更新此值然后以此值为基准触发update */
    lastAlignment: OverlayProps['alignment'];
    /** 最后更新使用的target, 无论是手动还是钩子更新, 都应提前更新此值然后以此值为基准触发update */
    lastTarget: OverlayProps['target'];
    /** 内容区域是否处于活动状态 */
    activeContent: boolean;
    /** 内容节点是否已挂载 */
    contentExist: boolean;
    /** 由于active或focus时间触发关闭, 但是activeContent为true阻止关闭时, 设置此项为true来在合适的时机重新关闭 */
    shouldCloseFlag?: boolean;
    /** 触发shouldCloseFlag自动关闭的计时器, 在show状态更新时清理 */
    shouldCloseTimer?: any;
    /** 正在触发的active或focus的状态 */
    currentActiveStatus?: boolean;
  };
  /** 组件props */
  props: _MergeDefaultProps;
  /** 容器的ref */
  containerRef: React.MutableRefObject<HTMLDivElement>;
  sp: SpringValues<{ x: number; y: number; isHidden: boolean }>;
  spApi: SpringRef<{ x: number; y: number; isHidden: boolean }>;
  arrowSp: SpringValues<{ offset: number }>;
  arrowSpApi: SpringRef<{ offset: number }>;
  trigger: ReturnType<typeof useTrigger>;
  overlaysClickAway: ReturnType<typeof useOverlaysClickAway>;
  overlaysMask: ReturnType<typeof useOverlaysMask>;
  measure: UseMeasureBound;
}

/** 描述位置和该位置是否可用的对象 */
export interface _DirectionMeta {
  left: number;
  top: number;
  /** 该方向是否可用 */
  valid: boolean;
  direction: OverlayDirectionUnion;
}

export type _DirectionMetaMap = {
  [key in OverlayDirection]: _DirectionMeta;
};

/** 合并默认props的props, 避免确定已存在的属性访问出现类型错误 */
export type _MergeDefaultProps = OverlayProps & typeof defaultProps;

/** 箭头的基本位置信息 */
export interface _ArrowBasePosition {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  rotate: number;
}

/** 限制边界 */
export interface _ClampBound {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
