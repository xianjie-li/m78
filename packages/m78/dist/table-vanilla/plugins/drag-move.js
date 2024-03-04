import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { _tableTriggerFilters, _triggerFilterList } from "../common.js";
import { DragScroll as PhysicalScroll, DragScrollEventType as PhysicalScrollEventType } from "@m78/smooth-scroll";
/** 拖拽滚动相关功能支持 */ export var _TableDragMovePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableDragMovePlugin, TablePlugin);
    var _super = _create_super(_TableDragMovePlugin);
    function _TableDragMovePlugin() {
        _class_call_check(this, _TableDragMovePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _define_property(_assert_this_initialized(_this), "ps", void 0);
        _define_property(_assert_this_initialized(_this), "enable", false);
        /** 事件过滤 */ _define_property(_assert_this_initialized(_this), "triggerFilter", function(e) {
            if (!_this.enable) return true;
            var interrupt = _triggerFilterList(e.target, _tableTriggerFilters, _this.config.el);
            if (interrupt) return true;
            var startPoint = _this.table.transformViewportPoint(e.offset);
            var items = _this.table.getBoundItems(startPoint.xy);
            var first = items.cells[0];
            // 表头不参与滚动
            if (!first || first.column.isHeader || first.row.isHeader) return true;
        });
        return _this;
    }
    _create_class(_TableDragMovePlugin, [
        {
            key: "beforeInit",
            value: function beforeInit() {
                // 在支持触控的设备上默认启用
                this.enable = "ontouchstart" in document;
                this.methodMapper(this.table, [
                    "isDragMoveEnable",
                    "setDragMoveEnable"
                ]);
            }
        },
        {
            key: "mounted",
            value: function mounted() {
                var _this = this;
                this.ps = new PhysicalScroll({
                    el: this.config.el,
                    type: [
                        PhysicalScrollEventType.touch,
                        PhysicalScrollEventType.mouse
                    ],
                    triggerFilter: this.triggerFilter,
                    trigger: function(e) {
                        _this.table.setXY(_this.table.getX() + e.x, _this.table.getY() + e.y);
                    }
                });
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                this.ps.destroy();
            }
        },
        {
            key: "isDragMoveEnable",
            value: function isDragMoveEnable() {
                return this.enable;
            }
        },
        {
            key: "setDragMoveEnable",
            value: function setDragMoveEnable(enable) {
                this.enable = enable;
                this.table.event.dragMoveChange.emit(enable);
            }
        }
    ]);
    return _TableDragMovePlugin;
}(TablePlugin);
