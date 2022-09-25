/**
 * 将转入的开关状态在指定延迟后转为本地状态并在变更后同步
 * */ import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useState, useEffect } from "react";
import { useSelf } from "../../";
export function useDelayToggle(toggle) {
    var delay = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 300, options = arguments.length > 2 ? arguments[2] : void 0;
    var ref = options || {}, disabled = ref.disabled, _leadingDelay = ref.leadingDelay, leadingDelay = _leadingDelay === void 0 ? delay : _leadingDelay, _trailingDelay = ref.trailingDelay, trailingDelay = _trailingDelay === void 0 ? delay : _trailingDelay, trailing = ref.trailing, _leading = ref.leading, leading = _leading === void 0 ? true : _leading;
    var isDisabled = !delay || disabled || !trailing && !leading;
    // 初始值在禁用或未开启前导延迟时为toggle本身，否则为false
    var ref1 = _sliced_to_array(useState(toggle), 2), innerState = ref1[0], setInnerState = ref1[1];
    var self = useSelf({
        toggleTimer: null
    });
    useEffect(function() {
        if (isDisabled) return;
        if (toggle && !leading || !toggle && !trailing) {
            toggle !== innerState && setInnerState(toggle);
            return;
        }
        var d = toggle ? leadingDelay : trailingDelay;
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
