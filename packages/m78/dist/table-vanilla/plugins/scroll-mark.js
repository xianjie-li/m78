import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { removeNode } from "../../common/index.js";
export var _TableScrollMarkPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableScrollMarkPlugin, TablePlugin);
    var _super = _create_super(_TableScrollMarkPlugin);
    function _TableScrollMarkPlugin() {
        _class_call_check(this, _TableScrollMarkPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 可见性更新 */ _this.updateVisible = function() {
            var ctx = _this.context;
            var x = _this.table.x();
            var y = _this.table.y();
            var touchTop = y === 0;
            var touchBottom = Math.ceil(y) >= _this.table.maxY(); // 为什么会出现小数?
            var touchLeft = x === 0;
            var touchRight = Math.ceil(x) >= _this.table.maxX();
            _this.tEl.style.opacity = touchTop || !ctx.topFixedHeight ? "0" : "1";
            _this.bEl.style.opacity = touchBottom || !ctx.bottomFixedHeight ? "0" : "1";
            _this.lEl.style.opacity = touchLeft || !ctx.leftFixedWidth ? "0" : "1";
            _this.rEl.style.opacity = touchRight || !ctx.rightFixedWidth ? "0" : "1";
        };
        return _this;
    }
    var _proto = _TableScrollMarkPlugin.prototype;
    _proto.mount = function mount() {
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
    };
    _proto.beforeDestroy = function beforeDestroy() {
        removeNode(this.wrapNode);
    };
    _proto.rendering = function rendering() {
        this.updateVisible();
    };
    _proto.reload = function reload() {
        this.updateBound();
        this.updateVisible();
    };
    /** 位置尺寸更新 */ _proto.updateBound = function updateBound() {
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
    };
    return _TableScrollMarkPlugin;
}(TablePlugin);
