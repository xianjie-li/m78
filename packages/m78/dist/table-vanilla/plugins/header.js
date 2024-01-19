import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { stringifyNamePath } from "@m78/utils";
import { _getCellKey } from "../common.js";
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
export var _TableHeaderPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableHeaderPlugin, TablePlugin);
    var _super = _create_super(_TableHeaderPlugin);
    function _TableHeaderPlugin() {
        _class_call_check(this, _TableHeaderPlugin);
        return _super.apply(this, arguments);
    }
    _create_class(_TableHeaderPlugin, [
        {
            key: "loadStage",
            value: function loadStage(stage, isBefore) {
                if (stage === TableLoadStage.formatBaseInfo && isBefore) {
                    this.process();
                }
            }
        },
        {
            /** 渲染行头内容 */ key: "cellRender",
            value: function cellRender(cell, ctx) {
                var isCrossHeader = cell.row.isHeader && cell.column.isHeader;
                if (isCrossHeader) {
                    ctx.disableDefaultRender = true;
                }
                if (ctx.isFirstRender && isCrossHeader) {
                    cell.dom.innerHTML = "<span class='m78-table_corner-btn'></span>";
                    return;
                }
            }
        },
        {
            /** 处理行头/表头 */ key: "process",
            value: function process() {
                this.handleHeaderY();
                this.handleHeaderX();
            }
        },
        {
            /** 处理表头 */ key: "handleHeaderY",
            value: function handleHeaderY() {
                var _this = this;
                var _ctx_data;
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
                        currentRow = injectRows[depth] = _define_property({}, conf.primaryKey, key);
                        ctx.getRowMeta(key).fake = true;
                        rows[key] = ctx.getRowMergeConfig(key, {
                            fixed: TableRowFixed.top,
                            height: defHeight
                        });
                        injectRows[depth] = currentRow;
                    }
                    if (!currentDepthColumns) {
                        currentDepthColumns = depthColumns[depth] = [];
                    }
                    list.forEach(function(c, ind) {
                        var _c_children;
                        var count = 0;
                        var firstKey = "";
                        // 确认子项
                        if ("key" in c) {
                            var _opt_parent, _opt_countCB;
                            var sKey = stringifyNamePath(c.key);
                            var formatColumn = ctx.getColumnMergeConfig(sKey, _object_spread_props(_object_spread({}, c), {
                                originalKey: c.key,
                                key: sKey
                            }));
                            if (opt.parent) {
                                ctx.mergeHeaderRelationMap[formatColumn.key] = true;
                            }
                            // 若包含父级, 一律使用顶层fixed配置
                            if (opt.parent && ((_opt_parent = opt.parent) === null || _opt_parent === void 0 ? void 0 : _opt_parent.fixed) !== c.fixed) {
                                var _opt_parent1;
                                formatColumn.fixed = (_opt_parent1 = opt.parent) === null || _opt_parent1 === void 0 ? void 0 : _opt_parent1.fixed;
                            }
                            columns.push(formatColumn);
                            currentRow[formatColumn.key] = c.label;
                            currentDepthColumns.push(formatColumn);
                            (_opt_countCB = opt.countCB) === null || _opt_countCB === void 0 ? void 0 : _opt_countCB.call(opt);
                            // 首项确认
                            if (depth !== 0 && ind === 0) {
                                var _opt_firstKeyCB;
                                (_opt_firstKeyCB = opt.firstKeyCB) === null || _opt_firstKeyCB === void 0 ? void 0 : _opt_firstKeyCB.call(opt, formatColumn.key);
                            }
                            return;
                        }
                        // 无效表头
                        if (!((_c_children = c.children) === null || _c_children === void 0 ? void 0 : _c_children.length)) return;
                        // 处理子级
                        recursionColumns(c.children, depth + 1, {
                            parent: opt.parent || c,
                            firstKeyCB: function firstKeyCB(key) {
                                currentRow[key] = c.label; // 用于显示的文本设置到指定的字段
                                firstKey = key;
                                if (ind === 0) {
                                    var _opt_firstKeyCB;
                                    (_opt_firstKeyCB = opt.firstKeyCB) === null || _opt_firstKeyCB === void 0 ? void 0 : _opt_firstKeyCB.call(opt, key);
                                }
                            },
                            countCB: function countCB() {
                                var _opt_countCB;
                                count++;
                                (_opt_countCB = opt.countCB) === null || _opt_countCB === void 0 ? void 0 : _opt_countCB.call(opt);
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
                (_ctx_data = ctx.data).unshift.apply(_ctx_data, _to_consumable_array(injectRows));
                ctx.columns = columns;
                ctx.hasMergeHeader = depthColumns.length > 1;
                Object.assign(ctx.rows, rows, conf.rows);
                Object.assign(ctx.cells, conf.cells, cells);
            }
        },
        {
            /** 处理行头 */ key: "handleHeaderX",
            value: function handleHeaderX() {
                var key = this.getDefaultXKey();
                // 生成行头配置
                var headerColumn = {
                    key: key,
                    originalKey: key,
                    fixed: TableColumnFixed.left,
                    width: 40,
                    label: "序号"
                };
                headerColumn = this.context.getColumnMergeConfig(key, headerColumn);
                this.context.getColumnMeta(key).fake = true;
                // 表头向下合并
                this.context.cells[_getCellKey(this.getDefaultYKey(0), key)] = {
                    mergeY: this.context.yHeaderKeys.length
                };
                this.context.xHeaderKey = key;
                this.context.columns.unshift(headerColumn);
            }
        },
        {
            /** 获取默认生成的key */ key: "getDefaultYKey",
            value: function getDefaultYKey(rowInd) {
                return "__TH".concat(rowInd);
            }
        },
        {
            key: "getDefaultXKey",
            value: function getDefaultXKey() {
                return "__RH";
            }
        }
    ]);
    return _TableHeaderPlugin;
}(TablePlugin);
