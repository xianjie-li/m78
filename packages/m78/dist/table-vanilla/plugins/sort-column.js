import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { TableReloadLevel } from "./life.js";
import { _TablePrivateProperty, TableColumnFixed } from "../types/base-type.js";
import { getNamePathValue } from "@m78/utils";
import { _prefix } from "../common.js";
/**
 * note:
 * sortColumns 和拖拽排序都不支持合并头的场景
 * 需要知道某项是否为子项
 * */ /** 表格列排序 */ export var _TableSortColumnPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableSortColumnPlugin, TablePlugin);
    var _super = _create_super(_TableSortColumnPlugin);
    function _TableSortColumnPlugin() {
        _class_call_check(this, _TableSortColumnPlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _TableSortColumnPlugin.prototype;
    _proto.loadStage = function loadStage(level, isBefore) {
        if (level === TableReloadLevel.index && isBefore) {
            this.handle();
        }
    };
    /** 处理sortColumns */ _proto.handle = function handle() {
        var _columns;
        var ctx = this.context;
        var sortColumns = this.context.persistenceConfig.sortColumns || [];
        sortColumns = sortColumns.slice();
        if (!sortColumns.length) return;
        if (ctx.hasMergeHeader) {
            console.warn("[".concat(_prefix, "] persistenceConfig.sortColumns: Can not sort column when has merge header"));
            return;
        }
        var sortMap = {};
        // 不存在于sortColumns中的项
        var regularColumns = [];
        var regularFixedLeft = [];
        var regularFixedRight = [];
        ctx.columns.forEach(function(i) {
            var fake = getNamePathValue(i, _TablePrivateProperty.fake);
            var isChild = ctx.mergeHeaderRelationMap[i.key];
            if (fake && i.fixed === TableColumnFixed.left) {
                // 虚拟固定项不处理
                regularFixedLeft.push(i);
            } else if (fake && i.fixed === TableColumnFixed.right) {
                regularFixedRight.push(i);
            } else if (isChild) {
                // 子项不处理
                regularColumns.push(i);
            } else if (sortColumns.includes(i.key)) {
                // 记录sort项
                sortMap[i.key] = i;
            } else {
                // 不存在的项保持原样
                regularColumns.push(i);
            }
        });
        var indexHKey = sortColumns.indexOf(ctx.xHeaderKey);
        if (indexHKey !== -1) {
            sortColumns.splice(indexHKey, 1);
        }
        var sorted = sortColumns.map(function(key) {
            return sortMap[key];
        }).filter(function(i) {
            return !!i;
        });
        var newColumns = _to_consumable_array(regularFixedLeft).concat(_to_consumable_array(sorted), _to_consumable_array(regularColumns), _to_consumable_array(regularFixedRight));
        // 保持引用不变
        ctx.columns.length = 0;
        (_columns = ctx.columns).push.apply(_columns, _to_consumable_array(newColumns));
    };
    _proto.getColumnSortKeys = function getColumnSortKeys() {
        var _this = this;
        var column = this.context.columns;
        var list = column.filter(function(i) {
            // 虚拟项
            if (getNamePathValue(i, _TablePrivateProperty.fake)) return false;
            // 子项
            return !_this.context.mergeHeaderRelationMap[i.key];
        });
        return list.map(function(i) {
            return i.key;
        });
    };
    return _TableSortColumnPlugin;
}(TablePlugin);
