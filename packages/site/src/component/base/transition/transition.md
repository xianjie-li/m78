---
title: Transition - 过渡动画
group:
  title: 基础组件
  path: /base
---

# Transition

提供开箱即用的动画支持

> 适合切换类的动画, 对于包含复杂交互并且包含两个以上动画阶段的动画应使用 react-spring 等动画库

## 内置动画

<code src="./builtIn.tsx"></code>

## 定制动画

使用`TransitionBase`来简单的实现各种自定义动画, 可以通过`interpolater`prop 或 render children 来进行更为强大的插值动画

<code src="./custom.tsx"></code>

## 动画配置

动画配置, 可用于配置动画表现、行为、添加动画回调钩子等, 更多细节请参考[react-spring](https://www.react-spring.io/)

<code src="./config.tsx"></code>

## API

```tsx | pure
/**
 * 内置动画类型
 * */
export enum TransitionType {
  fade = "fade",
  zoom = "zoom",
  punch = "punch",
  slideLeft = "slideLeft",
  slideRight = "slideRight",
  slideTop = "slideTop",
  slideBottom = "slideBottom",
  bounce = "bounce",
}

/**
 * 基础配置
 * */
interface Base extends ComponentBasePropsWithAny {
  /** true | 开关 */
  open?: boolean;
  /** true | 初始化时是否触发动画 */
  appear?: boolean;
  /**
   * "div" | 包裹元素的tag类型, 你可以理解为Transition就是一个带动画的普通dom节点
   * - 当为span等内联元素时transform不会生效，需要将其块类型设置为inner-block
   * */
  tag?: Primitives;
  /** 指向根节点的ref, 用于直接操作根节点 */
  innerRef?: any;
  /** true | 如果为true，在第一次启用时才真正挂载内容 */
  mountOnEnter?: boolean;
  /** false | 在关闭时卸载内容 */
  unmountOnExit?: boolean;
  /**
   * 接收除to、from外的所有react-spring动画配置, 用于对react-spring进行深度定制
   * - 例如, 你可以用它来更改动画表现、设置事件回调、延迟和循环动画等
   * */
  springProps?: any;
}

/* TransitionBase额外类型 */
export interface TransitionBaseProps extends Base {
  /** 动画的入场状态 */
  to: AnyObject;
  /** 动画的离场状态 */
  from: AnyObject;
  /** 用于插值动画，在动画属性传递给动画元素前会将即将用于动画的spring styles和当前的toggle状态传入并返回新的动画对象 */
  interpolater?: (props: any, toggle: boolean) => any;
  /** true | 执行完离场动画后对元素进行隐藏, 防止离场元素占用布局空间和触发事件 */
  changeVisible?: boolean;
  /** 常规内容或接收动画参数返回插值节点的函数 */
  children?: React.ReactNode | ((springStyle: any) => React.ReactNode);
}

/* Transition额外类型 */
export interface TransitionProps extends Base {
  /** 动画类型 */
  type: TransitionTypeUnion;
  /** true | 默认会为所有类型的动画附加fade动画，使其视觉效果更平滑 */
  alpha?: boolean;
}
```
