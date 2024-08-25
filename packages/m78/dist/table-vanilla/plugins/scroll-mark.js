import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { removeNode } from "../../common/index.js";
import { setCacheValue } from "@m78/utils";
export var _TableScrollMarkPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableScrollMarkPlugin, TablePlugin);
    var _super = _create_super(_TableScrollMarkPlugin);
    function _TableScrollMarkPlugin() {
        _class_call_check(this, _TableScrollMarkPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 容器 */ _define_property(_assert_this_initialized(_this), "wrapNode", void 0);
        _define_property(_assert_this_initialized(_this), "tEl", void 0);
        _define_property(_assert_this_initialized(_this), "rEl", void 0);
        _define_property(_assert_this_initialized(_this), "bEl", void 0);
        _define_property(_assert_this_initialized(_this), "lEl", void 0);
        /** 可见性更新 */ _define_property(_assert_this_initialized(_this), "updateVisible", function() {
            var ctx = _this.context;
            var x = _this.table.getX();
            var y = _this.table.getY();
            var touchTop = y === 0;
            var touchBottom = Math.ceil(y) >= _this.table.getMaxY(); // 为什么会出现小数?
            var touchLeft = x === 0;
            var touchRight = Math.ceil(x) >= _this.table.getMaxX();
            setCacheValue(_this.tEl.style, "opacity", touchTop || !ctx.topFixedHeight ? "0" : "1");
            setCacheValue(_this.bEl.style, "opacity", touchBottom || !ctx.bottomFixedHeight ? "0" : "1");
            setCacheValue(_this.lEl.style, "opacity", touchLeft || !ctx.leftFixedWidth ? "0" : "1");
            setCacheValue(_this.rEl.style, "opacity", touchRight || !ctx.rightFixedWidth ? "0" : "1");
        });
        return _this;
    }
    _create_class(_TableScrollMarkPlugin, [
        {
            key: "mounted",
            value: function mounted() {
                var wrapNode = document.createElement("div");
                wrapNode.className = "m78-table_scroll-mark-wrap";
                this.tEl = document.createElement("div");
                this.rEl = document.createElement("div");
                this.bEl = document.createElement("div");
                this.lEl = document.createElement("div");
                this.tEl.className = "m78-table_scroll-mark __top";
                this.rEl.className = "m78-table_scroll-mark __right";
                this.bEl.className = "m78-table_scroll-mark __bottom";
                this.lEl.className = "m78-table_scroll-mark __left";
                wrapNode.appendChild(this.tEl);
                wrapNode.appendChild(this.rEl);
                wrapNode.appendChild(this.bEl);
                wrapNode.appendChild(this.lEl);
                this.config.el.appendChild(wrapNode);
                this.updateBound();
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                removeNode(this.wrapNode);
            }
        },
        {
            key: "rendering",
            value: function rendering() {
                this.updateVisible();
            }
        },
        {
            key: "reload",
            value: function reload() {
                this.updateBound();
                this.updateVisible();
            }
        },
        {
            /** 位置尺寸更新 */ key: "updateBound",
            value: function updateBound() {
                var ctx = this.context;
                var left = ctx.leftFixedWidth;
                var top = ctx.topFixedHeight;
                var right = ctx.rightFixedWidth;
                var bottom = ctx.bottomFixedHeight;
                // 下面的1px为修正位置, 使阴影看起来更贴合边缘
                this.tEl.style.top = "".concat(top - 1, "px");
                this.bEl.style.bottom = "".concat(bottom - 1, "px");
                this.rEl.style.right = "".concat(right - 1, "px");
                this.lEl.style.left = "".concat(left - 1, "px");
            }
        }
    ]);
    return _TableScrollMarkPlugin;
}(TablePlugin);
