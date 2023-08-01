import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _create_class from "@swc/helpers/src/_create_class.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { createEvent, isNumber } from "@m78/utils";
import { Gesture } from "@use-gesture/vanilla";
// 在单独的模块提供
export var VirtualBound = /*#__PURE__*/ function() {
    "use strict";
    function VirtualBound(conf) {
        var _this = this;
        _class_call_check(this, VirtualBound);
        /** 所有bound */ this.bounds = [];
        /** 拖动中 */ this.dragging = false;
        /** 设置为false时, 将停止事件派发 */ this._enable = true;
        /** 最后触发hover的bound */ this.lastMoveEnterBound = null;
        /** 当前拖动的bound */ this.currentDragBound = null;
        /** 最后一次drag完成的时间, 用于现在drag后一定时间内不触发hover, 防止同时包含两个事件的bound在拖动完成后立即触发hover */ this.lastDragEndTime = 0;
        /** 监听move, 处理hover */ this.moveHandle = function(e) {
            if (_this.delayHoverTimer) {
                clearTimeout(_this.delayHoverTimer);
                _this.delayHoverTimer = null;
            }
            if (e.type === "pointerleave" || e.type === "mouseleave") {
                _this.triggerUnHover(e.event);
                return;
            }
            if (!_this.enable || _this.dragging) return;
            if (_this.lastDragEndTime) {
                var diff = Date.now() - _this.lastDragEndTime;
                if (diff < 200) return; // drag完成 200ms内不能触发hover
            }
            var bounds = _this.getBound(e.xy, true);
            var bound = bounds[0];
            if (_this.lastMoveEnterBound && _this.lastMoveEnterBound !== bound) {
                _this.triggerUnHover(e.event);
                return;
            }
            if (bound && _this.lastMoveEnterBound !== bound) {
                _this.delayHover(bound, e);
            }
        };
        /** 取消hover */ this.triggerUnHover = function(event) {
            if (!_this.lastMoveEnterBound) return;
            _this.hover.emit({
                bound: _this.lastMoveEnterBound,
                hover: false,
                event: event
            });
            _this.lastMoveEnterBound = null;
            if (!_this.dragging) {
                _this.cursor = null;
            }
        };
        /** 延迟触发hover */ this.delayHover = function(bound, e) {
            _this.delayHoverTimer = setTimeout(function() {
                var bounds = _this.getBound(e.xy, true);
                var _bound = bounds[0];
                // 最新的hover项已经不是该项
                if (!_bound || bound !== _bound) return;
                var ev = {
                    bound: bound,
                    hover: true,
                    event: e.event
                };
                if (_this.hoverPreCheck && _this.hoverPreCheck(e.event)) return;
                _this.lastMoveEnterBound = bound;
                _this.hover.emit(ev);
                if (bound.hoverCursor) _this.cursor = bound.hoverCursor;
            }, _this.hoverDelay);
        };
        this.dragHandle = function(e) {
            if (!_this.enable) {
                e.cancel();
                return;
            }
            if (e.tap) {
                var bounds = _this.getBound(e.xy, true);
                if (!bounds.length) return;
                _this.click.emit({
                    bound: bounds[0],
                    event: e.event
                });
                return;
            }
            if (e.canceled) return;
            if (e.first) {
                if (_this.dragPreCheck && _this.dragPreCheck(e.event)) {
                    e.cancel();
                    return;
                }
                var curBound = _this.getBound(e.xy, true);
                if (!curBound.length) {
                    e.cancel();
                    return;
                }
                _this.dragging = true;
                _this.cursor = "grabbing";
                _this.currentDragBound = curBound[0];
            }
            _this.drag.emit({
                bound: _this.currentDragBound,
                delta: e.delta,
                movement: e.movement,
                xy: e.xy,
                first: e.first,
                last: e.last,
                event: e.event
            });
            if (e.last) {
                _this.cursor = null;
                _this.currentDragBound = null;
                _this.dragging = false;
                _this.lastDragEndTime = Date.now();
            }
        };
        this.el = conf.el;
        this.hoverDelay = isNumber(conf.hoverDelay) ? conf.hoverDelay : 30;
        this.hoverPreCheck = conf.hoverPreCheck;
        this.dragPreCheck = conf.dragPreCheck;
        this.click = createEvent();
        this.hover = createEvent();
        this.drag = createEvent();
        this.bindEvents();
    }
    var _proto = VirtualBound.prototype;
    /** 清理所有占用 */ _proto.destroy = function destroy() {
        this.el.removeEventListener("mouseleave", this.triggerUnHover);
        this.gesture.destroy();
        this.click.empty();
        this.hover.empty();
        this.drag.empty();
        this.bounds = [];
        this.el = null;
    };
    /** 获取指定点的所有bound, 传入zIndexCheck可以在点上有多个bound时获取层级最高的那个 */ _proto.getBound = function getBound(xy, zIndexCheck) {
        var _this = this;
        var bounds = this.bounds.filter(function(i) {
            return _this.inBoundCheck(xy, i);
        });
        if (!zIndexCheck || bounds.length <= 1) return bounds;
        var bound = undefined;
        var max = 0;
        bounds.forEach(function(i) {
            if (i.zIndex >= max) {
                max = i.zIndex;
                bound = i;
            }
        });
        return bound ? [
            bound
        ] : [];
    };
    /** 指定点是否包含bound */ _proto.hasBound = function hasBound(xy) {
        for(var i = 0; i < this.bounds.length; i++){
            var cur = this.bounds[i];
            if (this.inBoundCheck(xy, cur)) return true;
        }
        return false;
    };
    /** 绑定事件 */ _proto.bindEvents = function bindEvents() {
        this.gesture = new Gesture(this.el, {
            onMove: this.moveHandle,
            onDrag: this.dragHandle
        }, {
            drag: {
                filterTaps: true,
                tapsThreshold: 1
            }
        });
        this.el.addEventListener("mouseleave", this.triggerUnHover);
    };
    /** xy是否在bound内 */ _proto.inBoundCheck = function inBoundCheck(xy, bound) {
        var _xy = _sliced_to_array(xy, 2), x = _xy[0], y = _xy[1];
        var left = bound.left, top = bound.top, width = bound.width, height = bound.height;
        return x >= left && x <= left + width && y >= top && y <= top + height;
    };
    _create_class(VirtualBound, [
        {
            key: "enable",
            get: function get() {
                return this._enable;
            },
            set: function set(v) {
                this._enable = v;
                if (!v && this._enable) {
                    this.cursor = null;
                    this.triggerUnHover();
                }
            }
        },
        {
            key: "cursor",
            get: /** 获取当前光标类型 */ function get() {
                return this._cursor;
            },
            set: /** 设置当前光标类型 */ function set(v) {
                this._cursor = v;
                this.el.style.cursor = v ? v : "";
            }
        }
    ]);
    return VirtualBound;
}();
