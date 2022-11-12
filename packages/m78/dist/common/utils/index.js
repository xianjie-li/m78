import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import React, { useState, useEffect } from "react";
import { useSelf } from "@m78/hooks";
/** 禁止冒泡的便捷扩展对象 */ export var stopPropagation = {
    onClick: function(e) {
        e.stopPropagation();
    }
};
/** throw error */ export function throwError(errorMsg, namespace) {
    throw new Error("M78\uD83D\uDCA5 -> ".concat(namespace ? "".concat(namespace, " -> ") : "", " ").concat(errorMsg));
}
export function sendWarning(msg, namespace) {
    console.log("M78\uD83D\uDCA2 -> ".concat(namespace ? "".concat(namespace, " -> ") : "", " ").concat(msg));
}
export function useDelayToggle(toggle, options) {
    var ref = options || {}, _leading = ref.leading, leading = _leading === void 0 ? 300 : _leading, _trailing = ref.trailing, trailing = _trailing === void 0 ? 600 : _trailing;
    var isDisabled = !trailing && !leading;
    // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
    var ref1 = _sliced_to_array(useState(!leading ? toggle : false), 2), innerState = ref1[0], setInnerState = ref1[1];
    var self = useSelf({
        toggleTimer: null
    });
    useEffect(function() {
        if (isDisabled) return;
        if (toggle && !leading || !toggle && !trailing) {
            toggle !== innerState && setInnerState(toggle);
            return;
        }
        var d = toggle ? leading : trailing;
        self.toggleTimer = setTimeout(function() {
            setInnerState(toggle);
        }, d);
        return function() {
            self.toggleTimer && clearTimeout(self.toggleTimer);
        };
    }, [
        toggle
    ]);
    return isDisabled ? toggle : innerState;
}
