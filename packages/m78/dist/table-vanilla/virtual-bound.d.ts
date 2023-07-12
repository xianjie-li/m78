import { BoundSize, Point, CustomEvent, TupleNumber } from "@m78/utils";
import { Gesture } from "@use-gesture/vanilla";
export interface VirtualBoundItem extends BoundSize {
    /** 节点层级, 决定了事件覆盖 */
    zIndex: number;
    /** 根据此标识判断bound的类型 */
    type: any;
    /** 块的光标类型 */
    cursor?: string;
    /** 触发hover时的光标类型 */
    hoverCursor?: string;
    /** 通常是跟该bound关联的数据 */
    data?: any;
}
export interface VirtualBoundClickEvent {
    /** 当前bound */
    bound: VirtualBoundItem;
    /** 原始事件, 根据兼容性可能是pointer事件或mouse事件 */
    event: Event;
}
export declare type VirtualBoundClickListener = (ev: VirtualBoundClickEvent) => void;
export interface VirtualBoundHoverEvent {
    /** 当前bound */
    bound: VirtualBoundItem;
    /** 是否触发hover */
    hover: boolean;
    /** 原始事件, 根据兼容性可能是pointer事件或mouse事件 */
    event?: Event;
}
export declare type VirtualBoundHoverListener = (ev: VirtualBoundHoverEvent) => void;
export interface VirtualBoundDragEvent {
    /** 当前bound */
    bound: VirtualBoundItem;
    /** 相对上一次的移动距离 */
    delta: TupleNumber;
    /** 总的移动距离 */
    movement: TupleNumber;
    /** 指针位置 */
    xy: TupleNumber;
    /** 是否首次触发 */
    first: boolean;
    /** 是否最后一次触发 */
    last: boolean;
    /** 原始事件, 根据兼容性可能是pointer事件或mouse/touch事件 */
    event: Event;
}
export declare type VirtualBoundDragListener = (ev: VirtualBoundDragEvent) => void;
export declare class VirtualBound {
    constructor(conf: {
        /** 挂载事件的节点 */
        el: HTMLDivElement;
        /** 30 | hover延迟触发时间, 单位为ms */
        hoverDelay?: number;
        /** 触发hover前的校验, 返回true时停止事件触发, ev为原始事件对象 */
        hoverPreCheck?: (ev: Event) => boolean;
        /** 触发drag前的校验, 返回true时停止事件触发, ev为原始事件对象 */
        dragPreCheck?: (ev: Event) => boolean;
    });
    el: HTMLDivElement;
    hoverDelay: number;
    hoverPreCheck?: (ev: Event) => boolean;
    dragPreCheck?: (ev: Event) => boolean;
    gesture: Gesture;
    /** 所有bound */
    bounds: VirtualBoundItem[];
    /** 虚拟节点触发了click */
    click: CustomEvent<VirtualBoundClickListener>;
    /** 虚拟节点触发了hover */
    hover: CustomEvent<VirtualBoundHoverListener>;
    /** 拖动虚拟节点 */
    drag: CustomEvent<VirtualBoundDragListener>;
    dragging: boolean;
    /** 设置为false时, 将停止事件派发 */
    private _enable;
    /** 当前光标 */
    private _cursor;
    /** 最后触发hover的bound */
    private lastMoveEnterBound;
    /** 延迟触发计时器 */
    private delayHoverTimer;
    /** 当前拖动的bound */
    private currentDragBound;
    /** 最后一次drag完成的时间, 用于现在drag后一定时间内不触发hover, 防止同时包含两个事件的bound在拖动完成后立即触发hover */
    private lastDragEndTime;
    /** 清理所有占用 */
    destroy(): void;
    get enable(): boolean;
    set enable(v: boolean);
    /** 获取当前光标类型 */
    get cursor(): string | null;
    /** 设置当前光标类型 */
    set cursor(v: string | null);
    /** 获取指定点的所有bound, 传入zIndexCheck可以在点上有多个bound时获取层级最高的那个 */
    getBound(xy: Point, zIndexCheck?: boolean): VirtualBoundItem[];
    /** 指定点是否包含bound */
    hasBound(xy: Point): boolean;
    /** 绑定事件 */
    private bindEvents;
    /** 监听move, 处理hover */
    private moveHandle;
    /** 取消hover */
    private triggerUnHover;
    /** 延迟触发hover */
    private delayHover;
    private dragHandle;
    /** xy是否在bound内 */
    private inBoundCheck;
}
//# sourceMappingURL=virtual-bound.d.ts.map