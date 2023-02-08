import { isNumber } from "@m78/utils";
/** 实现下拉刷新时, 在某些设备上禁用滚动位置为0时的下拉(如微信/ios) */ export function preventTopPull(el) {
    // 记录起始offset
    var offset = null;
    // 记录起始scrollTop
    var scrollTop = null;
    var start = function(e) {
        offset = e.targetTouches[0].screenY;
        scrollTop = el.scrollTop;
    };
    var move = function(e) {
        if (!isNumber(offset) || !isNumber(scrollTop)) return;
        var nowOffset = e.targetTouches[0].screenY;
        var isPullDown = nowOffset - offset > 0;
        if (scrollTop === 0 && isPullDown) {
            e.preventDefault();
        }
    };
    var end = function() {
        offset = null;
        scrollTop = null;
    };
    el.addEventListener("touchstart", start);
    el.addEventListener("touchmove", move);
    el.addEventListener("touchend", end);
    return function() {
        el.removeEventListener("touchstart", start);
        el.removeEventListener("touchmove", move);
        el.removeEventListener("touchend", end);
    };
}
