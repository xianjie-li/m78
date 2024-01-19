import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
        var _this;
        _this = _super.call.apply(_super, [
            this
        ].concat(_to_consumable_array(args)));
        _define_property(_assert_this_initialized(_this), "getProps", void 0);
        _define_property(_assert_this_initialized(_this), "getDeps", void 0);
        return _this;
    }
    _create_class(RCTablePlugin, [
        {
            /** 获取已注册的 RCTablePlugin 实例, 不存在对应类型的插件时, 抛出异常 */ key: "getRCPlugin",
            value: function getRCPlugin(pluginClass) {
                var ins = this.plugins.find(function(p) {
                    return _instanceof(p, RCTablePlugin) && _instanceof(p, pluginClass);
                });
                if (!ins) {
                    throwError("No plugin of type ".concat(pluginClass.name, " was found."), _prefix);
                }
                return ins;
            }
        }
    ]);
    return RCTablePlugin;
}(TablePlugin);
