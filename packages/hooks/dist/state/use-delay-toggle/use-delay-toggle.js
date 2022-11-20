import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useEffect, useState } from "react";
import { useSelf } from "../../";
/** 代理一个toggle状态, 确保其在关闭前至少开启了duration毫秒, 用于解决loading等组件的闪烁问题 */ export function useDelayToggle(toggle) {
    var duration = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 300;
    var change = function change() {
        if (toggle !== innerState) setInnerState(toggle);
    };
    var isDisabled = !duration;
    var ref = _sliced_to_array(useState(toggle), 2), innerState = ref[0], setInnerState = ref[1];
    var self = useSelf({
        timer: null,
        openTime: toggle ? Date.now() : null
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
