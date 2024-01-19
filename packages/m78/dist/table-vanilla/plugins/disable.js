import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { _getCellKey, _getCellKeysByStr } from "../common.js";
import { addCls, removeCls } from "../../common/index.js";
import { SelectManager } from "@m78/utils";
import { TableReloadLevel } from "./life.js";
/** 在单元格/行/列上设置半透明遮挡物, 目前仅用于组件内部api设置临时禁用状态, 如拖动排序时, 为拖动列显示禁用样式 */ export var _TableDisablePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableDisablePlugin, TablePlugin);
    var _super = _create_super(_TableDisablePlugin);
    function _TableDisablePlugin() {
        _class_call_check(this, _TableDisablePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        // 表格本身的禁用状态, 状态本身并无约束力, 可能某些api会需要读取其并禁用行为
        _define_property(_assert_this_initialized(_this), "disabled", false);
        // 用于检测禁用状态的select状态, 可以在其他插件向其中推入新的实例, 来实现插件自行管理禁用状态, 避免被通用禁用状态干扰
        _define_property(_assert_this_initialized(_this), "rowChecker", [
            new SelectManager()
        ]);
        // 同rowChecker, 但检测列
        _define_property(_assert_this_initialized(_this), "columnChecker", [
            new SelectManager()
        ]);
        // 同rowChecker, 但检测单元格
        _define_property(_assert_this_initialized(_this), "cellChecker", [
            new SelectManager()
        ]);
        /** 禁用行 */ _define_property(_assert_this_initialized(_this), "rows", _this.rowChecker[0]);
        /** 禁用单元格 */ _define_property(_assert_this_initialized(_this), "cells", _this.cellChecker[0]);
        /** 禁用列 */ _define_property(_assert_this_initialized(_this), "columns", _this.columnChecker[0]);
        _define_property(_assert_this_initialized(_this), "isDisabled", function() {
            return _this.disabled;
        });
        _define_property(_assert_this_initialized(_this), "isDisabledRow", function(key) {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = _this.rowChecker[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var checker = _step.value;
                    if (checker.isSelected(key)) return true;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            return false;
        });
        _define_property(_assert_this_initialized(_this), "isDisabledColumn", function(key) {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = _this.columnChecker[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var checker = _step.value;
                    if (checker.isSelected(key)) return true;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            return false;
        });
        _define_property(_assert_this_initialized(_this), "isDisabledCell", function(key) {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = _this.cellChecker[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var checker = _step.value;
                    if (checker.isSelected(key)) return true;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            var cell = _this.table.getCellByStrKey(key);
            return _this.isDisabledRow(cell.row.key) || _this.isDisabledColumn(cell.column.key);
        });
        _define_property(_assert_this_initialized(_this), "getDisabledRows", function() {
            var ls = [];
            _this.rowChecker.forEach(function(c) {
                c.getState().selected.forEach(function(key) {
                    var row = _this.table.getRow(key);
                    ls.push(row);
                });
            });
            return ls;
        });
        _define_property(_assert_this_initialized(_this), "getDisabledColumns", function() {
            var ls = [];
            _this.columnChecker.forEach(function(c) {
                c.getState().selected.forEach(function(key) {
                    var column = _this.table.getColumn(key);
                    ls.push(column);
                });
            });
            return ls;
        });
        _define_property(_assert_this_initialized(_this), "getDisabledCells", function() {
            var uniqCache = {}; // 保证行和单元格的选中不重复
            var list = [];
            // 此处可能有潜在的性能问题
            var keyHandle = function(key) {
                var _$_getCellKeysByStr = _sliced_to_array(_getCellKeysByStr(key), 2), rowKey = _$_getCellKeysByStr[0], columnKey = _$_getCellKeysByStr[1];
                var cell = _this.table.getCell(rowKey, columnKey);
                // 跳过已经处理过的单元格
                if (uniqCache[cell.key]) return;
                uniqCache[cell.key] = 1;
                list.push(cell);
            };
            _this.rowChecker.forEach(function(c) {
                c.getState().selected.forEach(function(key) {
                    _this.context.allColumnKeys.forEach(function(columnKey) {
                        keyHandle(_getCellKey(key, columnKey));
                    });
                });
            });
            _this.columnChecker.forEach(function(c) {
                c.getState().selected.forEach(function(key) {
                    _this.context.allRowKeys.forEach(function(rowKey) {
                        keyHandle(_getCellKey(rowKey, key));
                    });
                });
            });
            _this.cellChecker.forEach(function(c) {
                c.getState().selected.forEach(function(k) {
                    return keyHandle(k);
                });
            });
            return list;
        });
        _define_property(_assert_this_initialized(_this), "setRowDisable", function(rows) {
            var disable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, merge = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
            if (!merge) {
                _this.rows.unSelectAll();
            }
            disable ? _this.rows.selectList(rows) : _this.rows.unSelectList(rows);
            _this.table.render();
        });
        _define_property(_assert_this_initialized(_this), "setColumnDisable", function(columns) {
            var disable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, merge = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
            if (!merge) {
                _this.columns.unSelectAll();
            }
            disable ? _this.columns.selectList(columns) : _this.columns.unSelectList(columns);
            _this.table.render();
        });
        _define_property(_assert_this_initialized(_this), "setCellDisable", function(cells) {
            var disable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, merge = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
            if (!merge) {
                _this.cells.unSelectAll();
            }
            disable ? _this.cells.selectList(cells) : _this.cells.unSelectList(cells);
            _this.table.render();
        });
        _define_property(_assert_this_initialized(_this), "disable", function(disable) {
            _this.disabled = disable;
            _this.table.render();
        });
        return _this;
    }
    _create_class(_TableDisablePlugin, [
        {
            key: "cellRender",
            value: function cellRender(cell) {
                var disabled = this.isDisabledCell(cell.key);
                disabled ? addCls(cell.dom, "__disabled") : removeCls(cell.dom, "__disabled");
            }
        },
        {
            key: "clear",
            value: function clear() {
                this.rows.unSelectAll();
                this.cells.unSelectAll();
                this.columns.unSelectAll();
            }
        },
        {
            key: "reload",
            value: function reload(opt) {
                if (opt.level === TableReloadLevel.full) {
                    this.clear();
                }
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                this.clear();
            }
        },
        {
            key: "clearDisable",
            value: function clearDisable() {
                this.rows.unSelectAll();
                this.columns.unSelectAll();
                this.cells.unSelectAll();
                this.disabled = false;
                this.table.render();
            }
        }
    ]);
    return _TableDisablePlugin;
}(TablePlugin);
