import { RefObject } from "react";
import { UseMeasureBound } from "./use-measure.js";
/**
 * 原始尺寸/位置 变更时进行通知
 * */
export declare function useMeasureNotify<T extends Element = HTMLElement>(props: {
    /** 目标节点 */
    target?: HTMLElement | RefObject<HTMLElement>;
    /** 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能 */
    debounceDelay?: number;
    /** 发生变更时触发 */
    onChange: (bounds: UseMeasureBound) => void;
}): import("react").MutableRefObject<T>;
//# sourceMappingURL=useMeasureNotify.d.ts.map