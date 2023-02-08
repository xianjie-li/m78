import { ScrollDirection } from "./types.js";
/** 预留的滚动条区域, 应大于所有浏览器的最大值 */ export var _RESERVE_BAR_SIZE = 40;
/** 下拉刷新每划动1px实际应移动的距离比例 */ export var _PULL_DOWN_SWIPE_RATIO = 0.5;
/** 下拉刷新触发比例 */ export var _PULL_DOWN_TRIGGER_RATIO = 0.9;
/** 组件默认props */ export var _defaultProps = {
    direction: ScrollDirection.xy,
    scrollbar: true,
    scrollIndicator: true,
    pullDownIndicatorRotate: true,
    pullUpTriggerRatio: 0.65
};
/** 滚动条thumb最大尺寸(轨道尺寸 / _BAR_MAX_SIZE_RATIO) */ export var _BAR_MAX_SIZE_RATIO = 2.5;
/** 滚动条thumb最小尺寸 */ export var _BAR_MIN_SIZE_RATIO = 18;
/** 根据传入的滚动方向返回用于启用滚动条的css style */ export function _getScrollStyleByDirection(dir) {
    var style = {
        overflowX: "scroll",
        overflowY: "scroll"
    };
    if (dir === ScrollDirection.x) {
        style.overflowY = "hidden";
    }
    if (dir === ScrollDirection.y) {
        style.overflowX = "hidden";
    }
    if (dir === ScrollDirection.none) {
        style.overflowX = "hidden";
        style.overflowY = "hidden";
    }
    return style;
}
