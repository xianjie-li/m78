import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { getNamePathValue, isArray, isNumber, isString, isTruthyOrZero, setNamePathValue, throwError } from "@m78/utils";
import { _getBoundByPoint, _getCellKey, _getCellKeysByStr, _prefix } from "../common.js";
import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { _TableHidePlugin } from "./hide.js";
import { Position } from "../../common/index.js";
import { _TableMetaDataPlugin } from "./meta-data.js";
import { _GetterCacheKey } from "../types/cache.js";
export var _TableGetterPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableGetterPlugin, TablePlugin);
    var _super = _create_super(_TableGetterPlugin);
    function _TableGetterPlugin() {
        _class_call_check(this, _TableGetterPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "hide", void 0);
        return _this;
    }
    _create_class(_TableGetterPlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                // 映射实现方法
                this.methodMapper(this.table, [
                    "getX",
                    "getY",
                    "getXY",
                    "getMaxX",
                    "getMaxY",
                    "getWidth",
                    "getHeight",
                    "getContentWidth",
                    "getContentHeight",
                    "getBoundItems",
                    "getViewportItems",
                    "getAreaBound",
                    "getRow",
                    "getColumn",
                    "getCell",
                    "getCellKey",
                    "getCellByStrKey",
                    "getNearCell",
                    "getRowCells",
                    "getKeyByRowIndex",
                    "getKeyByColumnIndex",
                    "getIndexByRowKey",
                    "getIndexByColumnKey",
                    "getKeyByRowData",
                    "getMergedData",
                    "getMergeData",
                    "getAttachPosition",
                    "getColumnAttachPosition",
                    "getRowAttachPosition"
                ]);
                this.methodMapper(this.context, [
                    "getCellMergeConfig",
                    "getRowMergeConfig",
                    "getColumnMergeConfig",
                    "getBaseConfig"
                ]);
            }
        },
        {
            key: "init",
            value: function init() {
                this.hide = this.getPlugin(_TableHidePlugin);
            }
        },
        {
            key: "getContentHeight",
            value: function getContentHeight() {
                var _this = this;
                return this.context.getterCache.get(_GetterCacheKey.getContentHeight, function() {
                    if (_this.config.autoSize) {
                        return _this.context.contentHeight;
                    } else {
                        // 见contentWidth()
                        return Math.max(_this.context.contentHeight, _this.table.getHeight());
                    }
                });
            }
        },
        {
            key: "getContentWidth",
            value: function getContentWidth() {
                var _this = this;
                return this.context.getterCache.get(_GetterCacheKey.getContentWidth, function() {
                    if (_this.config.autoSize) {
                        return _this.context.contentWidth;
                    } else {
                        // 无自动尺寸时, 内容尺寸不小于容器尺寸, 否则xy()等计算会出现问题
                        return Math.max(_this.context.contentWidth, _this.table.getWidth());
                    }
                });
            }
        },
        {
            key: "getMaxX",
            value: function getMaxX() {
                var _this = this;
                return this.context.getterCache.get(_GetterCacheKey.getMaxX, function() {
                    return _this.context.viewEl.scrollWidth - _this.context.viewEl.clientWidth;
                });
            }
        },
        {
            key: "getMaxY",
            value: function getMaxY() {
                var _this = this;
                return this.context.getterCache.get(_GetterCacheKey.getMaxY, function() {
                    return _this.context.viewEl.scrollHeight - _this.context.viewEl.clientHeight;
                });
            }
        },
        {
            key: "getHeight",
            value: function getHeight() {
                var _this = this;
                return this.context.getterCache.get(_GetterCacheKey.getHeight, function() {
                    return _this.config.el.clientHeight;
                });
            }
        },
        {
            key: "getWidth",
            value: function getWidth() {
                var _this = this;
                return this.context.getterCache.get(_GetterCacheKey.getWidth, function() {
                    return _this.config.el.clientWidth;
                });
            }
        },
        {
            key: "getX",
            value: function getX() {
                var _this = this;
                return this.context.getterCache.get(_GetterCacheKey.getX, function() {
                    return _this.context.viewEl.scrollLeft;
                });
            }
        },
        {
            key: "getY",
            value: function getY() {
                var _this = this;
                return this.context.getterCache.get(_GetterCacheKey.getY, function() {
                    return _this.context.viewEl.scrollTop;
                });
            }
        },
        {
            key: "getXY",
            value: function getXY() {
                return [
                    this.getX(),
                    this.getY()
                ];
            }
        },
        {
            key: "getAreaBound",
            value: function getAreaBound(p1, p2) {
                p2 = p2 || p1;
                return this.getBoundItems(_getBoundByPoint(p1, p2));
            }
        },
        {
            key: "getBoundItems",
            value: function getBoundItems(target) {
                var skipFixed = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                var _this_getBoundItemsInner = this.getBoundItemsInner(target, skipFixed), rows = _this_getBoundItemsInner.rows, columns = _this_getBoundItemsInner.columns, cells = _this_getBoundItemsInner.cells;
                return {
                    rows: rows,
                    columns: columns,
                    cells: cells
                };
            }
        },
        {
            key: "getBoundItemsInner",
            value: /**
   * 内部使用的getBoundItems, 包含了startRowIndex等额外返回
   * - 注意, 返回的index均对应dataFixedSortList/columnsFixedSortList而不是配置中的data
   * */ function getBoundItemsInner(target) {
                var skipFixed = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                var _this = this;
                var x = 0;
                var y = 0;
                var width = 0;
                var height = 0;
                var isSingle = false;
                if (isArray(target)) {
                    x = target[0];
                    y = target[1];
                    isSingle = true;
                } else {
                    x = target.left;
                    y = target.top;
                    width = target.width;
                    height = target.height;
                }
                var startRowIndex = 0;
                var endRowIndex = 0;
                var startColumnIndex = 0;
                var endColumnIndex = 0;
                // 这里使用二分搜索先查找到可见的第一个行和列, 然后对它们后方的项进行遍历, 取所有可见节点, 避免循环整个列表
                var startRow;
                var startColumn;
                var _this_context = this.context, data = _this_context.data, columns = _this_context.columns;
                // 对行或列执行二分搜索
                var binarySearchHandle = function(isRow) {
                    return function(item, index) {
                        var key = isRow ? item[_this.config.primaryKey] : item.key;
                        var ignore = isRow ? _this.context.isIgnoreRow(key) : _this.context.isIgnoreColumn(key);
                        if (ignore) return null;
                        var cur = isRow ? _this.getRow(key) : _this.getColumn(key);
                        var xORy = isRow ? y : x;
                        if (skipFixed && cur.isFixed) return null;
                        var offset = isRow ? cur.y : cur.x;
                        var size = isRow ? cur.height : cur.width;
                        var rangStart = xORy - size;
                        // 视口边缘 - 尺寸 到 视口边缘的范围内视为第一项
                        if (offset >= rangStart && offset <= xORy) {
                            if (isRow) {
                                startRowIndex = index;
                                endRowIndex = startRowIndex;
                                startRow = cur;
                            } else {
                                startColumnIndex = index;
                                endColumnIndex = startColumnIndex;
                                startColumn = cur;
                            }
                            return 0;
                        }
                        if (offset > xORy) return 1;
                        if (offset < xORy) return -1;
                        return null;
                    };
                };
                // 最小可见行
                this.binarySearch(data, binarySearchHandle(true));
                // 最小可见列
                this.binarySearch(columns, binarySearchHandle(false));
                var rowList = [];
                var columnsList = [];
                var cellList = [];
                if (!startRow || !startColumn) {
                    return {
                        rows: rowList,
                        columns: columnsList,
                        cells: cellList
                    };
                }
                if (startRow) {
                    for(var i = startRowIndex; i < data.length; i++){
                        var key = this.getKeyByRowIndex(i);
                        if (this.context.isIgnoreRow(key)) continue;
                        var row = this.getRow(key);
                        if (skipFixed && row.isFixed) continue;
                        if (row.y > y + height) break;
                        rowList.push(row);
                        endRowIndex = i;
                    }
                }
                if (startColumn) {
                    for(var i1 = startColumnIndex; i1 < columns.length; i1++){
                        var key1 = this.getKeyByColumnIndex(i1);
                        if (this.context.isIgnoreColumn(key1)) continue;
                        var column = this.getColumn(key1);
                        if (skipFixed && column.isFixed) continue;
                        if (column.x > x + width) break;
                        columnsList.push(column);
                        endColumnIndex = i1;
                    }
                }
                var push = this.cellMergeHelper(cellList);
                // 截取可见区域cell
                rowList.forEach(function(row) {
                    var slice = [];
                    for(var i = startColumnIndex; i <= endColumnIndex; i++){
                        var col = columns[i];
                        if (_this.context.isIgnoreColumn(col.key)) continue;
                        slice.push(_this.getCell(row.key, _this.getKeyByColumnIndex(i)));
                    }
                    slice.forEach(function(cell) {
                        if (_this.context.isIgnoreRow(cell.row.key)) return;
                        // 固定项单独处理
                        if (skipFixed && (cell.row.isFixed || cell.column.isFixed)) return;
                        if (push(cell)) return;
                        cellList.push(cell);
                    });
                });
                return {
                    rows: isSingle ? rowList.slice(0, 1) : rowList,
                    columns: isSingle ? columnsList.slice(0, 1) : columnsList,
                    cells: isSingle ? cellList.slice(0, 1) : cellList,
                    startRowIndex: startRowIndex,
                    endRowIndex: endRowIndex,
                    startColumnIndex: startColumnIndex,
                    endColumnIndex: endColumnIndex
                };
            }
        },
        {
            key: "getViewportItems",
            value: function getViewportItems() {
                var _this = this;
                var _columns, _columns1, _rows, _rows1;
                var table = this.table;
                var ctx = this.context;
                // 截取非fixed区域内容
                var x = Math.min(table.getX() + ctx.leftFixedWidth, this.table.getContentWidth());
                var y = Math.min(table.getY() + ctx.topFixedHeight, this.table.getContentHeight());
                var width = Math.max(this.table.getWidth() - ctx.rightFixedWidth - ctx.leftFixedWidth, 0);
                var height = Math.max(this.table.getHeight() - ctx.bottomFixedHeight - ctx.topFixedHeight, 0);
                var items = this.getBoundItemsInner({
                    left: x,
                    top: y,
                    width: width,
                    height: height
                }, true);
                var startRowIndex = items.startRowIndex, endRowIndex = items.endRowIndex, startColumnIndex = items.startColumnIndex, endColumnIndex = items.endColumnIndex, cells = items.cells, rows = items.rows, columns = items.columns;
                if (!isNumber(startRowIndex) || !isNumber(endRowIndex)) {
                    return items;
                }
                // 固定项处理, 由于已知当前区域的x/y轴开始结束索引, 所以按相同区域从fixed行和列中截取等量的数据即可
                var push = this.cellMergeHelper(cells);
                var lf = ctx.leftFixedList.map(function(key) {
                    return _this.getColumn(key);
                }).filter(function(i) {
                    return !ctx.isIgnoreColumn(i.key);
                });
                var rf = ctx.rightFixedList.map(function(key) {
                    return _this.getColumn(key);
                }).filter(function(i) {
                    return !ctx.isIgnoreColumn(i.key);
                });
                _to_consumable_array(lf).concat(_to_consumable_array(rf)).forEach(function(column) {
                    // 截取固定列中可见单元格
                    for(var i = startRowIndex; i <= endRowIndex; i++){
                        var cell = _this.getCell(_this.getKeyByRowIndex(i), column.key);
                        if (cell.row.isFixed || ctx.isIgnoreRow(cell.row.key)) continue;
                        if (push(cell)) continue;
                        cells.push(cell);
                    }
                });
                (_columns = columns).unshift.apply(_columns, _to_consumable_array(lf));
                (_columns1 = columns).push.apply(_columns1, _to_consumable_array(rf));
                var tf = ctx.topFixedList.map(function(key) {
                    return _this.getRow(key);
                });
                var bf = ctx.bottomFixeList.map(function(key) {
                    return _this.getRow(key);
                });
                _to_consumable_array(tf).concat(_to_consumable_array(bf)).forEach(function(row) {
                    // 截取固定行中可用单元格
                    for(var i = startColumnIndex; i <= endColumnIndex; i++){
                        var curConf = _this.context.columns[i];
                        if (ctx.isIgnoreColumn(curConf.key)) continue;
                        var cell = _this.getCell(row.key, _this.getKeyByColumnIndex(i));
                        if (cell.column.isFixed) continue;
                        if (push(cell)) continue;
                        cells.push(cell);
                    }
                    // 添加四个角的固定项
                    _to_consumable_array(ctx.leftFixedList).concat(_to_consumable_array(ctx.rightFixedList)).forEach(function(key) {
                        var cell = _this.getCell(row.key, key);
                        if (ctx.isIgnoreColumn(cell.column.key)) return;
                        if (ctx.isIgnoreRow(cell.row.key)) return;
                        if (push(cell)) return;
                        cells.push(cell);
                    });
                });
                (_rows = rows).unshift.apply(_rows, _to_consumable_array(tf));
                (_rows1 = rows).push.apply(_rows1, _to_consumable_array(bf));
                return {
                    rows: rows,
                    columns: columns,
                    cells: cells
                };
            }
        },
        {
            /** 获取指定行的实例, useCache为false时会跳过缓存重新计算关键属性, 并将最新内容写入缓存 */ key: "getRow",
            value: function getRow(key) {
                var useCache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                var ctx = this.context;
                var row = ctx.rowCache[key];
                var meta = ctx.getRowMeta(key);
                var lastKeyNotEqual = !!row && meta.reloadKey !== ctx.lastReloadKey;
                // 是否需要刷新缓存
                var needFresh = !useCache || lastKeyNotEqual;
                if (!row) {
                    // 新建
                    row = this.getFreshRow(key);
                    ctx.rowCache[key] = row;
                } else if (needFresh) {
                    // 更新缓存
                    var fresh = this.getFreshRow(key);
                    Object.assign(row, fresh);
                }
                meta.reloadKey = ctx.lastReloadKey;
                return row;
            }
        },
        {
            key: "getFreshRow",
            value: /** 跳过缓存获取最新的row */ function getFreshRow(key) {
                var ctx = this.context;
                var index = ctx.dataKeyIndexMap[key];
                if (!isNumber(index)) {
                    throwError("row key ".concat(key, " is invalid"), _prefix);
                }
                var conf = ctx.rows[key] || {};
                var height = isNumber(conf.height) ? conf.height : this.config.rowHeight;
                var data = ctx.data[index];
                var meta = ctx.getRowMeta(key);
                var isFixed = !!conf.fixed && conf.fixed !== TableRowFixed.none;
                var isHeader = ctx.yHeaderKeys.includes(key);
                var beforeIgnoreLength = this.getBeforeIgnoreY(index).length;
                var realIndex = index - beforeIgnoreLength;
                var dataIndex = index - ctx.yHeaderKeys.length;
                var row = {
                    key: key,
                    height: height,
                    index: realIndex,
                    dataIndex: isHeader ? -1 : dataIndex,
                    realIndex: index,
                    y: this.getBeforeSizeY(index),
                    config: conf,
                    data: data,
                    isFixed: isFixed,
                    isEven: realIndex % 2 === 0,
                    isHeader: isHeader,
                    isFake: !!meta.fake
                };
                if (row.isFixed) {
                    var tf = ctx.topFixedMap[key];
                    if (tf) row.fixedOffset = tf.viewPortOffset;
                    var bf = ctx.bottomFixedMap[key];
                    if (bf) row.fixedOffset = bf.viewPortOffset;
                }
                return row;
            }
        },
        {
            /** 获取指定列的实例, useCache为false时会跳过缓存重新计算关键属性, 并将最新内容写入缓存 */ key: "getColumn",
            value: function getColumn(key) {
                var useCache = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                var ctx = this.context;
                var column = ctx.columnCache[key];
                var meta = ctx.getColumnMeta(key);
                var lastKeyNotEqual = !!column && meta.reloadKey !== ctx.lastReloadKey;
                // 是否需要刷新缓存
                var needFresh = !useCache || lastKeyNotEqual;
                if (!column) {
                    // 新建
                    column = this.getFreshColumn(key);
                    ctx.columnCache[key] = column;
                } else if (needFresh) {
                    // 更新缓存
                    var fresh = this.getFreshColumn(key);
                    Object.assign(column, fresh);
                }
                meta.reloadKey = ctx.lastReloadKey;
                return column;
            }
        },
        {
            key: "getFreshColumn",
            value: /** 跳过缓存获取最新的column */ function getFreshColumn(key) {
                var ctx = this.context;
                var index = ctx.columnKeyIndexMap[key];
                if (!isNumber(index)) {
                    throwError("column key ".concat(key, " is invalid"), _prefix);
                }
                var meta = ctx.getColumnMeta(key);
                var conf = ctx.columns[index];
                var width = isNumber(conf.width) ? conf.width : this.config.columnWidth;
                var beforeIgnoreLength = this.getBeforeIgnoreX(index).length;
                var isFixed = !!conf.fixed && conf.fixed !== TableColumnFixed.none;
                var isHeader = ctx.xHeaderKey === key;
                var realIndex = index - beforeIgnoreLength;
                var dataIndex = index - 1; // 1为左侧插入行头
                var column = {
                    key: key,
                    width: width,
                    index: realIndex,
                    dataIndex: isHeader ? -1 : dataIndex,
                    realIndex: index,
                    x: this.getBeforeSizeX(index),
                    config: conf,
                    isFixed: isFixed,
                    isEven: realIndex % 2 === 0,
                    isHeader: isHeader,
                    isFake: !!meta.fake
                };
                if (column.isFixed) {
                    var lf = ctx.leftFixedMap[key];
                    if (lf) column.fixedOffset = lf.viewPortOffset;
                    var rf = ctx.rightFixedMap[key];
                    if (rf) column.fixedOffset = rf.viewPortOffset;
                }
                return column;
            }
        },
        {
            key: "getCellKey",
            value: function getCellKey(rowKey, columnKey) {
                return _getCellKey(rowKey, columnKey);
            }
        },
        {
            /** 根据单元格key获取cell */ key: "getCellByStrKey",
            value: function getCellByStrKey(key) {
                var keys = _getCellKeysByStr(key);
                if (keys.length !== 2) {
                    throwError("key ".concat(key, " is invalid"), _prefix);
                }
                return this.getCell(keys[0], keys[1]);
            }
        },
        {
            /** 根据单元格类型获取其文本 */ key: "getText",
            value: function getText(cell) {
                var row = cell.row, column = cell.column;
                var text;
                if (row.isHeader) {
                    // 表头数据根据普通key注入
                    text = row.data[column.key];
                } else if (column.isHeader) {
                    text = String(cell.row.index - this.context.yHeaderKeys.length + 1);
                } else {
                    text = getNamePathValue(row.data, column.config.originalKey);
                }
                if (isString(text)) return text;
                return String(isTruthyOrZero(text) ? text : "");
            }
        },
        {
            key: "getCell",
            value: function getCell(rowKey, columnKey) {
                var useCache = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
                var ctx = this.context;
                var key = _getCellKey(rowKey, columnKey);
                var cell = ctx.cellCache[key];
                var lastKeyNotEqual = !!cell && getNamePathValue(cell, _TableMetaDataPlugin.RELOAD_KEY) !== ctx.lastReloadKey;
                // 是否需要刷新缓存
                var needFresh = !useCache || lastKeyNotEqual;
                if (!cell) {
                    // 新建
                    cell = this.getFreshCell(rowKey, columnKey, key);
                    cell.state = {};
                    ctx.cellCache[key] = cell;
                } else if (needFresh) {
                    // 更新缓存
                    var fresh = this.getFreshCell(rowKey, columnKey, key);
                    Object.assign(cell, fresh);
                }
                setNamePathValue(cell, _TableMetaDataPlugin.RELOAD_KEY, ctx.lastReloadKey);
                return cell;
            }
        },
        {
            key: "getFreshCell",
            value: function getFreshCell(rowKey, columnKey, key) {
                var ctx = this.context;
                var row = this.getRow(rowKey);
                var column = this.getColumn(columnKey);
                var config = ctx.cells[key] || {};
                var mergeData = ctx.mergeMapMain[key];
                var width = column.width;
                var height = row.height;
                if (mergeData) {
                    if (isNumber(mergeData.width)) width = mergeData.width;
                    if (isNumber(mergeData.height)) height = mergeData.height;
                }
                return {
                    row: row,
                    column: column,
                    key: key,
                    config: config,
                    isMount: false,
                    isFixed: column.isFixed || row.isFixed,
                    isCrossFixed: column.isFixed && row.isFixed,
                    isLastX: columnKey === ctx.lastColumnKey || columnKey === ctx.lastFixedColumnKey || !!ctx.lastMergeXMap[key],
                    isLastY: rowKey === ctx.lastRowKey || rowKey === ctx.lastFixedRowKey || !!ctx.lastMergeYMap[key],
                    width: width,
                    height: height,
                    text: ""
                };
            }
        },
        {
            key: "getNearCell",
            value: function getNearCell(arg) {
                var cell = arg.cell, _arg_position = arg.position, position = _arg_position === void 0 ? Position.right : _arg_position, filter = arg.filter;
                var _this_context = this.context, columns = _this_context.columns, data = _this_context.data;
                // 是否垂直方向
                var isVertical = position === Position.top || position === Position.bottom;
                // 区分获取前方还是后方单元格
                var isPrev = position === Position.left || position === Position.top;
                var row = cell.row, column = cell.column;
                var index = isVertical ? row.realIndex : column.realIndex;
                if (!isNumber(index)) return;
                var list = isVertical ? data : columns;
                // 由于进入循环后立即回获取下一项, 所以需要把索引边界扩大或减小1
                while(index <= list.length && index >= -1){
                    index = isPrev ? index - 1 : index + 1;
                    var next = list[index];
                    // 超出最后/前项时, 获取下一行或下一列
                    if (!next) {
                        var offset = isPrev ? -1 : 1;
                        // 下一项相关信息
                        var nextListIndex = isVertical ? column.realIndex : row.realIndex;
                        var nextListKey = void 0;
                        var nextItem = void 0;
                        var isIgnore = false;
                        try {
                            // 处理隐藏项和忽略项
                            do {
                                nextListIndex = nextListIndex + offset;
                                nextListKey = isVertical ? this.getKeyByColumnIndex(nextListIndex) : this.getKeyByRowIndex(nextListIndex);
                                nextItem = isVertical ? this.table.getColumn(nextListKey) : this.table.getRow(nextListKey);
                                isIgnore = isVertical ? this.context.isIgnoreColumn(nextListKey) : this.context.isIgnoreRow(nextListKey);
                            }while (// 隐藏或忽略项, 并且在有效索引内
                            isIgnore && nextListIndex < columns.length && nextListIndex > 0);
                        } catch (e) {
                        // 忽略getKeyByColumnIndex/getRow等api的越界错误
                        }
                        // 包含下一行/列, 跳转都首个或末尾
                        if (nextItem) {
                            index = isPrev ? list.length : -1;
                            if (isVertical) {
                                column = nextItem;
                            } else {
                                row = nextItem;
                            }
                            continue;
                        }
                        return;
                    }
                    var key = isVertical ? this.table.getKeyByRowData(next) : next.key;
                    var ignore = isVertical ? this.context.isIgnoreRow(key) : this.context.isIgnoreColumn(key);
                    if (ignore) continue;
                    var _cell = isVertical ? this.getCell(key, column.key) : this.getCell(row.key, key);
                    // 单元格是被合并项
                    if (this.context.mergeMapSub[_cell.key]) continue;
                    var skip = filter && !filter(_cell);
                    if (skip) continue;
                    return _cell;
                }
            }
        },
        {
            key: "getRowCells",
            value: function getRowCells(rowKey) {
                var _this = this;
                return this.context.allColumnKeys.map(function(columnKey) {
                    return _this.getCell(rowKey, columnKey);
                });
            }
        },
        {
            /** 获取指定列左侧的距离 */ key: "getBeforeSizeX",
            value: function getBeforeSizeX(index) {
                var columns = this.context.columns;
                var cur = columns[index];
                var key = cur.key;
                var fixedLeft = this.context.leftFixedMap[key];
                if (fixedLeft) {
                    return fixedLeft.offset;
                }
                var fixedRight = this.context.rightFixedMap[key];
                if (fixedRight) {
                    return fixedRight.offset;
                }
                var columnWidth = this.config.columnWidth;
                var max = Math.min(index, columns.length);
                var leftIgnoreLength = this.context.ignoreXList.filter(function(i) {
                    return i < index;
                }).length;
                // 预测左侧使用宽度
                var x = columnWidth * (index - leftIgnoreLength);
                for(var i = 0; i < max; i++){
                    var cur1 = columns[i];
                    if (this.context.isIgnoreColumn(cur1.key)) continue;
                    if (cur1.width) {
                        x = x + cur1.width - columnWidth;
                    }
                }
                return x;
            }
        },
        {
            /** 获取指定行上方的距离 */ key: "getBeforeSizeY",
            value: function getBeforeSizeY(index) {
                var _this = this;
                var key = this.getKeyByRowIndex(index);
                var fixedTop = this.context.topFixedMap[key];
                if (fixedTop) {
                    return fixedTop.offset;
                }
                var fixedBottom = this.context.bottomFixedMap[key];
                if (fixedBottom) {
                    return fixedBottom.offset;
                }
                var rowHeight = this.config.rowHeight;
                var rows = this.context.rows;
                var topIgnoreLength = this.context.ignoreYList.filter(function(i) {
                    return i < index;
                }).length;
                var y = rowHeight * (index - topIgnoreLength);
                // 对配置了高度的项进行修正
                this.context.rowConfigNumberKeys.forEach(function(k) {
                    var cur = rows[k];
                    if (_this.context.isIgnoreRow(k)) return;
                    var ind = _this.getIndexByRowKey(k);
                    // 大于当前行或非顶部固定项跳过
                    if (ind >= index && cur.fixed !== TableRowFixed.top) return;
                    if (cur.height) {
                        y = y + cur.height - rowHeight;
                    }
                });
                return y;
            }
        },
        {
            /** 二分查找, 包含了对无效项的处理, 返回分别表示:  小于, 等于, 大于, 无效 , 当处于无效项时, 需要向前左/右选区第一个有效项后继续 */ key: "binarySearch",
            value: function binarySearch(list, comparator) {
                var left = 0;
                var right = list.length - 1;
                while(left <= right){
                    var mid = Math.floor((left + right) / 2);
                    var compareResult = comparator(list[mid], mid);
                    if (compareResult === 0) {
                        return list[mid];
                    } else if (compareResult === 1) {
                        right = mid - 1;
                    } else if (compareResult === -1) {
                        left = mid + 1;
                    }
                    var midClone = mid;
                    // 向右查找有效项
                    while(compareResult === null && midClone < right){
                        midClone++;
                        compareResult = comparator(list[midClone], midClone);
                        if (compareResult === 0) {
                            return list[midClone];
                        } else if (compareResult === 1) {
                            right = midClone - 1;
                        } else if (compareResult === -1) {
                            left = midClone + 1;
                        }
                    }
                    // 向左查找有效项
                    midClone = mid;
                    while(compareResult === null && midClone > left){
                        midClone--;
                        compareResult = comparator(list[midClone], midClone);
                        if (compareResult === 0) {
                            return list[midClone];
                        } else if (compareResult === 1) {
                            right = midClone - 1;
                        } else if (compareResult === -1) {
                            left = midClone + 1;
                        }
                    }
                    if (compareResult === null) {
                        return;
                    }
                }
                return null;
            }
        },
        {
            key: "getKeyByRowIndex",
            value: function getKeyByRowIndex(ind) {
                var cur = this.context.data[ind];
                var key = cur[this.config.primaryKey];
                if (key === undefined) {
                    throwError("primaryKey: ".concat(this.config.primaryKey, " does not exist in data on row ").concat(ind), _prefix);
                }
                return key;
            }
        },
        {
            key: "getKeyByColumnIndex",
            value: function getKeyByColumnIndex(ind) {
                var cur = this.context.columns[ind];
                var key = cur.key;
                if (key === undefined) {
                    throwError("key: No key with index ".concat(ind, " exists"), _prefix);
                }
                return key;
            }
        },
        {
            key: "getIndexByRowKey",
            value: function getIndexByRowKey(key) {
                var ind = this.context.dataKeyIndexMap[key];
                if (ind === undefined) {
                    throwError("row key ".concat(key, " does not have a corresponding index"), _prefix);
                }
                return ind;
            }
        },
        {
            key: "getIndexByColumnKey",
            value: function getIndexByColumnKey(key) {
                var ind = this.context.columnKeyIndexMap[key];
                if (ind === undefined) {
                    throwError("column key ".concat(key, " does not have a corresponding index"), _prefix);
                }
                return ind;
            }
        },
        {
            key: "getKeyByRowData",
            value: function getKeyByRowData(cur) {
                var key = cur[this.config.primaryKey];
                if (key === undefined || key === null) {
                    throwError("No key obtained. ".concat(JSON.stringify(cur, null, 4)), _prefix);
                }
                return key;
            }
        },
        {
            key: "cellMergeHelper",
            value: /** 处理merge项, 防止cell列表重复推入相同项, 并在确保cell中包含被合并项的父项, 回调返回true时表示以处理, 需要跳过后续流程 */ function cellMergeHelper(list) {
                var _this = this;
                var existCache = {};
                return function(cell) {
                    if (existCache[cell.key]) return true;
                    existCache[cell.key] = true;
                    // 跳过被合并项, 并确保被合并项的主单元格存在
                    if (_this.getMergeData(cell)) {
                        list.push(cell);
                        return true;
                    }
                    var merged = _this.getMergedData(cell);
                    if (merged) {
                        var parent = _this.getCell(merged[0], merged[1]);
                        if (parent && !existCache[parent.key]) {
                            list.push(_this.getCell(merged[0], merged[1]));
                        }
                        return true;
                    }
                    return false;
                };
            }
        },
        {
            key: "getMergeData",
            value: function getMergeData(cell) {
                return this.context.mergeMapMain[cell.key];
            }
        },
        {
            key: "getMergedData",
            value: function getMergedData(cell) {
                return this.context.mergeMapSub[cell.key];
            }
        },
        {
            /** 获取指定索引前的所有忽略项 */ key: "getBeforeIgnoreX",
            value: function getBeforeIgnoreX(index) {
                return this.context.ignoreXList.filter(function(i) {
                    return i < index;
                });
            }
        },
        {
            /** 获取指定索引前的所有忽略项 */ key: "getBeforeIgnoreY",
            value: function getBeforeIgnoreY(index) {
                return this.context.ignoreYList.filter(function(i) {
                    return i < index;
                });
            }
        },
        {
            key: "getAttachPosition",
            value: function getAttachPosition(cell) {
                var rPos = this.getRowAttachPosition(cell.row);
                var cPos = this.getColumnAttachPosition(cell.column);
                var zIndex;
                if (!cell.isFixed) {
                    zIndex = "5"; // 高于其所在单元格对应层index.scss
                } else if (cell.isCrossFixed) {
                    zIndex = "31";
                } else if (cell.row.isFixed) {
                    zIndex = "21";
                } else {
                    zIndex = "11";
                }
                return {
                    left: cPos.left,
                    top: rPos.top,
                    width: cell.width,
                    height: cell.height,
                    zIndex: zIndex
                };
            }
        },
        {
            key: "getColumnAttachPosition",
            value: function getColumnAttachPosition(column) {
                return {
                    left: column.isFixed ? this.table.getX() + column.fixedOffset : column.x,
                    width: column.width,
                    // 固定列应高于交叉固定列,
                    zIndex: column.isFixed ? "31" : "21",
                    // 以下均设为零值
                    top: 0,
                    height: 0
                };
            }
        },
        {
            key: "getRowAttachPosition",
            value: function getRowAttachPosition(row) {
                return {
                    top: row.isFixed ? this.table.getY() + row.fixedOffset : row.y,
                    height: row.height,
                    // 固定行应高于交叉固定行, 非固定化应高于固定列
                    zIndex: row.isFixed ? "31" : "11",
                    // 以下均设为零值
                    left: 0,
                    width: 0
                };
            }
        },
        {
            key: "getRowMergeConfig",
            value: function getRowMergeConfig(key, config) {
                var _pConfig_rows;
                var pConfig = this.context.persistenceConfig;
                var pRowConfig = ((_pConfig_rows = pConfig.rows) === null || _pConfig_rows === void 0 ? void 0 : _pConfig_rows[key]) || {};
                return _object_spread({}, config, pRowConfig);
            }
        },
        {
            key: "getColumnMergeConfig",
            value: function getColumnMergeConfig(key, config) {
                var _pConfig_columns;
                var pConfig = this.context.persistenceConfig;
                var pColConfig = ((_pConfig_columns = pConfig.columns) === null || _pConfig_columns === void 0 ? void 0 : _pConfig_columns[key]) || {};
                return _object_spread({}, config, pColConfig);
            }
        },
        {
            key: "getCellMergeConfig",
            value: function getCellMergeConfig(key, config) {
                var _pConfig_cells;
                var pConfig = this.context.persistenceConfig;
                var pCellConfig = ((_pConfig_cells = pConfig.cells) === null || _pConfig_cells === void 0 ? void 0 : _pConfig_cells[key]) || {};
                return _object_spread({}, config, pCellConfig);
            }
        },
        {
            key: "getBaseConfig",
            value: function getBaseConfig(key) {
                var pConfig = this.context.persistenceConfig;
                var config = this.config;
                return pConfig[key] || config[key];
            }
        }
    ]);
    return _TableGetterPlugin;
}(TablePlugin);
