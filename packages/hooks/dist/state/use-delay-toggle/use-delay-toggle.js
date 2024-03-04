import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useEffect, useState } from "react";
import { useFn, useSelf } from "../../index.js";
/** 代理一个toggle状态, 确保其在关闭前至少开启了duration毫秒, 用于解决loading等组件的闪烁问题 */ export function useDelayToggle(toggle) {
    var duration = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 300;
    var isDisabled = !duration;
    var _useState = _sliced_to_array(useState(toggle), 2), innerState = _useState[0], setInnerState = _useState[1];
    var self = useSelf({
        timer: null,
        openTime: toggle ? Date.now() : null
    });
    var change = useFn(function() {
        if (toggle !== innerState) setInnerState(toggle);
    });
    useEffect(function() {
        if (isDisabled) return;
        if (toggle) {
            change();
            return;
        }
        var surplus = self.openTime ? Date.now() - self.openTime : 0;
        surplus = duration - surplus;
        if (surplus <= 0) {
            change();
            return;
        }
        self.timer = setTimeout(change, surplus);
        return function() {
            self.timer && clearTimeout(self.timer);
        };
    }, [
        toggle
    ]);
    return isDisabled ? toggle : innerState;
}
