import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { _TableFormPlugin } from "./form.js";
import debounce from "lodash/debounce.js";
import { createTrigger, TriggerType } from "../../trigger/index.js";
import { TableMutationType } from "./mutation.js";
/** 提供对某些表格元素的交互反馈, 比如单元格包含错误信息或内容超出时, 在选中后为其提供反馈 */ export var _TableFeedbackPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableFeedbackPlugin, TablePlugin);
    var _super = _create_super(_TableFeedbackPlugin);
    function _TableFeedbackPlugin() {
        _class_call_check(this, _TableFeedbackPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "form", void 0);
        _define_property(_assert_this_initialized(_this), "lastEvent", null);
        // 防止键盘交互导致自动滚动时, feedback触发完马上滚动导致关闭
        _define_property(_assert_this_initialized(_this), "lastTime", 0);
        // 表头交互提醒
        _define_property(_assert_this_initialized(_this), "headerTrigger", void 0);
        /** mutation value change 提交延迟计时器 */ _define_property(_assert_this_initialized(_this), "valueChangeTimer", void 0);
        // 渲染完成后, 重新计算表头的触发区域
        _define_property(_assert_this_initialized(_this), "renderedDebounce", debounce(function() {
            _this.updateHeaderTriggerTargets();
        }, 100, {
            leading: false,
            trailing: true
        }));
        // 滚动时关闭已触发反馈
        _define_property(_assert_this_initialized(_this), "scroll", function() {
            _this.emitClose();
        });
        // 触发单元格feedback, 默认为选中单元格触发
        _define_property(_assert_this_initialized(_this), "cellChange", function(cells) {
            if (!(cells === null || cells === void 0 ? void 0 : cells.length)) {
                cells = _this.table.getSelectedCells();
            }
            // 只在选中单条时触发
            if (cells.length !== 1) {
                _this.emitClose();
                return;
            }
            var cell = cells[0];
            var events = [];
            // 内容溢出
            if (_this.isCellOverflow(cell)) {
                var e = {
                    type: "overflow",
                    text: cell.text,
                    cell: cell,
                    dom: cell.dom
                };
                events.push(e);
            }
            // form invalid
            if (!_this.form.validCheck(cell)) {
                var e1 = {
                    type: "disable",
                    text: _this.context.texts["currently not editable"],
                    cell: cell,
                    dom: cell.dom
                };
                events.push(e1);
            }
            var errMsg = _this.form.getCellError(cell);
            // form error
            if (errMsg) {
                var e2 = {
                    type: "error",
                    text: errMsg,
                    cell: cell,
                    dom: cell.dom
                };
                events.push(e2);
            }
            // soft remove
            if (_this.table.isSoftRemove(cell.row.key)) {
                var e3 = {
                    type: "regular",
                    text: _this.context.texts["soft remove tip"],
                    cell: cell,
                    dom: cell.dom
                };
                events.push(e3);
            }
            if (events.length) {
                _this.lastEvent = _to_consumable_array(events);
                _this.lastTime = Date.now();
                _this.table.event.feedback.emit(events);
            } else {
                _this.emitClose();
            }
        });
        // 单元格提交时, 触发feedback
        _define_property(_assert_this_initialized(_this), "mutationHandle", function(event) {
            if (event.type === TableMutationType.value) {
                // 确保在变更并校验完成后触发
                _this.valueChangeTimer = setTimeout(function() {
                    _this.cellChange([
                        event.cell
                    ]);
                }, 50);
            }
        });
        // 表头交互
        _define_property(_assert_this_initialized(_this), "headerTriggerHandle", function(e) {
            if (e.type !== TriggerType.active) return;
            if (!e.active) {
                _this.emitClose();
                return;
            }
            var bound = e.target.target;
            var cell = e.data;
            var events = [];
            if (cell.column.key === "__RH") {
                var event = {
                    type: "regular",
                    text: _this.context.texts.selectAllOrUnSelectAll,
                    cell: cell,
                    bound: bound
                };
                events.push(event);
            }
            var isOverflow = _this.isCellOverflow(cell);
            if (isOverflow) {
                var event1 = {
                    type: "overflow",
                    text: cell.text,
                    cell: cell,
                    bound: bound
                };
                events.push(event1);
            }
            var editStatus = _this.form.getEditStatus(cell.column);
            if (editStatus) {
                var event2 = {
                    type: "regular",
                    text: editStatus.required ? _this.context.texts["editable and required"] : _this.context.texts.editable,
                    cell: cell,
                    bound: bound
                };
                events.push(event2);
            }
            if (events.length) {
                _this.lastEvent = _to_consumable_array(events);
                _this.table.event.feedback.emit(events);
            } else {
                _this.emitClose();
                _this.lastEvent = null;
            }
        });
        return _this;
    }
    _create_class(_TableFeedbackPlugin, [
        {
            key: "initialized",
            value: function initialized() {
                this.form = this.getPlugin(_TableFormPlugin);
                this.table.event.cellSelect.on(this.cellChange);
                this.table.event.mutation.on(this.mutationHandle);
                this.headerTrigger = createTrigger({
                    type: TriggerType.active,
                    container: this.config.el,
                    active: {
                        lastDelay: 0
                    }
                });
                this.headerTrigger.event.on(this.headerTriggerHandle);
                // 滚动时关闭
                this.context.viewEl.addEventListener("scroll", this.scroll);
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                this.headerTrigger.destroy();
                this.table.event.cellSelect.off(this.cellChange);
                this.table.event.mutation.off(this.mutationHandle);
                this.context.viewEl.removeEventListener("scroll", this.scroll);
                clearTimeout(this.valueChangeTimer);
            }
        },
        {
            key: "rendered",
            value: function rendered() {
                this.renderedDebounce();
            }
        },
        {
            // 如果有lastEvent, 发出关闭通知
            key: "emitClose",
            value: function emitClose() {
                if (this.lastEvent) {
                    var diffTime = Date.now() - this.lastTime;
                    if (diffTime < 60) return;
                    var e = {
                        type: "close",
                        text: ""
                    };
                    this.lastEvent = null;
                    this.table.event.feedback.emit([
                        e
                    ]);
                }
            }
        },
        {
            // 更新表头触发区域
            key: "updateHeaderTriggerTargets",
            value: function updateHeaderTriggerTargets() {
                var _this = this;
                var _this_context_lastViewportItems;
                var hKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];
                var lastColumns = ((_this_context_lastViewportItems = this.context.lastViewportItems) === null || _this_context_lastViewportItems === void 0 ? void 0 : _this_context_lastViewportItems.columns) || [];
                this.headerTrigger.clear();
                if (!lastColumns.length) {
                    return;
                }
                var headerCells = lastColumns.map(function(col) {
                    return _this.table.getCell(hKey, col.key);
                });
                var _this_config_el_getBoundingClientRect = this.config.el.getBoundingClientRect(), left = _this_config_el_getBoundingClientRect.left, top = _this_config_el_getBoundingClientRect.top;
                var x = this.table.getX();
                // 去掉column resize handle的位置
                var adjustSize = 4;
                var targets = headerCells.map(function(cell) {
                    var xFix = cell.column.isFixed ? 0 : x;
                    return {
                        target: {
                            width: cell.width - adjustSize * 2,
                            height: cell.height,
                            left: cell.column.x + left + adjustSize - xFix,
                            top: cell.row.y + top
                        },
                        zIndex: cell.column.isFixed ? 1 : 0,
                        data: cell
                    };
                });
                this.headerTrigger.add(targets);
            }
        },
        {
            // 检测单元格内容是否溢出
            key: "isCellOverflow",
            value: function isCellOverflow(cell) {
                var dom = cell.dom;
                if (!dom) return false;
                var diffX = dom.scrollWidth - dom.offsetWidth;
                var diffY = dom.scrollHeight - dom.offsetHeight;
                // 阈值
                var threshold = 4;
                return diffX > threshold || diffY > threshold;
            }
        }
    ]);
    return _TableFeedbackPlugin;
}(TablePlugin);
export var TableFeedback;
(function(TableFeedback) {
    /** 内容溢出 */ TableFeedback["overflow"] = "overflow";
    /** 错误 */ TableFeedback["error"] = "error";
    /** 禁用项 */ TableFeedback["disable"] = "disable";
    /** 常规提醒 */ TableFeedback["regular"] = "regular";
    /** 关闭 */ TableFeedback["close"] = "close";
})(TableFeedback || (TableFeedback = {}));
