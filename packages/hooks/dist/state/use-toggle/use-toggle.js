import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useState } from "react";
import { useFn } from "../../index.js";
export function useToggle() {
    var init = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    var ref = _sliced_to_array(useState(init), 2), toggle = ref[0], set = ref[1];
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
