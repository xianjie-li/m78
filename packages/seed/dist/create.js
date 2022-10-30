import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { middlewareImpl, subscribeImpl } from "./common";
var create = function() {
    var conf = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var ref = _sliced_to_array(middlewareImpl(conf), 2), config = ref[0], patchHandle = ref[1];
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
