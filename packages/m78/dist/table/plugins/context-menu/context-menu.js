import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _useContextMenuAct } from "./use-context-menu.act.js";
import { RCTablePlugin } from "../../plugin.js";
import { _injector } from "../../table.js";
export var _ContextMenuPlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_ContextMenuPlugin, RCTablePlugin);
    var _super = _create_super(_ContextMenuPlugin);
    function _ContextMenuPlugin() {
        _class_call_check(this, _ContextMenuPlugin);
        return _super.apply(this, arguments);
    }
    _create_class(_ContextMenuPlugin, [
        {
            key: "rcRuntime",
            value: function rcRuntime() {
                _injector.useDeps(_useContextMenuAct);
            }
        },
        {
            key: "rcExtraRender",
            value: function rcExtraRender() {
                return this.getDeps(_useContextMenuAct).node;
            }
        }
    ]);
    return _ContextMenuPlugin;
}(RCTablePlugin);
