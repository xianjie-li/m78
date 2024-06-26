import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useRef, useState } from "react";
import { useFn } from "../../index.js";
/**
 * 用于手动触发组件更新, 如果设置了nextTickCall, 多次触发的update会在下一个事件周期统一触发
 * */ export var useUpdate = function() {
    var nextTickCall = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var _useState = _sliced_to_array(useState(0), 2), setCount = _useState[1];
    var timerRef = useRef();
    var nextTickUpdate = useFn(function() {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(function() {
            setCount(function(prev) {
                return prev + 1;
            });
        });
    });
    var update = useFn(function() {
        return setCount(function(prev) {
            return prev + 1;
        });
    });
    return nextTickCall ? nextTickUpdate : update;
};
