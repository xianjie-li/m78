import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import cls from "clsx";
export var _AspectRatio = function(_param) {
    var _ratio = _param.ratio, ratio = _ratio === void 0 ? 1 : _ratio, children = _param.children, className = _param.className, style = _param.style, props = _object_without_properties(_param, [
        "ratio",
        "children",
        "className",
        "style"
    ]);
    return /*#__PURE__*/ _jsxs("div", _object_spread_props(_object_spread({}, props), {
        className: cls("m78 m78-aspect-ratio", className),
        style: style,
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: "m78-aspect-ratio_scaffold",
                style: {
                    paddingTop: "".concat(ratio * 100, "%")
                }
            }),
            children
        ]
    }));
};
_AspectRatio.displayName = "AspectRatio";
