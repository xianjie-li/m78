import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { hasScroll, isBoolean, isNumber, getNamePathValue, setNamePathValue, getDocScrollOffset, setDocScrollOffset } from "@m78/utils";
import { raf } from "./raf.js";
/** 用于在滚动边缘执行拖拽等操作时执行自动滚动以显示遮挡内容 */ export function createAutoScroll(config) {
    var defConf = {
        baseOffset: 16,
        triggerOffset: 0.16,
        maxTriggerOffset: 50,
        checkOverflowAttr: true,
        adjust: {}
    };
    var conf = _object_spread_props(_object_spread({}, defConf, config), {
        boundElement: config.boundElement || config.el
    });
    // 上下文信息是否绑定到dom上
    var isDomBind = conf.__isDomBind;
    var ctx;
    var initCtx = {
        autoScrollToggle: false
    };
    if (isDomBind) {
        var domCtx = getNamePathValue(conf.el, autoScrollDataKey);
        if (!domCtx) {
            setNamePathValue(conf.el, autoScrollDataKey, initCtx);
            domCtx = initCtx;
        }
        ctx = domCtx;
    } else {
        ctx = initCtx;
    }
    ctx.isDocOrBody = conf.el === document.documentElement || conf.el === document.body;
    /** 获取光标和目标位置的边缘覆盖状态 */ function getAutoScrollStatus(param, isLast) {
        var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1], disableConf = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var scrollData = hasScroll(conf.el, conf.checkOverflowAttr);
        if (!ctx.isDocOrBody && !scrollData.x && !scrollData.y) return;
        if (!isNumber(ctx.lastDetectX) || !isNumber(ctx.lastDetectY)) {
            ctx.lastDetectX = x;
            ctx.lastDetectY = y;
            return;
        }
        if (isLast) {
            ctx.isIncreaseY = undefined;
            ctx.isIncreaseX = undefined;
            ctx.lastDetectX = undefined;
            ctx.lastDetectY = undefined;
        }
        if (ctx.lastDetectX !== undefined) {
            if (x >= ctx.lastDetectX + adjustDistance) {
                ctx.isIncreaseX = true;
                ctx.lastDetectX = x;
            } else if (x <= ctx.lastDetectX - adjustDistance) {
                ctx.isIncreaseX = false;
                ctx.lastDetectX = x;
            }
        }
        if (ctx.lastDetectY !== undefined) {
            if (y >= ctx.lastDetectY + adjustDistance) {
                ctx.isIncreaseY = true;
                ctx.lastDetectY = y;
            } else if (y <= ctx.lastDetectY - adjustDistance) {
                ctx.isIncreaseY = false;
                ctx.lastDetectY = y;
            }
        }
        // 是否在指定边最大/小处
        var touchLeft = conf.el.scrollLeft === 0;
        var touchRight = conf.el.scrollLeft >= conf.el.scrollWidth - conf.el.clientWidth;
        var touchTop = conf.el.scrollTop === 0;
        var touchBottom = conf.el.scrollTop >= conf.el.scrollHeight - conf.el.clientHeight;
        // 滚动容器为body或html根时, 取窗口尺寸
        // eslint-disable-next-line prefer-const
        var _ref = ctx.isDocOrBody ? {
            left: 0,
            top: 0,
            bottom: window.innerHeight,
            right: window.innerWidth,
            width: window.innerWidth,
            height: window.innerHeight
        } : conf.boundElement.getBoundingClientRect(), left = _ref.left, top = _ref.top, right = _ref.right, bottom = _ref.bottom, width = _ref.width, height = _ref.height;
        // 根据窗口和当前元素取最小、最大触发位置
        left = Math.max(left, 0);
        top = Math.max(top, 0);
        right = Math.min(right, window.innerWidth);
        bottom = Math.min(bottom, window.innerHeight);
        var xTriggerOffset = Math.min(conf.maxTriggerOffset, width * conf.triggerOffset);
        var yTriggerOffset = Math.min(conf.maxTriggerOffset, height * conf.triggerOffset);
        var leftAdjust = conf.adjust.left || 0;
        var rightAdjust = conf.adjust.right || 0;
        var topAdjust = conf.adjust.top || 0;
        var bottomAdjust = conf.adjust.bottom || 0;
        // 原始边界位置备份, 在某些时候需要以远位置做基准计算
        var beforeLeft = left;
        var beforeRight = right;
        var beforeTop = top;
        var beforeBottom = bottom;
        // 计算偏移
        left = left + xTriggerOffset + leftAdjust;
        top = top + yTriggerOffset + topAdjust;
        right = right - xTriggerOffset - rightAdjust;
        bottom = bottom - yTriggerOffset - bottomAdjust;
        var t = 0;
        var r = 0;
        var b = 0;
        var l = 0;
        // y轴处理, 使用beforeXXX是因为leftAdjust/xTriggerOffset修正后会出现不能触发自动滚动的死角
        if (x > beforeLeft && x < beforeRight) {
            if (y < top) {
                t = Math.min(1, (top - y) / yTriggerOffset);
            }
            if (y > bottom) {
                b = Math.min(1, (y - bottom) / yTriggerOffset);
            }
        }
        // x轴处理
        if (y > beforeTop && y < beforeBottom) {
            if (x < left) {
                l = Math.min(1, (left - x) / xTriggerOffset);
            }
            if (x > right) {
                r = Math.min(1, (x - right) / xTriggerOffset);
            }
        }
        var isIncreaseY = ctx.isIncreaseY;
        var isIncreaseX = ctx.isIncreaseX;
        var topEnable = isBoolean(isIncreaseY) && !isIncreaseY && scrollData.y && !touchTop && !disableConf.top;
        var bottomEnable = isBoolean(isIncreaseY) && isIncreaseY && scrollData.y && !touchBottom && !disableConf.bottom;
        var leftEnable = isBoolean(isIncreaseX) && !isIncreaseX && scrollData.x && !touchLeft && !disableConf.left;
        var rightEnable = isBoolean(isIncreaseX) && isIncreaseX && scrollData.x && !touchRight && !disableConf.right;
        return {
            top: topEnable ? t : 0,
            bottom: bottomEnable ? b : 0,
            left: leftEnable ? l : 0,
            right: rightEnable ? r : 0
        };
    }
    /**
   * 根据getAutoScrollStatus的返回值决定是否要自动滚动滚动元素
   *
   * @param status 光标在模板元素边缘的信息, getAutoScrollStatus的返回值, 若不传则会停止当前的自动滚动
   * */ function autoScrollByStatus(status) {
        if (!conf.el || !status) {
            clear();
            return;
        }
        if (!(status.bottom || status.top || status.left || status.right)) {
            clear();
            return;
        }
        // 基础滚动距离
        ctx.autoScrollVal = 0;
        if (status.bottom) {
            ctx.autoScrollPosKey = "scrollTop";
            ctx.autoScrollVal = status.bottom * conf.baseOffset;
        }
        if (status.left) {
            ctx.autoScrollPosKey = "scrollLeft";
            ctx.autoScrollVal = status.left * -conf.baseOffset;
        }
        if (status.top) {
            ctx.autoScrollPosKey = "scrollTop";
            ctx.autoScrollVal = status.top * -conf.baseOffset;
        }
        if (status.right) {
            ctx.autoScrollPosKey = "scrollLeft";
            ctx.autoScrollVal += status.right * conf.baseOffset;
        }
        // 开启滚动
        if (!ctx.autoScrollToggle) {
            ctx.autoScrollToggle = true;
            autoScroll(conf.el);
        }
    }
    function autoScroll(el) {
        raf(function() {
            if (!ctx.autoScrollToggle) {
                return;
            }
            var val = Math.round(ctx.autoScrollVal);
            if (!conf.onlyNotify) {
                // 处理浏览器兼容
                if (ctx.isDocOrBody) {
                    var key;
                    if (ctx.autoScrollPosKey === "scrollTop") key = "y";
                    else key = "x";
                    var old = getDocScrollOffset();
                    setDocScrollOffset(_object_spread_props(_object_spread({}, old), _define_property({}, key, old[key] += val)));
                } else {
                    el[ctx.autoScrollPosKey] += val;
                }
            }
            if (conf.onScroll) {
                var isX = ctx.autoScrollPosKey === "scrollLeft";
                conf.onScroll(isX, val);
            }
            autoScroll(el);
        });
    }
    function clear() {
        if (ctx.clearFn) {
            ctx.clearFn();
            ctx.clearFn = undefined;
        }
        ctx.autoScrollToggle = false;
    }
    function trigger(xy, isLast, conf) {
        var status = getAutoScrollStatus(xy, isLast, conf);
        autoScrollByStatus(status);
    }
    return {
        /** 清理计时器, 如果当前正在滚动则停止 */ clear: clear,
        /** 根据指定的位置进行滚动触发, isLast用于区分是否为最后一次事件 */ trigger: trigger,
        /** 是否正在滚动 */ get scrolling () {
            return ctx.autoScrollToggle;
        },
        /** 更新配置, 后续trigger以合并后的配置进行 */ updateConfig: function updateConfig(newConf) {
            Object.assign(conf, newConf);
        }
    };
}
/** 可独立使用的autoScroll, 状态通过私有属性存储于被检测dom之上, 可以不用提前创建实例直接使用, 性能略低于单独实例用法 */ export function autoScrollTrigger(conf) {
    var xy = conf.xy, isLast = conf.isLast, disableConfig = conf.disableConfig, config = _object_without_properties(conf, [
        "xy",
        "isLast",
        "disableConfig"
    ]);
    var as = createAutoScroll(_object_spread_props(_object_spread({}, config), {
        __isDomBind: true
    }));
    as.trigger(xy, isLast, disableConfig);
    return function() {
        return as.clear();
    };
}
// 存放ctx到dom的key
var autoScrollDataKey = "AUTO_SCROLL_DATA";
// 修正isIncreaseX的判定范围, 减少细微操作时的误触发
var adjustDistance = 4;
