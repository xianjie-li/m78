import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import clsx from "clsx";
export var _Arrow = function(_param) {
    var width = _param.width, height = _param.height, children = _param.children, props = _object_without_properties(_param, [
        "width",
        "height",
        "children"
    ]);
    // 提升清晰度
    var w = width;
    var h = height;
    var c1x = w * 0.32;
    var c1y = h * 0.92;
    var c2x = w * 0.4;
    var c2y = h * 0.8;
    return /*#__PURE__*/ _jsxs("svg", _object_spread_props(_object_spread({}, props), {
        style: _object_spread_props(_object_spread({}, props.style), {
            width: width,
            height: height
        }),
        className: clsx("m78-overlay_arrow", props.className),
        version: "1.1",
        baseProfile: "full",
        width: w,
        height: h,
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ _jsx("path", {
                className: "m78-overlay_arrow-graphical",
                d: "M 0 ".concat(h, " C ").concat(c1x, " ").concat(c1y, ", ").concat(c2x, " ").concat(c2y, ", ").concat(w / 2, " 0 C ").concat(w - c2x, " ").concat(c2y, ", ").concat(w - c1x, " ").concat(c1y, ", ").concat(w, " ").concat(h)
            }),
            children
        ]
    }));
};
