import React, { ReactElement } from "react";
import { AnyObject } from "@m78/utils";
/**
 * 支持的事件类型
 * - 在触控设备上, 会自动添加css到目标dom并使用preventEvent来阻止一些默认行为
 * */
export declare enum UseTriggerType {
    /** 点击 */
    click = "click",
    /**
     * 获得焦点, 该事件在获取焦点和失去焦点时均会触发, 可通过e.focus判断是否聚焦, 事件的x/y, offsetX/Y等坐标信息始终为0
     * - 需要确保element或其任意子级是focusable的
     * */
    focus = "focus",
    /**
     * 根据不同的设备, 会有不同的表现, 该事件在开始和结束时均会触发:
     * - 支持鼠标事件的设备 - hover
     * - 不支持鼠标且支持touch的设备 - 按住一段时间
     *
     * 此事件自动附加了一个触发延迟, 用于在大部分场景下获得更好的体验(比如鼠标快速划过)
     * */
    active = "active",
    /** 通常是鼠标的副键点击, 在移动设备, 按住超过一定时间后也会触发, 这和active在移动设备的行为一致, 所以不建议将两者混合使用 */
    contextMenu = "contextMenu"
}
export declare type UseTriggerTypeKeys = keyof typeof UseTriggerType;
/** 可用事件类型 */
export declare type UseTriggerTypeUnion = UseTriggerType | UseTriggerTypeKeys;
/** 事件对象 */
export interface UseTriggerEvent<E extends Event = Event> {
    /** 触发的事件类型 */
    type: UseTriggerTypeUnion;
    /** 是否处于active状态 */
    active: boolean;
    /** 是否处于focus状态 */
    focus: boolean;
    /** 触发位置相对屏幕的x坐标 */
    x: number;
    /** 触发位置相对屏幕的y坐标 */
    y: number;
    /** 触发位置相对目标左上角的x坐标 */
    offsetX: number;
    /** 触发位置相对目标左上角的y坐标 */
    offsetY: number;
    /** 原生事件对象, 可能是touch/mouse事件对象, 在最新的浏览器里可能是pointer对象, 如需操作需自行注意处理兼容问题 */
    nativeEvent: E;
    /** 事件目标节点 */
    target: EventTarget;
    /** 接收至UseTriggerConfig.data, 使用Trigger组件时, 自动将所有接受到的props传入 */
    data?: any;
}
/** 事件配置, 配置以外的字段会被传递给事件对象的data属性 */
export interface UseTriggerConfig {
    /**
     * 事件目标元素, 元素渲染结果必须是单个dom节点, 文本或多个dom会导致事件监听异常
     * - 弱传入无效值则不进行任何监听
     * */
    element?: ReactElement;
    /** 需要绑定的事件类型 */
    type: UseTriggerTypeUnion | UseTriggerTypeUnion[];
    /** 触发回调 */
    onTrigger?: (e: UseTriggerEvent) => void;
    /** active的特有配置 */
    active?: {
        /** 开始触发延迟(ms), mouse和touch方式触发的默认值分别是 140/400, 防止鼠标快速划过触发或移动端点击触发 */
        triggerDelay?: number;
        /** 离开触发延迟(ms) */
        leaveDelay?: number;
    };
    /** trigger对应的dom节点的ref */
    innerRef?: React.Ref<HTMLElement | null>;
}
/** Trigger的props, 对element进行了更名 */
export interface UseTriggerProps extends Omit<UseTriggerConfig, "element"> {
    children: UseTriggerConfig["element"];
}
/**
 * 用来为一个ReactElement绑定常用的触发事件
 * */
export declare function useTrigger(config: UseTriggerConfig & AnyObject): {
    node: JSX.Element;
    el: HTMLElement | null;
};
export declare function Trigger(config: UseTriggerProps & AnyObject): JSX.Element;
//# sourceMappingURL=use-trigger.d.ts.map