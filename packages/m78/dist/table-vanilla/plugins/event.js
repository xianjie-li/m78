import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { getEventOffset, rafCaller } from "@m78/utils";
import debounce from "lodash/debounce.js";
import { SmoothWheel } from "@m78/utils";
/**
 * 内部事件绑定, 外部事件派发
 * */ export var _TableEventPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableEventPlugin, TablePlugin);
    var _super = _create_super(_TableEventPlugin);
    function _TableEventPlugin() {
        _class_call_check(this, _TableEventPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 在某些时候可以通过此项禁用内部的scroll监听, 防止重复触发 */ _define_property(_assert_this_initialized(_this), "disableScrollListener", false);
        /** 处理onwheel在平滑滚动, 主要是针对鼠标 */ _define_property(_assert_this_initialized(_this), "smoothWheel", void 0);
        /** 优化render函数 */ _define_property(_assert_this_initialized(_this), "scrollRafCaller", void 0);
        _define_property(_assert_this_initialized(_this), "scrollRafClear", void 0);
        _define_property(_assert_this_initialized(_this), "onContext", function(e) {
            e.preventDefault();
        });
        _define_property(_assert_this_initialized(_this), "onClick", function(e) {
            var pInfo = _this.table.transformViewportPoint(getEventOffset(e, _this.config.el));
            var event = _this.table.event;
            var items = _this.table.getAreaBound(pInfo.xy);
            if (items.cells.length) {
                event.click.emit(items.cells[0], e);
            }
        });
        /** 滚动 */ _define_property(_assert_this_initialized(_this), "onWheel", function(e) {
            _this.table.setXY(_this.table.getX() + e.x, _this.table.getY() + e.y);
        });
        /** 操作滚动条时同步滚动位置 */ _define_property(_assert_this_initialized(_this), "onScroll", function() {
            if (_this.disableScrollListener) return;
            var el = _this.context.viewEl;
            _this.scrollRafClear = _this.scrollRafCaller(function() {
                _this.context.xyShouldNotify = true;
                _this.table.setXY(el.scrollLeft, el.scrollTop);
                _this.context.xyShouldNotify = false;
            });
        });
        /** 延迟100毫秒后将disableScrollListener设置为false, 内置防抖逻辑, 可以多次调用 */ _define_property(_assert_this_initialized(_this), "scrollEndTrigger", debounce(function() {
            _this.disableScrollListener = false;
        }, 100, {
            leading: false,
            trailing: true
        }));
        /** 用于手动设置滚动位置时, 在回调期间内防止触发内部onScroll事件 */ _define_property(_assert_this_initialized(_this), "scrollAction", function(cb) {
            _this.disableScrollListener = true;
            cb();
            _this.scrollEndTrigger();
        });
        return _this;
    }
    _create_class(_TableEventPlugin, [
        {
            key: "init",
            value: function init() {
                this.scrollRafCaller = rafCaller();
            }
        },
        {
            key: "initialized",
            value: function initialized() {
                this.config.el.addEventListener("click", this.onClick);
                this.config.el.addEventListener("contextmenu", this.onContext);
                this.context.viewEl.addEventListener("scroll", this.onScroll);
                this.smoothWheel = new SmoothWheel({
                    el: this.context.viewEl,
                    trigger: this.onWheel
                });
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                if (this.scrollRafClear) this.scrollRafClear();
                this.config.el.removeEventListener("click", this.onClick);
                this.config.el.removeEventListener("contextmenu", this.onContext);
                this.context.viewEl.removeEventListener("scroll", this.onScroll);
                this.smoothWheel.destroy();
            }
        }
    ]);
    return _TableEventPlugin;
}(TablePlugin);
