import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { _getSizeString } from "../common.js";
import { _TableEventPlugin } from "./event.js";
export var _TableSetterPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableSetterPlugin, TablePlugin);
    var _super = _create_super(_TableSetterPlugin);
    function _TableSetterPlugin() {
        _class_call_check(this, _TableSetterPlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _TableSetterPlugin.prototype;
    _proto.beforeInit = function beforeInit() {
        this.methodMapper(this.table, [
            "setX",
            "setY",
            "setXY",
            "setWidth",
            "setHeight", 
        ]);
    };
    _proto.init = function init() {
        this.event = this.getPlugin(_TableEventPlugin);
    };
    _proto.setHeight = function setHeight(height) {
        this.config.el.style.height = _getSizeString(height);
        this.table.render();
    };
    _proto.setWidth = function setWidth(width) {
        this.config.el.style.width = _getSizeString(width);
        this.table.render();
    };
    _proto.setX = function setX(x) {
        var _this = this;
        var ctx = this.context;
        var viewEl = ctx.viewEl;
        var run = function() {
            viewEl.scrollLeft = x;
            _this.table.renderSync();
        };
        // 阻断/不阻断内部onScroll事件
        if (!ctx.xyShouldNotify) {
            this.event.scrollAction(run);
        } else {
            run();
        }
    };
    _proto.setY = function setY(y) {
        var _this = this;
        var ctx = this.context;
        var viewEl = ctx.viewEl;
        var run = function() {
            viewEl.scrollTop = y;
            _this.table.renderSync();
        };
        // 阻断/不阻断内部onScroll事件
        if (!ctx.xyShouldNotify) {
            this.event.scrollAction(run);
        } else {
            run();
        }
    };
    _proto.setXY = function setXY(x, y) {
        var _this = this;
        this.table.takeover(function() {
            _this.setX(x);
            _this.setY(y);
        });
    };
    return _TableSetterPlugin;
}(TablePlugin);
