import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableColumnFixed } from "../types/base-type.js";
import { _prefix } from "../common.js";
import { getNamePathValue, isNumber, isUndefined } from "@m78/utils";
/**
 * 表格列排序
 *
 * sortColumns只配置了部分项时, 先按顺序显示排序后的列, 再显示不再排序中的列, 左右固定项和中间部分分别进行排序
 * */ export var _TableSortColumnPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableSortColumnPlugin, TablePlugin);
    var _super = _create_super(_TableSortColumnPlugin);
    function _TableSortColumnPlugin() {
        _class_call_check(this, _TableSortColumnPlugin);
        return _super.apply(this, arguments);
    }
    _create_class(_TableSortColumnPlugin, [
        {
            key: "loadStage",
            value: function loadStage(stage, isBefore) {
                if (stage === TableLoadStage.mergePersistenceConfig && !isBefore) {
                    this.handle();
                }
            }
        },
        {
            /** 处理sortColumns */ key: "handle",
            value: function handle() {
                var _ctx_columns;
                var ctx = this.context;
                var sortColumns = this.context.persistenceConfig.sortColumns || [];
                if (!sortColumns.length) return;
                sortColumns = sortColumns.slice();
                if (ctx.hasMergeHeader) {
                    console.warn("[".concat(_prefix, "] persistenceConfig.sortColumns: Can not sort column when has merge header"));
                    return;
                }
                // 记录sort项的index
                var sortMap = {};
                sortColumns.forEach(function(k, index) {
                    return sortMap[k] = index;
                });
                // 存在于sortColumns中的项
                var sortRegularColumns = [];
                var sortFixedLeft = [];
                var sortFixedRight = [];
                // 不存在于sortColumns中的项
                var regularColumns = [];
                var regularFixedLeft = [];
                var regularFixedRight = [];
                var rh;
                // 克隆并排序当前ctx.columns
                var cloneAndSortColumns = ctx.columns.slice().sort(function(a, b) {
                    var aInd = sortMap[a.key];
                    var bInd = sortMap[b.key];
                    var notA = isUndefined(aInd);
                    var notB = isUndefined(bInd);
                    if (notA && notB) return 0;
                    if (notA) return 1; // 后移
                    if (notB) return -1; // 保持
                    return aInd - bInd;
                });
                cloneAndSortColumns.forEach(function(i) {
                    var isChild = ctx.mergeHeaderRelationMap[i.key];
                    var isSortItem = isNumber(sortMap[i.key]);
                    var isRH = ctx.xHeaderKey === i.key;
                    var persistenceConf = getNamePathValue(ctx.persistenceConfig, [
                        "columns",
                        i.key
                    ]);
                    // 从持久配置/fixed项中获取
                    var fixedConf = (persistenceConf === null || persistenceConf === void 0 ? void 0 : persistenceConf.fixed) || i.fixed;
                    if (isRH) {
                        rh = i;
                        return;
                    }
                    if (isChild) {
                        // 合并子项不处理
                        regularColumns.push(i);
                        return;
                    }
                    if (fixedConf === TableColumnFixed.left) {
                        if (isSortItem) {
                            sortFixedLeft.push(i);
                        } else {
                            regularFixedLeft.push(i);
                        }
                        return;
                    }
                    if (fixedConf === TableColumnFixed.right) {
                        if (isSortItem) {
                            sortFixedRight.push(i);
                        } else {
                            regularFixedRight.push(i);
                        }
                        return;
                    }
                    if (isSortItem) {
                        sortRegularColumns.push(i);
                    } else {
                        regularColumns.push(i);
                    }
                });
                var newColumns = [
                    rh
                ].concat(_to_consumable_array(sortFixedLeft), _to_consumable_array(regularFixedLeft), _to_consumable_array(sortRegularColumns), _to_consumable_array(regularColumns), _to_consumable_array(sortFixedRight), _to_consumable_array(regularFixedRight));
                // 保持引用不变
                ctx.columns.length = 0;
                (_ctx_columns = ctx.columns).push.apply(_ctx_columns, _to_consumable_array(newColumns));
            }
        },
        {
            key: "getColumnSortKeys",
            value: function getColumnSortKeys() {
                var _this = this;
                var column = this.context.columns;
                var list = [];
                column.forEach(function(i) {
                    if (!_this.context.mergeHeaderRelationMap[i.key]) {
                        list.push(i.key);
                    }
                });
                return list;
            }
        }
    ]);
    return _TableSortColumnPlugin;
}(TablePlugin);
