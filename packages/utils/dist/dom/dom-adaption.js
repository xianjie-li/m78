import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _throttle from "lodash/throttle.js";
var defaultConfig = {
    designWidth: 1920,
    designHeight: 1080,
    keepRatio: true
};
/**
 *  缩放指定dom以兼容屏幕尺寸
 *  缩放比换算公式: 页面实际尺寸 / 设计图尺寸
 *  */ export function domAdaption(config) {
    var _config = _object_spread({}, defaultConfig, config);
    fixSize(_config);
    var set = _throttle(function() {
        fixSize(_config);
    }, 1000, {
        leading: false,
        trailing: true
    });
    window.addEventListener("resize", set);
    return function() {
        window.removeEventListener("resize", set);
    };
}
function fixSize(param) {
    var designWidth = param.designWidth, designHeight = param.designHeight, keepRatio = param.keepRatio, el = param.el;
    var sSize = getScreenSize();
    var xScale = sSize.w / designWidth;
    var yScale = sSize.h / designHeight;
    var base = Math.min(xScale, yScale); //  永远悲观的选择最小缩放值
    var xS = keepRatio ? base : xScale;
    var yS = keepRatio ? base : yScale;
    el.style.position = "fixed";
    el.style.top = "50%";
    el.style.left = "50%";
    el.style.transform = "scale3d(".concat(xS, ", ").concat(yS, ", 1) translate3d(-50%, -50%, 0)");
    el.style.width = "".concat(designWidth, "px");
    el.style.height = "".concat(designHeight, "px");
    el.style.transformOrigin = "left top";
}
function getScreenSize() {
    return {
        w: window.innerWidth,
        h: window.innerHeight
    };
}
