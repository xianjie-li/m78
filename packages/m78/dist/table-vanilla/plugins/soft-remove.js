import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { _TableDisablePlugin } from "./disable.js";
import { ensureArray, SelectManager } from "@m78/utils";
import { removeNode } from "../../common/index.js";
import { TableReloadLevel } from "./life.js";
import { _rowMountChecker, _syncListNode } from "../common.js";
import { _getBlankMutationDataEvent, TableMutationDataType } from "./mutation.js";
/**
 * 实现软删除
 *
 * 触发mutation事件, 可在 getData().remove 等api中获取被删除项, 同时也应影响 getChanged 等api
 *
 * 也可视作数据变更, 应计入历史记录
 * */ export var _TableSoftRemovePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableSoftRemovePlugin, TablePlugin);
    var _super = _create_super(_TableSoftRemovePlugin);
    function _TableSoftRemovePlugin() {
        _class_call_check(this, _TableSoftRemovePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "wrapNode", void 0);
        // 用于显示行删除标识的节点
        _define_property(_assert_this_initialized(_this), "rowMarkNodes", []);
        // 记录删除状态的select
        _define_property(_assert_this_initialized(_this), "remove", new SelectManager());
        return _this;
    }
    _create_class(_TableSoftRemovePlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.methodMapper(this.table, [
                    "softRemove",
                    "isSoftRemove",
                    "restoreSoftRemove"
                ]);
            }
        },
        {
            key: "mounted",
            value: function mounted() {
                this.wrapNode = document.createElement("div");
                this.wrapNode.className = "m78-table_soft-remove-wrap";
                this.context.viewContentEl.appendChild(this.wrapNode);
            }
        },
        {
            key: "init",
            value: function init() {
                var disablePlugin = this.getPlugin(_TableDisablePlugin);
                disablePlugin.rowChecker.push(this.remove);
            }
        },
        {
            key: "reload",
            value: function reload(opt) {
                if (opt.level === TableReloadLevel.full) {
                    this.remove.unSelectAll();
                }
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                this.remove.unSelectAll();
                removeNode(this.wrapNode);
            }
        },
        {
            key: "rendering",
            value: function rendering() {
                var _this = this;
                var list = this.getRemoveList();
                list.forEach(function(i, ind) {
                    var node = _this.rowMarkNodes[ind];
                    var position = i.attachPosition;
                    node.style.transform = "translate(".concat(position.left, "px, ").concat(position.top, "px)");
                    node.style.height = "".concat(position.height, "px");
                    node.style.zIndex = position.zIndex;
                });
            }
        },
        {
            key: "softRemove",
            value: function softRemove(key) {
                var _this = this;
                // 过滤掉不存在的项
                var rowsKeys = ensureArray(key).filter(function(k) {
                    return _this.table.isRowExist(k);
                });
                if (!rowsKeys.length) return;
                var rowsData = rowsKeys.map(function(k) {
                    return _this.table.getRow(k).data;
                });
                this.table.history.redo({
                    title: this.context.texts["remove row"],
                    redo: function() {
                        // 移除删除项的选中状态
                        _this.table.unselectRows(rowsKeys);
                        _this.remove.selectList(ensureArray(key));
                        _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                            changeType: TableMutationDataType.softRemove,
                            soft: rowsData
                        }));
                        _this.table.renderSync();
                    },
                    undo: function() {
                        _this.remove.unSelectList(ensureArray(key));
                        _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                            changeType: TableMutationDataType.restoreSoftRemove,
                            soft: rowsData
                        }));
                        _this.table.renderSync();
                    }
                });
            }
        },
        {
            key: "isSoftRemove",
            value: function isSoftRemove(key) {
                return this.remove.isSelected(key);
            }
        },
        {
            key: "restoreSoftRemove",
            value: function restoreSoftRemove(key) {
                var _this = this;
                var keys = ensureArray(key);
                if (keys.length) {
                    keys = keys.filter(function(k) {
                        return _this.table.isRowExist(k);
                    });
                } else {
                    keys = this.remove.getState().selected;
                }
                this.table.history.redo({
                    title: this.context.texts["restore row"],
                    redo: function() {
                        _this.remove.unSelectList(keys);
                        _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                            changeType: TableMutationDataType.restoreSoftRemove
                        }));
                        _this.table.renderSync();
                    },
                    undo: function() {
                        _this.remove.selectList(keys);
                        _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                            changeType: TableMutationDataType.softRemove
                        }));
                        _this.table.renderSync();
                    }
                });
            }
        },
        {
            key: "getRemoveList",
            value: // 获取用于展示删除状态的列表, 包含了渲染需要的各种必要信息
            function getRemoveList() {
                var _this = this;
                var _this_context_lastViewportItems;
                var list = [];
                var keys = this.remove.getState().selected;
                var isMount = _rowMountChecker((_this_context_lastViewportItems = this.context.lastViewportItems) === null || _this_context_lastViewportItems === void 0 ? void 0 : _this_context_lastViewportItems.rows);
                keys.forEach(function(k) {
                    if (!isMount(k)) return;
                    var row = _this.table.getRow(k);
                    var attachPosition = _this.table.getRowAttachPosition(row);
                    list.push({
                        row: row,
                        attachPosition: attachPosition
                    });
                });
                _syncListNode({
                    wrapNode: this.wrapNode,
                    list: list,
                    nodeList: this.rowMarkNodes,
                    createAction: function(node) {
                        node.className = "m78-table_soft-remove-mark";
                    }
                });
                return list;
            }
        }
    ]);
    return _TableSoftRemovePlugin;
}(TablePlugin);
