import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { createForm } from "../../form-vanilla/index.js";
import { deleteNamePathValue, ensureArray, getNamePathValue, isEmpty, setNamePathValue, stringifyNamePath } from "@m78/utils";
import { _TablePrivateProperty } from "../types/base-type.js";
import { TablePlugin } from "../plugin.js";
import { TableMutationType } from "./mutation.js";
import { requiredValidatorKey } from "@m78/verify";
import { TableReloadLevel } from "./life.js";
import { removeNode } from "../../common/index.js";
import { _getCellKey, _syncListNode } from "../common.js";
import { _TableInteractiveCorePlugin } from "./interactive-core.js";
import { FORM_LANG_PACK_NS, i18n } from "../../i18n/index.js";
export var _TableFormPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableFormPlugin, TablePlugin);
    var _super = _create_super(_TableFormPlugin);
    function _TableFormPlugin() {
        _class_call_check(this, _TableFormPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        // 以key存储行表单实例
        _this.formInstances = {};
        // 以key存储行表单错误信息
        _this.errors = {};
        // 以行为单位存储单元格错误信息 { rowKey: { cellKey: "err msg" } }
        _this.cellErrors = {};
        // 记录行是否变动
        _this.rowChanged = {};
        // 用于显示错误反馈的节点
        _this.errorNodes = [];
        // 用于显示行变动标识的节点
        _this.rowChangedNodes = [];
        // 记录单元格是否变动
        _this.cellChanged = {};
        // 用于显示单元格变动标识的节点
        _this.cellChangedNodes = [];
        // 记录编辑/必填状态
        _this.editStatus = [];
        // 用于开始查找editStatus
        _this.editStatusMap = {};
        _this.editStatusNodes = [];
        // 无效状态
        _this.invalidCellMap = {};
        _this.invalidStatusMap = {};
        _this.invalidStatus = [];
        _this.invalidNodes = [];
        _this.mutation = function(e) {
            if (e.type !== TableMutationType.value) return;
            var cell = e.cell, value = e.value;
            var form = _this.initForm(e);
            var name = cell.column.config.originalKey;
            form.setValue(name, value);
            var changed = form.getFormChanged();
            if (changed) {
                _this.rowChanged[cell.row.key] = true;
            } else {
                delete _this.rowChanged[cell.row.key];
            }
            if (form.getChanged(name)) {
                _this.cellChanged[cell.key] = cell;
            } else {
                delete _this.cellChanged[cell.key];
            }
            _this.updateValidStatus(cell.row);
            _this.updateValidRelate();
            form.debounceVerify(name, function() {
                var errors = form.getErrors();
                var newError = [];
                var cellError = {};
                var hasCellError = false;
                errors.forEach(function(e) {
                    if (form.getTouched(e.namePath)) {
                        newError.push(e);
                        // 只取第一条错误
                        if (!cellError[e.name]) {
                            cellError[e.name] = e.message;
                            hasCellError = true;
                        }
                    }
                });
                if (newError.length) {
                    _this.errors[cell.row.key] = newError;
                } else {
                    delete _this.errors[cell.row.key];
                }
                if (hasCellError) {
                    _this.cellErrors[cell.row.key] = cellError;
                } else {
                    delete _this.cellErrors[cell.row.key];
                }
                _this.table.render();
            });
        };
        return _this;
    }
    var _proto = _TableFormPlugin.prototype;
    _proto.beforeInit = function beforeInit() {
        this.interactive = this.getPlugin(_TableInteractiveCorePlugin);
        this.wrapNode = document.createElement("div");
        this.wrapNode.className = "m78-table_form-wrap";
        this.methodMapper(this.table, [
            "verify",
            "verifyChanged",
            "getChangedData",
            "getData",
            "getChanged",
            "getFormChanged",
            "resetFormState", 
        ]);
    };
    _proto.mounted = function mounted() {
        this.table.event.mutation.on(this.mutation);
        this.context.viewContentEl.appendChild(this.wrapNode);
    };
    _proto.beforeDestroy = function beforeDestroy() {
        this.table.event.mutation.off(this.mutation);
        this.editStatus = [];
        this.editStatusMap = {};
        this.reset();
        removeNode(this.wrapNode);
    };
    _proto.loadStage = function loadStage(level, isBefore) {
        if (level === TableReloadLevel.full && isBefore) {
            this.reset();
        }
        if (level === TableReloadLevel.base && !isBefore) {
            this.updateEditStatus();
        }
    };
    _proto.rendering = function rendering() {
        var _this = this;
        var ref;
        var showRowsMap = {};
        var showRows = ((ref = this.context.lastViewportItems) === null || ref === void 0 ? void 0 : ref.rows) || [];
        this.invalidCellMap = {};
        this.updateValidRelate();
        // 动态创建form实例
        showRows.forEach(function(row) {
            showRowsMap[row.key] = true;
            _this.initForm(row);
            _this.updateValidStatus(row);
        });
        this.updateValidRelate();
        // 渲染编辑/必填状态
        if (this.editStatus.length) {
            this.editStatus.forEach(function(param, ind) {
                var cell = param.cell, required = param.required;
                // if (!cell.isMount) return;
                var node = _this.editStatusNodes[ind];
                var position = _this.table.getAttachPosition(cell);
                node.style.color = required ? "var(--m78-color-warning)" : "var(--m78-color-opacity-lg)";
                node.style.transform = "translate(".concat(position.left + 2, "px, ").concat(position.top + position.height - 8, "px)");
                node.style.zIndex = position.zIndex;
            });
        }
        if (isEmpty(this.formInstances)) return;
        // 渲染无效状态
        if (this.invalidStatus.length) {
            this.invalidStatus.forEach(function(cell, ind) {
                var node = _this.invalidNodes[ind];
                var position = _this.table.getAttachPosition(cell);
                node.style.height = "".concat(position.height + 1, "px");
                node.style.width = "".concat(position.width + 1, "px");
                node.style.transform = "translate(".concat(position.left - 1, "px, ").concat(position.top - 1, "px)");
                node.style.zIndex = String(Number(position.zIndex) + 2);
            });
        }
        // 渲染错误单元格标识/行变动标识/单元格变动标识
        var ref1 = _sliced_to_array(this.getErrorList(), 2), errList = ref1[0], errorMap = ref1[1];
        var changedList = this.getRowMarkList(showRowsMap, errorMap);
        var cellChangedList = this.getChangedList();
        changedList.forEach(function(param, ind) {
            var attachPosition = param.attachPosition, row = param.row, hasError = param.hasError;
            var node = _this.rowChangedNodes[ind];
            node.style.height = "".concat(attachPosition.height + 1, "px");
            node.style.transform = "translate(".concat(_this.table.getX(), "px, ").concat(attachPosition.top, "px)");
            node.style.backgroundColor = hasError ? "var(--m78-color-error)" : "var(--m78-color)";
            node.style.zIndex = row.isFixed ? "31" : "11";
        });
        cellChangedList.forEach(function(pos, ind) {
            var node = _this.cellChangedNodes[ind];
            node.style.transform = "translate(".concat(pos.left + pos.width - 8, "px, ").concat(pos.top + 2, "px)");
            node.style.zIndex = pos.zIndex;
        });
        errList.forEach(function(param, ind) {
            var attachPosition = param.attachPosition;
            var node = _this.errorNodes[ind];
            node.style.width = "".concat(attachPosition.width + 1, "px");
            node.style.height = "".concat(attachPosition.height + 1, "px");
            node.style.transform = "translate(".concat(attachPosition.left, "px, ").concat(attachPosition.top, "px)");
            node.style.zIndex = String(Number(attachPosition.zIndex) + 1); // 比变动标记高一层
        });
    };
    // 是否允许编辑
    _proto.validCheck = function validCheck(cell) {
        return !this.invalidStatusMap[cell.key];
    };
    _proto.getChanged = function getChanged(rowKey, columnKey) {
        if (!columnKey) {
            return !!this.rowChanged[rowKey];
        }
        return !!this.cellChanged[_getCellKey(rowKey, stringifyNamePath(columnKey))];
    };
    _proto.getFormChanged = function getFormChanged() {
        var _this = this;
        return Object.keys(this.rowChanged).some(function(key) {
            return _this.rowChanged[key];
        });
    };
    _proto.getData = function getData() {
        return this.getDataCommon();
    };
    _proto.getChangedData = function getChangedData() {
        var _this = this;
        return this.getDataCommon(function(i) {
            var key = _this.table.getKeyByRowData(i);
            return _this.rowChanged[key];
        });
    };
    _proto.resetFormState = function resetFormState() {
        this.reset();
        this.table.render();
    };
    _proto.verify = function verify(rowKey) {
        return this.verifyCommon(false, rowKey);
    };
    _proto.verifyChanged = function verifyChanged() {
        return this.verifyCommon(true);
    };
    /** 获取指定单元格最后一次参与验证后的错误 */ _proto.getCellError = function getCellError(cell) {
        var rec = this.cellErrors[cell.row.key];
        if (!rec) return "";
        return rec[cell.column.config.key] || "";
    };
    /** 获取指定列的可编辑信息, 不可编辑时返回null */ _proto.getEditStatus = function getEditStatus(col) {
        return this.editStatusMap[col.key] || null;
    };
    // 验证通用逻辑, 传入rowKey时仅验证指定的行
    _proto.verifyCommon = function verifyCommon(onlyChanged, rowKey) {
        var _this = this;
        return _async_to_generator(function() {
            var data, form, _tmp;
            return _ts_generator(this, function(_state) {
                if (rowKey) {
                    data = [
                        _this.table.getRow(rowKey).data
                    ];
                } else {
                    data = onlyChanged ? _this.getChangedData() : _this.getData();
                }
                _tmp = {};
                form = createForm((_tmp.schemas = {
                    eachSchema: {
                        schema: _this.config.schema
                    }
                }, _tmp.autoVerify = false, _tmp.verifyFirst = true, _tmp.languagePack = i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS), _tmp));
                form.setValues(data);
                return [
                    2,
                    form.verify().then(function() {
                        return data;
                    }).catch(function(err) {
                        var ref, ref1;
                        var namePath = (ref = err.rejects) === null || ref === void 0 ? void 0 : (ref1 = ref[0]) === null || ref1 === void 0 ? void 0 : ref1.namePath;
                        // 对首个错误行单独执行验证, 并高亮指定行/单元格
                        if (namePath) {
                            var ind = namePath[0];
                            var name = namePath[1];
                            var curData = data[ind];
                            var key = _this.table.getKeyByRowData(curData);
                            var cell = _this.table.getCell(key, name);
                            _this.verifySpecifiedRow(_this.table.getRow(key), cell);
                        }
                        throw err;
                    })
                ];
            });
        })();
    };
    // 验证指定行兵更新对应ui, 传入cell时, 高亮指定cell
    _proto.verifySpecifiedRow = function verifySpecifiedRow(row, cell) {
        var _this = this;
        var form = this.initForm(row);
        form.verify().then(function() {
            delete _this.errors[row.key];
            delete _this.cellErrors[row.key];
        }).catch(function(errors) {
            if (errors === null || errors === void 0 ? void 0 : errors.rejects) {
                var rejList = errors.rejects;
                _this.errors[row.key] = rejList;
                var cellError = {};
                var hasCellError = false;
                rejList.forEach(function(e) {
                    if (form.getTouched(e.namePath)) {
                        // 只取第一条错误
                        if (!cellError[e.name]) {
                            cellError[e.name] = e.message;
                            hasCellError = true;
                        }
                    }
                });
                if (hasCellError) {
                    _this.cellErrors[row.key] = cellError;
                } else {
                    delete _this.cellErrors[row.key];
                }
            }
        }).finally(function() {
            _this.table.render();
            _this.table.highlightRow(row.key);
            if (cell) {
                _this.table.highlight(cell.key);
                _this.table.selectCells(cell.key);
            }
        });
    };
    _proto.reset = function reset() {
        this.cellChanged = {};
        this.rowChanged = {};
        this.errors = {};
        this.cellErrors = {};
        this.formInstances = {};
        this.invalidCellMap = {};
        this.updateValidRelate();
    };
    // 更新可编辑状态
    _proto.updateEditStatus = function updateEditStatus() {
        var _this = this;
        var hKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];
        var firstRowKey = this.context.allRowKeys[0];
        this.editStatus = [];
        this.editStatusMap = {};
        if (!firstRowKey) return;
        var requireKeys = [];
        // 是否包含必填验证器
        if (!isEmpty(this.config.schema)) {
            requireKeys = this.config.schema.filter(function(i) {
                var validator = ensureArray(i.validator);
                return validator.some(function(i) {
                    return i.key === requiredValidatorKey;
                });
            }).map(function(i) {
                return stringifyNamePath(i.name);
            });
        }
        // 是否可编辑
        this.context.columns.forEach(function(col) {
            if (getNamePathValue(col, _TablePrivateProperty.ignore)) return;
            var cell = _this.table.getCell(hKey, col.key);
            // header cell 不能检测是否可编辑, 这里以第一行数据的可编译配置作为参照 (忽略单元格逐个配置的情况, 表单都是以列为单位启用)
            var firstRowCell = _this.table.getCell(firstRowKey, col.key);
            if (_this.interactive.isInteractive(firstRowCell)) {
                var item = {
                    required: requireKeys.includes(col.key),
                    cell: cell
                };
                _this.editStatusMap[col.key] = item;
                _this.editStatus.push(item);
            }
        });
        _syncListNode({
            wrapNode: this.wrapNode,
            list: this.editStatus,
            nodeList: this.editStatusNodes,
            createAction: function(node) {
                node.className = "m78-table_form-edit-status";
            }
        });
    };
    // 更新valid显示状态
    _proto.updateValidStatus = function updateValidStatus(row) {
        var _this = this;
        if (row.isHeader) return;
        if (getNamePathValue(row.data, _TablePrivateProperty.ignore)) return;
        var form = this.formInstances[row.key];
        if (!form) return;
        if (isEmpty(this.config.schema)) {
            this.invalidCellMap = {};
            this.updateValidRelate();
            return;
        }
        var list = [];
        this.config.schema.map(function(s) {
            var sc = form.getSchema(s.name);
            if ((sc === null || sc === void 0 ? void 0 : sc.valid) === false) {
                var cell = _this.table.getCell(row.key, sc.name);
                list.push(cell);
            }
        });
        if (list.length) {
            this.invalidCellMap[row.key] = list;
        } else {
            delete this.invalidCellMap[row.key];
        }
    };
    // 根据当前invalidCellMap更新相关状态
    _proto.updateValidRelate = function updateValidRelate() {
        var _this = this;
        this.invalidStatusMap = {};
        this.invalidStatus = [];
        Object.keys(this.invalidCellMap).forEach(function(key) {
            var invalidCells = _this.invalidCellMap[key];
            if (!invalidCells) return;
            invalidCells.forEach(function(cell) {
                _this.invalidStatusMap[cell.key] = true;
                _this.invalidStatus.push(cell);
            });
        });
        _syncListNode({
            wrapNode: this.wrapNode,
            list: this.invalidStatus,
            nodeList: this.invalidNodes,
            createAction: function(node) {
                node.className = "m78-table_form-invalid";
            }
        });
    };
    // 获取用于展示错误的列表, 包含了渲染需要的各种必要信息
    _proto.getErrorList = function getErrorList() {
        var _this = this;
        var list = [];
        var rowErrorMap = {};
        Object.keys(this.errors).forEach(function(key) {
            var rowErrors = _this.errors[key];
            if (rowErrors) {
                if (rowErrors.length) {
                    rowErrorMap[key] = true;
                }
                rowErrors.forEach(function(item) {
                    var cell = _this.table.getCell(key, item.name);
                    var pos = _this.table.getAttachPosition(cell);
                    if (!cell.isMount) return;
                    list.push({
                        message: item.message,
                        cell: cell,
                        attachPosition: pos
                    });
                });
            }
        });
        _syncListNode({
            wrapNode: this.wrapNode,
            list: list,
            nodeList: this.errorNodes,
            createAction: function(node) {
                node.className = "m78-table_form-error-feedback";
            }
        });
        return [
            list,
            rowErrorMap
        ];
    };
    // 获取用于展示变更/验证失败行列表, 包含了渲染需要的各种必要信息
    _proto.getRowMarkList = function getRowMarkList(showRowsMap, errorMap) {
        var _this = this;
        var keyList = _to_consumable_array(Object.keys(errorMap)).concat(_to_consumable_array(Object.keys(this.rowChanged)));
        var checkedMap = {};
        var list = keyList.filter(function(i) {
            if (checkedMap[i]) return false;
            checkedMap[i] = true;
            return showRowsMap[i] && (errorMap[i] || _this.rowChanged[i]);
        }).map(function(key) {
            var row = _this.table.getRow(key);
            var pos = _this.table.getRowAttachPosition(row);
            return {
                row: row,
                attachPosition: pos,
                hasError: _this.errors[key]
            };
        });
        _syncListNode({
            wrapNode: this.wrapNode,
            list: list,
            nodeList: this.rowChangedNodes,
            createAction: function(node) {
                node.className = "m78-table_form-changed-mark";
            }
        });
        return list;
    };
    // 获取用于展示变更单元格的列表, 包含了渲染需要的各种必要信息
    _proto.getChangedList = function getChangedList() {
        var _this = this;
        var list = [];
        Object.keys(this.cellChanged).forEach(function(key) {
            var cell = _this.cellChanged[key];
            if (!cell || !cell.isMount) return;
            var pos = _this.table.getAttachPosition(cell);
            list.push(pos);
        });
        _syncListNode({
            wrapNode: this.wrapNode,
            list: list,
            nodeList: this.cellChangedNodes,
            createAction: function(node) {
                node.className = "m78-table_form-cell-changed-mark";
            }
        });
        return list;
    };
    // 若行form不存在则对其进行初始化
    _proto.initForm = function initForm(arg) {
        var isCellArg = this.table.isCellLike(arg);
        var isRowArg = this.table.isRowLike(arg);
        var row;
        var cell;
        if (isRowArg) {
            row = arg;
        } else if (isCellArg) {
            cell = arg;
            row = cell.row;
        } else {
            cell = arg.cell;
            row = cell.row;
        }
        var form = this.formInstances[row.key];
        if (form) return form;
        var defaultValue = _object_spread({}, row.data);
        // 通过mutation触发时, 需要还原为旧值
        if (!isCellArg && !isRowArg) {
            setNamePathValue(defaultValue, cell.column.config.originalKey, arg.oldValue);
        }
        form = createForm({
            defaultValue: defaultValue,
            schemas: {
                schema: this.config.schema
            },
            autoVerify: false,
            languagePack: i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS)
        });
        this.formInstances[row.key] = form;
        return form;
    };
    _proto.getDataCommon = function getDataCommon(filter) {
        var _this = this;
        var list = [];
        this.context.data.forEach(function(i) {
            var isFake = getNamePathValue(i, _TablePrivateProperty.fake);
            if (isFake) return;
            if (filter && !filter(i)) return;
            var key = _this.table.getKeyByRowData(i);
            var data;
            var isIgnore = getNamePathValue(i, _TablePrivateProperty.ignore);
            // 是忽略项时, 获取其原始数据 (通常是其fixed项clone, 执行setValue时值保存在clone位置而不是原始备份记录)
            if (isIgnore) {
                var ind = _this.table.getIndexByRowKey(key);
                data = Object.assign({}, _this.context.data[ind]);
                deleteNamePathValue(data, _TablePrivateProperty.fake);
            } else {
                data = i;
            }
            var invalid = _this.invalidCellMap[key];
            if (invalid === null || invalid === void 0 ? void 0 : invalid.length) {
                // 数据未clone时, 需要clone数据, 防止污染原始数据
                if (!isIgnore) {
                    data = _object_spread({}, data);
                }
                invalid.forEach(function(cell) {
                    var name = cell.column.config.originalKey;
                    deleteNamePathValue(data, name);
                });
            }
            list.push(data);
        });
        return list;
    };
    return _TableFormPlugin;
}(TablePlugin);
