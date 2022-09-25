import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useState, useCallback } from "react";
import { useStorageState } from "../../";
export var useStorageSetState = function(/** 缓存key */ key) {
    var /** 初始状态 */ initState = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, /** 其他选项 */ options = arguments.length > 2 ? arguments[2] : void 0;
    var ref = _sliced_to_array(useState(0), 2), update = ref[1];
    var ref1 = _sliced_to_array(useStorageState(key, initState, options), 2), state = ref1[0], set = ref1[1];
    var setState = useCallback(function(patch) {
        // 关键是使用Object.assign保证引用不变
        set(Object.assign(state, patch instanceof Function ? patch(state) : patch));
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
