import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { TablePlugin } from "../table-vanilla/plugin.js";
import { throwError } from "@m78/utils";
import { _prefix } from "../table-vanilla/common.js";
/** 扩展后的 TablePlugin, 提供了react相关的渲染api */ export var RCTablePlugin = /*#__PURE__*/ function(TablePlugin) {
    "use strict";
    _inherits(RCTablePlugin, TablePlugin);
    var _super = _create_super(RCTablePlugin);
    function RCTablePlugin() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        _class_call_check(this, RCTablePlugin);
        return _super.call.apply(_super, [
            this
        ].concat(_to_consumable_array(args)));
    }
    var _proto = RCTablePlugin.prototype;
    /** 获取已注册的 RCTablePlugin 实例, 不存在对应类型的插件时, 抛出异常 */ _proto.getRCPlugin = function getRCPlugin(pluginClass) {
        var ins = this.plugins.find(function(p) {
            return p instanceof RCTablePlugin && p instanceof pluginClass;
        });
        if (!ins) {
            throwError("No plugin of type ".concat(pluginClass.name, " was found."), _prefix);
        }
        return ins;
    };
    return RCTablePlugin;
}(TablePlugin);
