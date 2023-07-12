/** 高亮行/列/单元格, 并滚动至首个高亮项 */ import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { ensureArray, getNamePathValue, isNumber, raf, setNamePathValue } from "@m78/utils";
import { addCls, removeCls } from "../../common/index.js";
import { _TablePrivateProperty } from "../types/base-type.js";
/** 单元格, 行, 列高亮/自动滚动 */ export var _TableHighlightPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableHighlightPlugin, TablePlugin);
    var _super = _create_super(_TableHighlightPlugin);
    function _TableHighlightPlugin() {
        _class_call_check(this, _TableHighlightPlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _TableHighlightPlugin.prototype;
    _proto.init = function init() {
        this.methodMapper(this.table, [
            "highlight",
            "highlightColumn",
            "highlightRow", 
        ]);
    };
    _proto.locate = function locate(cell) {
        var _this = this;
        var list = ensureArray(cell).map(function(i) {
            return _this.table.getCellByStrKey(i);
        });
        var first = list[0];
        // 自动滚动到目标时的额外距离
        var edgeOffset = 50;
        if (list.length > 1) {
            var minRowIndex;
            list.forEach(function(i) {
                if (!isNumber(minRowIndex)) {
                    minRowIndex = i.row.index;
                } else if (minRowIndex > i.row.index) {
                    minRowIndex = i.row.index;
                }
            });
            if (isNumber(minRowIndex)) {
                var filter = list.filter(function(i) {
                    return i.row.index === minRowIndex;
                });
                var sort = filter.sort(function(a, b) {
                    return a.column.index - b.column.index;
                });
                if (sort.length) {
                    first = sort[0];
                }
            }
        }
        var ref = _sliced_to_array(this.table.xy(), 2), x = ref[0], y = ref[1];
        var column = first.column;
        var row = first.row;
        var leftContW = this.table.width() - this.context.rightFixedWidth;
        var topContH = this.table.height() - this.context.bottomFixedHeight;
        var left = x + this.context.leftFixedWidth;
        var right = x + leftContW;
        var top = y + this.context.topFixedHeight;
        var bottom = y + topContH;
        var xHide = false;
        var yHide = false;
        var overLeft = column.x < left;
        var overRight = column.x + column.width > right;
        var overTop = row.y < top;
        var overBottom = row.y + row.height > bottom;
        // 对应方向非固定项并且不在可见区域时, 对其标记
        if (!column.isFixed && (overLeft || overRight)) {
            xHide = true;
        }
        if (!row.isFixed && (overTop || overBottom)) {
            yHide = true;
        }
        if (xHide || yHide) {
            var xOffset = x;
            var yOffset = y;
            if (xHide) {
                if (overLeft) {
                    xOffset = column.x - this.context.leftFixedWidth - edgeOffset;
                } else if (overRight) {
                    xOffset = column.x - leftContW + column.width + edgeOffset;
                }
            }
            if (yHide) {
                if (overTop) {
                    yOffset = row.y - this.context.topFixedHeight - edgeOffset;
                } else if (overBottom) {
                    yOffset = row.y - topContH + row.height + edgeOffset;
                }
            }
            this.table.takeover(function() {
                _this.table.xy(xOffset, yOffset);
            }, false);
            this.table.renderSync();
        }
        return first;
    };
    _proto.highlight = function highlight(cell) {
        var autoScroll = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        var _this = this;
        var list = ensureArray(cell).map(function(i) {
            return _this.table.getCellByStrKey(i);
        });
        if (!list.length) return;
        if (autoScroll) {
            this.locate(cell);
        }
        list.forEach(function(it) {
            var trigger = function(item) {
                if (!item.dom) return;
                removeCls(item.dom, "m78-table_highlight");
                raf(function() {
                    if (item.dom) {
                        var prevTimer = getNamePathValue(item.dom, _TablePrivateProperty.timer);
                        if (prevTimer !== undefined) {
                            clearTimeout(prevTimer);
                        }
                        addCls(item.dom, "m78-table_highlight");
                        var timer = setTimeout(function() {
                            if (item.dom) {
                                removeCls(item.dom, "m78-table_highlight");
                                setNamePathValue(item.dom, _TablePrivateProperty.timer, null);
                            }
                        }, 2000);
                        setNamePathValue(item.dom, _TablePrivateProperty.timer, timer);
                    }
                });
            };
            // 单元格cell可能尚未被初始化, 延迟一段时间后再执行
            if (!it.dom) {
                setTimeout(function() {
                    // item可能是cell的拷贝, 需要重新获取
                    var freshCell = _this.table.getCell(it.row.key, it.column.key);
                    // 如果节点仍然有效并挂载
                    if (freshCell.dom && freshCell.isMount) {
                        trigger(freshCell);
                    }
                }, 10);
                return;
            }
            trigger(it);
        });
    };
    _proto.highlightColumn = function highlightColumn(column) {
        var autoScroll = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        var _this = this;
        var columns = ensureArray(column).map(function(i) {
            return _this.table.getColumn(i);
        });
        var headerRowKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];
        var columnHeaderCells = [];
        columns.forEach(function(i) {
            var cell = _this.table.getCell(headerRowKey, i.key);
            // 若是被合并项, 取合并者
            var merged = _this.table.getMergedData(cell);
            if (merged) {
                columnHeaderCells.push(_this.table.getCell(merged[0], merged[1]));
            } else {
                columnHeaderCells.push(cell);
            }
        });
        if (!columnHeaderCells.length) return;
        this.highlight(columnHeaderCells.map(function(i) {
            return i.key;
        }), autoScroll);
    };
    _proto.highlightRow = function highlightRow(row) {
        var autoScroll = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
        var _this = this;
        var rows = ensureArray(row).map(function(i) {
            return _this.table.getRow(i);
        });
        var xHeaderKey = this.context.xHeaderKey;
        var rowHeaderCells = rows.map(function(i) {
            return _this.table.getCell(i.key, xHeaderKey);
        });
        if (!rowHeaderCells.length) return;
        this.highlight(rowHeaderCells.map(function(i) {
            return i.key;
        }), autoScroll);
    };
    return _TableHighlightPlugin;
}(TablePlugin);
