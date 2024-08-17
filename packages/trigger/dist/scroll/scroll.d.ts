import { TupleNumber } from "@m78/utils";
/** 创建配置 */
export interface ScrollTriggerOption {
    /** 要监听的滚动目标, 默认的滚动元素是documentElement */
    target?: HTMLElement;
    /** 滚动时触发 */
    handle: (event: ScrollTriggerState) => void;
    /** 设置handle的throttle间隔, 单位(ms) */
    throttleTime?: number;
    /** 使用scrollToElement api定位时的偏移值, 传入单个值时应用于两个方向, 两个值时分别表示 x, y */
    offset?: number | TupleNumber;
    /** touch系列属性的触发修正值 */
    touchOffset?: number | TupleNumber;
}
/** 调整滚动位置时的配置对象 */
export interface ScrollTriggerArg {
    /** 指定滚动的x轴 */
    x?: number;
    /** 指定滚动的y轴 */
    y?: number;
    /** 以当前滚动位置为基础进行增减滚动 */
    raise?: boolean;
    /** 为true时阻止动画 */
    immediate?: boolean;
}
/** 事件对象 */
export interface ScrollTriggerState {
    /** 滚动元素 */
    target: HTMLElement;
    /** x轴位置 */
    x: number;
    /** y轴位置 */
    y: number;
    /** 可接受的x轴滚动最大值(值大于0说明可滚动， 但不能保证开启了滚动) */
    xMax: number;
    /** 可接受的y轴滚动最大值(值大于0说明可滚动， 但不能保证开启了滚动) */
    yMax: number;
    /** 元素高度 */
    height: number;
    /** 元素宽度 */
    width: number;
    /** 元素实际高度(包含边框/滚动条/内边距等) */
    offsetWidth: number;
    /** 元素实际宽度(包含边框/滚动条/内边距等) */
    offsetHeight: number;
    /** 元素总高度 */
    scrollHeight: number;
    /** 元素总宽度 */
    scrollWidth: number;
    /** 滚动条位于最底部 */
    touchBottom: boolean;
    /** 滚动条位于最右侧 */
    touchRight: boolean;
    /** 滚动条位于最顶部 */
    touchTop: boolean;
    /** 滚动条位于最左侧 */
    touchLeft: boolean;
    /** 是否是x轴滚动, 通过判断上一个滚动值来获取, 某些场景可能不准确, 比如通过api控制滚动时 */
    isScrollX: boolean;
    /** 是否是y轴滚动, 通过判断上一个滚动值来获取, 某些场景可能不准确, 比如通过api控制滚动时 */
    isScrollY: boolean;
}
/** 滚动实例 */
export interface ScrollTriggerInstance {
    /** 设置滚动位置 */
    scroll: (arg: ScrollTriggerArg) => void;
    /** 滚动到指定的元素, 可传入一个dom节点或一个选择器, 设置 immediate 为 true 可跳过动画 */
    scrollToElement: (arg: string | HTMLElement, immediate?: boolean) => void;
    /** 获取和当前滚动状态有关的信息, 与handle中传入的事件对象一致 */
    get: () => ScrollTriggerState;
    /** 销毁实例 */
    destroy(): void;
}
export declare function createScrollTrigger(option: ScrollTriggerOption): ScrollTriggerInstance;
//# sourceMappingURL=scroll.d.ts.map