import { RefObject } from "react";
export interface UseMeasureBound extends Omit<DOMRectReadOnly, "toJSON"> {
    /** entry.contentRect中的宽高为contentSize, 所以额外提供此项 */
    offsetHeight: number;
    /** entry.contentRect中的宽高为contentSize, 所以额外提供此项 */
    offsetWidth: number;
}
/**
 * 实时测量一个元素的尺寸
 * @param target - 目标节点
 * @param debounceDelay - 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能
 * @return
 *  - return[0] - 元素的尺寸, 位置等信息
 *  - return[1] - 用于直接绑定的ref
 * */
export declare function useMeasure<T extends Element = HTMLElement>(target?: HTMLElement | RefObject<HTMLElement>, debounceDelay?: number): readonly [UseMeasureBound, import("react").MutableRefObject<T>];
//# sourceMappingURL=useMeasure.d.ts.map