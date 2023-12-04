import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
/** Standard error format, which includes a response when a request is received but has error */ export var ResponseError = /*#__PURE__*/ function(Error1) {
    "use strict";
    _inherits(ResponseError, Error1);
    var _super = _create_super(ResponseError);
    function ResponseError(message, response) {
        _class_call_check(this, ResponseError);
        var _this;
        _this = _super.call(this, message);
        _this.response = response;
        return _this;
    }
    return ResponseError;
}(_wrap_native_super(Error));
