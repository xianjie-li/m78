import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useState } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim/index.js";
import { useFn } from "@m78/hooks";
export function _createUseState(seed) {
    var defSelector = function(d) {
        return d;
    };
    var _useState = function() {
        var selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : defSelector, equalFn = arguments.length > 1 ? arguments[1] : void 0;
        var select = useFn(function() {
            return selector(seed.get());
        });
        // 用作缓存前一状态的state 通过引用直接操作
        var _useState = _sliced_to_array(useState(function() {
            return {
                state: select()
            };
        }), 1), deps = _useState[0];
        var getSnapshot = useFn(function() {
            var selected = select();
            if (equalFn && equalFn(selected, deps.state)) return deps.state;
            if (selected === deps.state) return deps.state;
            deps.state = selected;
            return selected;
        });
        return useSyncExternalStore(seed.subscribe, getSnapshot, select);
    };
    return _useState;
}
