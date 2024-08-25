import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import debounce from "lodash/debounce.js";
import clamp from "lodash/clamp.js";
import { rafCaller } from "@m78/animate-tools";
import { _TableMutationPlugin } from "./mutation.js";
import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { removeNode } from "../../common/index.js";
import { TriggerType, trigger } from "@m78/trigger";
import { createTempID } from "@m78/utils";
/** 列/行重置大小 */ export var _TableRowColumnResize = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableRowColumnResize, TablePlugin);
    var _super = _create_super(_TableRowColumnResize);
    function _TableRowColumnResize() {
        _class_call_check(this, _TableRowColumnResize);
        var _this;
        _this = _super.apply(this, arguments);
        /** 提示线 */ _define_property(_assert_this_initialized(_this), "xLine", void 0);
        _define_property(_assert_this_initialized(_this), "yLine", void 0);
        /** 显示重置后大小 */ _define_property(_assert_this_initialized(_this), "sizeBlock", void 0);
        _define_property(_assert_this_initialized(_this), "wrap", void 0);
        /** 额外对外暴露一个用于集中控制trigger开关的属性 */ _define_property(_assert_this_initialized(_this), "triggerEnable", true);
        // 用于快速批量向target添加或移除事件的key
        _define_property(_assert_this_initialized(_this), "targetUniqueKey", createTempID());
        _define_property(_assert_this_initialized(_this), "rafCaller", void 0);
        _define_property(_assert_this_initialized(_this), "rafClearFn", void 0);
        /** 拖动中 */ _define_property(_assert_this_initialized(_this), "dragging", false);
        /** 是否触发了hover */ _define_property(_assert_this_initialized(_this), "activating", false);
        /** 轴偏移 */ _define_property(_assert_this_initialized(_this), "dragOffsetX", 0);
        _define_property(_assert_this_initialized(_this), "dragOffsetY", 0);
        /** 每次render后根据ctx.lastViewportItems更新虚拟拖拽节点 */ _define_property(_assert_this_initialized(_this), "renderedDebounce", debounce(function() {
            var last = _this.context.lastViewportItems;
            trigger.off(_this.targetUniqueKey);
            if (!last) return;
            var wrapBound = _this.config.el.getBoundingClientRect();
            var columnBounds = _this.createBound(wrapBound, last, false);
            var rowBounds = _this.createBound(wrapBound, last, true);
            // TODO: tag6
            // this.trigger.clear();
            // this.trigger.add(columnBounds.concat(rowBounds));
            trigger.on(columnBounds.concat(rowBounds), _this.targetUniqueKey);
        }, 100, {
            leading: false,
            trailing: true
        }));
        _define_property(_assert_this_initialized(_this), "triggerDispatch", function(e) {
            // console.log(e, e.type);
            if (e.type === TriggerType.active) {
                _this.hoverHandle(e);
            }
            if (e.type === TriggerType.drag) {
                _this.dragHandle(e);
            }
        });
        _define_property(_assert_this_initialized(_this), "hoverHandle", function(e) {
            var active = e.active, data = e.data;
            var isRow = data.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;
            _this.activating = active;
            if (active) {
                isRow ? _this.updateYTipLine(data.y, e) : _this.updateXTipLine(data.x, e);
            } else if (!_this.dragging) {
                isRow ? _this.hideYTipLine() : _this.hideXTipLine();
            }
        });
        _define_property(_assert_this_initialized(_this), "dragHandle", function(e) {
            var first = e.first, last = e.last, deltaX = e.deltaX, deltaY = e.deltaY, data = e.data;
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
                    _this.updateYTipLine(data.y + _this.dragOffsetY, e);
                } else {
                    _this.dragOffsetX = curOffset;
                    _this.updateXTipLine(data.x + _this.dragOffsetX, e);
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
        });
        _define_property(_assert_this_initialized(_this), "scrollHandle", function() {
            _this.hideXTipLine();
            _this.hideYTipLine();
        });
        return _this;
    }
    _create_class(_TableRowColumnResize, [
        {
            key: "initialized",
            value: function initialized() {
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
                // TODO: tag2
                // 为virtualBound添加特定节点的过滤
                // const vbPreCheck: TriggerConfig["preCheck"] = (type) => {
                //   if (type !== TriggerType.active && type !== TriggerType.drag)
                //     return false;
                //   // return !_triggerFilterList(
                //   //   e.target as HTMLElement,
                //   //   _tableTriggerFilters,
                //   //   this.config.el
                //   // );
                //   return true;
                // };
                // TODO: tag1
                // this.trigger = createTrigger({
                //   container: this.config.el,
                //   type: [TriggerType.drag, TriggerType.active, TriggerType.move],
                //   preCheck: vbPreCheck,
                // });
                // this.trigger.event.on(this.triggerDispatch);
                this.context.viewEl.addEventListener("scroll", this.scrollHandle);
                // 选取过程中禁用
                this.table.event.selectStart.on(function() {
                    _this.triggerEnable = false;
                });
                this.table.event.select.on(function() {
                    _this.triggerEnable = true;
                });
            }
        },
        {
            key: "getEventOption",
            value: // 获取事件选项
            function getEventOption(target, level, cursor, data) {
                var _this = this;
                return {
                    enable: function() {
                        if (!_this.table.isActive() || !_this.triggerEnable) return false;
                        // if (!data.typeMap.get(TriggerType.active) && !data.typeMap.get(TriggerType.drag)) return false;
                        // return !_triggerFilterList(
                        //   e.target as HTMLElement,
                        //   _tableTriggerFilters,
                        //   this.config.el
                        // );
                        return true;
                    },
                    type: [
                        TriggerType.drag,
                        TriggerType.active
                    ],
                    handler: this.triggerDispatch,
                    target: target,
                    level: level,
                    cursor: {
                        active: cursor,
                        dragActive: cursor
                    },
                    data: data
                };
            }
        },
        {
            key: "rendered",
            value: function rendered() {
                this.renderedDebounce();
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                if (this.rafClearFn) this.rafClearFn();
                // TODO: tag3
                // this.trigger.destroy();
                // this.trigger = null!;
                trigger.off(this.targetUniqueKey);
                this.context.viewEl.removeEventListener("scroll", this.scrollHandle);
                this.table.event.selectStart.empty();
                this.table.event.select.empty();
                removeNode(this.wrap);
            }
        },
        {
            /** 生成虚拟节点 */ key: "createBound",
            value: function createBound(wrapBound, last, isRow) {
                var _this = this;
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
                var bSize = _TableRowColumnResize.HANDLE_SIZE;
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
                    var opt = _this.getEventOption({
                        left: left,
                        top: top,
                        height: isRow ? bSize : ctx.yHeaderHeight,
                        width: isRow ? ctx.xHeaderWidth : bSize
                    }, i.isFixed ? 1 : 0, isRow ? "row-resize" : "col-resize", (_obj = {
                        type: isRow ? _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY : _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY
                    }, _define_property(_obj, isRow ? "row" : "column", i), _define_property(_obj, isRow ? "y" : "x", _pos - 2), _define_property(_obj, "startPos", isEndFixed ? _pos : _pos - size), _define_property(_obj, "endPos", isEndFixed ? _pos + size : _pos), // 计算方向相反
                    _define_property(_obj, "reverse", isEndFixed), _obj));
                    // TODO: tag4
                    // const b: TriggerTargetMeta = {
                    //   target: {
                    //     left,
                    //     top,
                    //     height: isRow ? bSize : ctx.yHeaderHeight,
                    //     width: isRow ? ctx.xHeaderWidth : bSize,
                    //   },
                    //   zIndex: i.isFixed ? 1 : 0,
                    //   cursor: isRow ? "row-resize" : "col-resize",
                    //   data: {
                    //     type: isRow
                    //       ? _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY
                    //       : _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY,
                    //     [isRow ? "row" : "column"]: i,
                    //     [isRow ? "y" : "x"]: _pos - 2,
                    //     startPos: isEndFixed ? _pos : _pos - size,
                    //     endPos: isEndFixed ? _pos + size : _pos,
                    //     // 计算方向相反
                    //     reverse: isEndFixed,
                    //   },
                    // };
                    bounds.push(opt);
                });
                return bounds;
            }
        },
        {
            /** 更新column配置 */ key: "updateColumnSize",
            value: function updateColumnSize(column, diff) {
                if (Math.abs(diff) > 4) {
                    var width = Math.round(column.width + diff);
                    this.getPlugin(_TableMutationPlugin).setPersistenceConfig([
                        "columns",
                        column.key,
                        "width"
                    ], width, "resize column");
                }
            }
        },
        {
            /** 更新row配置 */ key: "updateRowSize",
            value: function updateRowSize(row, diff) {
                if (Math.abs(diff) > 4) {
                    var height = Math.round(row.height + diff);
                    this.getPlugin(_TableMutationPlugin).setPersistenceConfig([
                        "rows",
                        row.key,
                        "height"
                    ], height, "resize row");
                }
            }
        },
        {
            /** 显示并更新xLine位置 */ key: "updateXTipLine",
            value: function updateXTipLine(x, event) {
                var _this = this;
                this.rafClearFn = this.rafCaller(function() {
                    _this.sizeBlock.style.visibility = "visible";
                    _this.xLine.style.visibility = "visible";
                    var left;
                    var width;
                    if (event.data.reverse) {
                        left = x;
                        width = event.data.endPos - x;
                    } else {
                        left = event.data.startPos;
                        width = x - event.data.startPos;
                    }
                    _this.sizeBlock.style.width = "".concat(width, "px");
                    _this.sizeBlock.style.transform = "translate(".concat(left, "px,0)");
                    _this.sizeBlock.style.height = "".concat(_this.table.getHeight(), "px");
                    _this.xLine.style.transform = "translateX(".concat(x, "px)");
                });
            }
        },
        {
            /** 显示并更新yLine位置 */ key: "updateYTipLine",
            value: function updateYTipLine(y, event) {
                var _this = this;
                this.rafClearFn = this.rafCaller(function() {
                    _this.sizeBlock.style.visibility = "visible";
                    _this.yLine.style.visibility = "visible";
                    var top;
                    var height;
                    if (event.data.reverse) {
                        top = y;
                        height = event.data.endPos - y;
                    } else {
                        top = event.data.startPos;
                        height = y - event.data.startPos;
                    }
                    _this.sizeBlock.style.transform = "translate(0,".concat(top, "px)");
                    _this.sizeBlock.style.height = "".concat(height, "px");
                    _this.sizeBlock.style.width = "".concat(_this.table.getWidth(), "px");
                    _this.yLine.style.transform = "translateY(".concat(y, "px)");
                });
            }
        },
        {
            /** 隐藏xLine */ key: "hideXTipLine",
            value: function hideXTipLine() {
                if (this.xLine.style.visibility === "hidden") return;
                // this.trigger.cursor = "";
                this.xLine.style.visibility = "hidden";
                this.sizeBlock.style.visibility = "hidden";
            }
        },
        {
            /** 隐藏yLine */ key: "hideYTipLine",
            value: function hideYTipLine() {
                if (this.yLine.style.visibility === "hidden") return;
                // this.trigger.cursor = "";
                this.yLine.style.visibility = "hidden";
                this.sizeBlock.style.visibility = "hidden";
            }
        }
    ]);
    return _TableRowColumnResize;
}(TablePlugin);
/** 标识resize把手的key */ _define_property(_TableRowColumnResize, "VIRTUAL_COLUMN_HANDLE_KEY", "__m78-table-virtual-column-handle__");
_define_property(_TableRowColumnResize, "VIRTUAL_ROW_HANDLE_KEY", "__m78-table-virtual-row-handle__");
/** 最小/大列尺寸 */ _define_property(_TableRowColumnResize, "MIN_COLUMN_WIDTH", 40);
_define_property(_TableRowColumnResize, "MAX_COLUMN_WIDTH", 500);
/** 最小/大行尺寸 */ _define_property(_TableRowColumnResize, "MIN_ROW_HEIGHT", 20);
_define_property(_TableRowColumnResize, "MAX_ROW_HEIGHT", 300);
_define_property(_TableRowColumnResize, "HANDLE_SIZE", 6);
