import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import debounce from "lodash/debounce.js";
import clamp from "lodash/clamp.js";
import { rafCaller } from "@m78/utils";
import { VirtualBound } from "../virtual-bound.js";
import { _TableMutationPlugin } from "./mutation.js";
import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { removeNode } from "../../common/index.js";
import { _tableTriggerFilters, _triggerFilterList } from "../common.js";
/** 列重置大小 */ export var _TableRowColumnResize = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableRowColumnResize, TablePlugin);
    var _super = _create_super(_TableRowColumnResize);
    function _TableRowColumnResize() {
        _class_call_check(this, _TableRowColumnResize);
        var _this;
        _this = _super.apply(this, arguments);
        /** 拖动中 */ _this.dragging = false;
        /** 是否触发了hover */ _this.hovering = false;
        /** 轴偏移 */ _this.dragOffsetX = 0;
        _this.dragOffsetY = 0;
        /** 每次render后根据ctx.lastViewportItems更新虚拟拖拽节点 */ _this.renderedDebounce = debounce(function() {
            var last = _this.context.lastViewportItems;
            if (!last) return;
            var wrapBound = _this.config.el.getBoundingClientRect();
            var cBounds = _this.createBound(wrapBound, last, false);
            var rBounds = _this.createBound(wrapBound, last, true);
            _this.virtualBound.bounds = cBounds.concat(rBounds);
        }, 100, {
            leading: false,
            trailing: true
        });
        _this.hoverHandle = function(param) {
            var bound = param.bound, hover = param.hover;
            var isRow = bound.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;
            _this.hovering = hover;
            if (hover) {
                isRow ? _this.updateYTipLine(bound.data.y) : _this.updateXTipLine(bound.data.x);
            } else if (!_this.dragging) {
                isRow ? _this.hideYTipLine() : _this.hideXTipLine();
            }
        };
        _this.dragHandle = function(param) {
            var bound = param.bound, first = param.first, last = param.last, delta = param.delta;
            var isRow = bound.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;
            if (first) {
                _this.dragging = true;
            }
            var data = bound.data;
            var prevOffset = isRow ? _this.dragOffsetY : _this.dragOffsetX;
            if (!last) {
                var size = isRow ? data.row.height : data.column.width;
                var min = isRow ? size - _TableRowColumnResize.MIN_ROW_HEIGHT : size - _TableRowColumnResize.MIN_COLUMN_WIDTH;
                var max = isRow ? _TableRowColumnResize.MAX_ROW_HEIGHT - size : _TableRowColumnResize.MAX_COLUMN_WIDTH - size;
                var movePos = isRow ? delta[1] : delta[0];
                var curOffset = data.reverse ? clamp(prevOffset + movePos, -max, min) : clamp(prevOffset + movePos, -min, max);
                if (isRow) {
                    _this.dragOffsetY = curOffset;
                    _this.updateYTipLine(data.y + _this.dragOffsetY);
                } else {
                    _this.dragOffsetX = curOffset;
                    _this.updateXTipLine(data.x + _this.dragOffsetX);
                }
            }
            if (last) {
                var offset = data.reverse ? -prevOffset : prevOffset;
                isRow ? _this.updateRowSize(data.row, offset) : _this.updateColumnSize(data.column, offset);
                _this.dragging = false;
                isRow ? _this.hideYTipLine() : _this.hideXTipLine();
                _this.dragOffsetX = 0;
                _this.dragOffsetY = 0;
            }
        };
        _this.scrollHandle = function() {
            _this.hideXTipLine();
            _this.hideYTipLine();
        };
        return _this;
    }
    var _proto = _TableRowColumnResize.prototype;
    _proto.initialized = function initialized() {
        var _this = this;
        // 创建line节点
        this.xLine = document.createElement("div");
        this.yLine = document.createElement("div");
        this.xLine.className = "m78-table_tip-line-x";
        this.yLine.className = "m78-table_tip-line-y";
        this.config.el.appendChild(this.xLine);
        this.config.el.appendChild(this.yLine);
        // 创建raf用于优化动画
        this.rafCaller = rafCaller();
        // 为virtualBound添加特定节点的过滤
        var vbPreCheck = function(e) {
            return _triggerFilterList(e.target, _tableTriggerFilters, _this.config.el);
        };
        // 虚拟节点&事件绑定
        this.virtualBound = new VirtualBound({
            el: this.config.el,
            hoverPreCheck: vbPreCheck,
            dragPreCheck: vbPreCheck
        });
        this.virtualBound.hover.on(this.hoverHandle);
        this.virtualBound.drag.on(this.dragHandle);
        this.context.viewEl.addEventListener("scroll", this.scrollHandle);
        // 选取过程中禁用
        this.table.event.selectStart.on(function() {
            _this.virtualBound.enable = false;
        });
        this.table.event.select.on(function() {
            _this.virtualBound.enable = true;
        });
    };
    _proto.rendered = function rendered() {
        this.virtualBound.bounds = [];
        this.renderedDebounce();
    };
    _proto.beforeDestroy = function beforeDestroy() {
        if (this.rafClearFn) this.rafClearFn();
        this.virtualBound.hover.empty();
        this.virtualBound.click.empty();
        this.virtualBound.drag.empty();
        this.virtualBound.destroy();
        this.virtualBound = null;
        this.context.viewEl.removeEventListener("scroll", this.scrollHandle);
        this.table.event.selectStart.empty();
        this.table.event.select.empty();
        removeNode(this.xLine);
        removeNode(this.yLine);
    };
    /** 生成虚拟节点 */ _proto.createBound = function createBound(wrapBound, last, isRow) {
        var ctx = this.context;
        var pos = isRow ? this.table.y() : this.table.x();
        var startFixedSize = isRow ? ctx.topFixedHeight : ctx.leftFixedWidth;
        var endFixedSize = isRow ? ctx.bottomFixedHeight : ctx.rightFixedWidth;
        var tableSize = isRow ? this.table.height() : this.table.width();
        // 开始/结束边界
        var startLine = pos + startFixedSize;
        var endLine = pos + tableSize - endFixedSize;
        var maxPos = isRow ? this.table.maxY() : this.table.maxX();
        // 滚动到底
        var touchEnd = Math.ceil(pos) >= maxPos;
        var bounds = [];
        // 虚拟节点大小
        var bSize = isRow ? 8 : 10;
        var list = isRow ? last.rows : last.columns;
        list.forEach(function(i) {
            var rowI = i;
            var colI = i;
            var size = isRow ? rowI.height : colI.width;
            var end = isRow ? rowI.y + size : colI.x + size;
            if (!i.isFixed && (end < startLine || end > endLine)) return;
            var _pos = i.isFixed ? i.fixedOffset + size : end - pos;
            var isEndFixed = colI.config.fixed === TableColumnFixed.right || rowI.config.fixed === TableRowFixed.bottom;
            var isEndFixedFirst = ctx.rightFixedList[0] === colI.key || ctx.bottomFixeList[0] === rowI.key;
            // 滚动到底时, 需要展示末尾项的拖拽, 由于相互覆盖, 需要隐藏固定项首项
            if (touchEnd && isEndFixedFirst) return;
            if (isEndFixed) {
                _pos -= size;
            }
            var left = isRow ? wrapBound.left : wrapBound.left + _pos - bSize / 2;
            var top = isRow ? wrapBound.top + _pos - bSize / 2 : wrapBound.top;
            var _obj;
            var b = {
                left: left,
                top: top,
                height: isRow ? bSize : ctx.yHeaderHeight,
                width: isRow ? ctx.xHeaderWidth : bSize,
                zIndex: i.isFixed ? 1 : 0,
                type: isRow ? _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY : _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY,
                cursor: "pointer",
                hoverCursor: isRow ? "row-resize" : "col-resize",
                data: (_obj = {}, _define_property(_obj, isRow ? "row" : "column", i), _define_property(_obj, isRow ? "y" : "x", _pos - 2), // 计算方向相反
                _define_property(_obj, "reverse", isEndFixed), _obj)
            };
            bounds.push(b);
        });
        return bounds;
    };
    /** 更新column配置 */ _proto.updateColumnSize = function updateColumnSize(column, diff) {
        if (Math.abs(diff) > 4) {
            var width = Math.round(column.width + diff);
            this.getPlugin(_TableMutationPlugin).setPersistenceConfig([
                "columns",
                column.key,
                "width"
            ], width, "resize column");
        }
    };
    /** 更新row配置 */ _proto.updateRowSize = function updateRowSize(row, diff) {
        if (Math.abs(diff) > 4) {
            var height = Math.round(row.height + diff);
            this.getPlugin(_TableMutationPlugin).setPersistenceConfig([
                "rows",
                row.key,
                "height"
            ], height, "resize row");
        }
    };
    /** 显示并更新xLine位置 */ _proto.updateXTipLine = function updateXTipLine(x) {
        var _this = this;
        this.rafClearFn = this.rafCaller(function() {
            _this.xLine.style.display = "block";
            _this.xLine.style.left = "".concat(x, "px");
        });
    };
    /** 显示并更新yLine位置 */ _proto.updateYTipLine = function updateYTipLine(y) {
        var _this = this;
        this.rafClearFn = this.rafCaller(function() {
            _this.yLine.style.display = "block";
            _this.yLine.style.top = "".concat(y, "px");
        });
    };
    /** 隐藏xLine */ _proto.hideXTipLine = function hideXTipLine() {
        if (this.xLine.style.display === "none") return;
        this.virtualBound.cursor = null;
        this.xLine.style.display = "none";
    };
    /** 隐藏yLine */ _proto.hideYTipLine = function hideYTipLine() {
        if (this.yLine.style.display === "none") return;
        this.virtualBound.cursor = null;
        this.yLine.style.display = "none";
    };
    return _TableRowColumnResize;
}(TablePlugin);
/** 标识resize把手的key */ _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY = "__m78-table-virtual-column-handle__";
_TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY = "__m78-table-virtual-row-handle__";
/** 最小/大列尺寸 */ _TableRowColumnResize.MIN_COLUMN_WIDTH = 40;
_TableRowColumnResize.MAX_COLUMN_WIDTH = 500;
/** 最小/大行尺寸 */ _TableRowColumnResize.MIN_ROW_HEIGHT = 20;
_TableRowColumnResize.MAX_ROW_HEIGHT = 300;
