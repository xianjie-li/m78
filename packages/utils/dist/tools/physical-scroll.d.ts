import { SmoothTrigger, SmoothTriggerOption } from "./smooth-trigger.js";
import { TupleNumber } from "../types.js";
/** 支持的事件处理类型 */
export declare enum PhysicalScrollEventType {
    /** 针对鼠标事件进行模拟 */
    mouse = "mouse",
    /** 针对触摸事件进行模拟 */
    touch = "touch"
}
/** 根据不同事件生产的混合事件 */
export interface PhysicalScrollEvent {
    /** 光标的客户端坐标 */
    xy: TupleNumber;
    /** 触发事件的节点 */
    target: HTMLElement;
    /** 光标相对绑定事件元素左上角的距离 */
    offset: TupleNumber;
}
export interface PhysicalScrollOption extends SmoothTriggerOption {
    /** 绑定事件的元素 */
    el: HTMLElement;
    /** 绑定的事件类型 */
    type: PhysicalScrollEventType[];
    /** 可用于在某些节点情况下阻止事件触发(返回true) */
    triggerFilter?: (e: PhysicalScrollEvent) => true | void;
}
/**
 * 实现具有物理惯性效果的平滑滚动
 *
 * 前置条件:
 * - 滚动容器必须满足滚动条件, 设置overflow并且容器内容尺寸需超过滚动容器
 * - 在触摸设备, 通常要为滚动容器添加css: touch-action: none
 * */
export declare class PhysicalScroll {
    config: PhysicalScrollOption;
    /** 触发惯性滚动的阈值, 拖动速度大于此值时触发额外的惯性滚动 */
    static INERTIA_TRIGGER_THRESHOLD: number;
    /** 计算惯性移动距离时的衰减率 */
    static DECAY_FACTOR: number;
    static SCALE_RATIO: number;
    static TAP_DISTANCE: number;
    prevX?: number;
    prevY?: number;
    startX?: number;
    startY?: number;
    startTime?: number;
    mouseEnable: boolean;
    touchEnable: boolean;
    /** 最后绑定touch事件的节点 */
    lastBindTarget?: HTMLElement;
    /** 平滑滚动 */
    st: SmoothTrigger;
    constructor(config: PhysicalScrollOption);
    /** 正在执行滚动 */
    get scrolling(): boolean;
    private mount;
    destroy(): void;
    private mouseStart;
    private mouseMove;
    private mouseEnd;
    private touchStart;
    private touchMove;
    private touchEnd;
    private bindTouchEvent;
    private unBindTouchEvent;
    private getEventByMouse;
    private getEventByTouch;
    /** 真实的起始位置, 用于过滤掉点击和细微的移动 */
    private realPrevX?;
    private realPrevY?;
    private start;
    private realStart;
    private move;
    private end;
}
//# sourceMappingURL=physical-scroll.d.ts.map