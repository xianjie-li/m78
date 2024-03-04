import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useState, useCallback } from "react";
import { useStorageState } from "../../index.js";
/**
 * useSetState的storage版本
 * */ export var useStorageSetState = function(key) {
    var initState = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, options = arguments.length > 2 ? arguments[2] : void 0;
    var _useState = _sliced_to_array(useState(0), 2), update = _useState[1];
    var _useStorageState = _sliced_to_array(useStorageState(key, initState, options), 2), state = _useStorageState[0], set = _useStorageState[1];
    var setState = useCallback(function(patch) {
        // 关键是使用Object.assign保证引用不变
        set(Object.assign(state, _instanceof(patch, Function) ? patch(state) : patch));
        // 引用相同useState是不会更新的，需要手动触发更新
        update(function(prev) {
            return prev + 1;
        });
    }, [
        set
    ]);
    return [
        state,
        setState
    ];
};
