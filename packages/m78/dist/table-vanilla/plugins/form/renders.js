import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { requiredValidatorKey } from "@m78/form/validator/index.js";
import { _syncListNode } from "../../common.js";
import { ensureArray, setCacheValue, stringifyNamePath } from "@m78/utils";
/** 渲染各种form标记 */ export var _MixinRenders = /*#__PURE__*/ function() {
    "use strict";
    function _MixinRenders() {
        _class_call_check(this, _MixinRenders);
    }
    _create_class(_MixinRenders, [
        {
            /* # # # # # # # 与schema相关的标记渲染, editable & valid # # # # # # # */ // 更新单元格的可编辑/无效标记 渲染前调用
            key: "prepareSchemasMark",
            value: function prepareSchemasMark() {
                var _this = this;
                if (!this.config.interactiveMark) return;
                this.editStatusMap = new Map();
                this.invalidList = [];
                // 以 { rowKey: { columnKey: true } } 缓存行的必填信息, 避免重复计算
                var requiredCache = {};
                this.schemasMarkCB = function(cell) {
                    if (cell.row.isHeader || cell.column.isHeader) return;
                    if (_this.allRemoveRecordMap.has(cell.row.key)) return false; // 删除行不显示
                    // 根据isInteractive来判断是否是可编辑(交互)状态, 可能是仅 Interactive 项, 但不影响
                    var editable = _this.interactive.isInteractive(cell);
                    // 不可编辑时跳过, 后续的required/invalid检测都没有意义了
                    if (!editable) return;
                    var row = cell.row;
                    var column = cell.column;
                    var curRequiredCache = requiredCache[row.key];
                    var schemas = _this.getSchemas(row);
                    // 缓存行的required检验
                    if (!curRequiredCache) {
                        curRequiredCache = {};
                        requiredCache[row.key] = curRequiredCache;
                        schemas.schemas.forEach(function(i) {
                            var validators = ensureArray(i.validator);
                            var isRequired = validators.some(function(v) {
                                return (v === null || v === void 0 ? void 0 : v.key) === requiredValidatorKey;
                            });
                            if (isRequired) {
                                curRequiredCache[stringifyNamePath(i.name)] = true;
                            }
                        });
                    }
                    var curCol = _this.editStatusMap.get(column.key);
                    var required = !!curRequiredCache[column.key];
                    // 列未写入过时处理
                    if (!curCol) {
                        var hKey = _this.context.yHeaderKeys[_this.context.yHeaderKeys.length - 1];
                        curCol = {
                            cell: _this.table.getCell(hKey, column.key),
                            required: required
                        };
                        _this.editStatusMap.set(column.key, curCol);
                    }
                    // 更新required
                    if (required) {
                        curCol.required = required;
                    }
                    // 更新invalid
                    var invalid = !!schemas.invalid.get(column.key);
                    if (invalid) {
                        _this.invalidList.push({
                            position: _this.table.getAttachPosition(cell),
                            cell: cell
                        });
                    }
                };
                this.table.event.cellRendering.on(this.schemasMarkCB);
            }
        },
        {
            // 更新单元格的可编辑/无效标记
            key: "updateSchemasMark",
            value: function updateSchemasMark() {
                var _this = this;
                if (!this.config.interactiveMark) return;
                this.table.event.cellRendering.off(this.schemasMarkCB);
                var editStatusList = Array.from(this.editStatusMap.values());
                _syncListNode({
                    wrapNode: this.wrapNode,
                    list: editStatusList,
                    nodeList: this.editStatusNodes,
                    createAction: function(node) {
                        node.className = "m78-table_form-edit-status";
                    }
                });
                _syncListNode({
                    wrapNode: this.wrapNode,
                    list: this.invalidList,
                    nodeList: this.invalidNodes,
                    createAction: function(node) {
                        node.className = "m78-table_form-invalid";
                    }
                });
                // 渲染编辑/必填状态
                if (editStatusList.length) {
                    editStatusList.forEach(function(param, ind) {
                        var cell = param.cell, required = param.required;
                        var node = _this.editStatusNodes[ind];
                        var position = _this.table.getAttachPosition(cell);
                        setCacheValue(node.style, "backgroundColor", required ? "var(--m78-color-warning)" : "var(--m78-color-opacity-lg)");
                        setCacheValue(node.style, "transform", "translate(".concat(position.left, "px, ").concat(position.top, "px)"));
                        setCacheValue(node.style, "width", "".concat(position.width, "px"));
                        setCacheValue(node.style, "zIndex", position.zIndex);
                    });
                }
                // 渲染无效状态
                if (this.invalidList.length) {
                    this.invalidList.forEach(function(param, ind) {
                        var position = param.position;
                        var node = _this.invalidNodes[ind];
                        setCacheValue(node.style, "height", "".concat(position.height + 1, "px"));
                        setCacheValue(node.style, "width", "".concat(position.width + 1, "px"));
                        setCacheValue(node.style, "transform", "translate(".concat(position.left - 1, "px, ").concat(position.top - 1, "px)"));
                        setCacheValue(node.style, "zIndex", String(Number(position.zIndex) + 2));
                    });
                }
            }
        },
        {
            /* # # # # # # # cell error render # # # # # # # */ /** 获取指定单元格最后一次参与验证后的错误字符串 */ key: "getCellError",
            value: function getCellError(cell) {
                var rec = this.cellErrors.get(cell.row.key);
                if (!rec) return "";
                var cur = rec.get(cell.column.config.key);
                if (!cur) return "";
                return cur.message;
            }
        },
        {
            // 更新行的变更/错误标记 渲染前调用
            key: "prepareErrors",
            value: function prepareErrors() {
                var _this = this;
                this.errorsList = [];
                this.updateErrorsCB = function(cell) {
                    if (_this.allRemoveRecordMap.has(cell.row.key)) return false; // 删除行不显示
                    if (cell.row.isHeader || cell.column.isHeader) return;
                    var rowErrors = _this.cellErrors.get(cell.row.key);
                    if (!rowErrors || rowErrors.size === 0) return;
                    var err = rowErrors.get(cell.column.key);
                    if (!err) return;
                    _this.errorsList.push({
                        message: err.message,
                        position: _this.table.getAttachPosition(cell),
                        cell: cell
                    });
                };
                this.table.event.cellRendering.on(this.updateErrorsCB);
            }
        },
        {
            // 更新行的变更/错误标记
            key: "updateErrors",
            value: function updateErrors() {
                var _this = this;
                this.table.event.cellRendering.off(this.updateErrorsCB);
                _syncListNode({
                    wrapNode: this.wrapNode,
                    list: this.errorsList,
                    nodeList: this.errorsNodes,
                    createAction: function(node) {
                        node.className = "m78-table_form-error-feedback";
                    }
                });
                this.errorsList.forEach(function(param, ind) {
                    var position = param.position;
                    var node = _this.errorsNodes[ind];
                    setCacheValue(node.style, "width", "".concat(position.width + 1, "px"));
                    setCacheValue(node.style, "height", "".concat(position.height + 1, "px"));
                    setCacheValue(node.style, "transform", "translate(".concat(position.left, "px, ").concat(position.top, "px)"));
                    setCacheValue(node.style, "zIndex", String(Number(position.zIndex) + 1));
                });
            }
        },
        {
            /* # # # # # # # row mark # # # # # # # */ // 更新行的变更/错误标记 渲染前调用
            key: "prepareRowMark",
            value: function prepareRowMark() {
                var _this = this;
                if (!this.config.rowMark) return;
                this.rowMarkList = [];
                this.updateRowMarkCB = function(row) {
                    if (_this.allRemoveRecordMap.has(row.key)) return; // 删除行不显示
                    if (row.isHeader) return;
                    var errors = _this.cellErrors.get(row.key);
                    var hasError = !!errors && errors.size !== 0;
                    if (!_this.getChanged(row.key) && !hasError) return;
                    _this.rowMarkList.push({
                        position: _this.table.getRowAttachPosition(row),
                        row: row,
                        hasError: hasError
                    });
                };
                this.table.event.rowRendering.on(this.updateRowMarkCB);
            }
        },
        {
            // 更新行的变更/错误标记
            key: "updateRowMark",
            value: function updateRowMark() {
                var _this = this;
                if (!this.config.rowMark) return;
                this.table.event.rowRendering.off(this.updateRowMarkCB);
                _syncListNode({
                    wrapNode: this.wrapNode,
                    list: this.rowMarkList,
                    nodeList: this.rowChangedNodes,
                    createAction: function(node) {
                        node.className = "m78-table_form-changed-mark";
                    }
                });
                this.rowMarkList.forEach(function(param, ind) {
                    var position = param.position, row = param.row, hasError = param.hasError;
                    var node = _this.rowChangedNodes[ind];
                    setCacheValue(node.style, "height", "".concat(position.height + 1, "px"));
                    setCacheValue(node.style, "transform", "translate(".concat(_this.table.getX(), "px, ").concat(position.top, "px)"));
                    setCacheValue(node.style, "backgroundColor", hasError ? "var(--m78-color-error)" : "var(--m78-color)");
                    setCacheValue(node.style, "zIndex", row.isFixed ? "31" : "11");
                });
            }
        },
        {
            /* # # # # # # # changed cell mark # # # # # # # */ // 更新用于标识变更单元格的列表 渲染前调用
            key: "prepareChangedCell",
            value: function prepareChangedCell() {
                var _this = this;
                if (!this.config.cellChangedMark) return;
                this.changedCellList = [];
                this.changedCellCB = function(cell) {
                    if (_this.allRemoveRecordMap.has(cell.row.key)) return;
                    if (cell.row.isHeader || cell.column.isHeader) return;
                    var isChanged = _this.cellChanged.get(cell.key);
                    if (!isChanged) return;
                    var position = _this.table.getAttachPosition(cell);
                    _this.changedCellList.push(position);
                };
                this.table.event.cellRendering.on(this.changedCellCB);
            }
        },
        {
            // 更新用于标识变更单元格的列表 渲染后调用
            key: "updateChangedCell",
            value: function updateChangedCell() {
                var _this = this;
                if (!this.config.cellChangedMark) return;
                this.table.event.cellRendering.off(this.changedCellCB);
                _syncListNode({
                    wrapNode: this.wrapNode,
                    list: this.changedCellList,
                    nodeList: this.cellChangedNodes,
                    createAction: function(node) {
                        node.className = "m78-table_form-cell-changed-mark";
                    }
                });
                this.changedCellList.forEach(function(pos, ind) {
                    var node = _this.cellChangedNodes[ind];
                    setCacheValue(node.style, "transform", "translate(".concat(pos.left + pos.width - 8, "px, ").concat(pos.top + 2, "px)"));
                    setCacheValue(node.style, "zIndex", pos.zIndex);
                });
            }
        }
    ]);
    return _MixinRenders;
}();
