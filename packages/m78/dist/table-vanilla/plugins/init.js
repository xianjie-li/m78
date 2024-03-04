import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { simplyDeepClone, getNamePathValue, isEmpty, isNumber, isObject, isString, setNamePathValue, throwError } from "@m78/utils";
import clsx from "clsx";
import { _getCellKey, _getCellKeysByStr, _prefix, _privateScrollerDomKey, tableDefaultTexts } from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import { addCls } from "../../common/index.js";
import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { _TableHidePlugin } from "./hide.js";
import { _TableIsPlugin } from "./is.js";
import { _TableRenderPlugin } from "./render.js";
/**
 * 进行配置整理/预计算等
 * */ export var _TableInitPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableInitPlugin, TablePlugin);
    var _super = _create_super(_TableInitPlugin);
    function _TableInitPlugin() {
        _class_call_check(this, _TableInitPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "render", void 0);
        return _this;
    }
    _create_class(_TableInitPlugin, [
        {
            key: "init",
            value: function init() {
                this.render = this.getPlugin(_TableRenderPlugin);
                addCls(this.config.el, "m78-table");
                this.createDom();
                this.mergeTexts();
                this.clonePersistenceConfigToCtx();
                this.fullHandle();
            }
        },
        {
            key: "fullHandle",
            value: function fullHandle() {
                this.stageEmit(TableLoadStage.fullHandle, true);
                this.stageEmit(TableLoadStage.initBaseInfo, true);
                this.initBaseInfo();
                this.stageEmit(TableLoadStage.initBaseInfo, false);
                this.stageEmit(TableLoadStage.formatBaseInfo, true);
                this.formatBaseInfo();
                this.stageEmit(TableLoadStage.formatBaseInfo, false);
                this.stageEmit(TableLoadStage.fullHandle, false);
                this.indexHandle();
            }
        },
        {
            /** 为当前ctx.data/columns创建索引, 并合并持久化配置 对应TableReloadLevel.index */ key: "indexHandle",
            value: function indexHandle() {
                this.stageEmit(TableLoadStage.indexHandle, true);
                this.mergeTexts();
                this.stageEmit(TableLoadStage.mergePersistenceConfig, true);
                // 合并持久化配置, 注意, 在此之前对cell/column/row配置项的访问应通过 getRowMergeConfig/getColumnMergeConfig等api进行
                this.mergePersistenceConfig();
                this.stageEmit(TableLoadStage.mergePersistenceConfig, false);
                this.stageEmit(TableLoadStage.updateIndexAndMerge, true);
                this.updateIndexAndMerge();
                this.stageEmit(TableLoadStage.updateIndexAndMerge, false);
                this.indexEndHandle();
                this.stageEmit(TableLoadStage.indexHandle, false);
                this.baseHandle();
            }
        },
        {
            /** 基础预处理, 减少后续渲染的计算工作, , 对应TableReloadLevel.base */ key: "baseHandle",
            value: function baseHandle() {
                this.stageEmit(TableLoadStage.baseHandle, true);
                this.stageEmit(TableLoadStage.resetCache, true);
                var ctx = this.context;
                ctx.mergeMapMain = {};
                ctx.mergeMapSub = {};
                ctx.lastMergeXMap = {};
                ctx.lastMergeYMap = {};
                ctx.topFixedMap = {};
                ctx.bottomFixedMap = {};
                ctx.leftFixedMap = {};
                ctx.rightFixedMap = {};
                ctx.topFixedList = [];
                ctx.bottomFixeList = [];
                ctx.leftFixedList = [];
                ctx.rightFixedList = [];
                this.stageEmit(TableLoadStage.resetCache, false);
                this.stageEmit(TableLoadStage.preHandleSize, true);
                this.preHandleSize();
                this.stageEmit(TableLoadStage.preHandleSize, false);
                this.preCalcLastInfo();
                this.preHandleMerge();
                this.stageEmit(TableLoadStage.baseHandle, false);
            }
        },
        {
            /** 拷贝data/columns/persistenceConfig等需要本地化的配置 */ key: "initBaseInfo",
            value: function initBaseInfo() {
                var ctx = this.context;
                ctx.data = this.config.data.slice();
                ctx.rowCache = {};
                ctx.columnCache = {};
                ctx.cellCache = {};
                ctx.columns = [];
                ctx.cells = {};
                ctx.rows = {};
                ctx.backupRows = {};
                ctx.backupCells = {};
                ctx.backupColumns = {};
                ctx.backupFirstColumns = {};
                ctx.backupFirstRows = {};
                ctx.backupFirstCells = {};
                ctx.autoMovedRows = [];
            }
        },
        {
            /** 将data/columns进行预处理, 移动固定项到固定后位置, 并在原位置添加占位项 */ key: "formatBaseInfo",
            value: function formatBaseInfo() {
                var _listX, _listX1, _listY, // 推入表头
                _listY1, _listY2;
                var ctx = this.context;
                var columns = ctx.columns, data = ctx.data, rows = ctx.rows;
                var listX = [];
                var listY = [];
                var lf = [];
                var rf = [];
                var tf = [];
                var bf = [];
                // 添加获取合并项和配置项的方法
                // 从行头/表头开始, 拷贝并备份数据, 然后将fixed项移植首尾位置
                for(var i = 1; i < columns.length; i++){
                    var cur = columns[i];
                    cur = ctx.getColumnMergeConfig(cur.key, cur);
                    if (cur.fixed && cur.fixed !== TableColumnFixed.none) {
                        var meta = ctx.getColumnMeta(cur.key);
                        meta.fixed = true;
                        if (cur.fixed === TableColumnFixed.left) {
                            lf.push(cur);
                        } else {
                            rf.push(cur);
                        }
                    } else {
                        listX.push(cur);
                    }
                }
                for(var i1 = ctx.yHeaderKeys.length; i1 < data.length; i1++){
                    var cur1 = data[i1];
                    var key = cur1[this.config.primaryKey];
                    var conf = rows[key];
                    conf = ctx.getRowMergeConfig(key, conf);
                    if (conf && conf.fixed && conf.fixed !== TableRowFixed.none) {
                        var meta1 = ctx.getRowMeta(key);
                        meta1.fixed = true;
                        // 记录移动前的位置
                        ctx.autoMovedRows.push({
                            key: key,
                            from: i1 - ctx.yHeaderKeys.length
                        });
                        if (conf.fixed === TableRowFixed.top) {
                            tf.push(cur1);
                        } else {
                            bf.push(cur1);
                        }
                    } else {
                        listY.push(cur1);
                    }
                }
                (_listX = listX).unshift.apply(_listX, _to_consumable_array(lf));
                // 推入行头
                listX.unshift(columns[0]);
                (_listX1 = listX).push.apply(_listX1, _to_consumable_array(rf));
                (_listY = listY).unshift.apply(_listY, _to_consumable_array(tf));
                (_listY1 = listY).unshift.apply(_listY1, _to_consumable_array(data.slice(0, ctx.yHeaderKeys.length)));
                (_listY2 = listY).push.apply(_listY2, _to_consumable_array(bf));
                ctx.data = listY;
                ctx.columns = listX;
            }
        },
        {
            key: "mergePersistenceConfig",
            value: function mergePersistenceConfig() {
                var _this = this;
                var ctx = this.context;
                var pConfig = ctx.persistenceConfig;
                // 合并持久化rows
                if (isObject(pConfig.rows)) {
                    Object.entries(pConfig.rows).forEach(function(param) {
                        var _param = _sliced_to_array(param, 2), key = _param[0], value = _param[1];
                        _this.persistenceConfigHandle(ctx.rows, ctx.backupRows, ctx.backupFirstRows, key, value);
                    });
                }
                // 合并持久化cells
                if (isObject(pConfig.cells)) {
                    Object.entries(pConfig.cells).forEach(function(param) {
                        var _param = _sliced_to_array(param, 2), key = _param[0], value = _param[1];
                        _this.persistenceConfigHandle(ctx.cells, ctx.backupCells, ctx.backupFirstCells, key, value);
                    });
                }
                // 合并持久化columns
                if (isObject(pConfig.columns)) {
                    ctx.columns.forEach(function(cur, i) {
                        // 存在持久化配置时, 对其进行合并等操作
                        var persistenceConf = getNamePathValue(pConfig.columns, cur.key);
                        if (persistenceConf) {
                            _this.persistenceConfigHandle(ctx.columns, ctx.backupColumns, ctx.backupFirstColumns, cur.key, persistenceConf, i);
                        }
                    });
                }
            }
        },
        {
            /** 一些需要在updateIndexAndMerge完成之后进行的操作 */ key: "indexEndHandle",
            value: function indexEndHandle() {
                var ctx = this.context;
                var rowHeaderConf = ctx.columns[0];
                // 同步行头尺寸
                if (rowHeaderConf && rowHeaderConf.key === ctx.xHeaderKey && isNumber(rowHeaderConf.width)) {
                    ctx.xHeaderWidth = rowHeaderConf.width;
                }
            }
        },
        {
            /** 处理dataKeyIndexMap/columnKeyIndexMap, 合并persistenceConfig.columns/rows/cells 至ctx上同名配置 */ key: "updateIndexAndMerge",
            value: function updateIndexAndMerge() {
                var _this = this;
                var ctx = this.context;
                ctx.ignoreXList = [];
                ctx.ignoreYList = [];
                ctx.allRowKeys = [];
                ctx.allColumnKeys = [];
                var dataMap = {};
                var columnMap = {};
                // 列索引/合并持久化配置
                ctx.columns.forEach(function(cur, i) {
                    // 在此处确保所有key都是可用的, 后续代码中就可以直接安全取用了
                    if (!isString(cur.key) && !isNumber(cur.key)) {
                        throwError("No key obtained in column. ".concat(JSON.stringify(cur, null, 4)), _prefix);
                    }
                    var meta = ctx.getColumnMeta(cur.key);
                    var ignore = ctx.isIgnoreColumn(cur.key, meta);
                    var fake = meta.fake;
                    if (!fake && !ignore) {
                        ctx.allColumnKeys.push(cur.key);
                    }
                    if (ignore) {
                        ctx.ignoreXList.push(i);
                    }
                    columnMap[cur.key] = i;
                });
                // 行索引
                ctx.data.forEach(function(cur, i) {
                    var k = _this.table.getKeyByRowData(cur);
                    // 在此处确保所有key都是可用的, 后续代码中就可以直接安全取用了
                    if (!isString(k) && !isNumber(k)) {
                        throwError("No key obtained in row. ".concat(JSON.stringify(cur, null, 4)), _prefix);
                    }
                    var meta = ctx.getRowMeta(k);
                    var fake = meta.fake;
                    var ignore = ctx.isIgnoreRow(k, meta);
                    if (!fake && !ignore) {
                        ctx.allRowKeys.push(k);
                    }
                    if (ignore) {
                        ctx.ignoreYList.push(i);
                    }
                    dataMap[k] = i;
                });
                ctx.dataKeyIndexMap = dataMap;
                ctx.columnKeyIndexMap = columnMap;
            }
        },
        {
            /**
   * row/cells持久化处理通用逻辑, 根据情况备份/还原/合并持久化配置到当前配置
   *
   * @param map 对应的配置, 比如ctx.rows/ctx.cells
   * @param backupMap 对应的备份配置, 比如ctx.backupRows/ctx.backupCells
   * @param backupFirstMap 对应的备份配置, 如backupFirstColumns
   * @param key 对应map中的key
   * @param conf 需要合并的持久化配置
   * @param index 对应map中的index, 如果map是一个数组
   * */ key: "persistenceConfigHandle",
            value: function persistenceConfigHandle(map, backupMap, backupFirstMap, key, conf, index) {
                var indOrKey = isNumber(index) ? index : key;
                var backup = backupMap[key];
                if (map === this.context.columns) {
                    if (this.context.isIgnoreColumn(key)) return;
                }
                if (!map[indOrKey]) {
                    map[indOrKey] = {};
                }
                // 记录首个值
                if (!backupFirstMap[key]) {
                    backupFirstMap[key] = _object_spread({}, map[indOrKey]);
                }
                // 合并
                Object.assign(map[indOrKey], conf);
                // 清理无效配置, 若存在首个配置记录, 还原为首个配置
                if (backup) {
                    this.persistenceConfigCleanHandle(map[indOrKey], backup, conf || {}, backupFirstMap[key]);
                }
                backupMap[key] = _object_spread({}, conf);
            }
        },
        {
            // 根据传入的最新current和历史backup配置, 从obj中清理backup中存在但current不存在的配置
            key: "persistenceConfigCleanHandle",
            value: function persistenceConfigCleanHandle(obj, backup, current, first) {
                var backupKeys = Object.keys(backup);
                var currentKeys = Object.keys(current);
                var diffKeys = backupKeys.filter(function(k) {
                    return !currentKeys.includes(k);
                });
                diffKeys.forEach(function(k) {
                    if (first[k] !== undefined) {
                        obj[k] = first[k];
                        return;
                    }
                    delete obj[k];
                });
            }
        },
        {
            /** 预处理尺寸/固定项相关信息 */ key: "preHandleSize",
            value: function preHandleSize() {
                var _this_config = this.config, columnWidth = _this_config.columnWidth, rowHeight = _this_config.rowHeight;
                var ctx = this.context;
                var is = this.getPlugin(_TableIsPlugin);
                var columns = ctx.columns, rows = ctx.rows, data = ctx.data;
                var ignoreDataLength = ctx.ignoreYList.length;
                var ignoreColumnLength = ctx.ignoreXList.length;
                var leftFixedWidth = 0;
                var rightFixedWidth = 0;
                var contentWidth = (columns.length - ignoreColumnLength) * columnWidth;
                // x轴
                columns.forEach(function(c) {
                    var meta = ctx.getColumnMeta(c.key);
                    var ignore = ctx.isIgnoreColumn(c.key, meta);
                    var w = isNumber(c.width) ? c.width : columnWidth;
                    if (c.fixed && c.fixed !== TableColumnFixed.none) {
                        if (c.fixed === TableColumnFixed.left) {
                            if (!ignore) {
                                ctx.leftFixedMap[c.key] = {
                                    offset: leftFixedWidth,
                                    viewPortOffset: leftFixedWidth,
                                    config: c
                                };
                                leftFixedWidth += w;
                                ctx.leftFixedList.push(c.key);
                            }
                        }
                        if (c.fixed === TableColumnFixed.right) {
                            if (!ignore) {
                                ctx.rightFixedMap[c.key] = {
                                    offset: rightFixedWidth,
                                    viewPortOffset: rightFixedWidth,
                                    config: c
                                };
                                rightFixedWidth += w;
                                ctx.rightFixedList.push(c.key);
                            }
                        }
                    }
                    if (!ignore) {
                        contentWidth -= columnWidth;
                        contentWidth += w;
                    }
                });
                ctx.leftFixedWidth = leftFixedWidth;
                ctx.rightFixedWidth = rightFixedWidth;
                ctx.contentWidth = contentWidth;
                var rowKeys = Object.keys(rows).filter(function(key) {
                    return is.isRowExist(key);
                }).sort(function(a, b) {
                    var aIndex = ctx.dataKeyIndexMap[a];
                    var bIndex = ctx.dataKeyIndexMap[b];
                    return aIndex - bIndex;
                });
                var topFixedHeight = 0;
                var bottomFixedHeight = 0;
                var contentHeight = (data.length - ignoreDataLength) * rowHeight;
                // y轴
                rowKeys.forEach(function(key) {
                    var cur = rows[key];
                    var h = isNumber(cur.height) ? cur.height : rowHeight;
                    if (cur.fixed && cur.fixed !== TableRowFixed.none) {
                        if (cur.fixed === TableRowFixed.top) {
                            ctx.topFixedMap[key] = {
                                offset: topFixedHeight,
                                viewPortOffset: topFixedHeight,
                                config: cur
                            };
                            topFixedHeight += h;
                            ctx.topFixedList.push(key);
                        }
                        if (cur.fixed === TableRowFixed.bottom) {
                            ctx.bottomFixedMap[key] = {
                                offset: bottomFixedHeight,
                                viewPortOffset: bottomFixedHeight,
                                config: cur
                            };
                            bottomFixedHeight += h;
                            ctx.bottomFixeList.push(key);
                        }
                    }
                    contentHeight -= rowHeight;
                    contentHeight += h;
                });
                ctx.topFixedHeight = topFixedHeight;
                ctx.bottomFixedHeight = bottomFixedHeight;
                ctx.contentHeight = contentHeight;
                ctx.rowConfigNumberKeys = rowKeys;
                // 此处固定项尺寸已确定, 需要立即更新容器尺寸, 否则后续的clientWidth等信息计算会不准确
                this.render.updateWrapSize();
                var rightFixedStart = this.config.el.clientWidth - rightFixedWidth;
                var bottomFixedStart = this.config.el.clientHeight - bottomFixedHeight;
                // 计算右/下固定项偏移信息
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                Object.entries(ctx.bottomFixedMap).forEach(function(param) {
                    var _param = _sliced_to_array(param, 2), _ = _param[0], v = _param[1];
                    v.offset = ctx.contentHeight - ctx.bottomFixedHeight + v.offset;
                    v.viewPortOffset = bottomFixedStart + v.viewPortOffset;
                });
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                Object.entries(ctx.rightFixedMap).forEach(function(param) {
                    var _param = _sliced_to_array(param, 2), _ = _param[0], v = _param[1];
                    v.offset = ctx.contentWidth - ctx.rightFixedWidth + v.offset;
                    v.viewPortOffset = rightFixedStart + v.viewPortOffset;
                });
            }
        },
        {
            /** 末尾单元格相关信息计算 */ key: "preCalcLastInfo",
            value: function preCalcLastInfo() {
                var ctx = this.context;
                ctx.lastFixedColumnKey = ctx.rightFixedList[ctx.rightFixedList.length - 1];
                ctx.lastFixedRowKey = ctx.bottomFixeList[ctx.bottomFixeList.length - 1];
                for(var i = ctx.columns.length - 1; i >= 0; i--){
                    var cur = ctx.columns[i];
                    if (ctx.isIgnoreColumn(cur.key)) continue;
                    if (!ctx.rightFixedMap[cur.key]) {
                        ctx.lastColumnKey = cur.key;
                        break;
                    }
                }
                for(var i1 = ctx.data.length - 1; i1 >= 0; i1--){
                    var cur1 = ctx.data[i1];
                    var key = cur1[this.config.primaryKey];
                    if (ctx.isIgnoreRow(key)) continue;
                    if (!ctx.bottomFixedMap[key]) {
                        ctx.lastRowKey = key;
                        break;
                    }
                }
            }
        },
        {
            /** 预处理合并项, 需要提前计算出合并后的单元格尺寸和被合并项的信息 */ key: "preHandleMerge",
            value: function preHandleMerge() {
                var _this = this;
                var ctx = this.context;
                ctx.mergeMapMain = {};
                ctx.mergeMapSub = {};
                var cells = ctx.cells;
                if (isEmpty(cells)) return;
                var is = this.getPlugin(_TableIsPlugin);
                Object.entries(cells).forEach(function(param) {
                    var _param = _sliced_to_array(param, 2), k = _param[0], conf = _param[1];
                    if (!conf.mergeX && !conf.mergeY) return;
                    var keys = _getCellKeysByStr(k);
                    if (keys.length !== 2) return;
                    var _keys = _sliced_to_array(keys, 2), rowKey = _keys[0], columnKey = _keys[1];
                    if (!is.isRowExist(rowKey) || !is.isColumnExist(columnKey)) {
                        return;
                    }
                    var mergeMap = {};
                    var columnMergeList = [
                        columnKey
                    ];
                    var rowMergeList = [
                        rowKey
                    ];
                    if (conf.mergeX) {
                        var colMeta = _this.getMergeRange(columnKey, conf.mergeX, false);
                        columnMergeList = colMeta.mergeList;
                        mergeMap.width = colMeta.size;
                        mergeMap.xLength = columnMergeList.length;
                        // 合并项尾项处理
                        var last = columnMergeList[columnMergeList.length - 1];
                        if (last === ctx.lastColumnKey || last === ctx.lastFixedColumnKey) {
                            ctx.lastMergeXMap[k] = true;
                        }
                    }
                    if (conf.mergeY) {
                        var rowMeta = _this.getMergeRange(rowKey, conf.mergeY, true);
                        rowMergeList = rowMeta.mergeList;
                        mergeMap.height = rowMeta.size;
                        mergeMap.yLength = rowMergeList.length;
                        // 合并项尾项处理
                        var last1 = rowMergeList[rowMergeList.length - 1];
                        if (last1 === ctx.lastRowKey || last1 === ctx.lastFixedRowKey) {
                            ctx.lastMergeYMap[k] = true;
                        }
                    }
                    ctx.mergeMapMain[k] = mergeMap;
                    rowMergeList.forEach(function(rInd) {
                        columnMergeList.forEach(function(cInd) {
                            var cKey = _getCellKey(rInd, cInd);
                            if (k !== cKey) {
                                ctx.mergeMapSub[cKey] = [
                                    rowKey,
                                    columnKey
                                ];
                            }
                        });
                    });
                });
            }
        },
        {
            /**
   * 合并信息计算, 固定项和普通项交叉时, 不同类的后方项会被忽略
   * - 返回的mergeList为被合并行/列的索引
   * */ key: "getMergeRange",
            value: function getMergeRange(start, mergeNum, isRow) {
                var _rows_key, _columns_originalInd;
                var ctx = this.context;
                var _this_config = this.config, columnWidth = _this_config.columnWidth, rowHeight = _this_config.rowHeight;
                var columns = ctx.columns, rows = ctx.rows, data = ctx.data;
                var getter = this.getPlugin(_TableGetterPlugin);
                var is = this.getPlugin(_TableIsPlugin);
                var sortHide = this.getPlugin(_TableHidePlugin);
                var key = start;
                var originalInd = isRow ? getter.getIndexByRowKey(key) : getter.getIndexByColumnKey(key);
                var fixed = isRow ? (_rows_key = rows[key]) === null || _rows_key === void 0 ? void 0 : _rows_key.fixed : (_columns_originalInd = columns[originalInd]) === null || _columns_originalInd === void 0 ? void 0 : _columns_originalInd.fixed;
                // 主项是否是固定项
                var isMainFixed = !!fixed && fixed !== TableColumnFixed.none;
                var mergeList = [];
                var size = 0;
                var ind = originalInd;
                // let fixedList: TableKey[] = [];
                //
                // if (isMainFixed) {
                //   if (fixed === TableRowFixed.top) fixedList = ctx.topFixedList;
                //   if (fixed === TableRowFixed.bottom) fixedList = ctx.bottomFixeList;
                //   if (fixed === TableColumnFixed.left) fixedList = ctx.leftFixedList;
                //   if (fixed === TableColumnFixed.right) fixedList = ctx.rightFixedList;
                // }
                while(mergeNum > 0){
                    var exist = isRow ? is.isRowExistByIndex(ind) : is.isColumnExistByIndex(ind);
                    if (!exist) break;
                    var _key = isRow ? getter.getKeyByRowIndex(ind) : getter.getKeyByColumnIndex(ind);
                    var originalInd1 = isRow ? getter.getIndexByRowKey(_key) : getter.getIndexByColumnKey(_key);
                    var conf = isRow ? rows[_key] : columns[originalInd1];
                    var isFixed = !!(conf === null || conf === void 0 ? void 0 : conf.fixed) && conf.fixed !== TableColumnFixed.none;
                    // 根据主项是否是固定项做不同处理
                    if (!isMainFixed) {
                        // 合并项不是fixed时, 跳过fixed的被合并项
                        if (isFixed) {
                            ind++;
                            continue;
                        }
                        if (isRow && ind >= data.length) break;
                        if (!isRow && ind >= columns.length) break;
                    }
                    var cSize = isRow ? conf === null || conf === void 0 ? void 0 : conf.height : conf === null || conf === void 0 ? void 0 : conf.width;
                    var defSize = isRow ? rowHeight : columnWidth;
                    var s = isNumber(cSize) ? cSize : defSize;
                    var isHideColumn = sortHide.isHideColumn(_key);
                    var isIgnore = isRow ? ctx.isIgnoreRow(_key) : ctx.isIgnoreColumn(_key);
                    if (isHideColumn) {
                        // 跳过隐藏列, 不计入尺寸
                        mergeNum--;
                        mergeList.push(_key);
                    } else if (isIgnore) {
                        // 忽略ignore列
                        ind++;
                        continue;
                    } else {
                        mergeList.push(_key);
                        size += s;
                        mergeNum--;
                    }
                    ind += 1;
                    if (isMainFixed) {
                        var conf1 = isRow ? rows[getter.getKeyByRowIndex(ind)] : columns[ind];
                        if (!conf1 || !conf1.fixed || conf1.fixed !== TableColumnFixed.none) break;
                    // const curConf = this.
                    // const curInd = fixedList.indexOf(_key);
                    //
                    // if (curInd === fixedList.length - 1) break;
                    //
                    // if (!isHideColumn && curInd === -1) break;
                    //
                    // const k = fixedList[curInd + 1];
                    // ind = isRow
                    //   ? getter.getIndexByRowKey(k)
                    //   : getter.getIndexByColumnKey(k);
                    }
                }
                return {
                    size: size,
                    mergeList: mergeList
                };
            }
        },
        {
            /** 基础容器创建&初始化 */ key: "createDom",
            value: function createDom() {
                var ctx = this.context;
                // viewEl & viewContentEl
                if (!ctx.viewEl || !ctx.viewContentEl) {
                    if (this.config.viewEl && this.config.viewContentEl) {
                        // 传入配置时使用传入值
                        ctx.viewEl = this.config.viewEl;
                        ctx.viewContentEl = this.config.viewContentEl;
                    } else {
                        // 没有传入相关配置, 自动创建并渲染
                        var el = document.createElement("div");
                        setNamePathValue(el, _privateScrollerDomKey, true);
                        // 预设配置时, 为其添加滚动样式和尺寸控制
                        ctx.viewEl = el;
                        var contEl = document.createElement("div");
                        ctx.viewContentEl = contEl;
                        ctx.viewEl.className = clsx("m78-table_default-scroll m78-table_expand-size", ctx.viewEl.className);
                        el.appendChild(contEl);
                        this.config.el.appendChild(el);
                    }
                    var domContentEl = ctx.viewContentEl;
                    if (!domContentEl.className.includes("m78-table_view-content")) {
                        domContentEl.className = clsx("m78-table_view-content", domContentEl.className);
                    }
                }
                // 创建stage
                var stage = document.createElement("div");
                stage.className = "m78-table_stage";
                this.context.stageEL = stage;
                this.context.viewContentEl.appendChild(stage);
            }
        },
        {
            /** 合并消息文本 */ key: "mergeTexts",
            value: function mergeTexts() {
                this.context.texts = _object_spread({}, tableDefaultTexts, this.config.texts);
            }
        },
        {
            /** 克隆 config.persistenceConfig 到 context.persistenceConfig */ key: "clonePersistenceConfigToCtx",
            value: function clonePersistenceConfigToCtx() {
                this.context.persistenceConfig = isObject(this.config.persistenceConfig) ? simplyDeepClone(this.config.persistenceConfig) : {};
            }
        },
        {
            /** 触发插件loadStage不同阶段 */ key: "stageEmit",
            value: function stageEmit(stage, isBefore) {
                this.plugins.forEach(function(plugin) {
                    var _plugin_loadStage;
                    return (_plugin_loadStage = plugin.loadStage) === null || _plugin_loadStage === void 0 ? void 0 : _plugin_loadStage.call(plugin, stage, isBefore);
                });
            }
        }
    ]);
    return _TableInitPlugin;
}(TablePlugin);
