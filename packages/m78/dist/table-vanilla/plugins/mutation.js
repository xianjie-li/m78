import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _define_property from "@swc/helpers/src/_define_property.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { createRandString, deepClone, deleteNamePathValue, ensureArray, getNamePathValue, isArray, isNumber, isObject, recursionShakeEmpty, setNamePathValue, throwError, uniq } from "@m78/utils";
import { TableReloadLevel } from "./life.js";
import { _TablePrivateProperty, TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { _getCellKeysByStr, _prefix } from "../common.js";
import { _TableSortColumnPlugin } from "./sort-column.js";
/**
 * 所有config/data变更相关的操作, 变异操作应统一使用此处提供的api, 方便统一处理, 自动生成和处理历史等
 *
 * 配置变更/单元格值编辑/增删行列/行列排序/隐藏列
 * */ export var _TableMutationPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableMutationPlugin, TablePlugin);
    var _super = _create_super(_TableMutationPlugin);
    function _TableMutationPlugin() {
        _class_call_check(this, _TableMutationPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 每一次配置变更将变更的key记录, 通过记录来判断是否有变更项 */ _this.changedConfigKeys = [];
        /**
   * 设置ctx.persistenceConfig中的项, 并自动生成历史记录, 设置后, 原有值会被备份(引用类型会深拷贝), 并在执行undo操作时还原
   * */ _this.setPersistenceConfig = function(key, newValue, actionName) {
            var conf = _this.context.persistenceConfig;
            var old = getNamePathValue(conf, key);
            if (typeof old === "object") {
                old = deepClone(old);
            }
            var keyList = ensureArray(key);
            var first = keyList[0];
            var highlightItems = _this.getHighlightKeys(key, newValue);
            var redo = function() {
                setNamePathValue(conf, key, newValue);
                var value = getNamePathValue(conf, first);
                if (typeof value === "object") {
                    value = recursionShakeEmpty(deepClone(value));
                }
                var event = {
                    type: TableMutationType.config,
                    key: first,
                    value: value,
                    detailKeys: key
                };
                _this.changedConfigKeys.push(first);
                _this.table.event.mutation.emit(event);
                _this.table.reloadSync({
                    keepPosition: true,
                    level: TableReloadLevel.index
                });
                if (!_this.table.isTaking()) {
                    _this.highlightHandler(highlightItems);
                }
            };
            var undo = function() {
                if (old === undefined) {
                    deleteNamePathValue(conf, key);
                } else {
                    setNamePathValue(conf, key, old);
                }
                var value = getNamePathValue(conf, first);
                if (typeof value === "object") {
                    value = recursionShakeEmpty(deepClone(value));
                }
                var event = {
                    type: TableMutationType.config,
                    key: first,
                    value: value,
                    detailKeys: key
                };
                // 删除变更记录, 可能有多项, 若包含同名key, 每次只应删除一项
                var ind = _this.changedConfigKeys.indexOf(first);
                if (ind > -1) {
                    _this.changedConfigKeys.splice(ind, 1);
                }
                _this.table.event.mutation.emit(event);
                _this.table.reloadSync({
                    keepPosition: true,
                    level: TableReloadLevel.index
                });
                if (!_this.table.isTaking()) {
                    _this.highlightHandler(highlightItems);
                }
            };
            var action = {
                redo: redo,
                undo: undo,
                title: actionName
            };
            _this.table.history.redo(action);
        };
        /** 获取发生变更的持久化配置 */ _this.getChangedConfigKeys = function() {
            return uniq(_this.changedConfigKeys);
        };
        /** 获取当前持久化配置 */ _this.getPersistenceConfig = function() {
            return recursionShakeEmpty(deepClone(_this.context.persistenceConfig));
        };
        _this.addRow = function(data, to, insertAfter) {
            var index = -1;
            if (!to) {
                index = _this.context.topFixedList.length;
            } else {
                if (_this.context.yHeaderKeys.includes(to)) {
                    console.warn("[".concat(_prefix, "] addRow: can't add row to header"));
                    return;
                }
                var toRow = _object_spread({}, _this.table.getRow(to));
                index = toRow.isFixed ? _this.context.dataKeyIndexMap["".concat(toRow.key).concat(_TablePrivateProperty.ref)] : toRow.realIndex;
                if (insertAfter) {
                    index = index + 1;
                }
            }
            if (index < _this.context.yHeaderKeys.length) {
                index = _this.context.topFixedList.length;
            }
            if (index === -1) return;
            // 需要移动到的索引位置
            var list = ensureArray(data);
            var beforeItem = _this.context.data[index];
            if (beforeItem) {
                var beforeKey = beforeItem[_this.config.primaryKey];
                var row = _this.table.getRow(beforeKey);
                // 目标索引为fixed时,
                if (row && row.isFixed) {
                    var isFixedTop = _this.context.topFixedMap[beforeKey];
                    var isFixedBottom = _this.context.bottomFixedMap[beforeKey];
                    if (isFixedTop) {
                        index = _this.context.topFixedList.length;
                    }
                    if (isFixedBottom) {
                        index = _this.context.data.length - _this.context.bottomFixeList.length;
                    }
                }
            }
            var newData = list.map(function(i) {
                if (!isObject(i)) i = {};
                var key = i[_this.config.primaryKey];
                if (!key) {
                    return _object_spread_props(_object_spread({}, i), _define_property({}, _this.config.primaryKey, createRandString()));
                }
                return i;
            });
            _this.table.history.redo({
                title: _this.context.texts.addRow,
                redo: function() {
                    var _data;
                    (_data = _this.context.data).splice.apply(_data, [
                        index,
                        0
                    ].concat(_to_consumable_array(newData)));
                    _this.table.event.mutation.emit({
                        type: TableMutationType.data,
                        changeType: TableMutationDataType.add,
                        add: _to_consumable_array(newData),
                        remove: [],
                        move: []
                    });
                    _this.table.reloadSync({
                        keepPosition: true,
                        level: TableReloadLevel.index
                    });
                    if (!_this.table.isTaking()) {
                        _this.table.highlightRow(newData.map(function(i) {
                            return _this.table.getKeyByRowData(i);
                        }));
                    }
                },
                undo: function() {
                    _this.context.data.splice(index, newData.length);
                    _this.table.event.mutation.emit({
                        type: TableMutationType.data,
                        changeType: TableMutationDataType.remove,
                        add: [],
                        remove: _to_consumable_array(newData),
                        move: []
                    });
                    _this.table.reload({
                        keepPosition: true,
                        level: TableReloadLevel.index
                    });
                }
            });
        };
        _this.removeRow = function(key) {
            var list = _this.getIndexData(key).list;
            if (!list.length) return;
            var remove = list.filter(function(i) {
                return !i.ignore;
            }).map(function(i) {
                return i.data;
            });
            var rows = list.map(function(i) {
                return i.ins;
            });
            _this.table.history.redo({
                title: _this.context.texts.removeRow,
                redo: function() {
                    for(var i = list.length - 1; i >= 0; i--){
                        var cur = list[i];
                        _this.context.data.splice(cur.index, 1);
                    }
                    _this.table.event.mutation.emit({
                        type: TableMutationType.data,
                        changeType: TableMutationDataType.remove,
                        add: [],
                        remove: remove,
                        move: []
                    });
                    _this.table.reloadSync({
                        keepPosition: true,
                        level: TableReloadLevel.index
                    });
                },
                undo: function() {
                    for(var i = 0; i < list.length; i++){
                        var cur = list[i];
                        _this.context.data.splice(cur.index, 0, cur.data);
                    }
                    _this.table.event.mutation.emit({
                        type: TableMutationType.data,
                        changeType: TableMutationDataType.add,
                        add: remove,
                        remove: [],
                        move: []
                    });
                    _this.table.reloadSync({
                        keepPosition: true,
                        level: TableReloadLevel.index
                    });
                    if (!_this.table.isTaking()) {
                        _this.table.highlightRow(rows.map(function(i) {
                            return i.key;
                        }));
                    }
                }
            });
        };
        // 难点在于固定项/常规项间的转换, 以及固定项虚拟项的处理
        _this.moveRow = function(key, to, insertAfter) {
            if (_this.context.yHeaderKeys.includes(to)) {
                console.warn("[".concat(_prefix, "] moveRow: can't move row to header"));
                return;
            }
            _this.moveCommon(key, to, true, insertAfter);
        };
        _this.getValue = function(a, b) {
            var ref = _sliced_to_array(_this.valueActionGetter(a, b), 1), cell = ref[0];
            if (!cell) return;
            return getNamePathValue(cell.row.data, cell.column.config.originalKey);
        };
        _this.setValue = function(a, b, c) {
            var ref = _sliced_to_array(_this.valueActionGetter(a, b, c), 2), cell = ref[0], value = ref[1];
            if (!cell) return;
            var row = cell.row, column = cell.column;
            var oldValue = deepClone(getNamePathValue(row.data, column.config.originalKey));
            _this.table.history.redo({
                redo: function() {
                    setNamePathValue(row.data, column.config.originalKey, value);
                    var event = {
                        type: TableMutationType.value,
                        cell: cell,
                        value: value,
                        oldValue: oldValue
                    };
                    _this.table.event.mutation.emit(event);
                    _this.table.render();
                    _this.table.highlight(event.cell.key, false);
                },
                undo: function() {
                    setNamePathValue(row.data, column.config.originalKey, oldValue);
                    var event = {
                        type: TableMutationType.value,
                        cell: cell,
                        value: oldValue,
                        oldValue: value
                    };
                    _this.table.event.mutation.emit(event);
                    _this.table.render();
                    _this.table.highlight(event.cell.key, false);
                },
                title: _this.context.texts.setValue
            });
        };
        _this.moveColumn = function(key, to, insertAfter) {
            if (_this.context.xHeaderKey === to) {
                console.warn("[".concat(_prefix, "] moveColumn: can't move column to header"));
                return;
            }
            if (_this.context.hasMergeHeader) {
                console.warn("[".concat(_prefix, "] persistenceConfig.sortColumns: Can not sort column when has merge header"));
                return;
            }
            _this.moveCommon(key, to, false, insertAfter);
        };
        /** 对传入的items执行高亮 */ _this.highlightHandler = function(items) {
            var rows = items.rows, columns = items.columns, cells = items.cells;
            if (cells.length) {
                _this.table.highlight(cells.map(function(i) {
                    return i.key;
                }));
                return;
            }
            if (rows.length) {
                _this.table.highlightRow(rows.map(function(i) {
                    return i.key;
                }));
                return;
            }
            if (columns.length) {
                _this.table.highlightColumn(columns.map(function(i) {
                    return i.key;
                }));
                return;
            }
        };
        return _this;
    }
    var _proto = _TableMutationPlugin.prototype;
    _proto.init = function init() {
        this.sortColumn = this.getPlugin(_TableSortColumnPlugin);
    };
    _proto.beforeInit = function beforeInit() {
        this.methodMapper(this.table, [
            "getChangedConfigKeys",
            "getPersistenceConfig",
            "setPersistenceConfig",
            "addRow",
            "removeRow",
            "moveRow",
            "moveColumn",
            "setValue",
            "getValue", 
        ]);
    };
    _proto.reload = function reload() {
        var opt = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        if (opt.level === TableReloadLevel.full) {
            this.changedConfigKeys = [];
        }
    };
    /** 处理setValue/getValue的不同参数, 并返回cell和value */ _proto.valueActionGetter = function valueActionGetter(a, b, c) {
        var cell = null;
        var value;
        if (this.table.isCellLike(a)) {
            cell = a;
            value = b;
        } else if (this.table.isRowLike(a) && this.table.isColumnLike(b)) {
            cell = this.table.getCell(a.key, b.key);
            value = c;
        } else if (this.table.isTableKey(a) && this.table.isTableKey(b)) {
            cell = this.table.getCell(a, b);
            value = c;
        }
        if (!cell) return [
            cell,
            value
        ];
        if (cell.row.isHeader || cell.column.isHeader) return [
            null,
            value
        ];
        return [
            cell,
            value
        ];
    };
    /** move的通用逻辑, isRow控制是row还是column */ _proto.moveCommon = function moveCommon(key, to, isRow, insertAfter) {
        var _this = this;
        var indexData = this.getIndexData(key, isRow);
        if (!indexData.list.length) return;
        var moveList = this.getMoveData(indexData, to, isRow, insertAfter);
        if (!moveList) return;
        // 过滤掉ignore项
        var moveFilterData = moveList.filter(function(i) {
            return !i.cur.ignore;
        });
        var moveFilterIns = moveFilterData.map(function(i) {
            return i.cur.ins;
        });
        // 事件对象的move数据
        var moveEventData = moveFilterData.map(function(i) {
            return {
                from: i.from,
                to: i.to,
                data: i.data,
                dataFrom: i.dataFrom,
                dataTo: i.dataTo
            };
        });
        var action = {
            redo: function() {
                var data = isRow ? _this.context.data : _this.context.columns;
                _this.table.takeover(function() {
                    // 删除
                    for(var i = moveList.length - 1; i >= 0; i--){
                        var cur = moveList[i];
                        data.splice(cur.from, 1);
                    }
                    // 添加
                    for(var i1 = 0; i1 < moveList.length; i1++){
                        var cur1 = moveList[i1];
                        // 虚拟项不操作
                        if (isNumber(cur1.cur.refIndex)) continue;
                        data.splice(cur1.to, 0, cur1.data);
                    }
                    // 执行每个项的redo操作
                    moveList.forEach(function(i) {
                        return i.redo();
                    });
                    // 同步sortColumns
                    if (!isRow) {
                        _this.table.history.ignore(function() {
                            _this.setPersistenceConfig("sortColumns", _this.sortColumn.getColumnSortKeys());
                        });
                    }
                    _this.table.event.mutation.emit({
                        type: TableMutationType.data,
                        changeType: TableMutationDataType.move,
                        add: [],
                        remove: [],
                        move: _to_consumable_array(moveEventData)
                    });
                    _this.table.reloadSync({
                        keepPosition: true,
                        level: TableReloadLevel.index
                    });
                });
                if (!_this.table.isTaking()) {
                    isRow ? _this.table.highlightRow(moveFilterIns.map(function(i) {
                        return i.key;
                    })) : _this.table.highlightColumn(moveFilterIns.map(function(i) {
                        return i.key;
                    }));
                }
            },
            undo: function() {
                var data = isRow ? _this.context.data : _this.context.columns;
                _this.table.takeover(function() {
                    // 执行每个项的undo操作
                    moveList.slice().reverse().forEach(function(i) {
                        return i.undo();
                    });
                    // 删除添加的项
                    for(var i = moveList.length - 1; i >= 0; i--){
                        var cur = moveList[i];
                        // 虚拟项不操作
                        if (isNumber(cur.cur.refIndex)) continue;
                        data.splice(cur.to, 1);
                    }
                    // 恢复删除的项
                    for(var i1 = 0; i1 < moveList.length; i1++){
                        var cur1 = moveList[i1];
                        data.splice(cur1.from, 0, cur1.data);
                    }
                    // 同步sortColumns
                    if (!isRow) {
                        _this.table.history.ignore(function() {
                            _this.setPersistenceConfig("sortColumns", _this.sortColumn.getColumnSortKeys());
                        });
                    }
                    _this.table.event.mutation.emit({
                        type: TableMutationType.data,
                        changeType: TableMutationDataType.move,
                        add: [],
                        remove: [],
                        move: _to_consumable_array(moveEventData).map(function(i) {
                            return {
                                from: i.to,
                                to: i.from,
                                data: i.data,
                                dataFrom: i.dataTo,
                                dataTo: i.dataFrom
                            };
                        })
                    });
                    _this.table.reloadSync({
                        keepPosition: true,
                        level: TableReloadLevel.index
                    });
                });
                if (!_this.table.isTaking()) {
                    isRow ? _this.table.highlightRow(moveFilterIns.map(function(i) {
                        return i.key;
                    })) : _this.table.highlightColumn(moveFilterIns.map(function(i) {
                        return i.key;
                    }));
                }
            },
            title: isRow ? this.context.texts.moveRow : this.context.texts.moveColumn
        };
        this.table.history.redo(action);
    };
    /** 获取便于move操作的结构 */ _proto.getMoveData = function getMoveData(param, to) {
        var list = param.list, isRow = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true, insertAfter = arguments.length > 3 ? arguments[3] : void 0;
        var _this = this;
        var toIns = isRow ? _object_spread({}, this.table.getRow(to)) : _object_spread({}, this.table.getColumn(to));
        var indexMap = isRow ? this.context.dataKeyIndexMap : this.context.columnKeyIndexMap;
        var data = isRow ? this.context.data : this.context.columns;
        // 需要移动到的索引位置
        var index = toIns.isFixed ? indexMap["".concat(toIns.key).concat(_TablePrivateProperty.ref)] : toIns.realIndex;
        if (!isNumber(index)) {
            console.warn("[".concat(_prefix, "] move").concat(isRow ? "Row" : "Columns", ": Key ").concat(to, " is not found"));
            return;
        }
        if (insertAfter) {
            index += 1;
        }
        // 小于to的所有项
        var less = list.filter(function(i) {
            return i.index < index;
        });
        var toConf = _object_spread({}, toIns.config);
        var toIndex = index - less.length;
        var toDataIndex = toIns.dataIndex - less.length;
        if (insertAfter) {
            toDataIndex += 1;
        }
        // 处理isToFixed时, 添加的虚拟项索引
        var toFixedIndex = -1;
        // 小于目标索引的所有虚拟项
        var lessRemove = less.filter(function(i) {
            return isNumber(i.refIndex);
        });
        return list.map(function(i, ind) {
            var conf = _object_spread({}, i.ins.config);
            var hasFixed = !!toConf.fixed || !!conf.fixed;
            var fixedEqual = toConf.fixed === conf.fixed;
            // 由常规项转换为fixed项
            var isToFixed = hasFixed && !conf.fixed;
            // 由fixed项转换为常规项
            var isToNormal = hasFixed && !toConf.fixed;
            // 固定项到固定项
            var isFixedToFixed = !!conf.fixed && !!toConf.fixed;
            // 保留之前的ignore状态
            var prevIgnore = getNamePathValue(i.data, _TablePrivateProperty.ignore);
            // 备份添加的虚拟项索引, 在undo时删除
            var toFixedIndexBackup = -1;
            return {
                // 索引数据
                cur: i,
                // 源索引
                from: i.index,
                // 在源数据中的from
                dataFrom: i.ins.dataIndex,
                // 目标索引
                to: toIndex + ind - lessRemove.length,
                // 在源数据中的to
                dataTo: toDataIndex + ind,
                // 数据/列配置
                data: i.data,
                // 保持fixed配置与目标项一致, 并在常规项和fixed项间移动时生成和清理fixed ref项
                // 需要在执行完move操作后执行
                redo: function() {
                    // 虚拟项不操作
                    if (isNumber(i.refIndex)) return;
                    // 保持fixed一致
                    if (hasFixed && !fixedEqual) {
                        _this.table.history.ignore(function() {
                            _this.setPersistenceConfig([
                                isRow ? "rows" : "columns",
                                i.ins.key,
                                "fixed"
                            ], toConf.fixed);
                        });
                    }
                    // 转为fixed项或固定项到固定项
                    if (isToFixed || isFixedToFixed) {
                        // 添加虚拟fixed项, 确定需要添加到的索引位置
                        if (toFixedIndex === -1) {
                            toFixedIndex = _this.getFixedIndex(toIns.key, toConf.fixed);
                            if (insertAfter) {
                                toFixedIndex += 1;
                            }
                        }
                        var cloneData = _object_spread({}, i.data);
                        // 防止之前为ignore
                        deleteNamePathValue(cloneData, _TablePrivateProperty.ignore);
                        data.splice(toFixedIndex, 0, _object_spread_props(_object_spread({}, cloneData), _define_property({
                            fixed: toConf.fixed
                        }, _TablePrivateProperty.fake, true)));
                        toFixedIndexBackup = toFixedIndex;
                        // 确保当前为ignore
                        setNamePathValue(i.data, _TablePrivateProperty.ignore, true);
                        toFixedIndex++;
                    }
                    // 转为常规项
                    if (isToNormal) {
                        deleteNamePathValue(i.data, _TablePrivateProperty.ignore);
                    }
                },
                // 还原配置
                // 需要在move操作撤销前倒序执行
                undo: function() {
                    toFixedIndex = -1;
                    // 虚拟项在转换fixed为常规项时将其还原为fake
                    if (isNumber(i.refIndex)) {
                        if (isToNormal) {
                            setNamePathValue(i.data, _TablePrivateProperty.fake, true);
                        }
                        return;
                    }
                    // 还原fixed
                    if (hasFixed && !fixedEqual) {
                        _this.table.history.ignore(function() {
                            _this.setPersistenceConfig([
                                isRow ? "rows" : "columns",
                                i.ins.key,
                                "fixed"
                            ], conf.fixed);
                        });
                    }
                    if (isToFixed || isFixedToFixed) {
                        // 清理添加的虚拟项
                        data.splice(toFixedIndexBackup, 1);
                        // 还原ignore
                        if (prevIgnore) {
                            setNamePathValue(i.data, _TablePrivateProperty.ignore, true);
                        } else {
                            deleteNamePathValue(i.data, _TablePrivateProperty.ignore);
                        }
                    }
                    if (isToNormal) {
                        setNamePathValue(i.data, _TablePrivateProperty.ignore, true);
                    }
                }
            };
        });
    };
    /** 获取方便用于删除/移动等操作的索引数据信息 */ _proto.getIndexData = function getIndexData(key) {
        var isRow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        var _this = this;
        var list = ensureArray(key);
        list.forEach(function(key) {
            if (isRow && !_this.table.isRowExist(key)) {
                throwError("Row ".concat(key, " not exist"), _prefix);
            }
            if (!isRow && !_this.table.isColumnExist(key)) {
                throwError("Column ".concat(key, " not exist"), _prefix);
            }
        });
        // 相关项信息, 用于简化后续的增删操作
        var dataList = [];
        // 防止重复
        var existMap = {};
        var indexMap = isRow ? this.context.dataKeyIndexMap : this.context.columnKeyIndexMap;
        var data = isRow ? this.context.data : this.context.columns;
        // 查找出所有相关的项
        list.forEach(function(i) {
            var ins = isRow ? _this.table.getRow(i) : _this.table.getColumn(i);
            var _ins = _object_spread({}, ins);
            var refInd;
            // 固定项需要查找其关联的原始项
            if (ins.isFixed) {
                var refIndex = indexMap["".concat(ins.key).concat(_TablePrivateProperty.ref)];
                if (isNumber(refIndex)) {
                    var cur = data[refIndex];
                    if (existMap[refIndex]) return;
                    existMap[refIndex] = true;
                    if (cur) {
                        refInd = refIndex;
                        dataList.push({
                            index: refIndex,
                            data: _object_spread({}, cur),
                            ins: _ins,
                            ignore: true
                        });
                    }
                }
            }
            if (existMap[ins.realIndex]) return;
            existMap[ins.realIndex] = true;
            dataList.push({
                index: ins.realIndex,
                data: isRow ? _object_spread({}, ins.data) : ins.config,
                ins: _ins,
                refIndex: refInd
            });
        });
        // 根据索引排序
        dataList.sort(function(a, b) {
            return a.index - b.index;
        });
        return {
            /** 根据index排序后的列表 */ list: dataList
        };
    };
    /** 快速获取fixed虚拟项的index */ _proto.getFixedIndex = function getFixedIndex(key, fixed) {
        var ctx = this.context;
        var isRow = fixed === TableRowFixed.top || fixed === TableRowFixed.bottom;
        var list = isRow ? ctx.data : ctx.columns;
        if (fixed === TableRowFixed.top || fixed === TableColumnFixed.left) {
            for(var i = 0; i < list.length; i++){
                var cur = list[i];
                if (!getNamePathValue(cur, _TablePrivateProperty.fake)) return -1;
                if (isRow && this.table.getKeyByRowData(cur) === key) return i;
                if (!isRow && cur.key === key) return i;
            }
        }
        if (fixed === TableRowFixed.bottom || fixed === TableColumnFixed.right) {
            for(var i1 = list.length - 1; i1 >= 0; i1--){
                var cur1 = list[i1];
                if (!getNamePathValue(cur1, _TablePrivateProperty.fake)) return -1;
                if (isRow && this.table.getKeyByRowData(cur1) === key) return i1;
                if (!isRow && cur1.key === key) return i1;
            }
        }
        return -1;
    };
    /** 根据setPersistenceConfig入参 "尽可能合理" 的方式获取需要高亮的项 */ _proto.getHighlightKeys = function getHighlightKeys(key, newValue) {
        var _this = this;
        var rows = [];
        var columns = [];
        var cells = [];
        var keys = ensureArray(key);
        var first = keys[0];
        if (first === "columns" && keys.length > 1) {
            columns.push(this.table.getColumn(keys[1]));
        }
        if (first === "rows" && keys.length > 1) {
            rows.push(this.table.getRow(keys[1]));
        }
        if (first === "cells" && keys.length > 1) {
            var _keys = _getCellKeysByStr(String(keys[1]));
            if (_keys.length === 2) {
                cells.push(this.table.getCell(_keys[0], _keys[1]));
            }
        }
        // sortColumns变更时, 定位到第一个变更的列
        if (first === "sortColumns" && isArray(newValue) && newValue.length) {
            var old = getNamePathValue(this.context.persistenceConfig, first);
            if (isArray(old) && old.length) {
                for(var i = 0; i < old.length; i++){
                    var cur = old[i];
                    var nCur = newValue[i];
                    if (nCur === undefined) break;
                    if (cur !== nCur) {
                        columns.push(this.table.getColumn(nCur));
                        break;
                    }
                }
            }
        }
        // hideColumns变更时, 将原本隐藏但不再隐藏的列高亮
        if (first === "hideColumns" && isArray(newValue)) {
            var old1 = getNamePathValue(this.context.persistenceConfig, first);
            if (isArray(old1) && old1.length) {
                old1.forEach(function(i) {
                    var exist = newValue.find(function(it) {
                        return it === i;
                    });
                    if (!exist) {
                        columns.push(_this.table.getColumn(i));
                    }
                });
            }
        }
        return {
            rows: rows,
            columns: columns,
            cells: cells
        };
    };
    return _TableMutationPlugin;
}(TablePlugin);
export var TableMutationType;
(function(TableMutationType) {
    TableMutationType[/** 持久化配置变更 */ "config"] = "config";
    TableMutationType[/** 记录变更, 通常表示新增/删除/排序 */ "data"] = "data";
    TableMutationType[/** 单元格值变更 */ "value"] = "value";
})(TableMutationType || (TableMutationType = {}));
export var TableMutationDataType;
(function(TableMutationDataType) {
    TableMutationDataType["add"] = "add";
    TableMutationDataType["remove"] = "remove";
    TableMutationDataType["move"] = "move";
})(TableMutationDataType || (TableMutationDataType = {}));
