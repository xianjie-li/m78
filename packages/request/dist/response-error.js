import { _ as _assert_this_initialized } from "@swc/helpers/_/_assert_this_initialized";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _wrap_native_super } from "@swc/helpers/_/_wrap_native_super";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
/** Standard error format, which includes a response when a request is received but has error */ export var ResponseError = /*#__PURE__*/ function(Error1) {
    "use strict";
    _inherits(ResponseError, Error1);
    var _super = _create_super(ResponseError);
    function ResponseError(message, response) {
        _class_call_check(this, ResponseError);
        var _this;
        _this = _super.call(this, message);
        _define_property(_assert_this_initialized(_this), "response", void 0);
        _this.response = response;
        return _this;
    }
    return ResponseError;
}(_wrap_native_super(Error));
