import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _type_of } from "@swc/helpers/_/_type_of";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { TablePlugin } from "../plugin.js";
import { createKeyboardHelpersBatch, isString, KeyboardHelperModifier, KeyboardHelperTriggerType } from "@m78/utils";
import { _TableInteractiveCorePlugin } from "./interactive-core.js";
import { Position } from "../../common/index.js";
/** 单个值粘贴时, 最大的可粘贴单元格数 */ var maxSinglePaste = 50;
/** 集中处理不分键盘交互操作, 比如单元格复制/粘贴/delete等 */ export var _TableKeyboardInteractionPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableKeyboardInteractionPlugin, TablePlugin);
    var _super = _create_super(_TableKeyboardInteractionPlugin);
    function _TableKeyboardInteractionPlugin() {
        _class_call_check(this, _TableKeyboardInteractionPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "interactiveCore", void 0);
        _define_property(_assert_this_initialized(_this), "multipleHelper", void 0);
        /** 粘贴 */ _define_property(_assert_this_initialized(_this), "onPaste", function(e) {
            if (!_this.table.isActive()) return;
            _this.pasteImpl(e);
        });
        /** 复制 */ _define_property(_assert_this_initialized(_this), "onCopy", function(e) {
            if (!_this.table.isActive()) return;
            _this.copyImpl(e);
        });
        /** 删除 */ _define_property(_assert_this_initialized(_this), "onDelete", function() {
            var selected = _this.table.getSelectedCells();
            if (!selected.length) return false;
            _this.table.history.batch(function() {
                selected.forEach(function(cell) {
                    _this.table.setValue(cell, "");
                });
            });
        });
        /** 撤销 */ _define_property(_assert_this_initialized(_this), "onUndo", function() {
            _this.table.history.undo();
        });
        /** 重做 */ _define_property(_assert_this_initialized(_this), "onRedo", function() {
            _this.table.history.redo();
        });
        /** 各方向移动 */ _define_property(_assert_this_initialized(_this), "onMove", function(e) {
            var position;
            if (e.code === "ArrowUp") position = Position.top;
            if (e.code === "ArrowDown") position = Position.bottom;
            if (e.code === "ArrowLeft") position = Position.left;
            if (e.code === "ArrowRight" || e.code === "Tab") position = Position.right;
            if (!position) return false;
            var selected = _this.table.getSelectedCells();
            // 无选中单元格时, 移动到第一个单元格
            if (selected.length === 0) {
                var firstCell = _this.getFirstCell();
                if (!firstCell) return;
                _this.table.locate(firstCell.key);
                _this.table.selectCells(firstCell.key);
                return;
            }
            if (selected.length !== 1) return;
            var next = _this.table.getNearCell({
                cell: selected[0],
                position: position,
                filter: function(cell) {
                    var isSelectable = _this.table.isCellSelectable(cell);
                    var disable = cell.column.isHeader || cell.row.isHeader || !isSelectable;
                    return !disable;
                }
            });
            if (!next) return;
            _this.table.locate(next.key);
            _this.table.selectCells(next.key);
        });
        /** 空格按下/放开 */ _define_property(_assert_this_initialized(_this), "onSpace", function(e) {
            if (e.type === KeyboardHelperTriggerType.down) {
                if (!_this.table.isDragMoveEnable()) {
                    _this.table.setDragMoveEnable(true);
                }
            }
            if (e.type === KeyboardHelperTriggerType.up) {
                _this.table.setDragMoveEnable(false);
            }
        });
        return _this;
    }
    _create_class(_TableKeyboardInteractionPlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                this.methodMapper(this.table, [
                    "copy",
                    "paste"
                ]);
            }
        },
        {
            key: "init",
            value: function init() {
                this.interactiveCore = this.getPlugin(_TableInteractiveCorePlugin);
            }
        },
        {
            key: "mounted",
            value: function mounted() {
                window.addEventListener("paste", this.onPaste);
                window.addEventListener("copy", this.onCopy);
                this.multipleHelper = createKeyboardHelpersBatch(this.getKeydownOptions());
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                window.removeEventListener("paste", this.onPaste);
                window.removeEventListener("copy", this.onCopy);
                this.multipleHelper.destroy();
            }
        },
        {
            key: "paste",
            value: function paste() {
                this.pasteImpl();
            }
        },
        {
            key: "copy",
            value: function copy() {
                this.copyImpl();
            }
        },
        {
            key: "pasteImpl",
            value: // 粘贴的核心实现, 传入ClipboardEvent时, 使用事件对象操作剪切板, 否则使用 Clipboard API
            function pasteImpl(e) {
                var _this = this;
                return _async_to_generator(function() {
                    var _loop, str, data, e1, strCell, selected, actions, isSingleValue, _loop1, allCell, singleValue, i, _ret, errorStr, i1, _ret1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _loop = function(i1) {
                                    var _loop = function(j) {
                                        var curCellStr = curList[j];
                                        var cell = selected[i1][j];
                                        // 若任意一个cell未获取到则中断
                                        if (!cell) return {
                                            v: void void 0
                                        };
                                        if (!_this.interactiveCore.isInteractive(cell)) {
                                            _this.table.event.error.emit(_this.context.texts.paste);
                                            return {
                                                v: void void 0
                                            };
                                        }
                                        actions.push(function() {
                                            _this.table.setValue(cell, curCellStr);
                                        });
                                    };
                                    var curList = strCell[i1];
                                    for(var j = 0; j < curList.length; j++){
                                        var _ret = _loop(j);
                                        if (_type_of(_ret) === "object") return {
                                            v: _ret.v
                                        };
                                    }
                                };
                                // 有正在进行编辑等操作的单元格, 跳过
                                if (_this.interactiveCore.items.length) return [
                                    2
                                ];
                                str = "";
                                if (!e) return [
                                    3,
                                    1
                                ];
                                data = e.clipboardData;
                                if (!data) {
                                    _this.table.event.error.emit(_this.context.texts.clipboardWarning);
                                    return [
                                        2
                                    ];
                                }
                                str = data.getData("text/plain");
                                return [
                                    3,
                                    4
                                ];
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    navigator.clipboard.readText()
                                ];
                            case 2:
                                str = _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                e1 = _state.sent();
                                _this.table.event.error.emit(_this.context.texts.clipboardWarning);
                                return [
                                    2
                                ];
                            case 4:
                                if (!isString(str)) return [
                                    2
                                ];
                                strCell = _this.parse(str);
                                if (!strCell.length) return [
                                    2
                                ];
                                selected = _this.table.getSortedSelectedCells();
                                if (!selected.length) return [
                                    2
                                ];
                                // 事件对象时, 阻止默认行为
                                if (e) {
                                    e.preventDefault();
                                }
                                actions = [];
                                // case1: 只有单个粘贴值, 若是, 并且选中单元格数量小于一定值, 则设置到所有选中的单元格
                                isSingleValue = strCell.length === 1 && strCell[0].length === 1;
                                if (isSingleValue) {
                                    _loop1 = function(i) {
                                        var cell = allCell[i];
                                        if (!_this.interactiveCore.isInteractive(cell)) {
                                            _this.table.event.error.emit(_this.context.texts.paste);
                                            return {
                                                v: void void 0
                                            };
                                        }
                                        actions.push(function() {
                                            _this.table.setValue(cell, singleValue);
                                        });
                                    };
                                    allCell = selected.reduce(function(a, b) {
                                        return a.concat(b);
                                    }, []);
                                    if (allCell.length > maxSinglePaste) {
                                        _this.table.event.error.emit(_this.context.texts["paste single value limit"].replace("{num}", String(maxSinglePaste)));
                                        return [
                                            2
                                        ];
                                    }
                                    singleValue = strCell[0][0];
                                    for(i = 0; i < allCell.length; i++){
                                        _ret = _loop1(i);
                                        if (_type_of(_ret) === "object") return [
                                            2,
                                            _ret.v
                                        ];
                                    }
                                    _this.table.history.batch(function() {
                                        actions.forEach(function(action) {
                                            return action();
                                        });
                                    });
                                    return [
                                        2
                                    ];
                                }
                                // case2: 非isSingleValue时, 检测行列数是否一致并进行设值
                                errorStr = _this.checkAlign(strCell, selected);
                                if (errorStr) {
                                    _this.table.event.error.emit(errorStr);
                                    return [
                                        2
                                    ];
                                }
                                for(i1 = 0; i1 < strCell.length; i1++){
                                    _ret1 = _loop(i1);
                                    if (_type_of(_ret1) === "object") return [
                                        2,
                                        _ret1.v
                                    ];
                                }
                                if (!actions.length) return [
                                    2
                                ];
                                _this.table.history.batch(function() {
                                    actions.forEach(function(action) {
                                        return action();
                                    });
                                });
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "copyImpl",
            value: // 复制的核心实现, 传入ClipboardEvent时, 使用事件对象操作剪切板, 否则使用 Clipboard API
            function copyImpl(e) {
                var _this = this;
                return _async_to_generator(function() {
                    var selected, data, str, i, curList, j, cell, value, e1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                // 有正在进行编辑等操作的单元格, 跳过
                                if (_this.interactiveCore.items.length) return [
                                    2
                                ];
                                selected = _this.table.getSortedSelectedCells();
                                if (!selected.length) return [
                                    2
                                ];
                                if (e) {
                                    data = e.clipboardData;
                                    if (!data) {
                                        _this.table.event.error.emit(_this.context.texts.clipboardWarning);
                                        return [
                                            2
                                        ];
                                    }
                                    e.preventDefault();
                                }
                                str = "";
                                for(i = 0; i < selected.length; i++){
                                    curList = selected[i];
                                    for(j = 0; j < curList.length; j++){
                                        cell = curList[j];
                                        value = _this.table.getValue(cell) || "";
                                        if (j === curList.length - 1) {
                                            str += value;
                                        } else {
                                            str += "".concat(value, "	");
                                        }
                                    }
                                    if (i !== selected.length - 1) {
                                        str += "\r\n";
                                    }
                                }
                                if (!e) return [
                                    3,
                                    1
                                ];
                                e.clipboardData.clearData();
                                e.clipboardData.setData("text/plain", str);
                                return [
                                    3,
                                    4
                                ];
                            case 1:
                                _state.trys.push([
                                    1,
                                    3,
                                    ,
                                    4
                                ]);
                                return [
                                    4,
                                    navigator.clipboard.writeText(str)
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    3,
                                    4
                                ];
                            case 3:
                                e1 = _state.sent();
                                _this.table.event.error.emit(_this.context.texts.clipboardWarning);
                                return [
                                    2
                                ];
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getKeydownOptions",
            value: // 事件绑定配置
            function getKeydownOptions() {
                var _this = this;
                var checker = function() {
                    // 非表格焦点 或 有正在进行编辑等操作的单元格, 跳过
                    return _this.table.isActive() && !_this.interactiveCore.items.length;
                };
                return [
                    {
                        code: "Backspace",
                        handle: this.onDelete,
                        enable: checker
                    },
                    {
                        code: "KeyZ",
                        modifier: [
                            KeyboardHelperModifier.sysCmd
                        ],
                        handle: this.onUndo,
                        enable: checker
                    },
                    {
                        code: "KeyZ",
                        modifier: [
                            KeyboardHelperModifier.sysCmd,
                            KeyboardHelperModifier.shift
                        ],
                        handle: this.onRedo,
                        enable: checker
                    },
                    {
                        code: [
                            "ArrowUp",
                            "ArrowDown",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab"
                        ],
                        handle: this.onMove,
                        enable: checker
                    },
                    {
                        code: "Space",
                        type: KeyboardHelperTriggerType.down,
                        handle: this.onSpace,
                        enable: checker
                    },
                    {
                        code: "Space",
                        type: KeyboardHelperTriggerType.up,
                        handle: this.onSpace,
                        enable: checker
                    }
                ];
            }
        },
        {
            /** 将指定字符串根据\t和\n解析为一个二维数组 */ key: "parse",
            value: function parse(str) {
                var list = [];
                var rows = str.split(/\n|\r\n/);
                for(var i = 0; i < rows.length; i++){
                    var row = rows[i];
                    var cells = row.split("	");
                    if (cells.length) {
                        list.push(cells);
                    }
                }
                return list;
            }
        },
        {
            /** 检测传入的str cell 和 cell 的二维数组是否行列数完全一致, 如果不一致, 返回错误文本 */ key: "checkAlign",
            value: function checkAlign(strCell, cells) {
                if (strCell.length !== cells.length) {
                    return "".concat(this.context.texts["paste unaligned row"], " [").concat(strCell.length, " -> ").concat(cells.length, "]");
                }
                for(var i = 0; i < strCell.length; i++){
                    var row = strCell[i];
                    var cellsRow = cells[i];
                    if (row.length !== cellsRow.length) {
                        return "".concat(this.context.texts["paste unaligned column"], " [").concat(row.length, " -> ").concat(cellsRow.length, "]");
                    }
                }
                return "";
            }
        },
        {
            /** 获取首个常规单元格 */ key: "getFirstCell",
            value: function getFirstCell() {
                var firstRow;
                var firstRowIndex = 0;
                do {
                    try {
                        var key = this.table.getKeyByRowIndex(firstRowIndex);
                        firstRow = this.table.getRow(key);
                        firstRowIndex++;
                    } catch (e) {
                    // 忽略越界错误
                    }
                }while (firstRow && firstRow.isHeader);
                var firstColumn;
                var firstColumnIndex = 0;
                do {
                    try {
                        var key1 = this.table.getKeyByColumnIndex(firstColumnIndex);
                        firstColumn = this.table.getColumn(key1);
                        firstColumnIndex++;
                    } catch (e) {
                    // 忽略越界错误
                    }
                }while (firstColumn && firstColumn.isHeader);
                if (!firstRow || !firstColumn) return;
                return this.table.getCell(firstRow.key, firstColumn.key);
            }
        }
    ]);
    return _TableKeyboardInteractionPlugin;
}(TablePlugin);
