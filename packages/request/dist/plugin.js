import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import { getNamePathValue } from "@m78/utils";
export var Plugin = /*#__PURE__*/ function() {
    "use strict";
    function Plugin(ctx, createOptions, options // request中传入的配置
    ) {
        _class_call_check(this, Plugin);
        this.ctx = ctx;
        this.createOptions = createOptions;
        this.options = options;
    }
    var _proto = Plugin.prototype;
    /**
   * 帮助函数，从extraOption或createOption中取出指定名称的方法，前者优先级更高
   * */ _proto.getCurrentOption = function getCurrentOption(optionField) {
        return getNamePathValue(this.options, [
            "extraOption",
            optionField
        ]) || this.createOptions[optionField];
    };
    return Plugin;
}();
