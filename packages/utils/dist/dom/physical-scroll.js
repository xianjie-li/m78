// 轻扫: 事件小于一定比例时算作轻扫, 添加惯性滚动效果
// 惯性滚动距离: 根据滑动距离而定, 越大则滚动越远
// 惯性滚动持续时间: 根据滑动距离而定, 越大则持续时间越久
// 重新开始拖动时, 停止之前的惯性滚动
// 触发阈值, 用于用户操作移动幅度过小时跳过惯性
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { raf } from "../bom.js";
import { getEventOffset } from "../dom.js";
import { clamp } from "../number.js";
var triggerThreshold = 2;
// 轻扫触发的时间阈值, ms
var lightSweep = 280;
// 最小动画时间
var minDuration = 600;
// 最大动画时间
var maxDuration = 2200;
// 假设的最大移动距离
var maxDistance = 1600;
// 略过过小的移动
var ignoreMove = 30;
export var PhysicalScrollEventType;
(function(PhysicalScrollEventType) {
    PhysicalScrollEventType[/** 针对鼠标事件进行模拟 */ "mouse"] = "mouse";
    PhysicalScrollEventType[/** 针对触摸事件进行模拟 */ "touch"] = "touch";
})(PhysicalScrollEventType || (PhysicalScrollEventType = {}));
/**
 * 在指定元素上模拟拖拽滚动的物理效果
 *
 * 前置条件:
 * - 滚动容器必须设置为overflow: hidden, 并且容器内容尺寸需超过滚动容器
 * - 在触摸设备, 通常要为滚动容器添加css: touch-action: none
 * */ export var PhysicalScroll = /*#__PURE__*/ function() {
    "use strict";
    function PhysicalScroll(config) {
        var _this = this;
        _class_call_check(this, PhysicalScroll);
        this.config = config;
        this.// 每次开始事件后记录每一次移动的距离, 在结束后取尾端项作为样本判断手势意图
        moveXList = [];
        this.moveYList = [];
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
            var _xy = _sliced_to_array(e.xy, 2), clientX = _xy[0], clientY = _xy[1];
            if (_this.config.triggerFilter) {
                var interrupt = _this.config.triggerFilter(e);
                if (interrupt) return;
            }
            // 清理之前的状态
            _this.clear();
            // 记录信息
            _this.prevX = clientX;
            _this.prevY = clientY;
            _this.startX = clientX;
            _this.startY = clientY;
            _this.startTime = Date.now();
            if (_this.touchEnable) {
                _this.bindTouchEvent(e.target);
            }
        };
        this.move = function(e) {
            var _config, ref;
            if (_this.prevX === undefined || _this.prevY === undefined) return;
            var _xy = _sliced_to_array(e.xy, 2), clientX = _xy[0], clientY = _xy[1];
            var offsetX = clientX - _this.prevX;
            var offsetY = clientY - _this.prevY;
            var ref1 = _sliced_to_array(_this.getScrollPosition(), 2), x = ref1[0], y = ref1[1];
            x = x - offsetX;
            y = y - offsetY;
            if (!_this.config.onlyNotify) {
                _this.setScrollPosition([
                    x,
                    y
                ]);
            }
            (ref = (_config = _this.config).onScroll) === null || ref === void 0 ? void 0 : ref.call(_config, [
                x,
                y
            ], false);
            var now = Date.now();
            _this.moveXList.push([
                offsetX,
                now
            ]);
            _this.moveYList.push([
                offsetY,
                now
            ]);
            _this.prevX = clientX;
            _this.prevY = clientY;
        };
        this.end = function(e) {
            if (_this.touchEnable) {
                _this.unBindTouchEvent(e.target);
            }
            if (_this.prevX === undefined || _this.prevY === undefined) return;
            var _xy = _sliced_to_array(e.xy, 2), clientX = _xy[0], clientY = _xy[1];
            var offsetX = clientX - _this.startX;
            var offsetY = clientY - _this.startY;
            var duration = Date.now() - _this.startTime;
            _this.prevX = undefined;
            _this.prevY = undefined;
            _this.startY = undefined;
            _this.startY = undefined;
            var absX = Math.abs(offsetX);
            var absY = Math.abs(offsetY);
            // 样本截取开始事件
            var sampleTimeStart = _this.startTime + duration * 0.8;
            // 用于检测拖动结尾时的停顿, 若有明显停顿不应触发惯性
            var endXSvgMove = Math.abs(_this.getSampleOffset(sampleTimeStart, _this.moveXList) || 0);
            var endYSvgMove = Math.abs(_this.getSampleOffset(sampleTimeStart, _this.moveYList) || 0);
            if (duration > lightSweep || endXSvgMove < triggerThreshold && endYSvgMove < triggerThreshold) {
                return;
            }
            // 不同轴的惯性移动距离倍数, 移动距离约远惯性倍数越大
            var timesX = clamp(Math.abs(offsetX) / 100, 2, 10);
            var timesY = clamp(Math.abs(offsetY) / 100, 2, 10);
            // 略过过小的移动
            if (absY < ignoreMove) offsetY = 0;
            if (absX < ignoreMove) offsetX = 0;
            var movementX = offsetX * timesX;
            var movementY = offsetY * timesY;
            // x或y轴移动距离中较大的一个
            var maxMovement = Math.max(Math.abs(movementX), Math.abs(movementY));
            // 动画时间, 移动距离越大则约长
            var animationDuration = maxDuration * (maxMovement / maxDistance);
            animationDuration = clamp(animationDuration, minDuration, maxDuration);
            _this.autoScroll(movementX, movementY, animationDuration);
        };
        this.clear = function() {
            if (_this.rafClear) _this.rafClear();
            _this.autoScrollStartTime = undefined;
            _this.lastDistanceY = undefined;
            _this.lastDistanceX = undefined;
            _this.prevX = undefined;
            _this.prevY = undefined;
            _this.startY = undefined;
            _this.startY = undefined;
            _this.moveXList = [];
            _this.moveYList = [];
        };
        this.touchEnable = config.type.includes(PhysicalScrollEventType.touch);
        this.mouseEnable = config.type.includes(PhysicalScrollEventType.mouse);
        this.mount();
    }
    var _proto = PhysicalScroll.prototype;
    _proto.mount = function mount() {
        if (this.mouseEnable) {
            this.config.el.addEventListener("mousedown", this.mouseStart);
            document.addEventListener("mousemove", this.mouseMove);
            document.addEventListener("mouseup", this.mouseEnd);
        }
        if (this.touchEnable) {
            this.config.el.addEventListener("touchstart", this.touchStart);
        }
    };
    // 销毁
    _proto.destroy = function destroy() {
        this.config.el.removeEventListener("mousedown", this.mouseStart);
        document.removeEventListener("mousemove", this.mouseMove);
        document.removeEventListener("mouseup", this.mouseEnd);
        this.config.el.removeEventListener("touchstart", this.touchStart);
        if (this.lastBindTarget) {
            this.unBindTouchEvent(this.lastBindTarget);
            this.lastBindTarget = undefined;
        }
    };
    _proto.getEventByMouse = function getEventByMouse(e) {
        return {
            xy: [
                e.clientX,
                e.clientY
            ],
            offset: getEventOffset(e, this.config.el),
            target: e.target
        };
    };
    _proto.getEventByTouch = function getEventByTouch(e) {
        var point = e.changedTouches[0];
        return {
            xy: [
                point.clientX,
                point.clientY
            ],
            offset: getEventOffset(e, this.config.el),
            target: e.target
        };
    };
    /** 根据对应轴的移动距离和持续时间执行自动滚动 */ _proto.autoScroll = function autoScroll(xDistance, yDistance, duration) {
        var _this = this;
        this.rafClear = raf(function(t) {
            var _config, ref;
            if (!_this.autoScrollStartTime) _this.autoScrollStartTime = t;
            var cost = t - _this.autoScrollStartTime;
            if (cost > duration) {
                _this.autoScrollStartTime = undefined;
                return;
            }
            // 当前在持续时间的比例
            var timeRatio = Math.min(cost / duration, 1);
            // 缓动基数, 越靠近动画结束越慢
            var base = 1 - Math.pow(2, -10 * timeRatio);
            var distanceX = xDistance * base;
            var distanceY = yDistance * base;
            if (!_this.lastDistanceX) _this.lastDistanceX = distanceX;
            if (!_this.lastDistanceY) _this.lastDistanceY = distanceY;
            var moveX = distanceX - _this.lastDistanceX;
            var moveY = distanceY - _this.lastDistanceY;
            var ref1 = _sliced_to_array(_this.getScrollPosition(), 2), x = ref1[0], y = ref1[1];
            x = x - moveX;
            y = y - moveY;
            // 这里需要同步更新滚动位置
            if (!_this.config.onlyNotify) {
                _this.setScrollPosition([
                    x,
                    y
                ]);
            }
            (ref = (_config = _this.config).onScroll) === null || ref === void 0 ? void 0 : ref.call(_config, [
                x,
                y
            ], true);
            _this.lastDistanceX = distanceX;
            _this.lastDistanceY = distanceY;
            _this.autoScroll(xDistance, yDistance, duration);
        });
    };
    _proto.getScrollPosition = function getScrollPosition() {
        var conf = this.config;
        if (conf.positionGetter) return conf.positionGetter();
        return [
            conf.el.scrollLeft,
            conf.el.scrollTop
        ];
    };
    _proto.setScrollPosition = function setScrollPosition(xy) {
        var conf = this.config;
        if (conf.positionSetter) {
            conf.positionSetter(xy);
            return;
        }
        conf.el.scrollLeft = xy[0];
        conf.el.scrollTop = xy[1];
    };
    /** 根据一组[offset, time]和提供的起始时间获取该时间之后移动距离的平均值, 如果最后一段时间未移动, 可能返回undefined */ _proto.getSampleOffset = function getSampleOffset(startTime, list) {
        var svg;
        for(var i = list.length - 1; i >= 0; i--){
            var _i = _sliced_to_array(list[i], 2), offset = _i[0], time = _i[1];
            if (time < startTime) {
                if (svg !== undefined) {
                    svg = svg / (list.length - 1 - i);
                }
                break;
            }
            if (svg === undefined) {
                svg = offset;
            } else {
                svg += offset;
            }
        }
        return svg;
    };
    return PhysicalScroll;
}();
