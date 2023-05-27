import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { hasScroll } from "../../dist/index.js";
import { raf } from "../bom.js";
/** 一个光标在目标边缘时自动滚动节点的工具 */ export function createAutoScroll(config) {
    var getAutoScrollStatus = /** 获取光标和目标位置的边缘覆盖状态 */ function getAutoScrollStatus(x, y) {
        var disableConf = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var scrollData = hasScroll(conf.el, conf.checkOverflowAttr);
        if (!isDocOrBody && !scrollData.x && !scrollData.y) return;
        // 是否在指定边最大/小处
        var touchLeft = conf.el.scrollLeft === 0;
        var touchRight = conf.el.scrollLeft >= conf.el.scrollWidth - conf.el.clientWidth;
        var touchTop = conf.el.scrollTop === 0;
        var touchBottom = conf.el.scrollTop >= conf.el.scrollHeight - conf.el.clientHeight;
        // 滚动容器为body或html根时, 取窗口尺寸
        // eslint-disable-next-line prefer-const
        var ref = isDocOrBody ? {
            left: 0,
            top: 0,
            bottom: window.innerHeight,
            right: window.innerWidth,
            width: window.innerWidth,
            height: window.innerHeight
        } : conf.boundElement.getBoundingClientRect(), left = ref.left, top = ref.top, right = ref.right, bottom = ref.bottom, width = ref.width, height = ref.height;
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
        return {
            top: scrollData.y && !touchTop && !disableConf.top ? t : 0,
            bottom: scrollData.y && !touchBottom && !disableConf.bottom ? b : 0,
            left: scrollData.x && !touchLeft && !disableConf.left ? l : 0,
            right: scrollData.x && !touchRight && !disableConf.right ? r : 0
        };
    };
    var autoScrollByStatus = /**
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
    };
    var clear = /** 清理计时器, 如果当前正在滚动则停止 */ function clear() {
        if (ctx.clearFn) {
            ctx.clearFn();
            ctx.clearFn = undefined;
        }
        ctx.autoScrollToggle = false;
    };
    var trigger = function trigger(x, y, disableConf) {
        var status = getAutoScrollStatus(x, y, disableConf);
        autoScrollByStatus(status);
    };
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
    var isDocOrBody = conf.el === document.documentElement || conf.el === document.body;
    var ctx = {
        autoScrollToggle: false
    };
    function autoScroll(el) {
        raf(function() {
            if (!ctx.autoScrollToggle) return;
            el[ctx.autoScrollPosKey] += ctx.autoScrollVal;
            // 处理浏览器兼容
            if (el === document.documentElement) {
                document.body[ctx.autoScrollPosKey] += ctx.autoScrollVal;
            }
            if (conf.onScroll) {
                var isX = ctx.autoScrollPosKey === "scrollLeft";
                conf.onScroll(isX, ctx.autoScrollVal);
            }
            autoScroll(el);
        });
    }
    return {
        /** 根据当前的AutoScrollCtx来自动滚动目标元素 */ clear: clear,
        /** 根据指定的位置进行滚动触发 */ trigger: trigger,
        /** 是否正在滚动 */ get scrolling () {
            return ctx.autoScrollToggle;
        },
        /** 更新配置, 后续trigger以配置进行 */ updateConfig: function(newConf) {
            Object.assign(conf, newConf);
        }
    };
}
