import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { middlewareImpl, subscribeImpl } from "./common.js";
var create = function() {
    var conf = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _middlewareImpl = _sliced_to_array(middlewareImpl(conf), 2), config = _middlewareImpl[0], patchHandle = _middlewareImpl[1];
    var state = config.state;
    var share = {
        state: _object_spread({}, state),
        listeners: []
    };
    var setState = function(patch) {
        share.state = _object_spread({}, share.state, patch);
        /** 触发listener */ share.listeners.forEach(function(listener) {
            return listener(patch);
        });
    };
    var coverSetState = function(patch) {
        share.state = _object_spread({}, patch);
        /** 触发listener */ share.listeners.forEach(function(listener) {
            return listener(patch);
        });
    };
    var subscribe = subscribeImpl(share);
    var apis = {
        subscribe: subscribe,
        set: setState,
        coverSet: coverSetState,
        get: function() {
            return share.state;
        }
    };
    patchHandle && patchHandle(apis);
    return apis;
};
export default create;
