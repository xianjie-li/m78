import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _wrap_native_super from "@swc/helpers/src/_wrap_native_super.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
export var VerifyError = /*#__PURE__*/ function(Error1) {
    "use strict";
    _inherits(VerifyError, Error1);
    var _super = _create_super(VerifyError);
    function VerifyError(rejects) {
        var message = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "verify error";
        _class_call_check(this, VerifyError);
        var _this;
        _this = _super.call(this, message);
        _this.rejects = rejects;
        return _this;
    }
    return VerifyError;
}(_wrap_native_super(Error));
