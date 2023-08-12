import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import debounce from "lodash/debounce.js";
import clamp from "lodash/clamp.js";
import { rafCaller } from "@m78/utils";
import { _TableMutationPlugin } from "./mutation.js";
import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { removeNode } from "../../common/index.js";
import { _tableTriggerFilters, _triggerFilterList } from "../common.js";
import { createTrigger, TriggerType } from "../../trigger/index.js";
/** 列/行重置大小 */ export var _TableRowColumnResize = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableRowColumnResize, TablePlugin);
    var _super = _create_super(_TableRowColumnResize);
    function _TableRowColumnResize() {
        _class_call_check(this, _TableRowColumnResize);
        var _this;
        _this = _super.apply(this, arguments);
        /** 拖动中 */ _this.dragging = false;
        /** 是否触发了hover */ _this.activating = false;
        /** 轴偏移 */ _this.dragOffsetX = 0;
        _this.dragOffsetY = 0;
        /** 每次render后根据ctx.lastViewportItems更新虚拟拖拽节点 */ _this.renderedDebounce = debounce(function() {
            var last = _this.context.lastViewportItems;
            if (!last) return;
            var wrapBound = _this.config.el.getBoundingClientRect();
            var cBounds = _this.createBound(wrapBound, last, false);
            var rBounds = _this.createBound(wrapBound, last, true);
            _this.trigger.clear();
            _this.trigger.add(cBounds.concat(rBounds));
        }, 100, {
            leading: false,
            trailing: true
        });
        _this.triggerDispatch = function(e) {
            if (e.type === TriggerType.active) {
                _this.hoverHandle(e);
            }
            if (e.type === TriggerType.drag) {
                _this.dragHandle(e);
            }
        };
        _this.hoverHandle = function(param) {
            var target = param.target, active = param.active;
            var meta = target;
            var data = meta.data;
            var isRow = data.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;
            _this.activating = active;
            if (active) {
                isRow ? _this.updateYTipLine(data.y, meta) : _this.updateXTipLine(data.x, meta);
            } else if (!_this.dragging) {
                isRow ? _this.hideYTipLine() : _this.hideXTipLine();
            }
        };
        _this.dragHandle = function(param) {
            var target = param.target, first = param.first, last = param.last, deltaX = param.deltaX, deltaY = param.deltaY;
            var meta = target;
            var data = meta.data;
            var isRow = data.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;
            if (first) {
                _this.dragging = true;
            }
            var prevOffset = isRow ? _this.dragOffsetY : _this.dragOffsetX;
            if (!last) {
                var size = isRow ? data.row.height : data.column.width;
                var min = isRow ? size - _TableRowColumnResize.MIN_ROW_HEIGHT : size - _TableRowColumnResize.MIN_COLUMN_WIDTH;
                var max = isRow ? _TableRowColumnResize.MAX_ROW_HEIGHT - size : _TableRowColumnResize.MAX_COLUMN_WIDTH - size;
                var movePos = isRow ? deltaY : deltaX;
                var curOffset = data.reverse ? clamp(prevOffset + movePos, -max, min) : clamp(prevOffset + movePos, -min, max);
                if (isRow) {
                    _this.dragOffsetY = curOffset;
                    _this.updateYTipLine(data.y + _this.dragOffsetY, meta);
                } else {
                    _this.dragOffsetX = curOffset;
                    _this.updateXTipLine(data.x + _this.dragOffsetX, meta);
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
        this.sizeBlock = document.createElement("div");
        this.wrap = document.createElement("div");
        this.xLine.className = "m78-table_tip-line-x";
        this.yLine.className = "m78-table_tip-line-y";
        this.sizeBlock.className = "m78-table_drag-area-x";
        this.wrap.className = "m78-table_rc-resize";
        this.wrap.appendChild(this.xLine);
        this.wrap.appendChild(this.yLine);
        this.wrap.appendChild(this.sizeBlock);
        this.config.el.appendChild(this.wrap);
        // 创建raf用于优化动画
        this.rafCaller = rafCaller();
        // 为virtualBound添加特定节点的过滤
        var vbPreCheck = function(type, e) {
            if (type !== TriggerType.active && type !== TriggerType.drag) return false;
            return !_triggerFilterList(e.target, _tableTriggerFilters, _this.config.el);
        };
        this.trigger = createTrigger({
            target: [],
            container: this.config.el,
            type: [
                TriggerType.drag,
                TriggerType.active,
                TriggerType.move
            ],
            preCheck: vbPreCheck
        });
        this.trigger.event.on(this.triggerDispatch);
        this.context.viewEl.addEventListener("scroll", this.scrollHandle);
        // 选取过程中禁用
        this.table.event.selectStart.on(function() {
            _this.trigger.enable = false;
        });
        this.table.event.select.on(function() {
            _this.trigger.enable = true;
        });
    };
    _proto.rendered = function rendered() {
        this.trigger.clear();
        this.renderedDebounce();
    };
    _proto.beforeDestroy = function beforeDestroy() {
        if (this.rafClearFn) this.rafClearFn();
        this.trigger.destroy();
        this.trigger = null;
        this.context.viewEl.removeEventListener("scroll", this.scrollHandle);
        this.table.event.selectStart.empty();
        this.table.event.select.empty();
        removeNode(this.wrap);
    };
    /** 生成虚拟节点 */ _proto.createBound = function createBound(wrapBound, last, isRow) {
        var ctx = this.context;
        var pos = isRow ? this.table.getY() : this.table.getX();
        var startFixedSize = isRow ? ctx.topFixedHeight : ctx.leftFixedWidth;
        var endFixedSize = isRow ? ctx.bottomFixedHeight : ctx.rightFixedWidth;
        var tableSize = isRow ? this.table.getHeight() : this.table.getWidth();
        // 开始/结束边界
        var startLine = pos + startFixedSize;
        var endLine = pos + tableSize - endFixedSize;
        var maxPos = isRow ? this.table.getMaxY() : this.table.getMaxX();
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
                target: {
                    left: left,
                    top: top,
                    height: isRow ? bSize : ctx.yHeaderHeight,
                    width: isRow ? ctx.xHeaderWidth : bSize
                },
                zIndex: i.isFixed ? 1 : 0,
                cursor: isRow ? "row-resize" : "col-resize",
                data: (_obj = {
                    type: isRow ? _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY : _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY
                }, _define_property(_obj, isRow ? "row" : "column", i), _define_property(_obj, isRow ? "y" : "x", _pos - 2), _define_property(_obj, "startPos", isEndFixed ? _pos : _pos - size), _define_property(_obj, "endPos", isEndFixed ? _pos + size : _pos), // 计算方向相反
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
    /** 显示并更新xLine位置 */ _proto.updateXTipLine = function updateXTipLine(x, bound) {
        var _this = this;
        this.rafClearFn = this.rafCaller(function() {
            _this.sizeBlock.style.visibility = "visible";
            _this.xLine.style.visibility = "visible";
            var left;
            var width;
            if (bound.data.reverse) {
                left = x;
                width = bound.data.endPos - x;
            } else {
                left = bound.data.startPos;
                width = x - bound.data.startPos;
            }
            _this.sizeBlock.style.width = "".concat(width, "px");
            _this.sizeBlock.style.transform = "translate(".concat(left, "px,0)");
            _this.sizeBlock.style.height = "".concat(_this.table.getHeight(), "px");
            _this.xLine.style.transform = "translateX(".concat(x, "px)");
        });
    };
    /** 显示并更新yLine位置 */ _proto.updateYTipLine = function updateYTipLine(y, bound) {
        var _this = this;
        this.rafClearFn = this.rafCaller(function() {
            _this.sizeBlock.style.visibility = "visible";
            _this.yLine.style.visibility = "visible";
            var top;
            var height;
            if (bound.data.reverse) {
                top = y;
                height = bound.data.endPos - y;
            } else {
                top = bound.data.startPos;
                height = y - bound.data.startPos;
            }
            _this.sizeBlock.style.transform = "translate(0,".concat(top, "px)");
            _this.sizeBlock.style.height = "".concat(height, "px");
            _this.sizeBlock.style.width = "".concat(_this.table.getWidth(), "px");
            _this.yLine.style.transform = "translateY(".concat(y, "px)");
        });
    };
    /** 隐藏xLine */ _proto.hideXTipLine = function hideXTipLine() {
        if (this.xLine.style.visibility === "hidden") return;
        // this.trigger.cursor = "";
        this.xLine.style.visibility = "hidden";
        this.sizeBlock.style.visibility = "hidden";
    };
    /** 隐藏yLine */ _proto.hideYTipLine = function hideYTipLine() {
        if (this.yLine.style.visibility === "hidden") return;
        // this.trigger.cursor = "";
        this.yLine.style.visibility = "hidden";
        this.sizeBlock.style.visibility = "hidden";
    };
    return _TableRowColumnResize;
}(TablePlugin);
/** 标识resize把手的key */ _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY = "__m78-table-virtual-column-handle__";
_TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY = "__m78-table-virtual-row-handle__";
/** 最小/大列尺寸 */ _TableRowColumnResize.MIN_COLUMN_WIDTH = 40;
_TableRowColumnResize.MAX_COLUMN_WIDTH = 500;
/** 最小/大行尺寸 */ _TableRowColumnResize.MIN_ROW_HEIGHT = 20;
_TableRowColumnResize.MAX_ROW_HEIGHT = 300;
