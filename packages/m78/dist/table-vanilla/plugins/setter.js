import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { _getSizeString } from "../common.js";
import { _TableEventPlugin } from "./event.js";
export var _TableSetterPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableSetterPlugin, TablePlugin);
    var _super = _create_super(_TableSetterPlugin);
    function _TableSetterPlugin() {
        _class_call_check(this, _TableSetterPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 用于滚动优化 */ _define_property(_assert_this_initialized(_this), "event", void 0);
        return _this;
    }
    _create_class(_TableSetterPlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.methodMapper(this.table, [
                    "setX",
                    "setY",
                    "setXY",
                    "setWidth",
                    "setHeight"
                ]);
                this.methodMapper(this.context, [
                    "setCursor"
                ]);
            }
        },
        {
            key: "init",
            value: function init() {
                this.event = this.getPlugin(_TableEventPlugin);
            }
        },
        {
            key: "setHeight",
            value: function setHeight(height) {
                this.config.el.style.height = _getSizeString(height);
                this.table.render();
            }
        },
        {
            key: "setWidth",
            value: function setWidth(width) {
                this.config.el.style.width = _getSizeString(width);
                this.table.render();
            }
        },
        {
            key: "setX",
            value: function setX(x) {
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
            }
        },
        {
            key: "setY",
            value: function setY(y) {
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
            }
        },
        {
            key: "setXY",
            value: function setXY(x, y) {
                var _this = this;
                this.table.takeover(function() {
                    _this.setX(x);
                    _this.setY(y);
                });
            }
        },
        {
            key: "setCursor",
            value: function setCursor(cursor) {
                this.config.el.style.cursor = cursor;
            }
        }
    ]);
    return _TableSetterPlugin;
}(TablePlugin);
