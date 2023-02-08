import { ScrollDirection, ScrollDirectionUnion } from "./types.js";
import { CSSProperties } from "react";
/** 预留的滚动条区域, 应大于所有浏览器的最大值 */
export declare const _RESERVE_BAR_SIZE = 40;
/** 下拉刷新每划动1px实际应移动的距离比例 */
export declare const _PULL_DOWN_SWIPE_RATIO = 0.5;
/** 下拉刷新触发比例 */
export declare const _PULL_DOWN_TRIGGER_RATIO = 0.9;
/** 组件默认props */
export declare const _defaultProps: {
    direction: ScrollDirection;
    scrollbar: boolean;
    scrollIndicator: boolean;
    pullDownIndicatorRotate: boolean;
    pullUpTriggerRatio: number;
};
/** 滚动条thumb最大尺寸(轨道尺寸 / _BAR_MAX_SIZE_RATIO) */
export declare const _BAR_MAX_SIZE_RATIO = 2.5;
/** 滚动条thumb最小尺寸 */
export declare const _BAR_MIN_SIZE_RATIO = 18;
/** 根据传入的滚动方向返回用于启用滚动条的css style */
export declare function _getScrollStyleByDirection(dir: ScrollDirectionUnion): CSSProperties;
//# sourceMappingURL=common.d.ts.map