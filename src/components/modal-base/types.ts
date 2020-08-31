import { TransitionTypes } from '@lxjx/react-transition-spring';
import { ComponentBaseProps } from 'm78/types/types';
import React from 'react';

export type TupleNumber = [number, number];

export interface InstanceItem {
  id: string;
  meta: {
    mask: boolean;
    clickAwayClosable: boolean;
    namespace: string;
  };
}

/** 组件中共享的一组数据 */
export interface Share {
  cIndex: number;
  instances: InstanceItem[];
  show: boolean;
  mask: boolean;
  namespace: string;
  clickAwayClosable: boolean;
  contRef: React.MutableRefObject<HTMLDivElement>;
  alignment: TupleNumber;
  setPos: React.Dispatch<React.SetStateAction<number[]>>;
  refState: {
    show: boolean;
    maskShouldShow: boolean;
    shouldTriggerClose: boolean;
  };
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: ModalBaseProps['onClose'];
  triggerNode: ModalBaseProps['triggerNode'];
  lockScroll: boolean;
  modalSize: [number, number];
  props: ModalBaseProps;
}

export interface ModalBaseProps extends ComponentBaseProps {
  /** Modal要展示的内容 */
  children: React.ReactNode;
  /** 默认显示状态，与show同时使用时无效 */
  defaultShow?: boolean;
  /** 手动控制modal的显示/隐藏, 与onClose搭配作为受控模式使用 */
  show?: boolean;
  /** 显示状态发生改变时触发 */
  onChange?: (currentShow: boolean) => void;
  /** 可选, 传入一个占位节点来作为Modal的控制开关, 在非受控时会直接代理show的值，受控时通过onChange回传最新状态 */
  triggerNode?: React.ReactElement;
  /** MODAL' | 自定义挂载节点的明明空间 */
  namespace?: string;
  /** true | 是否显示遮罩 */
  mask?: boolean;
  /** 设置到mask节点上的className */
  maskClassName?: string;
  /** true | 点击内容区域以外是否关闭Modal */
  clickAwayClosable?: boolean;
  /** 'light' | mask主题色 */
  maskTheme?: 'dark' | 'light';
  /** [0.5, 0.5] | 指定x/y轴位置, 值为 -1 ~ 1, 例：[0.5, 0.5] -> 居中， [1, 0] -> 右上， [1, 1] -> 右下 */
  alignment?: TupleNumber;
  /** 动画类型, 默认从光标位置出现 */
  animationType?: TransitionTypes;
  /** true | 开启后内容会在Modal开启时才进行渲染，关闭后内容随Modal一起渲染, 并根据show状态决定是否显示 */
  mountOnEnter?: boolean;
  /** false | Modal关闭后是否卸载其内容 */
  unmountOnExit?: boolean;
  /** true | modal出现时锁定滚动条 */
  lockScroll?: boolean;
  /* ========== 以下api用于搭配render api使用, 通常不会直接使用 ========== */
  /** 通知关闭 */
  onClose?: () => void;
  /** 通常移除实例 */
  onRemove?: () => void;
  /** 800 | 指定onRemove的调用延迟 */
  onRemoveDelay?: number;
  /** 1800 | 基准zIndex值，默认为Modal层 */
  baseZIndex?: number;
}
