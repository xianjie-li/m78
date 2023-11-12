import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { TablePlugin } from "../plugin.js";
import { createKeyboardHelpersBatch, isString, KeyboardHelperModifier } from "@m78/utils";
import { _TableInteractiveCorePlugin } from "./interactive-core.js";
import { Position } from "../../common/index.js";
/** 单个值粘贴时, 最大的可粘贴单元格数 */ var maxSinglePaste = 50;
/** 键盘交互操作, 比如单元格复制/粘贴/delete等 */ export var _TableKeyboardInteractionPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableKeyboardInteractionPlugin, TablePlugin);
    var _super = _create_super(_TableKeyboardInteractionPlugin);
    function _TableKeyboardInteractionPlugin() {
        _class_call_check(this, _TableKeyboardInteractionPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 粘贴 */ _this.onPaste = function(e) {
            if (!_this.table.isActive()) return;
            _this.pasteImpl(e);
        };
        /** 复制 */ _this.onCopy = function(e) {
            if (!_this.table.isActive()) return;
            _this.copyImpl(e);
        };
        /** 删除 */ _this.onDelete = function() {
            var selected = _this.table.getSelectedCells();
            if (!selected.length) return false;
            _this.table.history.batch(function() {
                selected.forEach(function(cell) {
                    _this.table.setValue(cell, "");
                });
            });
        };
        /** 撤销 */ _this.onUndo = function() {
            _this.table.history.undo();
        };
        /** 重做 */ _this.onRedo = function() {
            _this.table.history.redo();
        };
        /** 各方向移动 */ _this.onMove = function(e) {
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
        };
        return _this;
    }
    var _proto = _TableKeyboardInteractionPlugin.prototype;
    _proto.beforeInit = function beforeInit() {
        this.methodMapper(this.table, [
            "copy",
            "paste"
        ]);
    };
    _proto.init = function init() {
        this.interactiveCore = this.getPlugin(_TableInteractiveCorePlugin);
    };
    _proto.mounted = function mounted() {
        window.addEventListener("paste", this.onPaste);
        window.addEventListener("copy", this.onCopy);
        this.multipleHelper = createKeyboardHelpersBatch(this.getKeydownOptions());
    };
    _proto.beforeDestroy = function beforeDestroy() {
        window.removeEventListener("paste", this.onPaste);
        window.removeEventListener("copy", this.onCopy);
        this.multipleHelper.destroy();
    };
    _proto.paste = function paste() {
        this.pasteImpl();
    };
    _proto.copy = function copy() {
        this.copyImpl();
    };
    // 粘贴的核心实现, 传入ClipboardEvent时, 使用事件对象操作剪切板, 否则使用 Clipboard API
    _proto.pasteImpl = function pasteImpl(e) {
        var _this = this;
        return _async_to_generator(function() {
            var str, data, e1, strCell, selected, actions, isSingleValue, allCell, singleValue, i, cell, errorStr, i1, curList, j, curCellStr, cell1;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
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
                        isSingleValue = strCell.length === 1 && strCell[0].length === 1;
                        if (isSingleValue) {
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
                                cell = allCell[i];
                                if (!_this.interactiveCore.isInteractive(cell)) {
                                    _this.table.event.error.emit(_this.context.texts.paste);
                                    return [
                                        2
                                    ];
                                }
                                actions.push(function() {
                                    _this.table.setValue(cell, singleValue);
                                });
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
                        errorStr = _this.checkAlign(strCell, selected);
                        if (errorStr) {
                            _this.table.event.error.emit(errorStr);
                            return [
                                2
                            ];
                        }
                        for(i1 = 0; i1 < strCell.length; i1++){
                            curList = strCell[i1];
                            for(j = 0; j < curList.length; j++){
                                curCellStr = curList[j];
                                cell1 = selected[i1][j];
                                // 若任意一个cell未获取到则中断
                                if (!cell1) return [
                                    2
                                ];
                                if (!_this.interactiveCore.isInteractive(cell1)) {
                                    _this.table.event.error.emit(_this.context.texts.paste);
                                    return [
                                        2
                                    ];
                                }
                                actions.push(function() {
                                    _this.table.setValue(cell1, curCellStr);
                                });
                            }
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
    };
    // 复制的核心实现, 传入ClipboardEvent时, 使用事件对象操作剪切板, 否则使用 Clipboard API
    _proto.copyImpl = function copyImpl(e) {
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
    };
    // 事件绑定配置
    _proto.getKeydownOptions = function getKeydownOptions() {
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
        ];
    };
    /** 将指定字符串根据\t和\n解析为一个二维数组 */ _proto.parse = function parse(str) {
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
    };
    /** 检测传入的str cell 和 cell 的二维数组是否行列数完全一致, 如果不一致, 返回错误文本 */ _proto.checkAlign = function checkAlign(strCell, cells) {
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
    };
    /** 获取首个常规单元格 */ _proto.getFirstCell = function getFirstCell() {
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
            } catch (e1) {
            // 忽略越界错误
            }
        }while (firstColumn && firstColumn.isHeader);
        if (!firstRow || !firstColumn) return;
        return this.table.getCell(firstRow.key, firstColumn.key);
    };
    return _TableKeyboardInteractionPlugin;
}(TablePlugin);
