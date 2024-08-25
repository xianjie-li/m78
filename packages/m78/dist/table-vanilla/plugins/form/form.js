import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { applyMixins, getNamePathValue, setNamePathValue, simplyDeepClone, simplyEqual } from "@m78/utils";
import { TableLoadStage, TablePlugin } from "../../plugin.js";
import { TableMutationDataType, TableMutationType } from "../mutation.js";
import { removeNode } from "../../../common/index.js";
import { _TableInteractivePlugin } from "../interactive.js";
import { _TableSoftRemovePlugin } from "../soft-remove.js";
import { _MixinStatus } from "./status.js";
import { _MixinVerify } from "./verify.js";
import { _MixinSchema } from "./schema.js";
import { _MixinBase } from "./base.js";
import { _MixinData } from "./data.js";
import { _MixinRenders } from "./renders.js";
/**
 * 实现表单form功能, 由于功能较多, 插件通过mixins切分到多个混合类中实现
 * */ var Plugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(Plugin, TablePlugin);
    var _super = _create_super(Plugin);
    function Plugin() {
        _class_call_check(this, Plugin);
        var _this;
        _this = _super.apply(this, arguments);
        // 数据发生变更时进行处理
        _define_property(_assert_this_initialized(_this), "mutation", function(e) {
            if (e.type === TableMutationType.value) {
                _this.valueMutation(e);
            }
            if (e.type === TableMutationType.rowValue) {
                _this.rowValueMutation(e);
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
            var changed = !simplyEqual(row.data, _this.defaultValues.get(row.key));
            if (changed) {
                _this.rowChanged.set(row.key, true);
            } else {
                _this.rowChanged.delete(row.key);
            }
            var valueChanged = !simplyEqual(e.value, e.oldValue);
            if (valueChanged) {
                _this.cellChanged.set(cell.key, true);
            } else {
                _this.cellChanged.delete(cell.key);
            }
            // 更新schema
            var schema = _this.getSchemas(row, true);
            var fmtData = _this.getFmtData(row, row.data);
            _this.innerCheck({
                cell: cell,
                values: fmtData,
                schemas: schema.rootSchema
            }).then(function() {
                return _this.table.render();
            });
        });
        // 整行值变更, 创建或获取form实例, 并同步值和校验状态
        _define_property(_assert_this_initialized(_this), "rowValueMutation", function(e) {
            var row = e.row;
            // 默认值不存在, 将默认值写入
            if (!_this.defaultValues.has(row.key)) {
                var rawData = simplyDeepClone(e.oldValue);
                _this.defaultValues.set(row.key, rawData);
            }
            var defaultValue = _this.defaultValues.get(row.key);
            var changed = !simplyEqual(row.data, defaultValue);
            if (changed) {
                _this.rowChanged.set(row.key, true);
            } else {
                _this.rowChanged.delete(row.key);
            }
            var columns = _this.context.allColumnKeys.map(function(key) {
                return _this.table.getColumn(key);
            });
            columns.forEach(function(col) {
                var cell = _this.table.getCell(row.key, col.key);
                if (!_this.interactive.isInteractive(cell)) return;
                var v = getNamePathValue(row.data, col.config.originalKey);
                var dv = getNamePathValue(defaultValue, col.config.originalKey);
                var valueChanged = !simplyEqual(v, dv);
                if (valueChanged) {
                    _this.cellChanged.set(cell.key, true);
                } else {
                    _this.cellChanged.delete(cell.key);
                }
            });
            // 更新schema
            var schema = _this.getSchemas(row, true);
            var fmtData = _this.getFmtData(row, row.data);
            _this.innerCheck({
                row: row,
                values: fmtData,
                schemas: schema.rootSchema
            }).then(function() {
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
    _create_class(Plugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.interactive = this.getPlugin(_TableInteractivePlugin);
                this.softRemove = this.getPlugin(_TableSoftRemovePlugin);
                this.methodMapper(this.table, [
                    "verify",
                    "verifyRow",
                    "verifyUpdated",
                    "getData",
                    "getChanged",
                    "getTableChanged",
                    "getChangeStatus"
                ]);
                this.methodMapper(this.context, [
                    "getSchemas"
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
                this.initVerify();
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
            key: "beforeRender",
            value: function beforeRender() {
                this.prepareChangedCell();
                this.prepareRowMark();
                this.prepareErrors();
                this.prepareSchemasMark();
            }
        },
        {
            key: "rendering",
            value: function rendering() {
                this.updateChangedCell();
                this.updateRowMark();
                this.updateErrors();
                this.updateSchemasMark();
            }
        },
        {
            // 重置状态/数据内联内容等
            key: "reset",
            value: function reset() {
                this.addRecordMap = new Map();
                this.removeRecordMap = new Map();
                this.allRemoveRecordMap = new Map();
                this.sortRecordMap = new Map();
                this.defaultValues = new Map();
                this.schemaDatas = new Map();
                this.editStatusMap = new Map();
                this.cellChanged = new Map();
                this.rowChanged = new Map();
                this.cellErrors = new Map();
                this.invalidList = [];
                this.errorsList = [];
                this.changedCellList = [];
                this.rowMarkList = [];
                removeNode(this.wrapNode);
                this.errorsNodes = [];
                this.rowChangedNodes = [];
                this.cellChangedNodes = [];
                this.editStatusNodes = [];
                this.invalidNodes = [];
            }
        },
        {
            key: "resetStatus",
            value: function resetStatus() {
                this.addRecordMap = new Map();
                this.removeRecordMap = new Map();
                this.allRemoveRecordMap = new Map();
                this.sortRecordMap = new Map();
                // this.defaultValues = new Map();
                this.schemaDatas = new Map();
                // this.editStatusMap = new Map();
                this.cellChanged = new Map();
                this.rowChanged = new Map();
                this.cellErrors = new Map();
                this.invalidList = [];
                this.errorsList = [];
                this.changedCellList = [];
                this.rowMarkList = [];
            }
        },
        {
            // 初始化wrapNode
            key: "initNodeWrap",
            value: function initNodeWrap() {
                this.wrapNode = document.createElement("div");
                this.wrapNode.className = "m78-table_form-wrap";
                this.context.viewContentEl.appendChild(this.wrapNode);
            }
        },
        {
            // schema配置发生变更
            key: "schemaConfigChange",
            value: function schemaConfigChange() {
                this.schemaDatas = new Map();
                this.cellErrors = new Map();
                this.editStatusMap = new Map();
                this.invalidList = [];
                this.errorsList = [];
                this.initVerify();
                this.table.render();
            }
        }
    ]);
    return Plugin;
}(TablePlugin);
export var _TableFormPlugin = applyMixins(Plugin, _MixinBase, _MixinStatus, _MixinSchema, _MixinData, _MixinVerify, _MixinRenders);
