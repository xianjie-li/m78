import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { TablePlugin } from "../plugin.js";
import { ActionHistory } from "@m78/utils";
export var _TableHistoryPlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(_TableHistoryPlugin, TablePlugin);
    var _super = _create_super(_TableHistoryPlugin);
    function _TableHistoryPlugin() {
        _class_call_check(this, _TableHistoryPlugin);
        return _super.apply(this, arguments);
    }
    _create_class(_TableHistoryPlugin, [
        {
            key: "init",
            value: function init() {
                this.table.history = new ActionHistory();
            }
        }
    ]);
    return _TableHistoryPlugin;
}(TablePlugin);
