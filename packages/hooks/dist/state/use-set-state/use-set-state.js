import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useState, useCallback, useRef } from "react";
/**
 * 实现类似react类组件的setState Api
 * @param initState - 初始状态
 * @return tuple
 * @return tuple[0] - 当前状态
 * @return tuple[1] - 类似类组件的setState，不支持回调
 * */ export var useSetState = function() {
    var initState = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var ref = _sliced_to_array(useState(initState), 2), state = ref[0], set = ref[1];
    var ref1 = useRef(state);
    var setState = useCallback(function(patch) {
        var newState = _object_spread({}, state, patch instanceof Function ? patch(ref1.current) : patch);
        ref1.current = Object.assign(ref1.current, newState);
        set(newState);
    }, [
        set
    ]);
    return [
        ref1.current,
        setState
    ];
};
