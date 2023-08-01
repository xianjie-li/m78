import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import ResizeObserver from "resize-observer-polyfill";
import throttle from "lodash/throttle.js";
import { TablePlugin } from "../plugin.js";
export var _TableAutoResizePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableAutoResizePlugin, TablePlugin);
    var _super = _create_super(_TableAutoResizePlugin);
    function _TableAutoResizePlugin() {
        _class_call_check(this, _TableAutoResizePlugin);
        var _this;
        _this = _super.apply(this, arguments);
        _this.isFirst = true;
        _this.handleResize = throttle(function(e, ob) {
            if (_this.isFirst) {
                _this.isFirst = false;
                return;
            }
            _this.table.event.resize.emit(e, ob);
            _this.table.reload({
                keepPosition: true
            });
        }, 30);
        return _this;
    }
    var _proto = _TableAutoResizePlugin.prototype;
    _proto.mounted = function mounted() {
        this.ob = new ResizeObserver(this.handleResize);
        this.ob.observe(this.config.el);
    };
    _proto.beforeDestroy = function beforeDestroy() {
        this.ob.disconnect();
    };
    return _TableAutoResizePlugin;
}(TablePlugin);
