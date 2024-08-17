import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { getNamePathValue } from "@m78/utils";
export var Plugin = /*#__PURE__*/ function() {
    "use strict";
    function Plugin(/** Objects that share data between different plugins should only be operated by plugins in their own namespace, such as caching plugins using ctx.catch.xx */ ctx, /** Create options */ createOptions, /** Current request options */ options, /** Store content shared in the current request instance */ store) {
        _class_call_check(this, Plugin);
        _define_property(this, "ctx", void 0);
        _define_property(this, "createOptions", void 0);
        _define_property(this, "options", void 0);
        _define_property(this, "store", void 0);
        this.ctx = ctx;
        this.createOptions = createOptions;
        this.options = options;
        this.store = store;
    }
    _create_class(Plugin, [
        {
            /**
   * helper，extract specified propriety for extraOption or createOption, extraOption > createOption
   * */ key: "getCurrentOption",
            value: function getCurrentOption(optionField) {
                return getNamePathValue(this.options, [
                    "extraOption",
                    optionField
                ]) || this.createOptions[optionField];
            }
        }
    ]);
    return Plugin;
}();
