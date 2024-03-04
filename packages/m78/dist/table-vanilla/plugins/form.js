import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { createForm, createVerify } from "@m78/form";
import { requiredValidatorKey } from "@m78/form/validator/required.js";
import { deleteNamePathValue, deleteNamePathValues, ensureArray, isEmpty, isTruthyOrZero, setNamePathValue, simplyDeepClone, simplyEqual, stringifyNamePath } from "@m78/utils";
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableMutationDataType, TableMutationType } from "./mutation.js";
import { removeNode } from "../../common/index.js";
import { _getCellKey, _syncListNode } from "../common.js";
import { _TableInteractivePlugin } from "./interactive.js";
import { FORM_LANG_PACK_NS, i18n } from "../../i18n/index.js";
import { _TableSoftRemovePlugin } from "./soft-remove.js";
export var _TableFormPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableFormPlugin, TablePlugin);
    var _super = _create_super(_TableFormPlugin);
    function _TableFormPlugin() {
        _class_call_check(this, _TableFormPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "wrapNode", void 0);
        // 验证实例, 用于在未创建行form时复用
        _define_property(_assert_this_initialized(_this), "verifyInstance", void 0);
        // 以row key存储行表单错误信息
        _define_property(_assert_this_initialized(_this), "errors", new Map());
        // 以行为单位存储单元格错误信息 { [rowKey]: { [cellKey]: "err msg" } }
        _define_property(_assert_this_initialized(_this), "cellErrors", new Map());
        // 记录行是否变动
        _define_property(_assert_this_initialized(_this), "rowChanged", new Map());
        // 记录单元格是否变动
        _define_property(_assert_this_initialized(_this), "cellChanged", new Map());
        // 以行为key记录默认值
        _define_property(_assert_this_initialized(_this), "defaultValues", new Map());
        // 以row key存储的改行的计算后schema
        _define_property(_assert_this_initialized(_this), "schemaDatas", new Map());
        // 记录行是否被操作过 (首次进入交互后设置)
        _define_property(_assert_this_initialized(_this), "rowTouched", new Map());
        // 记录单元格是被操作过 (首次进入交互后设置)
        _define_property(_assert_this_initialized(_this), "cellTouched", new Map());
        // 用于显示错误反馈的节点
        _define_property(_assert_this_initialized(_this), "errorNodes", []);
        // 用于显示行变动标识的节点
        _define_property(_assert_this_initialized(_this), "rowChangedNodes", []);
        // 用于显示单元格变动标识的节点
        _define_property(_assert_this_initialized(_this), "cellChangedNodes", []);
        // 存储可编辑列的信息
        _define_property(_assert_this_initialized(_this), "editStatusMap", new Map());
        // 编辑/必填状态标识节点
        _define_property(_assert_this_initialized(_this), "editStatusNodes", []);
        // 无效反馈节点
        _define_property(_assert_this_initialized(_this), "invalidNodes", []);
        // 记录新增的数据
        _define_property(_assert_this_initialized(_this), "addRecordMap", new Map());
        // 记录移除的数据
        _define_property(_assert_this_initialized(_this), "removeRecordMap", new Map());
        // 记录移除的数据, 不进行 addRecordMap 的检测, 即 removeRecordMap 不会记录新增行的删除, 而 allRemoveRecordMap 会记录
        _define_property(_assert_this_initialized(_this), "allRemoveRecordMap", new Map());
        // 记录发生或排序变更的项信息
        _define_property(_assert_this_initialized(_this), "sortRecordMap", new Map());
        _define_property(_assert_this_initialized(_this), "interactive", void 0);
        _define_property(_assert_this_initialized(_this), "softRemove", void 0);
        // 数据发生变更时进行处理
        _define_property(_assert_this_initialized(_this), "mutation", function(e) {
            if (e.type === TableMutationType.value) {
                _this.valueMutation(e);
            }
            if (e.type === TableMutationType.data) {
                _this.dataMutation(e);
            }
        });
        // 值变更, 创建或获取form实例, 并同步值和校验状态
        _define_property(_assert_this_initialized(_this), "valueMutation", function(e) {
            var cell = e.cell;
            var column = cell.column;
            var row = cell.row;
            // 默认值不存在, 将默认值写入
            if (!_this.defaultValues.has(row.key)) {
                var rawData = simplyDeepClone(row.data);
                var name = column.config.originalKey;
                // 还原已变更的值
                setNamePathValue(rawData, name, e.oldValue);
                _this.defaultValues.set(row.key, rawData);
            }
            var changed = simplyEqual(row.data, _this.defaultValues.get(row.key));
            if (changed) {
                _this.rowChanged.set(row.key, true);
            } else {
                _this.rowChanged.delete(row.key);
            }
            var valueChanged = simplyEqual(e.value, e.oldValue);
            if (valueChanged) {
                _this.cellChanged.set(cell.key, true);
            } else {
                _this.cellChanged.delete(cell.key);
            }
            _this.rowTouched.set(row.key, true);
            _this.cellTouched.set(cell.key, true);
            // 更新schema
            var schema = _this.getSchemas(row, true);
            var fmtData = _this.getFmtData(row, row.data);
            _this.innerCheck(row, fmtData, schema.rootSchema).then(function() {
                return _this.table.render();
            });
        });
        // data变更, 记录新增, 删除数据, 并且也将其计入getFormChanged变更状态
        _define_property(_assert_this_initialized(_this), "dataMutation", function(e) {
            if (e.changeType === TableMutationDataType.add) {
                e.add.forEach(function(d) {
                    var k = _this.table.getKeyByRowData(d);
                    if (!k) return;
                    _this.allRemoveRecordMap.delete(k);
                    // 已经存在于删除列表中, 则不再计入新增列表
                    if (_this.removeRecordMap.delete(k)) return;
                    _this.addRecordMap.set(k, true);
                });
            }
            if (e.changeType === TableMutationDataType.remove) {
                e.remove.forEach(function(d) {
                    var k = _this.table.getKeyByRowData(d);
                    if (!k) return;
                    _this.allRemoveRecordMap.set(k, d);
                    // 已经存在于新增列表中, 则不再计入删除列表
                    if (_this.addRecordMap.delete(k)) return;
                    _this.removeRecordMap.set(k, d);
                });
            }
            // 除了自动触发的move外, 均记录到sortRecordMap
            if (e.changeType === TableMutationDataType.move && !e.isAutoMove) {
                e.move.forEach(function(meta) {
                    var k = _this.table.getKeyByRowData(meta.data);
                    if (!k) return;
                    var rec = _this.sortRecordMap.get(k);
                    if (!rec) {
                        rec = {
                            originIndex: meta.from,
                            currentIndex: meta.to
                        };
                        _this.sortRecordMap.set(k, rec);
                    }
                    rec.currentIndex = meta.to;
                });
            }
        });
        return _this;
    }
    _create_class(_TableFormPlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.interactive = this.getPlugin(_TableInteractivePlugin);
                this.softRemove = this.getPlugin(_TableSoftRemovePlugin);
                this.methodMapper(this.table, [
                    "verify",
                    "verifyRow",
                    "verifyChanged",
                    "getData",
                    "getChanged",
                    "getTableChanged"
                ]);
            }
        },
        {
            key: "mounted",
            value: function mounted() {
                var _this = this;
                this.table.event.mutation.on(this.mutation);
                // schemas配置变更时清理缓存的schema
                this.table.event.configChange.on(function(changeKeys, isChange) {
                    if (isChange("schemas")) {
                        _this.schemaConfigChange();
                    }
                });
                this.initNodeWrap();
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                this.table.event.mutation.off(this.mutation);
                this.table.event.configChange.empty();
                this.reset();
            }
        },
        {
            key: "loadStage",
            value: function loadStage(stage, isBefore) {
                if (stage === TableLoadStage.fullHandle && isBefore) {
                    this.reset();
                    this.initNodeWrap();
                }
            }
        },
        {
            key: "rendering",
            value: function rendering() {
                var _this = this;
                var _this_context_lastViewportItems;
                var showRowsMap = {};
                var showRows = ((_this_context_lastViewportItems = this.context.lastViewportItems) === null || _this_context_lastViewportItems === void 0 ? void 0 : _this_context_lastViewportItems.rows) || [];
                this.invalidCellMap = {};
                this.updateValidRelate();
                // 动态创建form实例
                showRows.forEach(function(row) {
                    showRowsMap[row.key] = true;
                    _this.getForm(row);
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
                        node.style.backgroundColor = required ? "var(--m78-color-warning)" : "var(--m78-color-opacity-lg)";
                        node.style.transform = "translate(".concat(position.left, "px, ").concat(position.top, "px)");
                        node.style.width = "".concat(position.width, "px");
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
                var _this_getErrorList = _sliced_to_array(this.getErrorList(), 2), errList = _this_getErrorList[0], errorMap = _this_getErrorList[1];
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
            }
        },
        {
            // 获取单元格invalid状态
            key: "validCheck",
            value: function validCheck(cell) {
                var invalid = this.getSchemas(cell.row).invalid;
                if (!invalid) return true;
                return !invalid.get(cell.column.key);
            }
        },
        {
            key: "getChanged",
            value: function getChanged(rowKey1, columnKey) {
                // 检测已有状态
                if (columnKey) {
                    var cellKey = _getCellKey(rowKey1, stringifyNamePath(columnKey));
                    if (this.cellChanged.get(cellKey)) return true;
                } else {
                    if (this.rowChanged.get(rowKey1)) return true;
                }
                // 新增行的检测均视为变更
                if (this.addRecordMap.has(rowKey1)) return true;
                // 删除行的检测均视为变更
                if (this.removeRecordMap.has(rowKey1)) return true;
                if (this.softRemove.isSoftRemove(rowKey1)) return true;
                // 排序变更
                var sortData = this.sortRecordMap.get(rowKey1);
                if (sortData && sortData.currentIndex !== sortData.originIndex) return true;
                return false;
            }
        },
        {
            key: "getTableChanged",
            value: function getTableChanged() {
                if (this.rowChanged.size !== 0) return true;
                // 包含新增或删除的行
                if (this.addRecordMap.size || this.removeRecordMap.size) return true;
                // 包含软删除数据
                if (this.softRemove.remove.hasSelected()) return true;
                var hasSorted = this.getSortedStatus();
                // 包含排序过的行
                if (hasSorted) return true;
                // 包含变更数据
                return false;
            }
        },
        {
            key: "getTouched",
            value: function getTouched(rowKey1, columnKey) {
                // 检测已有状态
                if (columnKey) {
                    var cellKey = _getCellKey(rowKey1, stringifyNamePath(columnKey));
                    if (this.cellTouched.get(cellKey)) return true;
                } else {
                    if (this.rowTouched.get(rowKey1)) return true;
                }
                // 包含新增行
                if (this.addRecordMap.has(rowKey1)) return true;
                // 包含删除行
                if (this.removeRecordMap.has(rowKey1)) return true;
                if (this.softRemove.isSoftRemove(rowKey1)) return true;
                // 排序变更
                var sortData = this.sortRecordMap.get(rowKey1);
                if (sortData && sortData.currentIndex !== sortData.originIndex) return true;
                return false;
            }
        },
        {
            key: "getTableTouched",
            value: function getTableTouched() {
                if (this.rowTouched.size !== 0) return true;
                // 包含新增或删除的行
                if (this.addRecordMap.size || this.removeRecordMap.size) return true;
                // 包含软删除数据
                if (this.softRemove.remove.hasSelected()) return true;
                var hasSorted = this.getSortedStatus();
                // 包含排序过的行
                if (hasSorted) return true;
                return false;
            }
        },
        {
            /** 检测是否发生了数据排序 */ key: "getSortedStatus",
            value: function getSortedStatus() {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                return Array.from(this.sortRecordMap.entries()).some(function(param) {
                    var _param = _sliced_to_array(param, 2), _ = _param[0], rec = _param[1];
                    return rec.currentIndex !== rec.originIndex;
                });
            }
        },
        {
            key: "getData",
            value: function getData() {
                var _this = this;
                var add = [];
                var change = [];
                var update = [];
                var remove = [];
                var all = this.eachData(function(data, key, status) {
                    if (status.add) add.push(data);
                    if (status.change) change.push(data);
                    if (status.update) update.push(data);
                });
                var rList = Array.from(this.removeRecordMap.values());
                if (rList) remove = rList;
                // 合并软删除项到remove
                if (this.softRemove.remove.hasSelected()) {
                    this.softRemove.remove.getState().selected.forEach(function(k) {
                        if (_this.removeRecordMap.has(k)) return; // 跳过已直接删除的项
                        var rmRow = _this.table.getRow(k);
                        remove.push(rmRow.data);
                    });
                }
                return {
                    change: change,
                    add: add,
                    remove: remove,
                    update: update,
                    all: all,
                    sorted: this.getSortedStatus()
                };
            }
        },
        {
            key: "verify",
            value: function verify() {
                return this.verifyCommon(false);
            }
        },
        {
            key: "verifyRow",
            value: function verifyRow(rowKey1) {
                return this.verifyCommon(false, rowKey1);
            }
        },
        {
            key: "verifyUpdated",
            value: function verifyUpdated() {
                return this.verifyCommon(true);
            }
        },
        {
            /** 获取指定单元格最后一次参与验证后的错误字符串 */ key: "getCellError",
            value: function getCellError(cell) {
                var rec = this.cellErrors[cell.row.key];
                if (!rec) return "";
                return rec[cell.column.config.key] || "";
            }
        },
        {
            /** 获取指定列的可编辑信息, 不可编辑时返回null */ key: "getEditStatus",
            value: function getEditStatus(col) {
                return this.editStatusMap[col.key] || null;
            }
        },
        {
            key: "verifyCommon",
            value: // verify/verifyChanged 验证通用逻辑, 传入rowKey时仅验证指定的行, 单行验证时仅返回指定行
            function verifyCommon(onlyUpdated) {
                var _this = this;
                return _async_to_generator(function() {
                    var list, dataLists, data, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, cur, form;
                    return _ts_generator(this, function(_state) {
                        list = _this.eachData(function(data, key, status) {
                            if (onlyUpdated && !status.update) return false;
                            var row = _this.table.getRow(key);
                            var schema = _this.getSchemas(row);
                        });
                        dataLists = _this.getData();
                        data = onlyUpdated ? dataLists.update : dataLists.all;
                        _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for(_iterator = data[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                                cur = _step.value;
                                _this.innerCheck();
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
                        form = createForm({
                            schemas: {
                                eachSchema: {
                                    schema: _this.config.schema
                                }
                            },
                            autoVerify: false,
                            verifyFirst: true,
                            languagePack: i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS)
                        });
                        form.setValues(data);
                        return [
                            2,
                            form.verify().then(function() {
                                return rowKey ? data[0] : dataLists;
                            }).catch(function(err) {
                                var _err_rejects_, _err_rejects;
                                var namePath = (_err_rejects = err.rejects) === null || _err_rejects === void 0 ? void 0 : (_err_rejects_ = _err_rejects[0]) === null || _err_rejects_ === void 0 ? void 0 : _err_rejects_.namePath;
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
            }
        },
        {
            key: "reset",
            value: // 重置状态/数据内联内容等
            function reset() {
                this.addRecordMap = new Map();
                this.removeRecordMap = new Map();
                this.allRemoveRecordMap = new Map();
                this.sortRecordMap = new Map();
                this.defaultValues = new Map();
                this.schemaDatas = new Map();
                this.editStatus = [];
                this.editStatusMap = new Map();
                this.cellChanged = new Map();
                this.rowChanged = new Map();
                this.rowTouched = new Map();
                this.cellTouched = new Map();
                this.errors = new Map();
                this.cellErrors = new Map();
                removeNode(this.wrapNode);
                this.errorNodes = [];
                this.rowChangedNodes = [];
                this.cellChangedNodes = [];
                this.editStatusNodes = [];
                this.invalidNodes = [];
            }
        },
        {
            key: "updateEditStatus",
            value: // 更新可编辑状态
            function updateEditStatus() {
                var _this = this;
                var hKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];
                var firstRowKey = this.context.allRowKeys[0];
                this.editStatus = [];
                this.editStatusMap = {};
                if (!firstRowKey) {
                    // 清空
                    _syncListNode({
                        wrapNode: this.wrapNode,
                        list: [],
                        nodeList: this.editStatusNodes
                    });
                    return;
                }
                var requireKeys = [];
                // 是否包含必填验证器
                if (!isEmpty(this.config.schema)) {
                    requireKeys = this.config.schema.filter(function(i) {
                        var validator = ensureArray(i.validator);
                        return validator.some(function(i) {
                            return (i === null || i === void 0 ? void 0 : i.key) === requiredValidatorKey;
                        });
                    }).map(function(i) {
                        return stringifyNamePath(i.name);
                    });
                }
                // 是否可编辑
                this.context.columns.forEach(function(col) {
                    if (_this.context.isIgnoreColumn(col.key)) return;
                    var cell = _this.table.getCell(hKey, col.key);
                    // header cell 不能检测是否可编辑, 这里以第一行数据的可编译配置作为参照 (忽略单元格逐个配置的情况, 表单都是以列为单位启用)
                    var firstRowCell = _this.table.getCell(firstRowKey, col.key);
                    // 根据isInteractive来判断是否是可编辑状态, 可能不完全正确, 但基本没影响
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
            }
        },
        {
            key: "updateValidStatus",
            value: // 更新valid显示状态
            function updateValidStatus(row) {
                var _this = this;
                if (row.isHeader) return;
                if (this.context.isIgnoreRow(row.key)) return;
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
            }
        },
        {
            key: "updateValidRelate",
            value: // 根据当前invalidCellMap更新相关状态
            function updateValidRelate() {
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
            }
        },
        {
            key: "getErrorList",
            value: // 获取用于展示错误的列表, 包含了渲染需要的各种必要信息
            function getErrorList() {
                var _this = this;
                var list = [];
                var rowErrorMap = {};
                Object.keys(this.errors).forEach(function(key) {
                    if (_this.allRemoveRecordMap.has(key)) return false; // 删除行不显示
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
            }
        },
        {
            key: "getRowMarkList",
            value: // 获取用于展示变更/验证失败行列表, 包含了渲染需要的各种必要信息
            function getRowMarkList(showRowsMap, errorMap) {
                var _this = this;
                var keyList = _to_consumable_array(Object.keys(errorMap)).concat(_to_consumable_array(Object.keys(this.rowChanged)));
                var checkedMap = {};
                var list = keyList.filter(function(i) {
                    if (checkedMap[i]) return false;
                    if (_this.allRemoveRecordMap.has(i)) return false; // 删除行不显示
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
            }
        },
        {
            key: "getChangedList",
            value: // 获取用于展示变更单元格的列表, 包含了渲染需要的各种必要信息
            function getChangedList() {
                var _this = this;
                var list = [];
                Object.keys(this.cellChanged).forEach(function(key) {
                    var cell = _this.cellChanged[key];
                    if (!cell || !cell.isMount) return;
                    if (_this.allRemoveRecordMap.has(cell.row.key)) return;
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
            }
        },
        {
            key: "innerCheck",
            value: // 接收处理后的values和schemas进行验证, 并更新行和单元格的错误信息, 包含错误时, 会选中并高亮首个错误单元格
            function innerCheck(row, values, schemas) {
                var _this = this;
                var _row = this.table.isRowLike(row) ? row : this.table.getRow(row);
                var verify = this.getVerify();
                return verify.staticCheck(values, schemas).then(function(res) {
                    var _res = _sliced_to_array(res, 1), errors = _res[0];
                    var newError = [];
                    var cellError = new Map();
                    var firstErrorColumnName;
                    if (errors) {
                        errors.forEach(function(e) {
                            newError.push(e);
                            // 每列只取第一条错误
                            if (!cellError.has(e.name)) {
                                cellError.set(e.name, e.message);
                            }
                            if (!firstErrorColumnName) {
                                firstErrorColumnName = e.name;
                            }
                        });
                    }
                    if (newError.length) {
                        _this.errors.set(_row.key, newError);
                    } else {
                        _this.errors.delete(_row.key);
                    }
                    if (cellError.size !== 0) {
                        _this.cellErrors.set(_row.key, cellError);
                    } else {
                        _this.cellErrors.delete(_row.key);
                    }
                    if (isTruthyOrZero(firstErrorColumnName)) {
                        var cell = _this.table.getCell(_row.key, firstErrorColumnName);
                        _this.table.highlight(cell.key);
                        _this.table.selectCells(cell.key);
                    }
                    return res;
                });
            }
        },
        {
            /** 获取verify实例 */ key: "getVerify",
            value: function getVerify() {
                return this.verifyInstance;
            }
        },
        {
            key: "getSchemas",
            value: // 获取指定行的schemas信息, 没有则创建, 可传入update来主动更新
            function getSchemas(row) {
                var update = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                var _this = this;
                var _row = this.table.isRowLike(row) ? row : this.table.getRow(row);
                if (!update) {
                    var cache = this.schemaDatas.get(_row.key);
                    if (cache) return cache;
                }
                var verify = this.getVerify();
                return verify.withValues(_row.data, function() {
                    var _verify_getSchemasDetail = verify.getSchemasDetail(), schemas = _verify_getSchemasDetail.schemas, invalidNames = _verify_getSchemasDetail.invalidNames;
                    var invalid = new Map();
                    invalidNames.forEach(function(k) {
                        return invalid.set(stringifyNamePath(k), true);
                    });
                    var data = {
                        schemas: schemas.schema,
                        rootSchema: schemas,
                        invalid: invalid,
                        invalidNames: invalidNames
                    };
                    _this.schemaDatas.set(_row.key, data);
                    return data;
                });
            }
        },
        {
            key: "getFmtData",
            value: // 获取处理invalid项后的data, data会经过clone
            function getFmtData(row, data) {
                var invalid = this.getSchemas(row).invalidNames;
                data = simplyDeepClone(data);
                if (invalid === null || invalid === void 0 ? void 0 : invalid.length) {
                    deleteNamePathValues(data, invalid);
                }
                return data;
            }
        },
        {
            key: "initVerify",
            value: /** 初始化verify实例 */ function initVerify() {
                this.verifyInstance = createVerify({
                    schemas: {
                        schema: this.config.schemas
                    },
                    autoVerify: false,
                    languagePack: i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS)
                });
            }
        },
        {
            key: "eachData",
            value: /** 遍历所有数据(不包含fake/软删除数据)并返回其clone版本
   *
   * - 若cb返回false则跳过并将该条数据从返回list中过滤, 返回0时, 停止遍历, 返回已遍历的值
   * - 数据会对invalid的值进行移除处理, 可通过 handleInvalid 控制
   * */ function eachData(cd) {
                var handleInvalid = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                var list = [];
                var d = this.context.data;
                for(var j = 0; j < d.length; j++){
                    var i = d[j];
                    var key = this.table.getKeyByRowData(i);
                    var meta = this.context.getRowMeta(key);
                    if (meta.fake) continue;
                    if (this.softRemove.isSoftRemove(key)) continue;
                    var data = handleInvalid ? this.getFmtData(key, i) : simplyDeepClone(i);
                    var isAdd = this.addRecordMap.has(key);
                    // 新增数据删除虚拟主键, 防止数据传输到服务端时出错
                    if (isAdd) {
                        deleteNamePathValue(data, this.config.primaryKey);
                    }
                    // 变更过且不是新增的数据
                    var isChange = !isAdd && this.getChanged(key);
                    var isUpdate = isAdd || isChange;
                    var res = cd(data, key, {
                        add: isAdd,
                        change: isChange,
                        update: isUpdate
                    });
                    if (res !== false) list.push(data);
                    if (res === 0) break;
                }
                return list;
            }
        },
        {
            key: "initNodeWrap",
            value: // 初始化wrapNode
            function initNodeWrap() {
                this.wrapNode = document.createElement("div");
                this.wrapNode.className = "m78-table_form-wrap";
                this.context.viewContentEl.appendChild(this.wrapNode);
            }
        },
        {
            key: "schemaConfigChange",
            value: // schema配置发生变更
            function schemaConfigChange() {
                this.schemaDatas = new Map();
                this.errors = new Map();
                this.cellErrors = new Map();
                this.editStatusMap = new Map();
                this.initVerify();
            }
        }
    ]);
    return _TableFormPlugin;
}(TablePlugin);
