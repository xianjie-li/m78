import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { deepClone, getNamePathValue, isEmpty, isNumber, isObject, isString, setNamePathValue, throwError } from "@m78/utils";
import clsx from "clsx";
import { _defaultTexts, _getCellKey, _getCellKeysByStr, _prefix, _privateScrollerDomKey } from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import { _TableHeaderPlugin } from "./header.js";
import { addCls } from "../../common/index.js";
import { _TablePrivateProperty, TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { TableReloadLevel } from "./life.js";
import { _TableHidePlugin } from "./hide.js";
/**
 * 进行配置整理/预计算等
 * */ export var _TableInitPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableInitPlugin, TablePlugin);
    var _super = _create_super(_TableInitPlugin);
    function _TableInitPlugin() {
        _class_call_check(this, _TableInitPlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _TableInitPlugin.prototype;
    _proto.init = function init() {
        this.methodMapper(this.table, [
            [
                "conf",
                "config"
            ]
        ]);
        addCls(this.config.el, "m78-table");
        this.createDomElement();
        this.mergeTexts();
        this.fullHandle();
    };
    _proto.conf = function conf(config) {
        if (config === undefined) return this.config;
        Object.assign(this.config, config);
    };
    _proto.fullHandle = function fullHandle() {
        this.plugins.forEach(function(plugin) {
            var ref;
            return (ref = plugin.loadStage) === null || ref === void 0 ? void 0 : ref.call(plugin, TableReloadLevel.full, true);
        });
        this.initHandle();
        this.getPlugin(_TableHeaderPlugin).process();
        this.fmtDataAndColumns();
        this.plugins.forEach(function(plugin) {
            var ref;
            return (ref = plugin.loadStage) === null || ref === void 0 ? void 0 : ref.call(plugin, TableReloadLevel.full, false);
        });
        this.indexHandle();
    };
    /** 为当前ctx.data/columns创建索引, 并合并持久化配置 对应TableReloadLevel.index */ _proto.indexHandle = function indexHandle() {
        this.plugins.forEach(function(plugin) {
            var ref;
            return (ref = plugin.loadStage) === null || ref === void 0 ? void 0 : ref.call(plugin, TableReloadLevel.index, true);
        });
        this.mergeTexts();
        this.mergePersistenceConfig();
        this.updateIndexAndMerge();
        this.mergePersistenceConfigAfter();
        this.plugins.forEach(function(plugin) {
            var ref;
            return (ref = plugin.loadStage) === null || ref === void 0 ? void 0 : ref.call(plugin, TableReloadLevel.index, false);
        });
        this.baseHandle();
    };
    /** 基础预处理, 减少后续渲染的计算工作, , 对应TableReloadLevel.base */ _proto.baseHandle = function baseHandle() {
        this.plugins.forEach(function(plugin) {
            var ref;
            return (ref = plugin.loadStage) === null || ref === void 0 ? void 0 : ref.call(plugin, TableReloadLevel.base, true);
        });
        var ctx = this.context;
        ctx.rowCache = {};
        ctx.columnCache = {};
        ctx.cellCache = {};
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
        ctx.leftFixedListALl = [];
        ctx.rightFixedListAll = [];
        this.preHandleSize();
        this.preCalcLastInfo();
        this.preHandleMerge();
        this.plugins.forEach(function(plugin) {
            var ref;
            return (ref = plugin.loadStage) === null || ref === void 0 ? void 0 : ref.call(plugin, TableReloadLevel.base, false);
        });
    };
    /** 拷贝data/columns/persistenceConfig等需要本地化的配置 */ _proto.initHandle = function initHandle() {
        var ctx = this.context;
        ctx.data = this.config.data.slice();
        ctx.columns = [];
        ctx.cells = {};
        ctx.rows = {};
        ctx.cellDomCaChe = {};
        ctx.cellStateCaChe = {};
        this.context.persistenceConfig = isObject(this.config.persistenceConfig) ? deepClone(this.config.persistenceConfig) : {};
        ctx.backupRows = {};
        ctx.backupCells = {};
        ctx.backupColumns = {};
        ctx.backupFirstColumns = {};
        ctx.backupFirstRows = {};
        ctx.backupFirstCells = {};
    };
    /** 将data/columns进行预处理后拷贝到其对应的ctx.xxx, 并对固定项进行处理 */ _proto.fmtDataAndColumns = function fmtDataAndColumns() {
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
        // 从行头/表头开始, 拷贝并备份数据, 然后将fixed项移植首尾位置
        for(var i = 1; i < columns.length; i++){
            var cur = columns[i];
            if (cur.fixed) {
                // 由于要注入私有属性, 这里需要将其克隆
                var clone = _object_spread({}, cur);
                listX.push(clone);
                var nCur = _object_spread_props(_object_spread({}, cur), _define_property({}, _TablePrivateProperty.fake, true));
                setNamePathValue(clone, _TablePrivateProperty.ignore, true);
                if (cur.fixed === TableColumnFixed.left) {
                    lf.push(nCur);
                } else {
                    rf.push(nCur);
                }
            } else {
                listX.push(cur);
            }
        }
        for(var i1 = ctx.yHeaderKeys.length; i1 < data.length; i1++){
            var cur1 = data[i1];
            var key = cur1[this.config.primaryKey];
            var conf = rows[key];
            if (conf && conf.fixed) {
                // 由于要注入私有属性, 这里需要将其克隆
                var clone1 = _object_spread({}, cur1);
                listY.push(clone1);
                var nCur1 = _object_spread_props(_object_spread({}, cur1), _define_property({}, _TablePrivateProperty.fake, true));
                setNamePathValue(clone1, _TablePrivateProperty.ignore, true);
                if (conf.fixed === TableRowFixed.top) {
                    tf.push(nCur1);
                } else {
                    bf.push(nCur1);
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
    };
    _proto.mergePersistenceConfig = function mergePersistenceConfig() {
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
    };
    _proto.mergePersistenceConfigAfter = function mergePersistenceConfigAfter() {
        var ctx = this.context;
        var rowHeaderConf = ctx.columns[0];
        // 同步行头尺寸
        if (rowHeaderConf && rowHeaderConf.key === ctx.xHeaderKey && isNumber(rowHeaderConf.width)) {
            ctx.xHeaderWidth = rowHeaderConf.width;
        }
    };
    /** 处理dataKeyIndexMap/columnKeyIndexMap, 合并persistenceConfig.columns/rows/cells 至ctx上同名配置 */ _proto.updateIndexAndMerge = function updateIndexAndMerge() {
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
            var ignore = getNamePathValue(cur, _TablePrivateProperty.ignore);
            // 存在持久化配置时, 对齐进行合并等操作
            var persistenceConf = getNamePathValue(ctx.persistenceConfig, [
                "columns",
                cur.key, 
            ]);
            if (persistenceConf) {
                _this.persistenceConfigHandle(ctx.columns, ctx.backupColumns, ctx.backupFirstColumns, cur.key, persistenceConf, i);
            }
            var isFake = getNamePathValue(cur, _TablePrivateProperty.fake);
            if (!isFake) {
                ctx.allColumnKeys.push(cur.key);
            }
            if (ignore) {
                ctx.ignoreXList.push(i);
                // 固定项已拷贝并移动到列表前/后位置, 跳过后续设置
                // 对fixed的ignore项进行标记
                if (!isFake && (cur.fixed || (persistenceConf === null || persistenceConf === void 0 ? void 0 : persistenceConf.fixed))) {
                    columnMap["".concat(cur.key).concat(_TablePrivateProperty.ref)] = i;
                    return;
                }
            }
            columnMap[cur.key] = i;
        });
        // 行索引
        ctx.data.forEach(function(cur, i) {
            var k = cur[_this.config.primaryKey];
            // 在此处确保所有key都是可用的, 后续代码中就可以直接安全取用了
            if (!isString(k) && !isNumber(k)) {
                throwError("No key obtained in row. ".concat(JSON.stringify(cur, null, 4)), _prefix);
            }
            var isFake = getNamePathValue(cur, _TablePrivateProperty.fake);
            if (!isFake) {
                ctx.allRowKeys.push(k);
            }
            var ignore = getNamePathValue(cur, _TablePrivateProperty.ignore);
            if (ignore) {
                ctx.ignoreYList.push(i);
                var conf = ctx.rows[k];
                // 固定项已拷贝并移动到列表前/后位置, 跳过后续设置
                if (!isFake && (conf === null || conf === void 0 ? void 0 : conf.fixed)) {
                    dataMap["".concat(k).concat(_TablePrivateProperty.ref)] = i;
                    return;
                }
            }
            dataMap[k] = i;
        });
        ctx.dataKeyIndexMap = dataMap;
        ctx.columnKeyIndexMap = columnMap;
    };
    /**
   * row/cells持久化处理通用逻辑, 根据情况备份/还原/合并持久化配置到当前配置
   *
   * @param map 对应的配置, 比如ctx.rows/ctx.cells
   * @param backupMap 对应的备份配置, 比如ctx.backupRows/ctx.backupCells
   * @param backupFirstMap 对应的备份配置, 如backupFirstColumns
   * @param key 对应map中的key
   * @param conf 需要合并的持久化配置
   * @param index 对应map中的index, 如果map是一个数组
   * */ _proto.persistenceConfigHandle = function persistenceConfigHandle(map, backupMap, backupFirstMap, key, conf, index) {
        var indOrKey = isNumber(index) ? index : key;
        var backup = backupMap[key];
        var item = map[indOrKey];
        var ignore = getNamePathValue(item, _TablePrivateProperty.ignore);
        if (ignore) return;
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
    };
    // 根据传入的最新current和历史backup配置, 从obj中清理backup中存在但current不存在的配置
    _proto.persistenceConfigCleanHandle = function persistenceConfigCleanHandle(obj, backup, current, first) {
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
    };
    /** 预处理尺寸/固定项相关信息 */ _proto.preHandleSize = function preHandleSize() {
        var _config = this.config, columnWidth = _config.columnWidth, rowHeight = _config.rowHeight;
        var ctx = this.context;
        var getter = this.getPlugin(_TableGetterPlugin);
        var columns = ctx.columns, rows = ctx.rows, data = ctx.data;
        var ignoreDataLength = ctx.ignoreYList.length;
        var ignoreColumnLength = ctx.ignoreXList.length;
        var leftFixedWidth = 0;
        var rightFixedWidth = 0;
        var contentWidth = (columns.length - ignoreColumnLength) * columnWidth;
        // x轴
        columns.forEach(function(c) {
            var ignore = getNamePathValue(c, _TablePrivateProperty.ignore);
            var hide = getNamePathValue(c, _TablePrivateProperty.hide);
            var w = isNumber(c.width) ? c.width : columnWidth;
            if (c.fixed) {
                if (c.fixed === TableColumnFixed.left) {
                    // 隐藏的hide项依然记录
                    if (!ignore || hide) {
                        ctx.leftFixedMap[c.key] = {
                            offset: leftFixedWidth,
                            viewPortOffset: leftFixedWidth,
                            config: c
                        };
                        ctx.leftFixedListALl.push(c.key);
                    }
                    if (!ignore) {
                        leftFixedWidth += w;
                        ctx.leftFixedList.push(c.key);
                    }
                }
                if (c.fixed === TableColumnFixed.right) {
                    if (!ignore || hide) {
                        ctx.rightFixedMap[c.key] = {
                            offset: rightFixedWidth,
                            viewPortOffset: rightFixedWidth,
                            config: c
                        };
                        ctx.rightFixedListAll.push(c.key);
                    }
                    if (!ignore) {
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
            return getter.isRowExist(key);
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
            if (cur.fixed) {
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
        var rightFixedStart = this.config.el.offsetWidth - rightFixedWidth;
        var bottomFixedStart = this.config.el.offsetHeight - bottomFixedHeight;
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
    };
    /** 末尾单元格相关信息计算 */ _proto.preCalcLastInfo = function preCalcLastInfo() {
        var ctx = this.context;
        ctx.lastFixedColumnKey = ctx.rightFixedList[ctx.rightFixedList.length - 1];
        ctx.lastFixedRowKey = ctx.bottomFixeList[ctx.bottomFixeList.length - 1];
        for(var i = ctx.columns.length - 1; i >= 0; i--){
            var cur = ctx.columns[i];
            if (getNamePathValue(cur, _TablePrivateProperty.ignore)) continue;
            if (!ctx.rightFixedMap[cur.key]) {
                ctx.lastColumnKey = cur.key;
                break;
            }
        }
        for(var i1 = ctx.data.length - 1; i1 >= 0; i1--){
            var cur1 = ctx.data[i1];
            if (getNamePathValue(cur1, _TablePrivateProperty.ignore)) continue;
            var key = cur1[this.config.primaryKey];
            if (!ctx.bottomFixedMap[key]) {
                ctx.lastRowKey = key;
                break;
            }
        }
    };
    /** 预处理合并项, 需要提前计算出合并后的单元格尺寸和被合并项的信息 */ _proto.preHandleMerge = function preHandleMerge() {
        var _this = this;
        var ctx = this.context;
        ctx.mergeMapMain = {};
        ctx.mergeMapSub = {};
        var cells = ctx.cells;
        if (isEmpty(cells)) return;
        var getter = this.getPlugin(_TableGetterPlugin);
        Object.entries(cells).forEach(function(param) {
            var _param = _sliced_to_array(param, 2), k = _param[0], conf = _param[1];
            if (!conf.mergeX && !conf.mergeY) return;
            var keys = _getCellKeysByStr(k);
            if (keys.length !== 2) return;
            var _keys = _sliced_to_array(keys, 2), rowKey = _keys[0], columnKey = _keys[1];
            if (!getter.isRowExist(rowKey) || !getter.isColumnExist(columnKey)) {
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
    };
    /**
   * 合并信息计算, 固定项和普通项交叉时, 不同类的后方项会被忽略
   * - 返回的mergeList为被合并行/列的索引
   * */ _proto.getMergeRange = function getMergeRange(start, mergeNum, isRow) {
        var ref, ref1;
        var ctx = this.context;
        var _config = this.config, columnWidth = _config.columnWidth, rowHeight = _config.rowHeight;
        var columns = ctx.columns, rows = ctx.rows, data = ctx.data;
        var getter = this.getPlugin(_TableGetterPlugin);
        var sortHide = this.getPlugin(_TableHidePlugin);
        var key = start;
        var originalInd = isRow ? getter.getIndexByRowKey(key) : getter.getIndexByColumnKey(key);
        var fixed = isRow ? (ref = rows[key]) === null || ref === void 0 ? void 0 : ref.fixed : (ref1 = columns[originalInd]) === null || ref1 === void 0 ? void 0 : ref1.fixed;
        // 主项是否是固定项
        var isMainFixed = !!fixed;
        var mergeList = [];
        var size = 0;
        var ind = originalInd;
        var fixedList = [];
        if (isMainFixed) {
            if (fixed === TableRowFixed.top) fixedList = ctx.topFixedList;
            if (fixed === TableRowFixed.bottom) fixedList = ctx.bottomFixeList;
            if (fixed === TableColumnFixed.left) fixedList = ctx.leftFixedList;
            if (fixed === TableColumnFixed.right) fixedList = ctx.rightFixedList;
        }
        while(mergeNum > 0){
            var exist = isRow ? getter.isRowExistByIndex(ind) : getter.isColumnExistByIndex(ind);
            if (!exist) break;
            var _key = isRow ? getter.getKeyByRowIndex(ind) : getter.getKeyByColumnIndex(ind);
            var originalInd1 = isRow ? getter.getIndexByRowKey(_key) : getter.getIndexByColumnKey(_key);
            var cur = isRow ? data[originalInd1] : columns[originalInd1];
            var conf = isRow ? rows[_key] : columns[originalInd1];
            var isFixed = !!(conf === null || conf === void 0 ? void 0 : conf.fixed);
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
            if (isHideColumn) {
                // 跳过隐藏列, 不计入尺寸
                mergeNum--;
                mergeList.push(_key);
            } else if (getNamePathValue(cur, _TablePrivateProperty.ignore)) {
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
                if (!conf1 || !conf1.fixed) break;
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
    };
    /** 基础容器创建&初始化 */ _proto.createDomElement = function createDomElement() {
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
    };
    /** 合并消息文本 */ _proto.mergeTexts = function mergeTexts() {
        this.context.texts = _object_spread({}, _defaultTexts, this.config.texts);
    };
    return _TableInitPlugin;
}(TablePlugin);
