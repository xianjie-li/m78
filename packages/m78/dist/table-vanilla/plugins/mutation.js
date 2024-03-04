import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { createRandString, simplyDeepClone, deleteNamePathValue, ensureArray, getNamePathValue, isArray, isObject, isString, isTruthyOrZero, recursionShakeEmpty, setNamePathValue, throwError, uniq } from "@m78/utils";
import { TableReloadLevel } from "./life.js";
import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { _getCellKey, _getCellKeysByStr, _prefix } from "../common.js";
import { _TableSortColumnPlugin } from "./sort-column.js";
import { _TableFormPlugin } from "./form.js";
/**
 * config/data变更相关的操作, 变异操作尽量集中在此处并需要新增和触发 TableMutationDataType 事件/处理操作历史等
 *
 * 配置变更/单元格值编辑/增删行列/行列排序/隐藏列
 *
 * 其他: soft-remove.ts 由于并不会直接操作数据, 在单独插件维护, 但仍触发mutation事件
 * */ export var _TableMutationPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableMutationPlugin, TablePlugin);
    var _super = _create_super(_TableMutationPlugin);
    function _TableMutationPlugin() {
        _class_call_check(this, _TableMutationPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 每一次配置变更将变更的key记录, 通过记录来判断是否有变更项 */ _define_property(_assert_this_initialized(_this), "changedConfigKeys", []);
        _define_property(_assert_this_initialized(_this), "sortColumn", void 0);
        _define_property(_assert_this_initialized(_this), "form", void 0);
        // 记录变更过的行
        _define_property(_assert_this_initialized(_this), "changedRows", {});
        /**
   * 设置ctx.persistenceConfig中的项, 并自动生成历史记录, 设置后, 原有值会被备份(引用类型会深拷贝), 并在执行undo操作时还原
   * */ _define_property(_assert_this_initialized(_this), "setPersistenceConfig", function(key, newValue, actionName) {
            var conf = _this.context.persistenceConfig;
            var old = getNamePathValue(conf, key);
            if (typeof old === "object") {
                old = simplyDeepClone(old);
            }
            var keyList = ensureArray(key);
            var first = keyList[0];
            var highlightItems = _this.getHighlightKeys(key, newValue);
            var redo = function() {
                setNamePathValue(conf, key, newValue);
                var value = getNamePathValue(conf, first);
                if (typeof value === "object") {
                    value = recursionShakeEmpty(simplyDeepClone(value));
                }
                var event = {
                    type: "config",
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
                    value = recursionShakeEmpty(simplyDeepClone(value));
                }
                var event = {
                    type: "config",
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
        });
        /** 获取发生变更的持久化配置 */ _define_property(_assert_this_initialized(_this), "getChangedConfigKeys", function() {
            return uniq(_this.changedConfigKeys);
        });
        /** 获取当前持久化配置 */ _define_property(_assert_this_initialized(_this), "getPersistenceConfig", function() {
            return recursionShakeEmpty(simplyDeepClone(_this.context.persistenceConfig));
        });
        _define_property(_assert_this_initialized(_this), "addRow", function(data, to, insertAfter) {
            var index = -1;
            if (!to) {
                // 常规项第一项
                index = _this.context.topFixedList.length;
            } else {
                if (_this.context.yHeaderKeys.includes(to)) {
                    console.warn("[".concat(_prefix, "] addRow: can't add row to header"));
                    return;
                }
                var toRow = _object_spread({}, _this.table.getRow(to));
                if (toRow.isFixed) {
                    console.warn("[".concat(_prefix, "] addRow: can't add row to fixed row"));
                    return;
                }
                index = toRow.realIndex;
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
            var newData = list.map(function(i) {
                if (!isObject(i)) i = {};
                var key = i[_this.config.primaryKey];
                // 使用传入的key或随机分配一个
                var pKey = isTruthyOrZero(key) ? key : createRandString();
                _this.context.getRowMeta(pKey).new = true;
                return _object_spread_props(_object_spread({}, i), _define_property({}, _this.config.primaryKey, pKey));
            });
            _this.table.history.redo({
                title: _this.context.texts["add row"],
                redo: function() {
                    var _this_context_data;
                    (_this_context_data = _this.context.data).splice.apply(_this_context_data, [
                        index,
                        0
                    ].concat(_to_consumable_array(newData)));
                    _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                        changeType: "add",
                        add: _to_consumable_array(newData)
                    }));
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
                    _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                        changeType: "remove",
                        remove: _to_consumable_array(newData)
                    }));
                    _this.table.reloadSync({
                        keepPosition: true,
                        level: TableReloadLevel.index
                    });
                }
            });
        });
        _define_property(_assert_this_initialized(_this), "removeRow", function(key) {
            var list = _this.getIndexData(key).list;
            if (!list.length) return;
            var remove = list.map(function(i) {
                return i.data;
            });
            var rows = list.map(function(i) {
                return i.ins;
            });
            var rowKeys = rows.map(function(i) {
                return i.key;
            });
            var cellKeys = rows.map(function(i) {
                return _this.context.allColumnKeys.map(function(cKey) {
                    return _getCellKey(i.key, cKey);
                });
            }).flat();
            _this.table.history.redo({
                title: _this.context.texts["remove row"],
                redo: function() {
                    // 移除删除项的选中状态
                    _this.table.unselectRows(rowKeys);
                    _this.table.unselectCells(cellKeys);
                    for(var i = list.length - 1; i >= 0; i--){
                        var cur = list[i];
                        _this.context.data.splice(cur.index, 1);
                    }
                    _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                        changeType: "remove",
                        remove: remove
                    }));
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
                    _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                        changeType: "add",
                        add: remove
                    }));
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
        });
        // 难点在于固定项/常规项间的转换, 以及固定项虚拟项的处理
        _define_property(_assert_this_initialized(_this), "moveRow", function(key, to, insertAfter) {
            if (_this.context.yHeaderKeys.includes(to)) {
                console.warn("[".concat(_prefix, "] moveRow: can't move row to header"));
                return;
            }
            _this.moveCommon(key, to, true, insertAfter);
        });
        _define_property(_assert_this_initialized(_this), "getValue", function(a, b) {
            var _this_valueActionGetter = _sliced_to_array(_this.valueActionGetter(a, b), 1), cell = _this_valueActionGetter[0];
            if (!cell) return;
            return getNamePathValue(cell.row.data, cell.column.config.originalKey);
        });
        _define_property(_assert_this_initialized(_this), "setValue", function(a, b, c) {
            // eslint-disable-next-line prefer-const
            var _this_valueActionGetter = _sliced_to_array(_this.valueActionGetter(a, b, c), 2), cell = _this_valueActionGetter[0], value = _this_valueActionGetter[1];
            if (!cell) return;
            if (!_this.form.validCheck(cell)) return;
            if (isString(value)) {
                value = value.trim();
            }
            var row = cell.row, column = cell.column;
            // 行未变更过, 将其完全clone, 避免更改原数据, 此外, 避免了在初始化阶段克隆所有数据导致性能损耗
            if (!_this.changedRows[row.key] && !_this.context.getRowMeta(row.key).new // 新增行不clone
            ) {
                _this.cloneAndSetRowData(row);
            }
            var ov = getNamePathValue(row.data, column.config.originalKey);
            var oldValue = typeof ov === "object" ? simplyDeepClone(ov) : ov;
            _this.table.history.redo({
                redo: function() {
                    setNamePathValue(row.data, column.config.originalKey, value);
                    var event = {
                        type: "value",
                        cell: cell,
                        value: value,
                        oldValue: oldValue
                    };
                    _this.table.event.mutation.emit(event);
                    _this.table.render();
                    _this.table.highlight(event.cell.key, false);
                },
                undo: function() {
                    if (oldValue === undefined) {
                        deleteNamePathValue(row.data, column.config.originalKey);
                    } else {
                        setNamePathValue(row.data, column.config.originalKey, oldValue);
                    }
                    var event = {
                        type: "value",
                        cell: cell,
                        value: oldValue,
                        oldValue: value
                    };
                    _this.table.event.mutation.emit(event);
                    _this.table.render();
                    _this.table.highlight(event.cell.key, false);
                },
                title: _this.context.texts["set value"]
            });
        });
        _define_property(_assert_this_initialized(_this), "moveColumn", function(key, to, insertAfter) {
            if (_this.context.xHeaderKey === to) {
                console.warn("[".concat(_prefix, "] moveColumn: can't move column to header"));
                return;
            }
            if (_this.context.hasMergeHeader) {
                console.warn("[".concat(_prefix, "] persistenceConfig.sortColumns: Can not sort column when has merge header"));
                return;
            }
            _this.moveCommon(key, to, false, insertAfter);
        });
        /** 对传入的items执行高亮 */ _define_property(_assert_this_initialized(_this), "highlightHandler", function(items) {
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
        });
        return _this;
    }
    _create_class(_TableMutationPlugin, [
        {
            key: "init",
            value: function init() {
                this.form = this.getPlugin(_TableFormPlugin);
                this.sortColumn = this.getPlugin(_TableSortColumnPlugin);
            }
        },
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.methodMapper(this.table, [
                    "getChangedConfigKeys",
                    "getPersistenceConfig",
                    "setPersistenceConfig",
                    "addRow",
                    "removeRow",
                    "moveRow",
                    "moveColumn",
                    "setValue",
                    "getValue"
                ]);
            }
        },
        {
            key: "reload",
            value: function reload() {
                var opt = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
                if (opt.level === TableReloadLevel.full) {
                    this.changedConfigKeys = [];
                }
            }
        },
        {
            key: "cloneAndSetRowData",
            value: /** 克隆并重新设置row的data, 防止变更原数据, 主要用于延迟clone, 可以在数据量较大时提升初始化速度  */ function cloneAndSetRowData(row) {
                var cloneData = simplyDeepClone(row.data);
                var ind = this.context.dataKeyIndexMap[row.key];
                row.data = cloneData;
                this.context.data[ind] = cloneData;
            }
        },
        {
            key: "valueActionGetter",
            value: /** 处理setValue/getValue的不同参数, 并返回cell和value */ function valueActionGetter(a, b, c) {
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
            }
        },
        {
            key: "moveCommon",
            value: /** move的通用逻辑, isRow控制是row还是column */ function moveCommon(key, to, isRow, insertAfter) {
                var _this = this;
                var list = this.getIndexData(key, isRow).list;
                if (!list.length) return;
                var toIns = isRow ? _object_spread({}, this.table.getRow(to)) : _object_spread({}, this.table.getColumn(to));
                var toFixedConf = toIns.config.fixed;
                // 是否是固定项
                var isToFixed = toIns.isFixed;
                // 插入到数据中的目标索引
                var toIndex = toIns.realIndex + (insertAfter ? 1 : 0);
                // 小于目标位置的项总数, 用来修正最终的目标位置
                var lessCount = 0;
                // 目标项在实际数据中的位置
                var toDataIndex = toIns.dataIndex + (insertAfter ? 1 : 0);
                // 小于目标在数据中实际位置的总数
                var lessToDataCount = 0;
                // 需要移除的项 (倒序)
                var removeList = [];
                // 所有待移动的项
                var moveList = [];
                for(var i = 0; i < list.length; i++){
                    var cur = list[i];
                    // 每一个在前方的删除项都使目标索引修正减一
                    if (cur.index < toIndex) {
                        lessCount++;
                    }
                    // dataIndex可以排除非数据的改动
                    if (cur.ins.dataIndex < toDataIndex) {
                        lessToDataCount++;
                    }
                    // 需要从大到小排序,方便删除时不打乱索引
                    removeList.unshift(cur);
                    moveList.push(cur);
                }
                // 修正目标索引
                toIndex -= lessCount;
                toDataIndex -= lessToDataCount;
                // 参与操作的数据源
                var dataList = isRow ? this.context.data : this.context.columns;
                // 所有新增项
                var addList = [];
                // 用于事件通知的列表
                var eventList = [];
                // 生成addList列表, 处理toFixed项的占位项
                moveList.forEach(function(i, ind) {
                    // 由fixed项转换为常规项
                    var itemIsToFixed = !i.ins.isFixed && toIns.isFixed;
                    // 由fixed项转换为常规项
                    var isToNormal = i.ins.isFixed && !toIns.isFixed;
                    // 固定项到固定项
                    var isFixedToFixed = i.ins.isFixed && toIns.isFixed;
                    var oData = {
                        data: i.originalData,
                        formIndex: i.index,
                        index: toIndex + ind,
                        key: i.ins.key,
                        isToNormal: isToNormal,
                        isFixedToFixed: isFixedToFixed,
                        isToFixed: itemIsToFixed,
                        dataFrom: i.ins.dataIndex,
                        dataTo: toDataIndex + ind,
                        fixedConf: i.ins.config.fixed
                    };
                    addList.push(oData);
                    eventList.push(oData);
                });
                // 按索引顺序排序
                addList.sort(function(a, b) {
                    return a.index - b.index;
                });
                // 通知autoMove
                if (isRow) {
                    this.autoMoveHandle();
                }
                var redo = function() {
                    _this.table.takeover(function() {
                        var _loop = function(ind) {
                            var i = addList[ind];
                            // 添加到list
                            dataList.splice(i.index, 0, i.data);
                            // 更新fixed为目标配置
                            if (isToFixed || i.isToNormal) {
                                // 同步固定项配置
                                _this.table.history.ignore(function() {
                                    _this.setPersistenceConfig([
                                        isRow ? "rows" : "columns",
                                        i.key,
                                        "fixed"
                                    ], i.isToNormal // 转为常规项时, 为防止项本身配置为fixed, 通过传入none覆盖
                                     ? toFixedConf || TableColumnFixed.none : toFixedConf);
                                });
                            }
                            var meta = isRow ? _this.context.getRowMeta(i.key) : _this.context.getColumnMeta(i.key);
                            // 更新meta信息
                            // 转换为fixed项
                            if (isToFixed) {
                                meta.fixed = true;
                            }
                            // fixed项转换为常规项
                            if (i.isToNormal) {
                                meta.fixed = false;
                            }
                        };
                        // 移除项
                        for(var i = 0; i < removeList.length; i++){
                            var cur = removeList[i];
                            dataList.splice(cur.index, 1);
                        }
                        for(var ind = 0; ind < addList.length; ind++)_loop(ind);
                        // 行变更进行事件通知, 列变更同步sortColumns
                        if (isRow) {
                            _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                                changeType: "move",
                                move: eventList.map(function(mi) {
                                    return {
                                        from: mi.formIndex,
                                        to: mi.index,
                                        dataFrom: mi.dataFrom,
                                        dataTo: mi.dataTo,
                                        data: mi.data
                                    };
                                })
                            }));
                        } else {
                            _this.table.history.ignore(function() {
                                _this.setPersistenceConfig("sortColumns", _this.sortColumn.getColumnSortKeys());
                            });
                        }
                        _this.table.reloadSync({
                            keepPosition: true,
                            level: TableReloadLevel.index
                        });
                    });
                    if (!_this.table.isTaking()) {
                        isRow ? _this.table.highlightRow(eventList.map(function(i) {
                            return i.key;
                        })) : _this.table.highlightColumn(eventList.map(function(i) {
                            return i.key;
                        }));
                    }
                };
                var undo = function() {
                    _this.table.takeover(function() {
                        var _loop = function(ind) {
                            var i = addList[ind];
                            // 从list移除
                            dataList.splice(i.index, 1);
                            // 非占位项且fixed有变更, 还原fixed配置
                            if (isToFixed || i.isToNormal) {
                                // 同步固定项配置
                                _this.table.history.ignore(function() {
                                    _this.setPersistenceConfig([
                                        isRow ? "rows" : "columns",
                                        i.key,
                                        "fixed"
                                    ], i.fixedConf);
                                });
                            }
                            var meta = isRow ? _this.context.getRowMeta(i.key) : _this.context.getColumnMeta(i.key);
                            // 更新meta信息
                            // 从fixed项还原为普通项
                            if (isToFixed) {
                                meta.fixed = false;
                            }
                            // 常规项还原为固定项
                            if (i.isToNormal) {
                                meta.fixed = true;
                            }
                        };
                        // 移除添加项
                        for(var ind = addList.length - 1; ind >= 0; ind--)_loop(ind);
                        // 恢复移除
                        for(var i = removeList.length - 1; i >= 0; i--){
                            var cur = removeList[i];
                            dataList.splice(cur.index, 0, cur.data);
                        }
                        // 行变更进行事件通知, 列变更同步sortColumns
                        if (isRow) {
                            _this.table.event.mutation.emit(_getBlankMutationDataEvent({
                                changeType: "move",
                                move: eventList.map(function(mi) {
                                    return {
                                        from: mi.index,
                                        to: mi.formIndex,
                                        dataFrom: mi.dataTo,
                                        dataTo: mi.dataFrom,
                                        data: mi.data
                                    };
                                })
                            }));
                        } else {
                            _this.table.history.ignore(function() {
                                _this.setPersistenceConfig("sortColumns", _this.sortColumn.getColumnSortKeys());
                            });
                        }
                        _this.table.reloadSync({
                            keepPosition: true,
                            level: TableReloadLevel.index
                        });
                    });
                    if (!_this.table.isTaking()) {
                        isRow ? _this.table.highlightRow(eventList.map(function(i) {
                            return i.key;
                        })) : _this.table.highlightColumn(eventList.map(function(i) {
                            return i.key;
                        }));
                    }
                };
                this.table.history.redo({
                    redo: redo,
                    undo: undo,
                    title: isRow ? this.context.texts["move row"] : this.context.texts["move column"]
                });
            }
        },
        {
            key: "getIndexData",
            value: /** 获取方便用于删除/移动等操作的索引数据信息 */ function getIndexData(key) {
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
                // 查找出所有相关的项
                list.forEach(function(i) {
                    var ins = isRow ? _this.table.getRow(i) : _this.table.getColumn(i);
                    var realData = isRow ? ins.data : ins.config;
                    if (existMap[ins.realIndex]) return;
                    existMap[ins.realIndex] = true;
                    dataList.push({
                        index: ins.realIndex,
                        data: realData,
                        originalData: realData,
                        ins: ins,
                        key: ins.key
                    });
                });
                // 根据索引排序
                dataList.sort(function(a, b) {
                    return a.index - b.index;
                });
                return {
                    /** 根据index排序后的列表 */ list: dataList
                };
            }
        },
        {
            key: "getFixedIndex",
            value: /** 快速获取fixed虚拟项的index, 由于修改后的数据尚未同步缓存和索引, 所以需要此方法 */ function getFixedIndex(key, fixed) {
                var isRow = fixed === TableRowFixed.top || fixed === TableRowFixed.bottom;
                var list = isRow ? this.context.data : this.context.columns;
                for(var i = 0; i < list.length; i++){
                    var cur = list[i];
                    var k = isRow ? this.table.getKeyByRowData(cur) : cur.key;
                    if (key === k) {
                        return i;
                    }
                }
                return -1;
            }
        },
        {
            key: "getHighlightKeys",
            value: /** 根据setPersistenceConfig入参 "尽可能合理" 的方式获取需要高亮的项 */ function getHighlightKeys(key, newValue) {
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
            }
        },
        {
            key: "autoMoveHandle",
            value: /** 处理和触发auto move mutation, 即被自动移动的fixed项,  */ function autoMoveHandle() {
                var _this = this;
                var autoList = this.context.autoMovedRows;
                if (!autoList.length) return;
                this.table.event.mutation.emit(_getBlankMutationDataEvent({
                    changeType: "move",
                    move: autoList.map(function(i) {
                        var row = _this.table.getRow(i.key);
                        return {
                            from: row.index,
                            to: row.index,
                            dataFrom: i.from,
                            dataTo: row.dataIndex,
                            data: row.data
                        };
                    }),
                    isAutoMove: true
                }));
                this.context.autoMovedRows = [];
            }
        }
    ]);
    return _TableMutationPlugin;
}(TablePlugin);
export var TableMutationType;
(function(TableMutationType) {
    /** 持久化配置变更 */ TableMutationType["config"] = "config";
    /** 记录变更, 通常表示新增/删除/排序 */ TableMutationType["data"] = "data";
    /** 单元格值变更 */ TableMutationType["value"] = "value";
})(TableMutationType || (TableMutationType = {}));
export var TableMutationDataType;
(function(TableMutationDataType) {
    /** 新增行 */ TableMutationDataType["add"] = "add";
    /** 删除行 */ TableMutationDataType["remove"] = "remove";
    /** 移动行 */ TableMutationDataType["move"] = "move";
    /** 软删除行 */ TableMutationDataType["softRemove"] = "softRemove";
    /** 恢复软删除 */ TableMutationDataType["restoreSoftRemove"] = "restoreSoftRemove";
})(TableMutationDataType || (TableMutationDataType = {}));
export function _getBlankMutationDataEvent(opt) {
    return _object_spread({
        type: "data",
        add: [],
        remove: [],
        soft: [],
        move: [],
        isAutoMove: false
    }, opt);
}
