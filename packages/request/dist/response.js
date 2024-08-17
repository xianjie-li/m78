import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { isArray, isObject } from "@m78/utils";
/**
 * Response class, used to smooth out differences between returns from different clients
 * */ export var Response = /*#__PURE__*/ function() {
    "use strict";
    function Response() {
        _class_call_check(this, Response);
        /** Response message, which is usually the prompt text corresponding to code in the request response */ _define_property(this, "message", "");
        /** Http status code. If 0, it usually means that the connection with the server has not been established normally. The error is caused by the local environment, such as network / cors, etc. */ _define_property(this, "code", 0);
        /** Response data */ _define_property(this, "data", null);
        /** Response header */ _define_property(this, "headers", {});
        /** Original response object */ _define_property(this, "original", void 0);
    }
    _create_class(Response, [
        {
            /** Shallow cloning in current state */ key: "clone",
            value: function clone() {
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
            }
        }
    ]);
    return Response;
}();
