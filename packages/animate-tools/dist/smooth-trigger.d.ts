/**
 * 接收每次x/y轴的偏移, 根据触发的区间进行补帧后平滑的触发trigger, 使用者可在trigger事件中更新实际的位置, 它是DragScroll和SmoothWheel的底层实现
 * */
export declare class SmoothTrigger {
    opt: SmoothTriggerOption;
    constructor(opt: SmoothTriggerOption);
    yAll: number;
    xAll: number;
    running: boolean;
    private static DECLINE_RATE;
    private rafClear?;
    trigger({ deltaX, deltaY }: {
        deltaX: number;
        deltaY: number;
    }): void;
    destroy(): void;
    /** 根据当前的xAll/yAll开始触发滚动 */
    private run;
    /** 移动距离计算 */
    private movementCalc;
}
export interface SmoothTriggerOption {
    /** 触发器 */
    trigger: (e: SmoothTriggerEvent) => void;
}
export interface SmoothTriggerEvent {
    /** x轴移动距离 */
    x: number;
    /** y轴移动距离 */
    y: number;
}
//# sourceMappingURL=smooth-trigger.d.ts.map