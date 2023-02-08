import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useEffect, useRef } from "react";
import { isNumber, isDom } from "@m78/utils";
import _clamp from "lodash/clamp.js";
import { getRefDomOrDom, useSelf, useThrottle } from "../../index.js";
import { useSpring, config } from "react-spring";
export function useScroll() {
    var ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, el = ref.el, onScroll = ref.onScroll, _throttleTime = ref.throttleTime, throttleTime = _throttleTime === void 0 ? 100 : _throttleTime, _offset = ref.offset, offset = _offset === void 0 ? 0 : _offset, offsetX = ref.offsetX, offsetY = ref.offsetY, _touchOffset = ref.touchOffset, touchOffset = _touchOffset === void 0 ? 0 : _touchOffset;
    var elIsDoc = /** 检测元素是否是body或html节点 */ function elIsDoc(_el) {
        var sEl = _el || getEl();
        return sEl === self.docEl || sEl === self.bodyEl;
    };
    var getEl = /** 根据参数获取滚动元素，默认为文档元素 */ function getEl() {
        return getRefDomOrDom(el, ref1) || self.docEl;
    };
    var animateTo = /** 动画滚动到指定位置 */ function animateTo(sEl, next, now, other) {
        var isDoc = elIsDoc(sEl);
        spApi.stop().start(_object_spread_props(_object_spread({}, next, other), {
            from: now,
            onChange: function(result) {
                var x = result.value.x;
                var y = result.value.y;
                if (isDoc) {
                    setDocPos(x, y);
                } else {
                    sEl.scrollTop = y;
                    sEl.scrollLeft = x;
                }
            }
        }));
    };
    var set = /** 根据传入的x、y值设置滚动位置 */ function set(param) {
        var x = param.x, y = param.y, raise = param.raise, immediate = param.immediate, config = param.config;
        var scroller = getEl();
        var ref = get(), xMax = ref.xMax, yMax = ref.yMax, oldX = ref.x, oldY = ref.y;
        var nextPos = {};
        var nowPos = {
            x: oldX,
            y: oldY
        };
        if (isNumber(x)) {
            var nextX = x;
            if (raise) {
                nextX = _clamp(oldX + x, 0, xMax);
            }
            if (nextX !== oldX) {
                nextPos.x = nextX;
            }
        }
        if (isNumber(y)) {
            var nextY = y;
            if (raise) {
                nextY = _clamp(oldY + y, 0, yMax);
            }
            if (nextY !== oldY) {
                nextPos.y = nextY;
            }
        }
        if ("x" in nextPos || "y" in nextPos) {
            var isDoc = elIsDoc(scroller);
            if (immediate) {
                spApi.stop();
                if (isNumber(nextPos.x)) {
                    if (isDoc) {
                        setDocPos(nextPos.x);
                    } else {
                        scroller.scrollLeft = nextPos.x;
                    }
                }
                if (isNumber(nextPos.y)) {
                    if (isDoc) {
                        setDocPos(undefined, nextPos.y);
                    } else {
                        scroller.scrollTop = nextPos.y;
                    }
                }
            } else {
                animateTo(scroller, nextPos, nowPos, config);
            }
        }
    };
    var scrollToElement = function scrollToElement(arg, immediate) {
        var sEl = getEl();
        var isDoc = elIsDoc(sEl);
        var targetEl;
        if (!sEl.getBoundingClientRect) {
            console.warn("The browser does not support `getBoundingClientRect` API");
            return;
        }
        if (typeof arg === "string") {
            targetEl = getEl().querySelector(arg);
        } else {
            targetEl = arg;
        }
        if (!isDom(targetEl)) return;
        var ref = targetEl.getBoundingClientRect(), cTop = ref.top, cLeft = ref.left;
        var ref1 = sEl.getBoundingClientRect(), fTop = ref1.top, fLeft = ref1.left;
        /**
     * 使用offsetTop等属性只能获取到元素相对于第一个非常规定位父元素的距离，所以需要单独计算
     * 计算规则: eg. 子元素距离顶部比父元素多100px，滚动条位置应该减少100px让两者等值
     * */ var xOffset = offsetX || offset;
        var yOffset = offsetY || offset;
        set({
            x: cLeft - fLeft + xOffset,
            y: cTop - fTop + yOffset,
            raise: !isDoc,
            immediate: immediate
        });
    };
    var get = /** 获取各种有用的滚动信息 */ function get() {
        var isDoc = elIsDoc();
        var sEl = getEl();
        var x = isDoc ? self.docEl.scrollLeft + self.bodyEl.scrollLeft : sEl.scrollLeft;
        var y = isDoc ? self.docEl.scrollTop + self.bodyEl.scrollTop : sEl.scrollTop;
        /* chrome高分屏+缩放时，滚动值会是小数，向上取整防止计算错误 */ x = Math.ceil(x);
        y = Math.ceil(y);
        var height = sEl.clientHeight;
        var width = sEl.clientWidth;
        var scrollHeight = sEl.scrollHeight;
        var scrollWidth = sEl.scrollWidth;
        /* chrome下(高分屏+缩放),无滚动的情况下scrollWidth会大于width */ var xMax = Math.max(0, scrollWidth - width);
        var yMax = Math.max(0, scrollHeight - height);
        var isScrollX = x !== self.lastX;
        var isScrollY = y !== self.lastY;
        self.lastX = x;
        self.lastY = y;
        return {
            el: sEl,
            x: x,
            y: y,
            xMax: xMax,
            yMax: yMax,
            height: height,
            width: width,
            scrollHeight: scrollHeight,
            scrollWidth: scrollWidth,
            touchBottom: yMax - y - touchOffset <= 0,
            touchLeft: x <= touchOffset,
            touchRight: xMax - x - touchOffset <= 0,
            touchTop: y <= touchOffset,
            offsetWidth: sEl.offsetWidth,
            offsetHeight: sEl.offsetHeight,
            isScrollX: isScrollX,
            isScrollY: isScrollY
        };
    };
    var setDocPos = /** 设置根级的滚动位置 */ function setDocPos(x, y) {
        if (isNumber(x)) {
            // 只有一个会生效
            self.bodyEl.scrollLeft = x;
            self.docEl.scrollLeft = x;
        }
        if (isNumber(y)) {
            self.bodyEl.scrollTop = y;
            self.docEl.scrollTop = y;
        }
    };
    // 用于返回的节点获取ref
    var ref1 = useRef(null);
    // 获取documentElement和body, 放到useEffect以兼容SSR
    var self = useSelf({
        docEl: null,
        bodyEl: null,
        lastX: 0,
        lastY: 0
    });
    var ref2 = _sliced_to_array(useSpring(function() {
        return {
            y: 0,
            x: 0,
            config: _object_spread({
                clamp: true
            }, config.stiff)
        };
    }), 2), spValue = ref2[0], spApi = ref2[1];
    /** 滚动处理 */ var scrollHandle = useThrottle(function() {
        onScroll && onScroll(get());
    }, throttleTime);
    /** 初始化获取根节点 */ useEffect(function() {
        self.docEl = document.documentElement;
        self.bodyEl = document.body;
    }, []);
    /** 绑定滚动事件 */ useEffect(function() {
        var sEl = getEl();
        /* 坑: 页面级滚动scroll事件绑在documentElement和body上无效, 只能绑在window上 */ var scrollEl = elIsDoc(sEl) ? window : sEl;
        scrollEl.addEventListener("scroll", scrollHandle);
        return function() {
            scrollEl.removeEventListener("scroll", scrollHandle);
        };
    }, [
        el,
        ref1.current
    ]);
    /** 记录初始化滚动位置, 用于计算滚动方向 */ useEffect(function() {
        var meta = get();
        self.lastX = meta.x;
        self.lastY = meta.y;
    }, [
        el,
        ref1.current
    ]);
    /** 执行滚动、拖动操作时，停止当前正在进行的滚动操作 */ useEffect(function() {
        var wheelHandle = function wheelHandle() {
            if (spValue.x.isAnimating || spValue.y.isAnimating) {
                spApi.stop();
            }
        };
        var sEl = getEl();
        sEl.addEventListener("wheel", wheelHandle);
        sEl.addEventListener("touchmove", wheelHandle);
        return function() {
            sEl.removeEventListener("wheel", wheelHandle);
            sEl.removeEventListener("touchmove", wheelHandle);
        };
    }, [
        el,
        ref1.current
    ]);
    return {
        set: set,
        get: get,
        scrollToElement: scrollToElement,
        ref: ref1
    };
}
