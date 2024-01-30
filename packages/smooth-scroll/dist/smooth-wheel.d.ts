import { SmoothTrigger, SmoothTriggerOption } from "./smooth-trigger.js";
/**
 * 提供平滑处理的 onwheel 事件, 在鼠标/触控板等方式触发wheel时均能增强滚动体验
 * */
export declare class SmoothWheel {
    opt: SmoothWheelOpt;
    /** 平滑触发器 */
    st: SmoothTrigger;
    constructor(opt: SmoothWheelOpt);
    destroy(): void;
    get wheeling(): boolean;
    private handle;
}
export interface SmoothWheelOpt extends SmoothTriggerOption {
    /** 绑定wheel事件的节点 */
    el: HTMLElement;
}
//# sourceMappingURL=smooth-wheel.d.ts.map