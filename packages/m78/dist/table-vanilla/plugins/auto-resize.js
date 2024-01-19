import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
        _define_property(_assert_this_initialized(_this), "ob", void 0);
        _define_property(_assert_this_initialized(_this), "isFirst", true);
        _define_property(_assert_this_initialized(_this), "handleResize", throttle(function(e, ob) {
            if (_this.isFirst) {
                _this.isFirst = false;
                return;
            }
            _this.table.event.resize.emit(e, ob);
            _this.table.reload({
                keepPosition: true
            });
        }, 16));
        return _this;
    }
    _create_class(_TableAutoResizePlugin, [
        {
            key: "mounted",
            value: function mounted() {
                this.ob = new ResizeObserver(this.handleResize);
                this.ob.observe(this.config.el);
            }
        },
        {
            key: "beforeDestroy",
            value: function beforeDestroy() {
                this.ob.disconnect();
            }
        }
    ]);
    return _TableAutoResizePlugin;
}(TablePlugin);
