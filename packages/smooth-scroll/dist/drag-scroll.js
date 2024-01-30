import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { SmoothTrigger } from "./smooth-trigger.js";
import { isNumber, getEventOffset } from "@m78/utils";
/**
 * 实现拖拽平滑滚动, 支持touch/鼠标操作
 *
 * 前置条件:
 * - 滚动容器必须满足滚动条件, 设置overflow并且容器内容尺寸需超过滚动容器
 * - 在触摸设备, 通常要为滚动容器添加css: touch-action: none
 * */ export var DragScroll = /*#__PURE__*/ function() {
    "use strict";
    function DragScroll(config) {
        var _this = this;
        _class_call_check(this, DragScroll);
        _define_property(this, "config", void 0);
        // 前一次触发的xy位置
        _define_property(this, "prevX", void 0);
        _define_property(this, "prevY", void 0);
        // 事件开始触发时的xy位置
        _define_property(this, "startX", void 0);
        _define_property(this, "startY", void 0);
        // 事件开始时间
        _define_property(this, "startTime", void 0);
        // 根据配置设置的mouse事件启用状态
        _define_property(this, "mouseEnable", void 0);
        // 根据配置设置的touch事件启用状态
        _define_property(this, "touchEnable", void 0);
        /** 最后绑定touch事件的节点 */ _define_property(this, "lastBindTarget", void 0);
        /** 平滑滚动 */ _define_property(this, "st", void 0);
        _define_property(this, "mouseStart", void 0);
        _define_property(this, "mouseMove", void 0);
        _define_property(this, "mouseEnd", void 0);
        _define_property(this, "touchStart", void 0);
        _define_property(this, "touchMove", void 0);
        _define_property(this, "touchEnd", void 0);
        // 如果e.target在拖动期间被移除, touchend不会触发, 需要再每次事件开始后进行绑定
        // https://stackoverflow.com/questions/9506041/events-mouseup-not-firing-after-mousemove
        _define_property(this, "bindTouchEvent", void 0);
        _define_property(this, "unBindTouchEvent", void 0);
        /** 真实的起始位置, 用于过滤掉点击和细微的移动 */ _define_property(this, "realPrevX", void 0);
        _define_property(this, "realPrevY", void 0);
        _define_property(this, "start", void 0);
        _define_property(this, "realStart", void 0);
        _define_property(this, "move", void 0);
        _define_property(this, "end", void 0);
        this.config = config;
        this.mouseStart = function(e) {
            _this.start(_this.getEventByMouse(e));
        };
        this.mouseMove = function(e) {
            _this.move(_this.getEventByMouse(e));
        };
        this.mouseEnd = function(e) {
            _this.end(_this.getEventByMouse(e));
        };
        this.touchStart = function(e) {
            _this.start(_this.getEventByTouch(e));
        };
        this.touchMove = function(e) {
            _this.move(_this.getEventByTouch(e));
        };
        this.touchEnd = function(e) {
            _this.end(_this.getEventByTouch(e));
        };
        this.bindTouchEvent = function(target) {
            target.addEventListener("touchmove", _this.touchMove);
            target.addEventListener("touchend", _this.touchEnd);
            _this.lastBindTarget = target;
        };
        this.unBindTouchEvent = function(target) {
            target.removeEventListener("touchmove", _this.touchMove);
            target.removeEventListener("touchend", _this.touchEnd);
        };
        this.start = function(e) {
            var _e_xy = _sliced_to_array(e.xy, 2), clientX = _e_xy[0], clientY = _e_xy[1];
            if (_this.config.triggerFilter) {
                var interrupt = _this.config.triggerFilter(e);
                if (interrupt) return;
            }
            // 立即停止当前滚动
            _this.st.xAll = 0;
            _this.st.yAll = 0;
            _this.realPrevX = clientX;
            _this.realPrevY = clientY;
            if (_this.touchEnable) {
                _this.bindTouchEvent(e.target);
            }
        };
        this.realStart = function(e) {
            var _e_xy = _sliced_to_array(e.xy, 2), clientX = _e_xy[0], clientY = _e_xy[1];
            // 记录信息
            _this.prevX = clientX;
            _this.prevY = clientY;
            _this.startX = clientX;
            _this.startY = clientY;
            _this.realPrevX = undefined;
            _this.realPrevY = undefined;
            _this.startTime = Date.now();
        };
        this.move = function(e) {
            var _e_xy = _sliced_to_array(e.xy, 2), clientX = _e_xy[0], clientY = _e_xy[1];
            // 处理tap过滤
            if (isNumber(_this.realPrevX) && isNumber(_this.realPrevY)) {
                var diffX = Math.abs(_this.realPrevX - clientX);
                var diffY = Math.abs(_this.realPrevY - clientY);
                if (diffX > DragScroll.TAP_DISTANCE || diffY > DragScroll.TAP_DISTANCE) {
                    _this.realStart(e);
                }
                return;
            }
            // 实际的move逻辑
            if (_this.prevX === undefined || _this.prevY === undefined) return;
            var deltaX = (_this.prevX - clientX) * DragScroll.SCALE_RATIO;
            var deltaY = (_this.prevY - clientY) * DragScroll.SCALE_RATIO;
            _this.prevX = clientX;
            _this.prevY = clientY;
            if (deltaY || deltaX) {
                _this.st.trigger({
                    deltaX: deltaX,
                    deltaY: deltaY
                });
            }
        };
        this.end = function(e) {
            if (_this.touchEnable) {
                _this.unBindTouchEvent(e.target);
            }
            _this.realPrevX = undefined;
            _this.realPrevY = undefined;
            if (_this.prevX === undefined || _this.prevY === undefined) return;
            var _e_xy = _sliced_to_array(e.xy, 2), clientX = _e_xy[0], clientY = _e_xy[1];
            var duration = Date.now() - _this.startTime;
            var movementX = _this.startX - clientX;
            var movementY = _this.startY - clientY;
            // 距离
            var totalDistance = Math.sqrt(Math.pow(movementX, 2) + Math.pow(movementY, 2));
            // 平均速度
            var averageSpeed = totalDistance / duration;
            // 大于阈值, 需要添加额外的惯性移动距离
            if (averageSpeed > DragScroll.INERTIA_TRIGGER_THRESHOLD) {
                // // 惯性距离占实际移动距离的比例
                var ratio = averageSpeed / DragScroll.INERTIA_TRIGGER_THRESHOLD * DragScroll.DECAY_FACTOR;
                var distanceX = movementX * ratio;
                var distanceY = movementY * ratio;
                _this.st.trigger({
                    deltaX: distanceX,
                    deltaY: distanceY
                });
            }
            _this.prevX = undefined;
            _this.prevY = undefined;
            _this.startX = undefined;
            _this.startY = undefined;
            _this.startTime = undefined;
            return;
        };
        this.touchEnable = config.type.includes("touch");
        this.mouseEnable = config.type.includes("mouse");
        this.mount();
    }
    _create_class(DragScroll, [
        {
            key: "scrolling",
            get: /** 正在执行滚动 */ function get() {
                return this.st.running;
            }
        },
        {
            key: "mount",
            value: function mount() {
                this.st = new SmoothTrigger({
                    trigger: this.config.trigger
                });
                if (this.mouseEnable) {
                    this.config.el.addEventListener("mousedown", this.mouseStart);
                    document.addEventListener("mousemove", this.mouseMove);
                    document.addEventListener("mouseup", this.mouseEnd);
                }
                if (this.touchEnable) {
                    this.config.el.addEventListener("touchstart", this.touchStart);
                }
            }
        },
        {
            // 销毁
            key: "destroy",
            value: function destroy() {
                this.config.el.removeEventListener("mousedown", this.mouseStart);
                document.removeEventListener("mousemove", this.mouseMove);
                document.removeEventListener("mouseup", this.mouseEnd);
                this.config.el.removeEventListener("touchstart", this.touchStart);
                if (this.lastBindTarget) {
                    this.unBindTouchEvent(this.lastBindTarget);
                    this.lastBindTarget = undefined;
                }
                this.st.destroy();
            }
        },
        {
            key: "getEventByMouse",
            value: function getEventByMouse(e) {
                return {
                    xy: [
                        e.clientX,
                        e.clientY
                    ],
                    offset: getEventOffset(e, this.config.el),
                    target: e.target
                };
            }
        },
        {
            key: "getEventByTouch",
            value: function getEventByTouch(e) {
                var point = e.changedTouches[0];
                return {
                    xy: [
                        point.clientX,
                        point.clientY
                    ],
                    offset: getEventOffset(e, this.config.el),
                    target: e.target
                };
            }
        }
    ]);
    return DragScroll;
}();
/** 触发惯性滚动的阈值, 拖动速度大于此值时触发额外的惯性滚动 */ _define_property(DragScroll, "INERTIA_TRIGGER_THRESHOLD", 2.6);
/** 计算惯性移动距离时的衰减率 */ _define_property(DragScroll, "DECAY_FACTOR", 0.7);
// 实际移动距离 = 拖动距离 * SCALE_RATIO, 值越大, 则滚动越灵敏
_define_property(DragScroll, "SCALE_RATIO", 1.2);
// 小于此距离视为tap, 不触发滚动
_define_property(DragScroll, "TAP_DISTANCE", 5);
export var DragScrollEventType;
(function(DragScrollEventType) {
    /** 针对鼠标事件进行模拟 */ DragScrollEventType["mouse"] = "mouse";
    /** 针对触摸事件进行模拟 */ DragScrollEventType["touch"] = "touch";
})(DragScrollEventType || (DragScrollEventType = {}));
