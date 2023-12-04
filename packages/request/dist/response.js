import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { isArray, isObject } from "@m78/utils";
/**
 * Response class, used to smooth out differences between returns from different clients
 * */ export var Response = /*#__PURE__*/ function() {
    "use strict";
    function Response() {
        _class_call_check(this, Response);
        /** Response message, which is usually the prompt text corresponding to code in the request response */ this.message = "";
        /** Http status code. If 0, it usually means that the connection with the server has not been established normally. The error is caused by the local environment, such as network / cors, etc. */ this.code = 0;
        /** Response data */ this.data = null;
        /** Response header */ this.headers = {};
    }
    var _proto = Response.prototype;
    /** Shallow cloning in current state */ _proto.clone = function clone() {
        var n = new Response();
        n.message = this.message;
        n.code = this.code;
        if (isArray(this.data)) {
            n.data = _to_consumable_array(this.data);
        } else if (isObject(this.data)) {
            n.data = _object_spread({}, this.data);
        } else {
            n.data = this.data;
        }
        n.headers = _object_spread({}, this.headers);
        n.original = _object_spread({}, this.original);
        return n;
    };
    return Response;
}();
