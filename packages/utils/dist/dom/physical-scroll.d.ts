import { TupleNumber, EmptyFunction } from "../types.js";
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
/**
 * 在指定元素上模拟拖拽滚动的物理效果
 *
 * 前置条件:
 * - 滚动容器必须设置为overflow: hidden, 并且容器内容尺寸需超过滚动容器
 * - 在触摸设备, 通常要为滚动容器添加css: touch-action: none
 * */
export declare class PhysicalScroll {
    config: {
        /** 绑定事件的元素 */
        el: HTMLElement;
        /** 绑定的事件类型 */
        type: PhysicalScrollEventType[];
        /** 滚动触发,  */
        onScroll?: (xy: TupleNumber, isAutoScroll: boolean) => void;
        /** 若传入true, 滚动将仅通过onScroll通知, 内部不再主动更新滚动位置, 交由用户更新 */
        onlyNotify?: boolean;
        /** 可用于在某些节点情况下阻止事件触发(返回true) */
        triggerFilter?: (e: PhysicalScrollEvent) => true | void;
        /** 自定义获取滚动位置, 省略时将取el.scrollTop/Left */
        positionGetter?: () => TupleNumber;
        /** 指定如何设置滚动位置, 省略时设置el.scrollTop/Left */
        positionSetter?: (xy: TupleNumber) => void;
    };
    prevX?: number;
    prevY?: number;
    startX?: number;
    startY?: number;
    startTime?: number;
    rafClear: EmptyFunction;
    autoScrollStartTime?: number;
    lastDistanceX: any;
    lastDistanceY: any;
    moveXList: [number, number][];
    moveYList: [number, number][];
    mouseEnable: boolean;
    touchEnable: boolean;
    /** 最后绑定touch事件的节点 */
    lastBindTarget?: HTMLElement;
    constructor(config: {
        /** 绑定事件的元素 */
        el: HTMLElement;
        /** 绑定的事件类型 */
        type: PhysicalScrollEventType[];
        /** 滚动触发,  */
        onScroll?: (xy: TupleNumber, isAutoScroll: boolean) => void;
        /** 若传入true, 滚动将仅通过onScroll通知, 内部不再主动更新滚动位置, 交由用户更新 */
        onlyNotify?: boolean;
        /** 可用于在某些节点情况下阻止事件触发(返回true) */
        triggerFilter?: (e: PhysicalScrollEvent) => true | void;
        /** 自定义获取滚动位置, 省略时将取el.scrollTop/Left */
        positionGetter?: () => TupleNumber;
        /** 指定如何设置滚动位置, 省略时设置el.scrollTop/Left */
        positionSetter?: (xy: TupleNumber) => void;
    });
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
    private start;
    private move;
    private end;
    /** 根据对应轴的移动距离和持续时间执行自动滚动 */
    private autoScroll;
    /** 清理当前状态/自动滚动 */
    private clear;
    private getScrollPosition;
    private setScrollPosition;
    /** 根据一组[offset, time]和提供的起始时间获取该时间之后移动距离的平均值, 如果最后一段时间未移动, 可能返回undefined */
    private getSampleOffset;
}
//# sourceMappingURL=physical-scroll.d.ts.map