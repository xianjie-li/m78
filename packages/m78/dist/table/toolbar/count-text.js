import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { useSetState } from "@m78/hooks";
export function _CountText(param) {
    var ctx = param.ctx;
    var ctxState = ctx.state;
    var ref = _sliced_to_array(useSetState({
        rows: 0,
        selected: 0
    }), 2), state = ref[0], setState = ref[1];
    useEffect(function() {
        if (!ctxState.instance) return;
        var selectHandle = function() {
            setState({
                selected: ctxState.instance.getSelectedRows().length
            });
        };
        ctxState.instance.event.select.on(selectHandle);
        return function() {
            ctxState.instance.event.select.off(selectHandle);
        };
    }, [
        ctxState.instance
    ]);
    return /*#__PURE__*/ _jsx("div", {
        className: "color-second fs-12",
        children: "共500行 / 选中5行"
    });
}
