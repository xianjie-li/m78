import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { _TableFormPlugin } from "./form.js";
import { TableFeedback } from "./event.js";
import debounce from "lodash/debounce.js";
import { createTrigger, TriggerType } from "../../trigger/index.js";
/** 提供对某些表格元素的交互反馈, 比如单元格包含错误信息或内容超出时, 在选中后为其提供反馈 */ export var _TableFeedbackPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableFeedbackPlugin, TablePlugin);
    var _super = _create_super(_TableFeedbackPlugin);
    function _TableFeedbackPlugin() {
        _class_call_check(this, _TableFeedbackPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _this.lastEvent = null;
        // 渲染完成后, 重新计算表头的触发区域
        _this.renderedDebounce = debounce(function() {
            _this.updateHeaderTriggerTargets();
        }, 100, {
            leading: false,
            trailing: true
        });
        // 滚动时关闭已触发反馈
        _this.scroll = function() {
            _this.emitClose();
        };
        // 单元格选中变更
        _this.cellChange = function() {
            var cells = _this.table.getSelectedCells();
            // 只在选中单条时触发
            if (cells.length !== 1) {
                _this.emitClose();
                return;
            }
            var cell = cells[0];
            var events = [];
            if (_this.isCellOverflow(cell)) {
                var e = {
                    type: TableFeedback.overflow,
                    text: cell.text,
                    cell: cell,
                    dom: cell.dom
                };
                events.push(e);
            }
            // 禁用检测
            if (!_this.form.validCheck(cell)) {
                var e1 = {
                    type: TableFeedback.disable,
                    text: _this.context.texts["currently not editable"],
                    cell: cell,
                    dom: cell.dom
                };
                events.push(e1);
            }
            var errMsg = _this.form.getCellError(cell);
            // 错误检测
            if (errMsg) {
                var e2 = {
                    type: TableFeedback.error,
                    text: errMsg,
                    cell: cell,
                    dom: cell.dom
                };
                events.push(e2);
            }
            if (events.length) {
                _this.lastEvent = _to_consumable_array(events);
                _this.table.event.feedback.emit(events);
            } else {
                _this.emitClose();
            }
        };
        // 表头交互
        _this.headerTriggerHandle = function(e) {
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
                    type: TableFeedback.regular,
                    text: "全选/反选",
                    cell: cell,
                    bound: bound
                };
                events.push(event);
            }
            if (_this.isCellOverflow(cell)) {
                var event1 = {
                    type: TableFeedback.overflow,
                    text: cell.text,
                    cell: cell,
                    bound: bound
                };
                events.push(event1);
            }
            var editStatus = _this.form.getEditStatus(cell.column);
            if (editStatus) {
                var event2 = {
                    type: TableFeedback.regular,
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
        };
        return _this;
    }
    var _proto = _TableFeedbackPlugin.prototype;
    _proto.initialized = function initialized() {
        this.form = this.getPlugin(_TableFormPlugin);
        this.table.event.cellSelect.on(this.cellChange);
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
    };
    _proto.beforeDestroy = function beforeDestroy() {
        this.headerTrigger.destroy();
        this.table.event.cellSelect.off(this.cellChange);
        this.context.viewEl.removeEventListener("scroll", this.scroll);
    };
    _proto.rendered = function rendered() {
        this.renderedDebounce();
    };
    // 如果有lastEvent, 发出关闭通知
    _proto.emitClose = function emitClose() {
        if (this.lastEvent) {
            var e = {
                type: TableFeedback.close,
                text: ""
            };
            this.lastEvent = null;
            this.table.event.feedback.emit([
                e
            ]);
        }
    };
    // 更新表头触发区域
    _proto.updateHeaderTriggerTargets = function updateHeaderTriggerTargets() {
        var _this = this;
        var ref;
        var hKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];
        var lastColumns = ((ref = this.context.lastViewportItems) === null || ref === void 0 ? void 0 : ref.columns) || [];
        this.headerTrigger.clear();
        if (!lastColumns.length) {
            return;
        }
        var headerCells = lastColumns.map(function(col) {
            return _this.table.getCell(hKey, col.key);
        });
        var ref1 = this.config.el.getBoundingClientRect(), left = ref1.left, top = ref1.top;
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
    };
    // 检测单元格内容是否溢出
    _proto.isCellOverflow = function isCellOverflow(cell) {
        var dom = cell.dom;
        if (!dom) return false;
        var diffX = dom.scrollWidth - dom.offsetWidth;
        var diffY = dom.scrollHeight - dom.offsetHeight;
        // 阈值
        var threshold = 4;
        return diffX > threshold || diffY > threshold;
    };
    return _TableFeedbackPlugin;
}(TablePlugin);
