import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { getEventOffset } from "@m78/utils";
import debounce from "lodash/debounce.js";
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
        /** 在某些时候可以通过此项禁用内部的scroll监听, 防止重复触发 */ _this.disableScrollListener = false;
        _this.onContext = function(e) {
            e.preventDefault();
        };
        _this.onClick = function(e) {
            var pInfo = _this.table.transformViewportPoint(getEventOffset(e, _this.config.el));
            var event = _this.table.event;
            var items = _this.table.getAreaBound(pInfo.xy);
            if (items.cells.length) {
                event.click.emit(items.cells[0], e);
            }
        };
        /** 滚动 */ _this.onWheel = function(e) {
            if (e) {
                e.preventDefault();
            }
            if (e.shiftKey) {
                _this.table.setX(_this.table.getX() + e.deltaY);
            } else {
                _this.table.setXY(_this.table.getX() + e.deltaX, _this.table.getY() + e.deltaY);
            }
        };
        /** 操作滚动条时同步滚动位置 */ _this.onScroll = function() {
            if (_this.disableScrollListener) return;
            var el = _this.context.viewEl;
            _this.context.xyShouldNotify = true;
            _this.table.setXY(el.scrollLeft, el.scrollTop);
            _this.context.xyShouldNotify = false;
        };
        /** 延迟100毫秒后将disableScrollListener设置为false, 内置防抖逻辑, 可以多次调用 */ _this.scrollEndTrigger = debounce(function() {
            _this.disableScrollListener = false;
        }, 100, {
            leading: false,
            trailing: true
        });
        /** 用于手动设置滚动位置时, 在回调期间内防止触发内部onScroll事件 */ _this.scrollAction = function(cb) {
            _this.disableScrollListener = true;
            cb();
            _this.scrollEndTrigger();
        };
        return _this;
    }
    var _proto = _TableEventPlugin.prototype;
    _proto.initialized = function initialized() {
        this.config.el.addEventListener("click", this.onClick);
        this.config.el.addEventListener("contextmenu", this.onContext);
        this.context.viewEl.addEventListener("wheel", this.onWheel);
        this.context.viewEl.addEventListener("scroll", this.onScroll);
    };
    _proto.beforeDestroy = function beforeDestroy() {
        this.config.el.removeEventListener("click", this.onClick);
        this.config.el.removeEventListener("contextmenu", this.onContext);
        this.context.viewEl.removeEventListener("wheel", this.onWheel);
        this.context.viewEl.removeEventListener("scroll", this.onScroll);
    };
    return _TableEventPlugin;
}(TablePlugin);
export var TableFeedback;
(function(TableFeedback) {
    TableFeedback[/** 内容移除的单元格 */ "overflow"] = "overflow";
    TableFeedback[/** 错误 */ "error"] = "error";
    TableFeedback[/** 禁用项 */ "disable"] = "disable";
    TableFeedback[/** 常规提醒 */ "regular"] = "regular";
    TableFeedback[/** 关闭 */ "close"] = "close";
})(TableFeedback || (TableFeedback = {}));
