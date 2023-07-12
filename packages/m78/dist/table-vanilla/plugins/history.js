import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
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
    var _proto = _TableHistoryPlugin.prototype;
    _proto.init = function init() {
        this.table.history = new ActionHistory();
    };
    return _TableHistoryPlugin;
}(TablePlugin);
