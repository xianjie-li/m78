import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { createAutoScroll, getCmdKeyStatus, getEventOffset, isBoolean, isEmpty, isFunction, isString } from "@m78/utils";
import throttle from "lodash/throttle.js";
import { _getCellKey, _getCellKeysByStr, _getMaxPointByPoint, _tableTriggerFilters, _triggerFilterList, isTouch } from "../common.js";
import { addCls, removeCls } from "../../common/index.js";
import { _TableRowColumnResize } from "./row-column-resize.js";
import { DragGesture } from "@use-gesture/vanilla";
/** 实现选区和选中功能 */ export var _TableSelectPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableSelectPlugin, TablePlugin);
    var _super = _create_super(_TableSelectPlugin);
    function _TableSelectPlugin() {
        _class_call_check(this, _TableSelectPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 选中的行 */ _this.selectedRows = {};
        /** 选中的单元格 */ _this.selectedCells = {};
        /** 临时选中的行 */ _this.selectedTempRows = {};
        /** 临时选中的单元格 */ _this.selectedTempCells = {};
        /** 开始点 */ _this.startPoint = null;
        /** 当前触发的事件是否在开始时按下了shift */ _this.isShift = false;
        /** 记录每次事件中移动的总距离 */ _this.moveDistance = 0;
        /** 记录最后一次的非shift down点 */ _this.lastPoint = null;
        /** 开始拖动之前的滚动位置, 用于自动滚动后修正框选区域 */ _this.autoScrollBeforePosition = null;
        /** 派发drag到start/move/end */ _this.dragDispatch = function(e) {
            if (e.first) {
                _this.selectStart(e);
                return;
            }
            _this.selectMove(e);
            if (e.last) {
                _this.selectEnd();
            }
        };
        /** 选取开始 */ _this.selectStart = function(e) {
            if (_this.config.rowSelectable === false && _this.config.cellSelectable === false) {
                return;
            }
            var interrupt = _triggerFilterList(e.target, _tableTriggerFilters, _this.config.el);
            if (interrupt) return;
            var resize = _this.getPlugin(_TableRowColumnResize);
            // 防止和拖拽行列冲突
            if (resize.dragging || resize.virtualBound.hasBound(e.xy)) return;
            // 包含前置点时处理shift按下
            _this.isShift = e.shiftKey && !!_this.lastPoint;
            // 合并还是覆盖, 控制键按下时为覆盖
            var isMerge = getCmdKeyStatus(e);
            var startPoint = _this.table.transformViewportPoint(getEventOffset(e.event, _this.context.viewEl));
            var p1 = startPoint.xy;
            var p2 = startPoint.xy;
            // 若shift key生效,
            if (_this.isShift) {
                var ref;
                ref = _sliced_to_array(_getMaxPointByPoint.apply(void 0, [
                    p1
                ].concat(_to_consumable_array(_this.lastPoint))), 2), p1 = ref[0], p2 = ref[1], ref;
            }
            var isTouchEvent = isTouch(e.event);
            var valid = _this.selectByPoint(p1, p2, function(items) {
                var first = items.cells[0];
                if (!first) return false;
                // 行头&列头格用于实现行全选行, 跳过框选
                if (first.row.isHeader && first.column.isHeader) return false;
                if (isFunction(_this.config.cellSelectable) && !_this.config.cellSelectable(first)) {
                    return false;
                }
                // touch事件下, 仅表头可选中
                if (isTouchEvent && !(first.row.isHeader || first.column.isHeader)) {
                    return false;
                }
                if (_this.table.isDisabledCell(first.key)) return false;
                // 启用了dragSortRow时, 需要禁止在已选中行上重新触发选中
                if (first.column.isHeader && _this.config.dragSortRow && _this.isSelectedRow(first.row.key)) {
                    return false;
                }
                // 未按下控制键则清空已选中项
                if (!isMerge) {
                    _this.clearSelected();
                }
                return true;
            });
            // 没有有效选中项时不进行后续操作
            if (valid) {
                _this.startPoint = startPoint;
                _this.autoScrollBeforePosition = [
                    _this.table.x(),
                    _this.table.y()
                ];
                if (!_this.isShift) {
                    _this.lastPoint = [
                        p1,
                        p2
                    ];
                }
                _this.table.event.selectStart.emit();
            }
        };
        /** 选取已开始, 并开始移动 */ _this.selectMove = throttle(function(e) {
            if (!_this.startPoint) return;
            var offset = getEventOffset(e.event, _this.context.viewEl);
            _this.moveDistance += Math.abs(_this.startPoint.originX - offset[0] + _this.startPoint.originY - offset[1]);
            var isMoved = _this.moveDistance > 8;
            _this.autoScroll.trigger(e.xy, e.last, _this.autoScrollConflictDisabledConfigGenerate(offset));
            if (_this.autoScroll.scrolling) return;
            var sX = _this.table.x() - _this.autoScrollBeforePosition[0];
            var sY = _this.table.y() - _this.autoScrollBeforePosition[1];
            var patchOffset = [
                offset[0] + sX,
                offset[1] + sY
            ];
            var ref = _sliced_to_array(_this.transformSelectedPoint(_this.startPoint, patchOffset), 2), p1 = ref[0], p2 = ref[1];
            if (isMoved) {
                _this.moveFixedEdgeHandle(p2);
            }
            // 若shift key生效,
            if (_this.isShift) {
                var ref1;
                ref1 = _sliced_to_array(_getMaxPointByPoint.apply(void 0, [
                    p2
                ].concat(_to_consumable_array(_this.lastPoint))), 2), p1 = ref1[0], p2 = ref1[1], ref1;
            }
            _this.selectByPoint(p1, p2);
            if (!_this.isShift) {
                _this.lastPoint = [
                    p1,
                    p2
                ];
            }
        }, 10) // 这里会出现潜在的bug, 从固定区域以极快速度拖动到触发滚动靠边行为时, 自动滚动可能因为节流被跳过, 但正常操作下几乎不可能出现, 出于性能考虑暂时不做处理
        ;
        /** 选取结束 */ _this.selectEnd = function() {
            if (!_this.startPoint) return;
            _this.autoScroll.clear();
            var isRowChange = !isEmpty(_this.selectedTempRows);
            var isCellChange = !isEmpty(_this.selectedTempCells);
            Object.assign(_this.selectedRows, _this.selectedTempRows);
            Object.assign(_this.selectedCells, _this.selectedTempCells);
            _this.autoScrollBeforePosition = null;
            _this.startPoint = null;
            _this.isShift = false;
            _this.conflictDisableConfig = null;
            _this.moveDistance = 0;
            _this.clearTempSelected();
            isRowChange && _this.table.event.rowSelect.emit();
            isCellChange && _this.table.event.cellSelect.emit();
            _this.table.event.select.emit();
        };
        /** 点击处理 */ _this.clickHandle = function(cell) {
            if (_this.config.rowSelectable === false) return;
            // 点击行&列头, 切换全选
            if (cell.row.isHeader && cell.column.isHeader) {
                var keys = Object.keys(_this.selectedRows);
                _this.clearSelected();
                if (!keys.length) {
                    _this.context.allRowKeys.forEach(function(key) {
                        _this.setSelected(key, _this.selectedRows);
                    });
                }
                _this.table.render();
                _this.table.event.rowSelect.emit();
                _this.table.event.select.emit();
            }
        };
        _this.isSelectedTempRow = function(key) {
            return !!_this.selectedTempRows[key];
        };
        _this.isSelectedTempCell = function(key) {
            return !!_this.selectedTempCells[key];
        };
        _this.isSelectedRow = function(key) {
            return !!_this.selectedRows[key];
        };
        _this.isSelectedCell = function(key) {
            return !!_this.selectedCells[key];
        };
        _this.getSelectedRows = function() {
            var ls = [];
            Object.keys(_this.selectedRows).forEach(function(key) {
                var row = _this.table.getRow(key);
                ls.push(row);
            });
            ls.sort(function(a, b) {
                return a.index - b.index;
            });
            return ls;
        };
        _this.getSelectedCells = function() {
            var rows = {};
            var uniqCache = {}; // 保证行和单元格的选中不重复
            // 此处可能有潜在的性能问题
            var keyHandle = function(key) {
                var ref = _sliced_to_array(_getCellKeysByStr(key), 2), rowKey = ref[0], columnKey = ref[1];
                var cell = _this.table.getCell(rowKey, columnKey);
                // 跳过行头
                if (cell.column.isHeader) return;
                // 跳过已经处理过的单元格
                if (uniqCache[cell.key]) return;
                var ls = rows[rowKey];
                if (!ls) {
                    ls = [];
                    rows[rowKey] = ls;
                }
                uniqCache[cell.key] = 1;
                ls.push(cell);
            };
            Object.keys(_this.selectedRows).forEach(function(key) {
                _this.context.allColumnKeys.forEach(function(columnKey) {
                    keyHandle(_getCellKey(key, columnKey));
                });
            });
            Object.keys(_this.selectedCells).forEach(keyHandle);
            return Object.entries(rows).map(function(param) {
                var _param = _sliced_to_array(param, 2), ls = _param[1];
                // 列排序
                return ls.sort(function(a, b) {
                    return a.column.index - b.column.index;
                });
            }).sort(function(a, b) {
                return a[0].row.index - b[0].row.index;
            });
        };
        _this.selectRows = function(rows, merge) {
            if (_this.config.rowSelectable === false) return;
            if (!merge) {
                _this.clearSelected();
            }
            rows.forEach(function(key) {
                _this.setSelected(key, _this.selectedRows);
            });
            _this.table.render();
            _this.table.event.rowSelect.emit();
            _this.table.event.select.emit();
        };
        _this.selectCells = function(cells, merge) {
            if (_this.config.cellSelectable === false) return;
            if (!merge) {
                _this.clearSelected();
            }
            cells.forEach(function(key) {
                _this.setSelected(key, _this.selectedCells);
            });
            _this.table.render();
            _this.table.event.cellSelect.emit();
            _this.table.event.select.emit();
        };
        /**
   * 根据传入的两个点更新临时选中状态
   * - 可传入interceptor来根据命中内容决定是否阻止后续操作
   * - 若没有选中项或interceptor()验证失败, 返回false
   * */ _this.selectByPoint = function(p1, p2, interceptor) {
            p2 = p2 || p1;
            var items = _this.table.getAreaBound(p1, p2);
            if (interceptor) {
                var res = interceptor(items);
                if (!res) return false;
            }
            _this.clearTempSelected();
            // 框选中不能重置大小
            // 是否有选中项
            var hasSelected = false;
            items.cells.forEach(function(i) {
                var row = i.row;
                var column = i.column;
                if (row.isHeader && column.isHeader) return;
                if (row.isFake && !column.isHeader) return;
                hasSelected = true;
                // 选中行头时, 将行设置为选中状态
                if (column.isHeader && !row.isHeader) {
                    _this.setSelected(row, _this.selectedTempRows);
                    return;
                }
                _this.setSelected(i, _this.selectedTempCells);
            });
            hasSelected && _this.table.render();
            return hasSelected;
        };
        /** 更新自动滚动判定点 */ _this.updateAutoScrollBound = function() {
            _this.autoScroll.updateConfig({
                adjust: _this.getAutoScrollBound()
            });
        };
        return _this;
    }
    var _proto = _TableSelectPlugin.prototype;
    _proto.init = function init() {
        this.methodMapper(this.table, [
            "isSelectedRow",
            "isSelectedCell",
            "getSelectedRows",
            "getSelectedCells",
            "selectRows",
            "selectCells", 
        ]);
    };
    _proto.mount = function mount() {
        var _this = this;
        this.table.event.click.on(this.clickHandle);
        this.drag = new DragGesture(this.config.el, this.dragDispatch, {
            // filterTaps: true,
            pointer: {
                // https://github.com/pmndrs/use-gesture/issues/611
                capture: false
            }
        });
        this.autoScroll = createAutoScroll({
            el: this.context.viewEl,
            boundElement: this.config.el,
            checkOverflowAttr: false,
            baseOffset: 10,
            adjust: this.getAutoScrollBound(),
            onlyNotify: true,
            onScroll: function(isX, offset) {
                // 这里需要通过 takeover 手动将x/y赋值调整为同步
                _this.table.takeover(function() {
                    if (isX) {
                        _this.table.x(_this.table.x() + offset);
                    } else {
                        _this.table.y(_this.table.y() + offset);
                    }
                    _this.table.renderSync();
                });
            }
        });
    };
    _proto.reload = function reload() {
        this.updateAutoScrollBound();
    };
    _proto.beforeDestroy = function beforeDestroy() {
        this.table.event.click.off(this.clickHandle);
        this.drag.destroy();
        this.autoScroll.clear();
        this.autoScroll = null;
    };
    _proto.cellRender = function cellRender(cell) {
        var selected = this.isSelectedCell(cell.key) || this.isSelectedTempCell(cell.key) || this.isSelectedRow(cell.row.key) || this.isSelectedTempRow(cell.row.key);
        selected ? addCls(cell.dom, "__selected") : removeCls(cell.dom, "__selected");
    };
    /**
   * 向selected map中设置行选中, item可以是cell/row的key或实例, 所有设置操作统一在此进行, 方便进行禁用等行为的拦截
   * - 返回false表示该次设置被拦截
   * */ _proto.setSelected = function setSelected(item, map) {
        var isKey = isString(item);
        var key = isKey ? item : item.key;
        var isRow = map === this.selectedRows || map === this.selectedTempRows;
        var isCell = map === this.selectedCells || map === this.selectedTempCells;
        var rowSelectable = this.config.rowSelectable;
        var cellSelectable = this.config.cellSelectable;
        if (isRow) {
            if (isBoolean(rowSelectable) && !rowSelectable) return false;
            if (isFunction(rowSelectable)) {
                var row = isKey ? this.table.getRow(key) : item;
                var pass = rowSelectable(row);
                if (!pass) return false;
            }
            if (this.table.isDisabledRow(key)) return false;
        }
        if (isCell) {
            if (isBoolean(cellSelectable) && !cellSelectable) return false;
            if (isFunction(cellSelectable)) {
                var cell = item;
                if (isKey) {
                    var ref = _sliced_to_array(_getCellKeysByStr(key), 2), rowKey = ref[0], columnKey = ref[1];
                    cell = this.table.getCell(rowKey, columnKey);
                }
                var pass1 = cellSelectable(cell);
                if (!pass1) return false;
            }
            if (this.table.isDisabledCell(key)) return false;
        }
        map[key] = 1;
        return true;
    };
    /**
   * 处理固定项移动到边缘的自动滚动和常规拖动自动滚动两个行为的冲突
   * - 如果从固定项开始拖动, 则先禁用该方向的常规自动滚动, 等到移动到非固定项时再启用
   * */ _proto.autoScrollConflictDisabledConfigGenerate = function autoScrollConflictDisabledConfigGenerate(pos) {
        var sp = this.startPoint;
        if (!sp) return;
        var curPoint = this.table.transformViewportPoint(pos, _TableSelectPlugin.EDGE_SIZE);
        if (!this.conflictDisableConfig) {
            // 禁用对应方向的开始位置
            this.conflictDisableConfig = {
                left: sp.leftFixed,
                right: sp.rightFixed,
                bottom: sp.bottomFixed,
                top: sp.topFixed
            };
        }
        if (!curPoint.leftFixed && this.conflictDisableConfig.left) {
            this.conflictDisableConfig.left = false;
        }
        if (!curPoint.rightFixed && this.conflictDisableConfig.right) {
            this.conflictDisableConfig.right = false;
        }
        if (!curPoint.bottomFixed && this.conflictDisableConfig.bottom) {
            this.conflictDisableConfig.bottom = false;
        }
        if (!curPoint.topFixed && this.conflictDisableConfig.top) {
            this.conflictDisableConfig.top = false;
        }
        return this.conflictDisableConfig;
    };
    /** 框选点在固定区域末尾时, 如果滚动边未贴合, 将其滚动到贴合位置, 一是解决瞬间选择大量数据的问题, 二是更符合直觉, 放置误选 */ _proto.moveFixedEdgeHandle = function moveFixedEdgeHandle(param) {
        var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1];
        if (!this.conflictDisableConfig) return;
        var edgeSize = _TableSelectPlugin.EDGE_SIZE;
        var ctx = this.context;
        // 根据this.conflictDisableConfig可以判断是否从对应固定方向开始, 对应方向是否已失效
        if (ctx.leftFixedWidth && this.conflictDisableConfig.left) {
            var lS = this.context.leftFixedWidth;
            var lE = lS + edgeSize;
            if (x > lS && x <= lE) {
                var x1 = this.table.x();
                if (x1 !== 0) {
                    this.table.x(0);
                    this.autoScrollBeforePosition[0] = 0; // 主动变更了位置, 所以需要对其修正
                }
            }
        }
        if (ctx.topFixedHeight && this.conflictDisableConfig.top) {
            var tS = this.context.topFixedHeight;
            var tE = tS + edgeSize;
            if (y > tS && y <= tE) {
                var y1 = this.table.y();
                if (y1 !== 0) {
                    this.table.y(0);
                    this.autoScrollBeforePosition[1] = 0;
                }
            }
        }
        if (ctx.rightFixedWidth && this.conflictDisableConfig.right) {
            var contW = this.table.contentWidth();
            var rE = contW - ctx.rightFixedWidth;
            var rS = rE - edgeSize;
            var max = this.table.maxX();
            if (x > rS && x <= rE) {
                var x2 = this.table.x();
                if (x2 < max) {
                    this.table.x(max);
                    this.autoScrollBeforePosition[0] = max;
                }
            }
        }
        if (ctx.bottomFixedHeight && this.conflictDisableConfig.bottom) {
            var contH = this.table.contentHeight();
            var bE = contH - ctx.bottomFixedHeight;
            var bS = bE - edgeSize;
            var max1 = this.table.maxY();
            if (y > bS && y <= bE) {
                var y2 = this.table.y();
                if (y2 < max1) {
                    this.table.y(max1);
                    this.autoScrollBeforePosition[1] = max1;
                }
            }
        }
    };
    /** 自动触发滚动便捷的修正位置 */ _proto.getAutoScrollBound = function getAutoScrollBound() {
        return {
            top: this.context.topFixedHeight,
            left: this.context.leftFixedWidth,
            right: this.context.rightFixedWidth,
            bottom: this.context.bottomFixedHeight
        };
    };
    _proto.clearSelected = function clearSelected() {
        this.selectedRows = {};
        this.selectedCells = {};
    };
    _proto.clearTempSelected = function clearTempSelected() {
        this.selectedTempRows = {};
        this.selectedTempCells = {};
    };
    /**
   * 专门用于框选的选区点转换
   * - 从固定区域拖选到非固定区域, 点非固定区开贴近固定区的位置开始计算点
   * - 从非固定区域拖动到固定区域, 若存在滚动位置, 则依然计算常规位置, 否则计算固定区位置
   * */ _proto.transformSelectedPoint = function transformSelectedPoint(startInfo, nowPoint) {
        var xDiff = nowPoint[0] - startInfo.originX;
        var yDiff = nowPoint[1] - startInfo.originY;
        var now = [
            startInfo.x + xDiff,
            startInfo.y + yDiff
        ];
        return [
            startInfo.xy,
            now
        ];
    };
    return _TableSelectPlugin;
}(TablePlugin);
/** 自动滚动距离边缘前的此位置开始触发 */ _TableSelectPlugin.EDGE_SIZE = 32;
