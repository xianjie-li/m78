import React from 'react';

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
 * 通过context检测子树
 * */

interface DragStatus {
  /* ####### 作为拖动元素时 ####### */
  /** 是否正在拖动 */
  dragging: boolean;
  /* ####### 作为拖动目标时 ####### */
  /** 是否有目标拖动到其上方 */
  dragOver: boolean;
  dragLeft: boolean;
  dragRight: boolean;
  dragBottom: boolean;
  dragTop: boolean;
  dragCenter: boolean;
}

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

interface DNDNode {
  // id?: string;
  groupId?: string;
  data?: any;
}

/** 基础拖动事件，只包含拖动目标 */
interface DragBaseEvent {
  /** 拖动目标 */
  source: DNDNode;
}

/** 带拖拽目标，可能包含放置目标、相对放置目标位置的拖动事件 */
interface DragPosEvent extends DragBaseEvent {
  /** 放置目标 */
  target?: DNDNode;
  /** 相对于目标左上角的x坐标 */
  offsetX?: number;
  /** 相对于目标左上角的y坐标 */
  offsetY?: number;
  /** 目标距文档左上角x轴坐标 */
  x: number;
  /** 目标距文档左上角y轴坐标 */
  y: number;
}

/** 包含拖拽目标、放置目标、位置的完整事件 */
interface DragFullEvent extends Required<DragPosEvent> {}

/** 监听内部所有的所有未被其他Context接管的DND的拖动开始、移动、接收事件 */
interface DNDContext {
  /** 拖动开始 */
  onStart?: (event: DragPosEvent) => void;
  /** 拖动过程中持续触发 */
  onMove?: (event: DragPosEvent) => void;
  /** 成功拖动到目标后触发 */
  onAccept?: (event: DragFullEvent) => void;
}

interface DNDProps {
  enableDrag?: boolean;
  enableDrop?: boolean;
  // /** 标识当前拖动元素的唯一id */
  // id?: string;
  /** 只有id相同的DND会触发互动行为 */
  groupId: string;
  /** 绑定到该拖动目标的数据，随拖动目标一起传入 */
  data?: any;
  /**
   * 用于绑定拖动元素的dragProps
   * 包含5个方向上的拖动信息和是否位于元素上信息
   * 拖动信息
   * */
  children: (bonus: DragBonus) => React.ReactNode;
  /** 拖动时显示的节点, 可以获取到节点尺寸等信息 */
  feedback?: (bonus: DragBonus) => React.ReactNode;
  /** 拖动时显示在指针下方的元素, 可以获取到节点尺寸等信息 */
  dragFeedback?: React.ReactNode;
  /** 长按时才允许拖动 */
  longPress?: boolean;

  /* ####### 拖动事件 ####### */
  /** 开始拖动的第一帧触发 */
  onDrag?: (event: DragPosEvent) => void;
  /** 开始拖动并移动, 第一帧时不触发 */
  onMove?: (event: DragPosEvent) => void;
  /** 拖动结束但是未拖动到目标 */
  onCancel?: (event: DragPosEvent) => void;
  /** 拖动到目标并放置, 传入data、位置等 */
  onDrop?: (event: DragFullEvent) => void;

  /* ####### 作为拖动目标的事件 ####### */
  /** 拖动目标在上方移动时，传入位置信息 */
  onTargetMove?: (event: DragFullEvent) => void;
  onTargetEnter?: (event: DragFullEvent) => void;
  onTargetLeave?: (event: DragFullEvent) => void;
  onTargetAccept?: (event: DragFullEvent) => void;

  /** 拖动时阻止互动 */
  preventDefault?: boolean;
  /** 禁用拖放 */
  disabled?: boolean;
  /**
   * 允许放置的位置
   * - 为对象时，只有对象中指定为true的位置支持放置
   * - 为true时，只要位于元素上方即可触发放置行为
   * */
  allowPosition?:
    | boolean
    | {
        left?: boolean;
        right?: boolean;
        bottom?: boolean;
        top?: boolean;
        center?: boolean;
      };
}
