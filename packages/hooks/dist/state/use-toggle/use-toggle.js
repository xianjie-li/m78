import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useState } from "react";
import { useFn } from "../../index.js";
export function useToggle() {
    var init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var _useState = _sliced_to_array(useState(init), 2), toggle = _useState[0], set = _useState[1];
    var s = useFn(function(next) {
        if (next !== undefined) {
            set(next);
            return;
        }
        set(function(prev) {
            return !prev;
        });
    });
    return [
        toggle,
        s
    ];
}
