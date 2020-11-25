import React from 'react';

interface DragContextProps {}

/*
 * 只有id对应的才触发事件
 * 便捷的方向识别(上下左右中心)， 启用方向
 * 自动滚动
 * 是否启用
 * 指定把手
 * 无入侵
 * 拖动到拖动目标、拖动到放置目标
 * 占位符
 * */

interface DroppableProps {}

interface DragStatus {
  /* ####### 作为拖动元素时 ####### */
  /** 是否正在拖动 */
  dragging?: boolean;
  /* ####### 作为拖动目标时 ####### */
  /** 是否有目标拖动到其上方 */
  dragOver?: boolean;
  dragLeft?: boolean;
  dragRight?: boolean;
  dragBottom?: boolean;
  dragTop?: boolean;
}

interface DragBonus {
  /** 传递给拖动目标的ref */
  innerRef?: React.Ref<any>;
  /** 传递给拖动把手的ref, 未在此项上获取到节点时，会以innerRef作为拖动节点 */
  handleRef?: React.Ref<any>;
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
  id?: string;
  groupId?: string;
  data?: any;
}

interface DragEvent {
  /** 拖动到的目标 */
  target?: DNDNode;
  /** 拖动的来源 */
  source?: DNDNode;
}

interface DNDContext {
  onTargetMove: () => void;
  onTargetEnter: () => void;
  onTargetLeave: () => void;
  onTargetAccept: () => void;
}

interface DNDProps {
  /** 标识当前拖动元素的唯一id */
  id?: string;
  /** 只有id相同的DND会触发互动行为 */
  groupId?: string;
  /** 绑定到该拖动目标的数据，随拖动目标一起传入 */
  data?: any;
  /**
   * 用于绑定拖动元素的dragProps
   * 包含5个方向上的拖动信息和是否位于元素上信息
   * 拖动信息
   * */
  children: (bonus: any) => React.ReactNode;
  /** 拖动时显示的节点, 可以获取到节点尺寸等信息 */
  feedback: (bonus: any) => React.ReactNode;
  /** 拖动时显示在指针下方的元素, 可以获取到节点尺寸等信息 */
  dragFeedback: React.ReactNode;
  /** 长按时才允许拖动 */
  longPress: boolean;

  /* ####### 拖动事件 ####### */
  /** 开始拖动的第一帧触发 */
  onDrag: () => void;
  /** 开始拖动并移动, 第一帧时不触发 */
  onMove: () => void;
  /** 拖动结束但是未拖动到目标 */
  onCancel: () => void;
  /** 拖动到目标并放置, 传入data、位置等 */
  onDrop: () => void;

  /* ####### 作为拖动目标的事件 ####### */
  /** 拖动目标在上方移动时，传入位置信息 */
  onTargetMove: () => void;
  onTargetEnter: () => void;
  onTargetLeave: () => void;
  onTargetAccept: () => void;

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
