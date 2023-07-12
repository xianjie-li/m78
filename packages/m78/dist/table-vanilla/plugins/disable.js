import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { _getCellKey, _getCellKeysByStr } from "../common.js";
import { addCls, removeCls } from "../../common/index.js";
/** 在单元格/行/列上设置半透明遮挡物进行禁用 */ export var _TableDisablePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableDisablePlugin, TablePlugin);
    var _super = _create_super(_TableDisablePlugin);
    function _TableDisablePlugin() {
        _class_call_check(this, _TableDisablePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _this.disabled = false;
        /** 禁用行 */ _this.rows = {};
        /** 禁用单元格 */ _this.cells = {};
        /** 禁用列 */ _this.columns = {};
        _this.isDisabled = function() {
            return _this.disabled;
        };
        _this.isDisabledRow = function(key) {
            return !!_this.rows[key];
        };
        _this.isDisabledColumn = function(key) {
            return !!_this.columns[key];
        };
        _this.isDisabledCell = function(key) {
            if (_this.cells[key]) return true;
            var cell = _this.table.getCellByStrKey(key);
            return _this.isDisabledRow(cell.row.key) || _this.isDisabledColumn(cell.column.key);
        };
        _this.getDisabledRows = function() {
            var ls = [];
            Object.keys(_this.rows).forEach(function(key) {
                var row = _this.table.getRow(key);
                ls.push(row);
            });
            return ls;
        };
        _this.getDisabledColumns = function() {
            var ls = [];
            Object.keys(_this.columns).forEach(function(key) {
                var row = _this.table.getRow(key);
                ls.push(row);
            });
            return ls;
        };
        _this.getDisabledCells = function() {
            var uniqCache = {}; // 保证行和单元格的选中不重复
            var list = [];
            // 此处可能有潜在的性能问题
            var keyHandle = function(key) {
                var ref = _sliced_to_array(_getCellKeysByStr(key), 2), rowKey = ref[0], columnKey = ref[1];
                var cell = _this.table.getCell(rowKey, columnKey);
                // 跳过已经处理过的单元格
                if (uniqCache[cell.key]) return;
                uniqCache[cell.key] = 1;
                list.push(cell);
            };
            Object.keys(_this.rows).forEach(function(key) {
                _this.context.allColumnKeys.forEach(function(columnKey) {
                    keyHandle(_getCellKey(key, columnKey));
                });
            });
            Object.keys(_this.columns).forEach(function(key) {
                _this.context.allRowKeys.forEach(function(rowKey) {
                    keyHandle(_getCellKey(rowKey, key));
                });
            });
            Object.keys(_this.cells).forEach(keyHandle);
            return list;
        };
        _this.setRowDisable = function(rows) {
            var disable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, merge = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
            if (!merge) {
                _this.rows = {};
            }
            rows.forEach(function(key) {
                _this.rows[key] = disable ? 1 : 0;
            });
            _this.table.render();
        };
        _this.setColumnDisable = function(columns) {
            var disable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, merge = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
            if (!merge) {
                _this.columns = {};
            }
            columns.forEach(function(key) {
                _this.columns[key] = disable ? 1 : 0;
            });
            _this.table.render();
        };
        _this.setCellDisable = function(cells) {
            var disable = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true, merge = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
            if (!merge) {
                _this.cells = {};
            }
            cells.forEach(function(key) {
                _this.cells[key] = disable ? 1 : 0;
            });
            _this.table.render();
        };
        _this.disable = function(disable) {
            _this.disabled = disable;
            _this.table.render();
        };
        return _this;
    }
    var _proto = _TableDisablePlugin.prototype;
    _proto.beforeInit = function beforeInit() {
        this.methodMapper(this.table, [
            "disable",
            "isDisabled",
            "isDisabledRow",
            "isDisabledColumn",
            "isDisabledCell",
            "getDisabledRows",
            "getDisabledColumns",
            "getDisabledCells",
            "setRowDisable",
            "setColumnDisable",
            "setCellDisable",
            "clearDisable", 
        ]);
    };
    _proto.cellRender = function cellRender(cell) {
        var disabled = this.isDisabledCell(cell.key);
        disabled ? addCls(cell.dom, "__disabled") : removeCls(cell.dom, "__disabled");
    };
    _proto.clearDisable = function clearDisable() {
        this.rows = {};
        this.columns = {};
        this.cells = {};
        this.disabled = false;
        this.table.render();
    };
    return _TableDisablePlugin;
}(TablePlugin);
