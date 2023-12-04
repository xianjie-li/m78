import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import { getNamePathValue } from "@m78/utils";
export var Plugin = /*#__PURE__*/ function() {
    "use strict";
    function Plugin(ctx, createOptions, options, store) {
        _class_call_check(this, Plugin);
        this.ctx = ctx;
        this.createOptions = createOptions;
        this.options = options;
        this.store = store;
    }
    var _proto = Plugin.prototype;
    /**
   * helper，extract specified propriety for extraOption or createOption, extraOption > createOption
   * */ _proto.getCurrentOption = function getCurrentOption(optionField) {
        return getNamePathValue(this.options, [
            "extraOption",
            optionField
        ]) || this.createOptions[optionField];
    };
    return Plugin;
}();
