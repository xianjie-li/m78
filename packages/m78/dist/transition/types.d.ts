/** 基础动画配置 */
import { AnyObject } from "@m78/utils";
import React from "react";
import { Primitives } from "@react-spring/web/dist/declarations/src/primitives";
import { ComponentBasePropsWithAny } from "../common/index.js";
/**
 * 内置动画类型
 * */
export declare enum TransitionType {
    none = "none",
    fade = "fade",
    zoom = "zoom",
    punch = "punch",
    slideLeft = "slideLeft",
    slideRight = "slideRight",
    slideTop = "slideTop",
    slideBottom = "slideBottom",
    bounce = "bounce"
}
export type TransitionTypeKeys = keyof typeof TransitionType;
export type TransitionTypeUnion = TransitionType | TransitionTypeKeys;
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
export interface TransitionProps extends Base {
    /** 动画类型 */
    type: TransitionTypeUnion;
    /** true | 默认会为所有类型的动画附加fade动画，使其视觉效果更平滑 */
    alpha?: boolean;
}
/** 内置动画配置项 */
interface TransitionConfigItem {
    from: any;
    to: any;
    config?: any;
    skipFade?: boolean;
    interpolater?: TransitionBaseProps["interpolater"];
}
export type _TransitionConfigsType = {
    [key in TransitionTypeKeys]: TransitionConfigItem;
};
export {};
//# sourceMappingURL=types.d.ts.map