import { EmptyFunction } from "../types.js";
/** 在多个滚动帮助函数间共享 */
export interface AutoScrollCtx {
    /** 自动滚动的开关 */
    autoScrollToggle: boolean;
    /** 要设置滚动位置的key */
    autoScrollPosKey: "scrollLeft" | "scrollTop";
    /** 每次滚动距离 */
    autoScrollVal: number;
    /** 清理函数 */
    clearFn?: EmptyFunction;
}
export interface AutoScrollConfig {
    /** 待检测和滚动的节点 */
    el: HTMLElement;
    /** 16 | 自动滚动的基准距离, 越大则滚动越快, 最终滚动距离为 baseOffset * 超出触发距离的系数 */
    baseOffset?: number;
    /** 0.16 | 在距离边缘此比例时即开始滚动(相对于元素尺寸的比例) */
    triggerOffset?: number;
    /** 50 | 根据triggerOffset计算后的触发距离最大不超过此值 */
    maxTriggerOffset?: number;
    /** true | 在检测目标元素是否是滚动元素时, 除了有可用滚动距离外, 是否需要额外检测 overflow 值是否等于 scroll 或 auto */
    checkOverflowAttr?: boolean;
    /** 在经过triggerOffset确认位置后, 再次对触发自动滚动的边界进行调整 */
    adjust?: {
        left?: number;
        right?: number;
        bottom?: number;
        top?: number;
    };
    /** 用于计算容器位置的节点, 默认为config.el, 当前滚动容器和用于测量位置的节点不同时, 可能会需要此配置 */
    boundElement?: HTMLElement;
    /** 自动滚动时触发, 可用isX判断x/y轴, offset为该次滚动的距离 */
    onScroll?: (isX: boolean, offset: number) => void;
}
/** 方向禁用配置 */
export declare type AutoScrollDisableConfig = {
    left?: boolean;
    right?: boolean;
    bottom?: boolean;
    top?: boolean;
};
export declare type AutoScroll = ReturnType<typeof createAutoScroll>;
/** 一个光标在目标边缘时自动滚动节点的工具 */
export declare function createAutoScroll(config: AutoScrollConfig): {
    /** 根据当前的AutoScrollCtx来自动滚动目标元素 */
    clear: () => void;
    /** 根据指定的位置进行滚动触发 */
    trigger: (x: number, y: number, disableConf?: AutoScrollDisableConfig) => void;
    /** 是否正在滚动 */
    readonly scrolling: boolean;
    /** 更新配置, 后续trigger以配置进行 */
    updateConfig(newConf: Partial<AutoScrollConfig>): void;
};
//# sourceMappingURL=auto-scroll.d.ts.map