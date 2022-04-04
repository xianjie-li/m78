/** 基础动画配置 */
import { AnyObject, ComponentBasePropsWithAny } from '@lxjx/utils';
import React from 'react';
import { Primitives } from '@react-spring/web/dist/declarations/src/primitives';

interface Base extends ComponentBasePropsWithAny {
  /** true | 控制显示隐藏 */
  show?: boolean;
  /** true | 初始化时show为true时是否触发动画 */
  appear?: boolean;
  /**
   * 'div' | 包裹元素的tag类型, 可以将此组件作为类似div的常规容器使用
   * - 当为span等内联元素时transform不会生效，需要将其块类型设置为inner-block
   * */
  tag?: Primitives;
  /**
   * 接收除to、from外的所有react-spring动画配置, 用于对react-spring进行深度定制
   * - 可用来更改动画表现、设置事件回调、延迟和循环动画等
   * */
  springProps?: any;
  // /** ?执行某些`破坏性`(form和to被设置为和前一个值毫无关联的动画值)的动画时，可以设置此项来取消前一个动画造成的影响 */
  // reset?: boolean;
  /** 指向根节点的ref, 用于直接操作根节点 */
  innerRef?: any;
  /** true | 初次渲染时，组件默认会以from状态先加载，为true时，只有在初次触发动画时才会加载组件 */
  mountOnEnter?: boolean;
  /** false | 默认情况下动画结束后组件依然会保持挂载，设置此属性会在过渡结束后卸载组件 */
  unmountOnExit?: boolean;
}

export enum TransitionType {
  fade = 'fade',
  zoom = 'zoom',
  punch = 'punch',
  slideLeft = 'slideLeft',
  slideRight = 'slideRight',
  slideTop = 'slideTop',
  slideBottom = 'slideBottom',
  bounce = 'bounce',
}

export type TransitionTypeKeys = keyof typeof TransitionType;

export type TransitionTypeUnion = TransitionType | TransitionTypeKeys;

/* 基础动画组件的类型 */
export interface TransitionBaseProps extends Base {
  /** 动画的入场状态 */
  to: AnyObject;
  /** 动画的离场状态 */
  from: AnyObject;
  /** 用于插值动画，在动画属性传递给动画元素前会将即将用于动画的style和当前的toggle状态传入并返回新的动画对象 */
  interpolater?: (props: any, toggle: boolean) => any;
  /** true | 执行完离场动画后对元素进行隐藏, 防止离场元素占用布局空间和触发事件 */
  changeVisible?: boolean;
  /** 常规内容或接收动画参数返回插值节点的函数 */
  children?: React.ReactNode | ((springStyle: any) => React.ReactNode);
}

/* 预置组件的类型 */
export interface TransitionProps extends Base {
  /** 动画类型 */
  type: TransitionTypeUnion;
  /** true | 为所有类型的动画附加fade动画，使其视觉效果更平滑 */
  alpha?: boolean;
}

interface TransitionConfigItem {
  from: any;
  to: any;
  config?: any;
  // 关闭
  skipFade?: boolean;
  interpolater?: TransitionBaseProps['interpolater'];
}

export type _TransitionConfigsType = {
  [key in TransitionTypeKeys]: TransitionConfigItem;
};
