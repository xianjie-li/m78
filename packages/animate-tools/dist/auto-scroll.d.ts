import { Point } from "@m78/utils";
/** 用于在滚动边缘执行拖拽等操作时执行自动滚动以显示遮挡内容 */
export declare function createAutoScroll(config: AutoScrollConfig): {
    /** 清理计时器, 如果当前正在滚动则停止 */
    clear: () => void;
    /** 根据指定的位置进行滚动触发, isLast用于区分是否为最后一次事件 */
    trigger: (xy: Point, isLast: boolean, conf?: AutoScrollTriggerConfig) => void;
    /** 是否正在滚动 */
    readonly scrolling: boolean;
    /** 更新配置, 后续trigger以合并后的配置进行 */
    updateConfig(newConf: Partial<AutoScrollConfig>): void;
};
/** 可独立使用的autoScroll, 状态通过私有属性存储于被检测dom之上, 可以不用提前创建实例直接使用, 性能略低于单独实例用法 */
export declare function autoScrollTrigger(conf: {
    xy: Point;
    isLast: boolean;
    disableConfig?: AutoScrollTriggerConfig;
} & AutoScrollConfig): () => void;
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
    /** 仅通过onScroll进行通知, 内部不再直接设置滚动位置 */
    onlyNotify?: boolean;
}
/** trigger配置 */
export type AutoScrollTriggerConfig = {
    /** 对应方向是否禁用 */
    left?: boolean;
    right?: boolean;
    bottom?: boolean;
    top?: boolean;
};
/** 实例 */
export type AutoScroll = ReturnType<typeof createAutoScroll>;
//# sourceMappingURL=auto-scroll.d.ts.map