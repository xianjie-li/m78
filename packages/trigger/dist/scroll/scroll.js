import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { isNumber, isDom } from "@m78/utils";
import _clamp from "lodash/clamp.js";
import _throttle from "lodash/throttle.js";
import { curveRun } from "@m78/animate-tools";
export function createScrollTrigger(option) {
    var target = option.target, handle = option.handle, _option_throttleTime = option.throttleTime, throttleTime = _option_throttleTime === void 0 ? 0 : _option_throttleTime, _option_offset = option.offset, offset = _option_offset === void 0 ? 0 : _option_offset, _option_touchOffset = option.touchOffset, touchOffset = _option_touchOffset === void 0 ? 0 : _option_touchOffset;
    var docEl = document.documentElement;
    var bodyEl = document.body;
    var _ref = _sliced_to_array(isNumber(offset) ? [
        offset,
        offset
    ] : offset, 2), offsetX = _ref[0], offsetY = _ref[1];
    var _ref1 = _sliced_to_array(isNumber(touchOffset) ? [
        touchOffset,
        touchOffset
    ] : touchOffset, 2), touchOffsetX = _ref1[0], touchOffsetY = _ref1[1];
    // 滚动目标, 默认为document
    var scrollTarget = target || docEl;
    // 元素是否是body或html节点
    var isDoc = scrollTarget === docEl || scrollTarget === bodyEl;
    // 滚动事件的绑定目标, 页面级滚动scroll事件绑在documentElement和body上无效, 只能绑在window上, 所以某些情况会使用window
    var actualTarget = isDoc ? window : scrollTarget;
    // 最后滚动位置
    var lastX = 0;
    var lastY = 0;
    var scrollHandle = throttleTime ? _throttle(_scrollHandle, throttleTime) : _scrollHandle;
    init();
    // 初始化
    function init() {
        actualTarget.addEventListener("scroll", scrollHandle);
        actualTarget.addEventListener("wheel", stopAnimate);
        actualTarget.addEventListener("touchstart", stopAnimate);
        /** 记录初始化滚动位置, 用于计算滚动方向 */ var state = get();
        lastX = state.x;
        lastY = state.y;
    }
    // 滚动处理
    function _scrollHandle() {
        handle(get());
    }
    var animateCleanup = null;
    // 取消进行中的滚动动画
    function stopAnimate() {
        if (animateCleanup) {
            animateCleanup();
            animateCleanup = null;
        }
    }
    // 动画滚动到指定位置
    function animateTo(sEl, next, now) {
        stopAnimate();
        var diffX = next.x - now.x;
        var diffY = next.y - now.y;
        // 根据移动距离增加动画持续时间, 最大不超过2.5s, 最小不低于800
        var diff = Math.max(Math.abs(diffX), Math.abs(diffY));
        var duration = _clamp(Math.abs(diff) / 100 * 20, 800, 1200);
        animateCleanup = curveRun({
            duration: duration,
            onChange: function onChange(value) {
                var x = now.x + diffX * value;
                var y = now.y + diffY * value;
                if (isDoc) {
                    setDocPos(x, y);
                } else {
                    sEl.scrollTop = y;
                    sEl.scrollLeft = x;
                }
            }
        });
    }
    // 获取滚动信息
    function get() {
        var x = isDoc ? docEl.scrollLeft + bodyEl.scrollLeft : scrollTarget.scrollLeft;
        var y = isDoc ? docEl.scrollTop + bodyEl.scrollTop : scrollTarget.scrollTop;
        /* chrome高分屏+缩放时，滚动值会是小数，向上取整防止计算错误 */ x = Math.ceil(x);
        y = Math.ceil(y);
        var height = scrollTarget.clientHeight;
        var width = scrollTarget.clientWidth;
        var scrollHeight = scrollTarget.scrollHeight;
        var scrollWidth = scrollTarget.scrollWidth;
        /* chrome下(高分屏+缩放),无滚动的情况下scrollWidth会大于width */ var xMax = Math.max(0, scrollWidth - width);
        var yMax = Math.max(0, scrollHeight - height);
        var isScrollX = x !== lastX;
        var isScrollY = y !== lastY;
        lastX = x;
        lastY = y;
        return {
            target: scrollTarget,
            x: x,
            y: y,
            xMax: xMax,
            yMax: yMax,
            height: height,
            width: width,
            scrollHeight: scrollHeight,
            scrollWidth: scrollWidth,
            touchBottom: yMax - y - touchOffsetY <= 0,
            touchLeft: x <= touchOffsetX,
            touchRight: xMax - x - touchOffsetX <= 0,
            touchTop: y <= touchOffsetY,
            offsetWidth: scrollTarget.offsetWidth,
            offsetHeight: scrollTarget.offsetHeight,
            isScrollX: isScrollX,
            isScrollY: isScrollY
        };
    }
    // 设置滚动位置
    function scroll(arg) {
        var x = arg.x, y = arg.y, raise = arg.raise, immediate = arg.immediate;
        var _get = get(), xMax = _get.xMax, yMax = _get.yMax, oldX = _get.x, oldY = _get.y;
        var nextPos = {
            x: oldX,
            y: oldY
        };
        var nowPos = {
            x: oldX,
            y: oldY
        };
        var hasChange = false;
        if (isNumber(x)) {
            var nextX = x;
            if (raise) {
                nextX = _clamp(oldX + x, 0, xMax);
            }
            if (nextX !== oldX) {
                nextPos.x = nextX;
                hasChange = true;
            }
        }
        if (isNumber(y)) {
            var nextY = y;
            if (raise) {
                nextY = _clamp(oldY + y, 0, yMax);
            }
            if (nextY !== oldY) {
                nextPos.y = nextY;
                hasChange = true;
            }
        }
        if (hasChange) {
            if (immediate) {
                stopAnimate();
                if (isNumber(nextPos.x)) {
                    if (isDoc) {
                        setDocPos(nextPos.x);
                    } else {
                        scrollTarget.scrollLeft = nextPos.x;
                    }
                }
                if (isNumber(nextPos.y)) {
                    if (isDoc) {
                        setDocPos(undefined, nextPos.y);
                    } else {
                        scrollTarget.scrollTop = nextPos.y;
                    }
                }
            } else {
                animateTo(scrollTarget, nextPos, nowPos);
            }
        }
    }
    // 滚动到指定dom
    function scrollToElement(arg, immediate) {
        var targetEl;
        if (typeof arg === "string") {
            targetEl = scrollTarget.querySelector(arg);
        } else {
            targetEl = arg;
        }
        if (!isDom(targetEl)) return;
        var _targetEl_getBoundingClientRect = targetEl.getBoundingClientRect(), cTop = _targetEl_getBoundingClientRect.top, cLeft = _targetEl_getBoundingClientRect.left;
        var _scrollTarget_getBoundingClientRect = scrollTarget.getBoundingClientRect(), fTop = _scrollTarget_getBoundingClientRect.top, fLeft = _scrollTarget_getBoundingClientRect.left;
        /**
     * 使用offsetTop等属性只能获取到元素相对于第一个非常规定位父元素的距离，所以需要单独计算
     * 计算规则: eg. 子元素距离顶部比父元素多100px，滚动条位置应该减少100px让两者等值
     * */ scroll({
            x: cLeft - fLeft + offsetX,
            y: cTop - fTop + offsetY,
            raise: !isDoc,
            immediate: immediate
        });
    }
    /** 设置根级的滚动位置 */ function setDocPos(x, y) {
        if (isNumber(x)) {
            // 只有一个会生效
            bodyEl.scrollLeft = x;
            docEl.scrollLeft = x;
        }
        if (isNumber(y)) {
            bodyEl.scrollTop = y;
            docEl.scrollTop = y;
        }
    }
    function destroy() {
        actualTarget.removeEventListener("scroll", scrollHandle);
        actualTarget.removeEventListener("wheel", stopAnimate);
        actualTarget.removeEventListener("touchstart", stopAnimate);
    }
    return {
        get: get,
        scroll: scroll,
        scrollToElement: scrollToElement,
        destroy: destroy
    };
}
