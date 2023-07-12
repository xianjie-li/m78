import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../plugin.js";
import { _tableTriggerFilters, _triggerFilterList } from "../common.js";
import { PhysicalScroll, PhysicalScrollEventType } from "@m78/utils";
/** 将touch事件模拟为滚动 */ export var _TableTouchScrollPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableTouchScrollPlugin, TablePlugin);
    var _super = _create_super(_TableTouchScrollPlugin);
    function _TableTouchScrollPlugin() {
        _class_call_check(this, _TableTouchScrollPlugin);
        var _this;
        _this = _super.apply(this, arguments);
        /** 事件过滤 */ _this.triggerFilter = function(e) {
            var interrupt = _triggerFilterList(e.target, _tableTriggerFilters, _this.config.el);
            if (interrupt) return true;
            var startPoint = _this.table.transformViewportPoint(e.offset);
            var items = _this.table.getBoundItems(startPoint.xy);
            var first = items.cells[0];
            // 表头不参与滚动
            if (!first || first.column.isHeader || first.row.isHeader) return true;
        };
        return _this;
    }
    var _proto = _TableTouchScrollPlugin.prototype;
    _proto.mount = function mount() {
        var _this = this;
        this.ps = new PhysicalScroll({
            el: this.config.el,
            type: [
                PhysicalScrollEventType.touch
            ],
            onlyNotify: true,
            triggerFilter: this.triggerFilter,
            positionGetter: function() {
                return _this.table.xy();
            },
            onScroll: function(param, isAutoScroll) {
                var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1];
                if (isAutoScroll) {
                    // 这里需要同步更新滚动位置
                    _this.table.takeover(function() {
                        _this.table.xy(x, y);
                        _this.table.renderSync();
                    });
                } else {
                    _this.table.xy(x, y);
                }
            }
        });
    };
    _proto.beforeDestroy = function beforeDestroy() {
        this.ps.destroy();
    };
    return _TableTouchScrollPlugin;
}(TablePlugin);
