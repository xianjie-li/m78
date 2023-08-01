import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { setNamePathValue, stringifyNamePath } from "@m78/utils";
import { _getCellKey } from "../common.js";
import { TablePlugin } from "../plugin.js";
import { _TablePrivateProperty, TableColumnFixed, TableRowFixed } from "../types/base-type.js";
export var _TableHeaderPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableHeaderPlugin, TablePlugin);
    var _super = _create_super(_TableHeaderPlugin);
    function _TableHeaderPlugin() {
        _class_call_check(this, _TableHeaderPlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _TableHeaderPlugin.prototype;
    /** 渲染行头内容 */ _proto.cellRender = function cellRender(cell, ctx) {
        var isCrossHeader = cell.row.isHeader && cell.column.isHeader;
        if (isCrossHeader) {
            ctx.disableDefaultRender = true;
        }
        if (ctx.isFirstRender && isCrossHeader) {
            cell.dom.innerHTML = "<span class='m78-table_corner-btn'></span>";
            return;
        }
    };
    /** 处理行头/表头 */ _proto.process = function process() {
        this.handleHeaderY();
        this.handleHeaderX();
    };
    /** 处理表头 */ _proto.handleHeaderY = function handleHeaderY() {
        var _this = this;
        var _data;
        var ctx = this.context;
        var conf = this.config;
        ctx.mergeHeaderRelationMap = {};
        /** 将columns扁平化并处理namePath类型的key */ var columns = [];
        /** 需要注入的行配置 */ var rows = {};
        /** 需要注入的单元格配置 */ var cells = {};
        /** 需要注入的记录 */ var injectRows = [];
        /** 每一行的所有列, 用于最后计算mergeY */ var depthColumns = [];
        var defHeight = conf.rowHeight + 4;
        // 递归处理组合表头, cb用于底层向上层回传信息
        var recursionColumns = function(list, depth, opt) {
            // 当前行
            var currentRow = injectRows[depth];
            var currentDepthColumns = depthColumns[depth];
            // 没有则创建
            if (!currentRow) {
                var key = _this.getDefaultYKey(depth);
                var _obj;
                currentRow = injectRows[depth] = (_obj = {}, _define_property(_obj, conf.primaryKey, key), _define_property(_obj, _TablePrivateProperty.fake, true), _obj);
                rows[key] = {
                    fixed: TableRowFixed.top,
                    height: defHeight
                };
                injectRows[depth] = currentRow;
            }
            if (!currentDepthColumns) {
                currentDepthColumns = depthColumns[depth] = [];
            }
            list.forEach(function(c, ind) {
                var ref;
                var count = 0;
                var firstKey = "";
                // 确认子项
                if ("key" in c) {
                    var ref1, ref2;
                    var formatColumn = _object_spread_props(_object_spread({}, c), {
                        originalKey: c.key,
                        key: stringifyNamePath(c.key)
                    });
                    if (opt.parent) {
                        ctx.mergeHeaderRelationMap[formatColumn.key] = true;
                    }
                    // 若包含父级, 一律使用顶层fixed配置
                    if (opt.parent && ((ref1 = opt.parent) === null || ref1 === void 0 ? void 0 : ref1.fixed) !== c.fixed) {
                        var ref3;
                        formatColumn.fixed = (ref3 = opt.parent) === null || ref3 === void 0 ? void 0 : ref3.fixed;
                    }
                    columns.push(formatColumn);
                    currentRow[formatColumn.key] = c.label;
                    currentDepthColumns.push(formatColumn);
                    (ref2 = opt.countCB) === null || ref2 === void 0 ? void 0 : ref2.call(opt);
                    // 首项确认
                    if (depth !== 0 && ind === 0) {
                        var ref4;
                        (ref4 = opt.firstKeyCB) === null || ref4 === void 0 ? void 0 : ref4.call(opt, formatColumn.key);
                    }
                    return;
                }
                // 无效表头
                if (!((ref = c.children) === null || ref === void 0 ? void 0 : ref.length)) return;
                // 处理子级
                recursionColumns(c.children, depth + 1, {
                    parent: opt.parent || c,
                    firstKeyCB: function(key) {
                        currentRow[key] = c.label; // 用于显示的文本设置到指定的字段
                        firstKey = key;
                        if (ind === 0) {
                            var ref;
                            (ref = opt.firstKeyCB) === null || ref === void 0 ? void 0 : ref.call(opt, key);
                        }
                    },
                    countCB: function() {
                        var ref;
                        count++;
                        (ref = opt.countCB) === null || ref === void 0 ? void 0 : ref.call(opt);
                    }
                });
                cells[_getCellKey(currentRow[conf.primaryKey], firstKey)] = {
                    mergeX: count
                };
            });
        };
        recursionColumns(conf.columns, 0, {});
        var maxDepth = depthColumns.length;
        // 为所有非末尾层的列设置mergeY, 使其撑满总行头数
        depthColumns.slice(0, -1).forEach(function(colList, ind) {
            colList.forEach(function(c) {
                var key = _getCellKey(_this.getDefaultYKey(ind), c.key);
                var cur = cells[key];
                if (!cur) {
                    cur = {};
                    cells[key] = cur;
                }
                cur.mergeY = maxDepth - ind;
            });
        });
        ctx.yHeaderKeys = injectRows.map(function(i) {
            return i[conf.primaryKey];
        });
        ctx.yHeaderHeight = ctx.yHeaderKeys.reduce(function(a, b) {
            var conf = ctx.rows[b];
            return a + ((conf === null || conf === void 0 ? void 0 : conf.height) || defHeight);
        }, 0);
        (_data = ctx.data).unshift.apply(_data, _to_consumable_array(injectRows));
        ctx.columns = columns;
        ctx.hasMergeHeader = depthColumns.length > 1;
        Object.assign(ctx.rows, rows, conf.rows);
        Object.assign(ctx.cells, conf.cells, cells);
    };
    /** 处理行头 */ _proto.handleHeaderX = function handleHeaderX() {
        var key = this.getDefaultXKey();
        // 生成行头配置
        var headerColumn = {
            key: key,
            originalKey: key,
            fixed: TableColumnFixed.left,
            width: 40,
            label: "序号"
        };
        setNamePathValue(headerColumn, _TablePrivateProperty.fake, true);
        // 表头向下合并
        this.context.cells[_getCellKey(this.getDefaultYKey(0), key)] = {
            mergeY: this.context.yHeaderKeys.length
        };
        this.context.xHeaderKey = key;
        this.context.columns.unshift(headerColumn);
    };
    /** 获取默认生成的key */ _proto.getDefaultYKey = function getDefaultYKey(rowInd) {
        return "__TH".concat(rowInd);
    };
    _proto.getDefaultXKey = function getDefaultXKey() {
        return "__RH";
    };
    return _TableHeaderPlugin;
}(TablePlugin);
