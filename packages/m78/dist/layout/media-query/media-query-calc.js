import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useContext, useEffect } from "react";
import { useMeasure } from "@m78/hooks";
import { _mediaQueryCtx } from "./context";
var style = {
    position: "absolute",
    visibility: "hidden",
    zIndex: -1,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
};
/**
 * 放置到某个position不为static的元素上并对其尺寸进行持续测量, 然后通过mediaQueryCtx回调变更
 * */ var _MediaQueryCalc = function() {
    var ref = _sliced_to_array(useMeasure(), 2), bound = ref[0], ref1 = ref[1];
    var mqCtx = useContext(_mediaQueryCtx);
    useEffect(function() {
        // 过滤掉无效回调
        if (bound.width === 0 && bound.height === 0) return;
        mqCtx.onChange(bound);
    }, [
        bound
    ]);
    return /*#__PURE__*/ _jsx("div", {
        ref: ref1,
        style: style
    });
};
export default _MediaQueryCalc;
