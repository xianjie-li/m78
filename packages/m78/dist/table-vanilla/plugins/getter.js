import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { getNamePathValue, isArray, isNumber, throwError } from "@m78/utils";
import { _TableViewportPlugin } from "./viewport.js";
import { _getBoundByPoint, _getCellKey, _getCellKeysByStr, _prefix } from "../common.js";
import clamp from "lodash/clamp.js";
import { _TablePrivateProperty, TableRowFixed } from "../types/base-type.js";
export var _TableGetterPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableGetterPlugin, TablePlugin);
    var _super = _create_super(_TableGetterPlugin);
    function _TableGetterPlugin() {
        _class_call_check(this, _TableGetterPlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _TableGetterPlugin.prototype;
    _proto.init = function init() {
        // 映射实现方法
        this.methodMapper(this.table, [
            "getBoundItems",
            "getViewportItems",
            "getAreaBound",
            "transformViewportPoint",
            "transformContentPoint",
            "getRow",
            "getColumn",
            "getCell",
            "getCellKey",
            "getCellByStrKey",
            "getKeyByRowIndex",
            "getKeyByColumnIndex",
            "getIndexByRowKey",
            "getIndexByColumnKey",
            "getKeyByRowData",
            "isRowExist",
            "isColumnExist",
            "getMergedData",
            "getMergeData", 
        ]);
    };
    _proto.transformViewportPoint = function transformViewportPoint(param) {
        var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1], fixedOffset = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
        var ctx = this.context;
        var lStart = 0;
        var lEnd = lStart + ctx.leftFixedWidth + fixedOffset;
        var tStart = 0;
        var tEnd = tStart + ctx.topFixedHeight + fixedOffset;
        var bEnd = this.table.height();
        var bStart = bEnd - ctx.bottomFixedHeight - fixedOffset;
        var rEnd = this.table.width();
        var rStart = rEnd - ctx.rightFixedWidth - fixedOffset;
        var isFixedLeft = x >= lStart && x <= lEnd;
        var isFixedTop = y >= tStart && y <= tEnd;
        var isFixedBottom = y >= bStart && y <= bEnd;
        var isFixedRight = x >= rStart && x <= rEnd;
        var realX = x + this.table.x();
        var realY = y + this.table.y();
        if (isFixedLeft) {
            realX = x;
        }
        if (isFixedRight) {
            var diffW = rEnd - x;
            realX = this.table.contentWidth() - diffW;
        }
        if (isFixedTop) {
            realY = y;
        }
        if (isFixedBottom) {
            var diffH = bEnd - y;
            realY = this.table.contentHeight() - diffH;
        }
        return {
            leftFixed: isFixedLeft,
            topFixed: isFixedTop,
            rightFixed: isFixedRight,
            bottomFixed: isFixedBottom,
            x: realX,
            y: realY,
            xy: [
                realX,
                realY
            ],
            originY: y,
            originX: x
        };
    };
    _proto.transformContentPoint = function transformContentPoint(pos) {
        var contW = this.table.contentWidth();
        var contH = this.table.contentHeight();
        // 基础位置, 限制在可用区域内
        var x = clamp(pos[0], 0, contW);
        var y = clamp(pos[1], 0, contH);
        var lStart = 0;
        var lEnd = this.context.leftFixedWidth;
        var tStart = 0;
        var tEnd = this.context.topFixedHeight;
        var rStart = contW - this.context.rightFixedWidth;
        var rEnd = contW;
        var bStart = contH - this.context.bottomFixedHeight;
        var bEnd = contH;
        var isFixedLeft = x >= lStart && x <= lEnd;
        var isFixedTop = y >= tStart && y <= tEnd;
        var isFixedRight = x >= rStart && x <= rEnd;
        var isFixedBottom = y >= bStart && y <= bEnd;
        var realX = x - this.table.x();
        var realY = y - this.table.y();
        if (isFixedLeft) {
            realX = x;
        }
        if (isFixedRight) {
            var diffW = rEnd - x;
            realX = this.table.width() - diffW;
        }
        if (isFixedTop) {
            realY = y;
        }
        if (isFixedBottom) {
            var diffH = bEnd - y;
            realY = this.table.height() - diffH;
        }
        return {
            leftFixed: isFixedLeft,
            topFixed: isFixedTop,
            rightFixed: isFixedRight,
            bottomFixed: isFixedBottom,
            x: realX,
            y: realY,
            xy: [
                realX,
                realY
            ],
            originY: pos[1],
            originX: pos[0]
        };
    };
    _proto.getAreaBound = function getAreaBound(p1, p2) {
        p2 = p2 || p1;
        return this.getBoundItems(_getBoundByPoint(p1, p2));
    };
    _proto.getBoundItems = function getBoundItems(target) {
        var skipFixed = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        var ref = this.getBoundItemsInner(target, skipFixed), rows = ref.rows, columns = ref.columns, cells = ref.cells;
        return {
            rows: rows,
            columns: columns,
            cells: cells
        };
    };
    /**
   * 内部使用的getBoundItems, 包含了startRowIndex等额外返回
   * - 注意, 返回的index均对应dataFixedSortList/columnsFixedSortList而不是配置中的data
   * */ _proto.getBoundItemsInner = function getBoundItemsInner(target) {
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
        var _context = this.context, data = _context.data, columns = _context.columns;
        // 对行或列执行二分搜索
        var binarySearchHandle = function(isRow) {
            return function(item, index) {
                var key = isRow ? item[_this.config.primaryKey] : item.key;
                if (getNamePathValue(item, _TablePrivateProperty.ignore)) return null;
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
                if (getNamePathValue(data[i], _TablePrivateProperty.ignore)) continue;
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
                if (getNamePathValue(columns[i1], _TablePrivateProperty.ignore)) continue;
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
                if (getNamePathValue(columns[i], _TablePrivateProperty.ignore)) continue;
                slice.push(_this.getCell(row.key, _this.getKeyByColumnIndex(i)));
            }
            slice.forEach(function(cell) {
                if (getNamePathValue(cell.row.data, _TablePrivateProperty.ignore)) return;
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
    };
    _proto.getViewportItems = function getViewportItems() {
        var _this = this;
        var _columns, _columns1, _rows, _rows1;
        var table = this.table;
        var ctx = this.context;
        var viewport = this.getPlugin(_TableViewportPlugin);
        // 截取非fixed区域内容
        var x = Math.min(table.x() + ctx.leftFixedWidth, viewport.contentWidth());
        var y = Math.min(table.y() + ctx.topFixedHeight, viewport.contentHeight());
        var width = Math.max(this.table.width() - ctx.rightFixedWidth - ctx.leftFixedWidth, 0);
        var height = Math.max(this.table.height() - ctx.bottomFixedHeight - ctx.topFixedHeight, 0);
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
            return !getNamePathValue(i.config, _TablePrivateProperty.ignore);
        });
        var rf = ctx.rightFixedList.map(function(key) {
            return _this.getColumn(key);
        }).filter(function(i) {
            return !getNamePathValue(i.config, _TablePrivateProperty.ignore);
        });
        _to_consumable_array(lf).concat(_to_consumable_array(rf)).forEach(function(column) {
            // 截取固定列中可见单元格
            for(var i = startRowIndex; i <= endRowIndex; i++){
                var cell = _this.getCell(_this.getKeyByRowIndex(i), column.key);
                if (cell.row.isFixed || getNamePathValue(cell.row.data, _TablePrivateProperty.ignore)) continue;
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
                if (getNamePathValue(curConf, _TablePrivateProperty.ignore)) continue;
                var cell = _this.getCell(row.key, _this.getKeyByColumnIndex(i));
                if (cell.column.isFixed) continue;
                if (push(cell)) continue;
                cells.push(cell);
            }
            // 添加四个角的固定项
            _to_consumable_array(ctx.leftFixedList).concat(_to_consumable_array(ctx.rightFixedList)).forEach(function(key) {
                var cell = _this.getCell(row.key, key);
                if (getNamePathValue(cell.column.config, _TablePrivateProperty.ignore)) return;
                if (getNamePathValue(cell.row.data, _TablePrivateProperty.ignore)) return;
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
    };
    /** 获取指定行的TableRow */ _proto.getRow = function getRow(key) {
        var ctx = this.context;
        var cache = ctx.rowCache[key];
        if (cache) return cache;
        var index = ctx.dataKeyIndexMap[key];
        if (!isNumber(index)) {
            throwError("row key ".concat(key, " is invalid"), _prefix);
        }
        var conf = ctx.rows[key] || {};
        var height = isNumber(conf.height) ? conf.height : this.config.rowHeight;
        var data = ctx.data[index];
        var isFixed = !!conf.fixed;
        var isHeader = ctx.yHeaderKeys.includes(key);
        var beforeIgnoreLength = this.getBeforeIgnoreY(index).length;
        var realIndex = index - beforeIgnoreLength;
        var dataIndex = index - ctx.topFixedList.length;
        var fIndex = ctx.dataKeyIndexMap["".concat(key).concat(_TablePrivateProperty.ref)];
        if (isFixed) {
            if (isNumber(fIndex)) {
                dataIndex = fIndex - ctx.topFixedList.length;
            }
        }
        var hasRef = isNumber(fIndex);
        // 数据被标记为fake, 并且没有ref才视为fake数据, 因为对于用户来说, 包含ref数据指向一个有效数据
        var isFake = !!getNamePathValue(data, _TablePrivateProperty.fake) && !hasRef;
        var row = {
            key: data[this.config.primaryKey],
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
            isFake: isFake
        };
        if (row.isFixed) {
            var tf = ctx.topFixedMap[key];
            if (tf) row.fixedOffset = tf.viewPortOffset;
            var bf = ctx.bottomFixedMap[key];
            if (bf) row.fixedOffset = bf.viewPortOffset;
        }
        ctx.rowCache[key] = row;
        return row;
    };
    _proto.getColumn = function getColumn(key) {
        var ctx = this.context;
        var cache = ctx.columnCache[key];
        if (cache) return cache;
        var index = ctx.columnKeyIndexMap[key];
        if (!isNumber(index)) {
            throwError("column key ".concat(key, " is invalid"), _prefix);
        }
        var conf = ctx.columns[index];
        var width = isNumber(conf.width) ? conf.width : this.config.columnWidth;
        var beforeIgnoreLength = this.getBeforeIgnoreX(index).length;
        var isFixed = !!conf.fixed;
        var isHeader = ctx.xHeaderKey === key;
        var realIndex = index - beforeIgnoreLength;
        var dataIndex = index - ctx.leftFixedList.length;
        var fIndex = ctx.columnKeyIndexMap["".concat(key).concat(_TablePrivateProperty.ref)];
        if (isFixed) {
            if (isNumber(fIndex)) {
                dataIndex = fIndex - ctx.leftFixedList.length;
            }
        }
        var hasRef = isNumber(fIndex);
        // 数据被标记为fake, 并且没有ref才视为fake数据, 因为对于用户来说, 包含ref数据指向一个有效数据
        var isFake = !!getNamePathValue(conf, _TablePrivateProperty.fake) && !hasRef;
        var column = {
            key: conf.key,
            width: width,
            index: realIndex,
            dataIndex: isHeader ? -1 : dataIndex,
            realIndex: index,
            x: this.getBeforeSizeX(index),
            config: conf,
            isFixed: isFixed,
            isEven: realIndex % 2 === 0,
            isHeader: isHeader,
            isFake: isFake
        };
        if (column.isFixed) {
            var lf = ctx.leftFixedMap[key];
            if (lf) column.fixedOffset = lf.viewPortOffset;
            var rf = ctx.rightFixedMap[key];
            if (rf) column.fixedOffset = rf.viewPortOffset;
        }
        ctx.columnCache[key] = column;
        return column;
    };
    _proto.getCellKey = function getCellKey(rowKey, columnKey) {
        return _getCellKey(rowKey, columnKey);
    };
    /** 根据单元格key获取cell */ _proto.getCellByStrKey = function getCellByStrKey(key) {
        var keys = _getCellKeysByStr(key);
        if (keys.length !== 2) {
            throwError("key ".concat(key, " is invalid"), _prefix);
        }
        return this.getCell(keys[0], keys[1]);
    };
    /** 获取指定行, 列坐标对应的TableCell */ _proto.getCell = function getCell(rowKey, columnKey) {
        var key = _getCellKey(rowKey, columnKey);
        var ctx = this.context;
        var cache = ctx.cellCache[key];
        if (cache) return cache;
        var row = this.getRow(rowKey);
        var column = this.getColumn(columnKey);
        var config = ctx.cells[key] || {};
        var state = ctx.cellStateCaChe[key];
        if (!state) {
            ctx.cellStateCaChe[key] = {};
            state = ctx.cellStateCaChe[key];
        }
        var cell = {
            row: row,
            column: column,
            key: key,
            config: config,
            isMount: false,
            text: "",
            isFixed: column.isFixed || row.isFixed,
            isCrossFixed: column.isFixed && row.isFixed,
            isLastX: columnKey === ctx.lastColumnKey || columnKey === ctx.lastFixedColumnKey || !!ctx.lastMergeXMap[key],
            isLastY: rowKey === ctx.lastRowKey || rowKey === ctx.lastFixedRowKey || !!ctx.lastMergeYMap[key],
            state: state
        };
        ctx.cellCache[key] = cell;
        return cell;
    };
    /** 获取指定列左侧的距离 */ _proto.getBeforeSizeX = function getBeforeSizeX(index) {
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
            if (getNamePathValue(cur1, _TablePrivateProperty.ignore)) continue;
            if (cur1.width) {
                x = x + cur1.width - columnWidth;
            }
        }
        return x;
    };
    /** 获取指定行上方的距离 */ _proto.getBeforeSizeY = function getBeforeSizeY(index) {
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
            if (getNamePathValue(cur, _TablePrivateProperty.ignore)) return;
            var ind = _this.getIndexByRowKey(k);
            // 大于当前行或非顶部固定项跳过
            if (ind >= index && cur.fixed !== TableRowFixed.top) return;
            if (cur.height) {
                y = y + cur.height - rowHeight;
            }
        });
        return y;
    };
    /** 二分查找, 包含了对无效项的处理, 返回分别表示:  小于, 等于, 大于, 无效 , 当处于无效项时, 需要向前左/右选区第一个有效项后继续 */ _proto.binarySearch = function binarySearch(list, comparator) {
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
    };
    _proto.getKeyByRowIndex = function getKeyByRowIndex(ind) {
        var cur = this.context.data[ind];
        var key = cur[this.config.primaryKey];
        if (key === undefined) {
            throwError("primaryKey: ".concat(this.config.primaryKey, " does not exist in data on row ").concat(ind), _prefix);
        }
        return key;
    };
    _proto.getKeyByColumnIndex = function getKeyByColumnIndex(ind) {
        var cur = this.context.columns[ind];
        var key = cur.key;
        if (key === undefined) {
            throwError("key: No key with index ".concat(ind, " exists"), _prefix);
        }
        return key;
    };
    _proto.getIndexByRowKey = function getIndexByRowKey(key) {
        var ind = this.context.dataKeyIndexMap[key];
        if (key === undefined) {
            throwError("row key ".concat(key, " does not have a corresponding index"), _prefix);
        }
        return ind;
    };
    _proto.getIndexByColumnKey = function getIndexByColumnKey(key) {
        var ind = this.context.columnKeyIndexMap[key];
        if (key === undefined) {
            throwError("column key ".concat(key, " does not have a corresponding index"), _prefix);
        }
        return ind;
    };
    _proto.getKeyByRowData = function getKeyByRowData(cur) {
        var key = cur[this.config.primaryKey];
        if (key === undefined || key === null) {
            throwError("No key obtained. ".concat(JSON.stringify(cur, null, 4)), _prefix);
        }
        return key;
    };
    _proto.isColumnExist = function isColumnExist(key) {
        return this.context.columnKeyIndexMap[key] !== undefined;
    };
    _proto.isRowExist = function isRowExist(key) {
        return this.context.dataKeyIndexMap[key] !== undefined;
    };
    _proto.isColumnExistByIndex = function isColumnExistByIndex(ind) {
        return this.context.columns[ind] !== undefined;
    };
    _proto.isRowExistByIndex = function isRowExistByIndex(ind) {
        return this.context.data[ind] !== undefined;
    };
    /** 处理merge项, 防止cell列表重复推入相同项, 并在确保cell中包含被合并项的父项, 回调返回true时表示以处理, 需要跳过后续流程 */ _proto.cellMergeHelper = function cellMergeHelper(list) {
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
    };
    _proto.getMergeData = function getMergeData(cell) {
        return this.context.mergeMapMain[cell.key];
    };
    _proto.getMergedData = function getMergedData(cell) {
        return this.context.mergeMapSub[cell.key];
    };
    /** 获取指定索引前的所有忽略项 */ _proto.getBeforeIgnoreX = function getBeforeIgnoreX(index) {
        return this.context.ignoreXList.filter(function(i) {
            return i < index;
        });
    };
    /** 获取指定索引前的所有忽略项 */ _proto.getBeforeIgnoreY = function getBeforeIgnoreY(index) {
        return this.context.ignoreYList.filter(function(i) {
            return i < index;
        });
    };
    return _TableGetterPlugin;
}(TablePlugin);
