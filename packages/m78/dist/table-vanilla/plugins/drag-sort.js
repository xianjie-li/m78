import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { DragGesture } from "@use-gesture/vanilla";
import { _TableRowColumnResize } from "./row-column-resize.js";
import { removeNode } from "../../common/index.js";
import { getEventOffset, isNumber, throwError } from "@m78/utils";
import { createAutoScroll, rafCaller } from "@m78/animate-tools";
import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { _TableSelectPlugin } from "./select.js";
import { _TableDisablePlugin } from "./disable.js";
/** 表格行/列排序 */ export var _TableDragSortPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableDragSortPlugin, TablePlugin);
    var _super = _create_super(_TableDragSortPlugin);
    function _TableDragSortPlugin() {
        _class_call_check(this, _TableDragSortPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 拖动控制 */ _define_property(_assert_this_initialized(_this), "drag", void 0);
        _define_property(_assert_this_initialized(_this), "lastColumns", void 0);
        _define_property(_assert_this_initialized(_this), "lastRows", void 0);
        /** 获取当前的行/列resize状态 */ _define_property(_assert_this_initialized(_this), "rcResize", void 0);
        /** 获取当前的选区插件信息 */ _define_property(_assert_this_initialized(_this), "select", void 0);
        /** 设置禁用样式 */ _define_property(_assert_this_initialized(_this), "disablePlugin", void 0);
        /** 正在拖动 */ _define_property(_assert_this_initialized(_this), "dragging", false);
        /** 提示节点的容器 */ _define_property(_assert_this_initialized(_this), "wrap", void 0);
        /** 提示区域 */ _define_property(_assert_this_initialized(_this), "tipAreaX", void 0);
        _define_property(_assert_this_initialized(_this), "tipAreaY", void 0);
        /** 提示线 */ _define_property(_assert_this_initialized(_this), "tipLineX", void 0);
        _define_property(_assert_this_initialized(_this), "tipLineY", void 0);
        /** 拖动到的目标行 */ _define_property(_assert_this_initialized(_this), "targetRow", void 0);
        /** 拖动到的目标列 */ _define_property(_assert_this_initialized(_this), "targetColumn", void 0);
        /** 若为true, 表示拖动的目标之后 */ _define_property(_assert_this_initialized(_this), "isTargetAfter", void 0);
        /** 边缘自动滚动控制器 */ _define_property(_assert_this_initialized(_this), "autoScroll", void 0);
        _define_property(_assert_this_initialized(_this), "rafCaller", void 0);
        /** 开始拖动的一些信息记录 */ _define_property(_assert_this_initialized(_this), "firstData", void 0);
        /** 将拖动事件派发到对应的行/列事件中 */ _define_property(_assert_this_initialized(_this), "dragDispatch", function(e) {
            if (e.tap) return;
            if (!_this.config.dragSortRow && !_this.config.dragSortColumn) {
                e.cancel();
                return;
            }
            // 如果与resize重叠, 则进行阻断
            if (e.first && (_this.rcResize.dragging || _this.rcResize.activating)) {
                e.cancel();
                return;
            }
            var offset = getEventOffset(e.event, _this.config.el);
            var contPoint = _this.table.transformViewportPoint(offset);
            if (e.last) {
                if (_this.lastColumns) {
                    _this.updateColumnNode(e, contPoint, offset);
                    _this.disablePlugin.setColumnDisable(_this.lastColumns.map(function(column) {
                        return column.key;
                    }), false);
                }
                if (_this.lastRows) {
                    _this.updateRowNode(e, contPoint, offset);
                    _this.disablePlugin.setRowDisable(_this.lastRows.map(function(row) {
                        return row.key;
                    }), false);
                }
                if (_this.lastColumns && _this.targetColumn) {
                    _this.triggerMoveColumn(_this.lastColumns, _this.targetColumn, _this.isTargetAfter);
                }
                if (_this.lastRows && _this.targetRow) {
                    _this.triggerMoveRow(_this.lastRows, _this.targetRow, _this.isTargetAfter);
                }
                _this.autoScroll.clear();
                _this.firstData = undefined;
                _this.lastColumns = undefined;
                _this.lastRows = undefined;
                _this.targetRow = undefined;
                _this.targetColumn = undefined;
                return;
            }
            if (_this.lastColumns) {
                _this.updateColumnNode(e, contPoint, offset);
                return;
            }
            if (_this.lastRows) {
                _this.updateRowNode(e, contPoint, offset);
                return;
            }
            if (e.canceled) return;
            var items = _this.table.getBoundItems(contPoint.xy);
            var first = items.cells[0];
            // 包含单元格并且该单元格是表头
            if (!first || !first.row.isHeader && !first.column.isHeader) {
                e.cancel();
                return;
            }
            // 跳过表头交叉区域
            if (first.row.isHeader && first.column.isHeader) {
                e.cancel();
                return;
            }
            // 禁用项
            if (_this.disablePlugin.isDisabledCell(first.key)) {
                e.cancel();
                return;
            }
            if (first.column.isHeader) {
                if (_this.table.isSelectedRow(first.row.key)) {
                    _this.lastRows = _this.table.getSelectedRows().filter(function(row) {
                        return !_this.disablePlugin.isDisabledRow(row.key);
                    });
                    _this.disablePlugin.setRowDisable(_this.lastRows.map(function(row) {
                        return row.key;
                    }));
                    _this.memoFirstData(offset);
                }
            }
            if (first.row.isHeader) {
                _this.lastColumns = items.columns.filter(function(column) {
                    return !_this.disablePlugin.isDisabledColumn(column.key);
                });
                _this.disablePlugin.setColumnDisable(_this.lastColumns.map(function(column) {
                    return column.key;
                }));
                _this.memoFirstData(offset);
            }
        });
        /** 更新自动滚动判定点 */ _define_property(_assert_this_initialized(_this), "updateAutoScrollBound", function() {
            _this.autoScroll.updateConfig({
                adjust: _this.select.getAutoScrollBound()
            });
        });
        return _this;
    }
    _create_class(_TableDragSortPlugin, [
        {
            key: "mounted",
            value: function mounted() {
                var _this = this;
                this.initNodes();
                this.drag = new DragGesture(this.config.el, this.dragDispatch, {
                    filterTaps: true,
                    tapsThreshold: 5,
                    pointer: {
                        // https://github.com/pmndrs/use-gesture/issues/611
                        capture: false
                    }
                });
                this.rcResize = this.getPlugin(_TableRowColumnResize);
                this.select = this.getPlugin(_TableSelectPlugin);
                this.disablePlugin = this.getPlugin(_TableDisablePlugin);
                this.rafCaller = rafCaller();
                this.autoScroll = createAutoScroll({
                    el: this.context.viewEl,
                    boundElement: this.config.el,
                    checkOverflowAttr: false,
                    baseOffset: 10,
                    adjust: this.select.getAutoScrollBound(),
                    onlyNotify: true,
                    onScroll: function(isX, offset) {
                        // 这里需要通过 takeover 手动将x/y赋值调整为同步
                        _this.table.takeover(function() {
                            if (isX) {
                                _this.table.setX(_this.table.getX() + offset);
                            } else {
                                _this.table.setY(_this.table.getY() + offset);
                            }
                            _this.table.renderSync();
                        });
                    }
                });
            }
        },
        {
            key: "reload",
            value: function reload() {
                this.updateAutoScrollBound();
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                removeNode(this.wrap);
                this.drag.destroy();
                this.autoScroll.clear();
                this.autoScroll = null;
            }
        },
        {
            key: "triggerMoveRow",
            value: function triggerMoveRow(rows, target, isTargetAfter) {
                this.table.moveRow(rows.map(function(i) {
                    return i.key;
                }), target.key, isTargetAfter);
            }
        },
        {
            key: "triggerMoveColumn",
            value: function triggerMoveColumn(columns, target, isTargetAfter) {
                this.table.moveColumn(columns.map(function(i) {
                    return i.key;
                }), target.key, isTargetAfter);
            }
        },
        {
            key: "updateColumnNode",
            value: /** 处理列拖移 */ function updateColumnNode(e, point, offset) {
                this.updateNodeCommon(e, point, false, offset);
            }
        },
        {
            key: "updateRowNode",
            value: /** 处理行拖移 */ function updateRowNode(e, point, offset) {
                this.updateNodeCommon(e, point, true, offset);
            }
        },
        {
            key: "memoFirstData",
            value: /** 开始拖动时, 记录一些需要在拖动阶段使用的信息, 必须保证isRow对应方向的lastRows/lastColumns存在 */ function memoFirstData(offset) {
                if (!this.lastRows && !this.lastColumns) {
                    throwError("lastRows/lastColumns must be exist");
                }
                var isRow = !!this.lastRows;
                var lastData = isRow ? this.lastRows : this.lastColumns;
                var tablePos = isRow ? this.table.getY() : this.table.getX();
                // area显示
                var pos;
                var size = 0;
                // 最终确定位置的项是否是fixed项
                var isFixedPos = false;
                lastData.forEach(function(cur) {
                    var curPos = isRow ? cur.y : cur.x;
                    if (cur.isFixed) {
                        curPos = cur.fixedOffset;
                    }
                    var curSize = isRow ? cur.height : cur.width;
                    if (!isNumber(pos) || pos > curPos) {
                        pos = curPos;
                        isFixedPos = cur.isFixed;
                    }
                    size += curSize;
                });
                if (!isFixedPos) {
                    pos = pos - tablePos;
                }
                var notNullPos = pos;
                this.firstData = {
                    position: notNullPos,
                    size: size,
                    offset: offset,
                    diffOffset: [
                        offset[0] - notNullPos,
                        offset[1] - notNullPos
                    ]
                };
            }
        },
        {
            key: "updateNodeCommon",
            value: /** 通用的拖动更新逻辑 */ function updateNodeCommon(e, point, isRow, offset) {
                var _this = this;
                var _lastData = isRow ? this.lastRows : this.lastColumns;
                var areaKey = isRow ? "tipAreaX" : "tipAreaY";
                var lineKey = isRow ? "tipLineX" : "tipLineY";
                var translateKey = isRow ? "translateY" : "translateX";
                var areaSizeKey = isRow ? "height" : "width";
                // 是否超过容器拖动方向的起始侧
                var isOverContainer = isRow ? offset[0] < 0 : offset[1] < 0;
                var clear = function() {
                    _this.targetRow = undefined;
                    _this.targetColumn = undefined;
                };
                if (e.last || !_lastData) {
                    this.dragging = false;
                    this.rcResize.triggerEnable = true;
                    this.autoScroll.trigger(e.xy, e.last, {
                        left: isRow,
                        right: isRow,
                        top: !isRow,
                        bottom: !isRow
                    });
                    this.rafCaller(function() {
                        _this[areaKey].style.visibility = "hidden";
                        _this[areaKey].style.transform = "".concat(translateKey, "(0)");
                        _this[areaKey].style[areaSizeKey] = "0px";
                        _this[lineKey].style.visibility = "hidden";
                        _this[lineKey].style.transform = "".concat(translateKey, "(0)");
                        clear();
                    });
                    return;
                }
                // 禁用_TableRowColumnResize,  处理快速拖动显示hover
                this.rcResize.triggerEnable = false;
                this.dragging = true;
                var lastData = _to_consumable_array(_lastData);
                // line显示
                var items = this.table.getBoundItems(point.xy);
                var firstRow = items.rows[0];
                var firstColumn = items.columns[0];
                var first = isRow ? firstRow : firstColumn;
                var disabled = !!(first === null || first === void 0 ? void 0 : first.isFixed);
                this.autoScroll.trigger(e.xy, e.last, {
                    left: disabled || isRow,
                    right: disabled || isRow,
                    top: disabled || !isRow,
                    bottom: disabled || !isRow
                });
                this.rafCaller(function() {
                    var updateLine;
                    var isValid = first && !isOverContainer && !first.isHeader && !_this.autoScroll.scrolling;
                    if (isValid) {
                        // 是否可见
                        var isVisible = isRow ? _this.table.isRowVisible(first.key, false) : _this.table.isColumnVisible(first.key, false);
                        // 是否是移动项本身
                        var isSelf = lastData.some(function(cur) {
                            return cur.key === first.key;
                        });
                        // 选中项的前后项不触发
                        var beforeIndex = lastData[0].index - 1;
                        var afterIndex = lastData[lastData.length - 1].index + 1;
                        var viewPoint = _this.table.transformContentPoint([
                            isRow ? 0 : firstColumn.x,
                            isRow ? firstRow.y : 0
                        ]);
                        var isEndFixed = first.config.fixed === TableRowFixed.bottom || first.config.fixed === TableColumnFixed.right;
                        // 提示线条的修正位置, 使其能更贴合单元格边框, 右侧固定项由于边框会偏左1px
                        var adjustOffset = isEndFixed ? 1 : 2;
                        var firstPos = isRow ? firstRow.y : firstColumn.x;
                        var firstSize = isRow ? firstRow.height : firstColumn.width;
                        var viewPointPos = isRow ? viewPoint.y : viewPoint.x;
                        var pointPos = isRow ? point.y : point.x;
                        var split = firstPos + firstSize / 2;
                        var start = viewPointPos - adjustOffset;
                        var end = start + firstSize;
                        var isStart = pointPos < split;
                        var isBeforeIgnore = !isStart && beforeIndex === first.index;
                        var isAfterIgnore = isStart && afterIndex === first.index;
                        // 可见 & 不是当前拖动项 & 不是当前拖动项前后的忽略项
                        if (isVisible && !isSelf && !(isBeforeIgnore || isAfterIgnore)) {
                            updateLine = function() {
                                _this[lineKey].style.visibility = "visible";
                                _this[lineKey].style.transform = "".concat(translateKey, "(").concat(isStart ? start : end, "px)");
                            };
                            clear();
                            if (isRow) {
                                _this.targetRow = firstRow;
                            } else {
                                _this.targetColumn = firstColumn;
                            }
                            _this.isTargetAfter = !isStart;
                        } else {
                            updateLine = function() {
                                _this[lineKey].style.visibility = "hidden";
                                clear();
                            };
                        }
                    } else {
                        updateLine = function() {
                            _this[lineKey].style.visibility = "hidden";
                            clear();
                        };
                    }
                    // 移动阶段起始数据时必定存在的
                    var firstData = _this.firstData;
                    var _offset = isRow ? offset[1] - firstData.diffOffset[1] : offset[0] - firstData.diffOffset[0];
                    _this[areaKey].style.visibility = "visible";
                    _this[areaKey].style.transform = "".concat(translateKey, "(").concat(_offset, "px)");
                    _this[areaKey].style[areaSizeKey] = "".concat(firstData.size, "px");
                    if (updateLine) updateLine();
                });
            }
        },
        {
            key: "initNodes",
            value: /** 初始化dom节点 */ function initNodes() {
                this.wrap = document.createElement("div");
                this.wrap.className = "m78-table_drag-feedback";
                this.tipAreaX = document.createElement("div");
                this.tipAreaY = document.createElement("div");
                this.tipLineX = document.createElement("div");
                this.tipLineY = document.createElement("div");
                this.tipAreaX.className = "m78-table_drag-area-x";
                this.tipAreaY.className = "m78-table_drag-area-y";
                this.tipLineX.className = "m78-table_drag-line-x";
                this.tipLineY.className = "m78-table_drag-line-y";
                this.wrap.appendChild(this.tipAreaX);
                this.wrap.appendChild(this.tipAreaY);
                this.wrap.appendChild(this.tipLineX);
                this.wrap.appendChild(this.tipLineY);
                this.config.el.appendChild(this.wrap);
            }
        }
    ]);
    return _TableDragSortPlugin;
}(TablePlugin);
