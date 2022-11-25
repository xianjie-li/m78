import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import cls from "clsx";
export var _Center = function(_param) {
    var children = _param.children, attach = _param.attach, className = _param.className, style = _param.style, props = _object_without_properties(_param, [
        "children",
        "attach",
        "className",
        "style"
    ]);
    return /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, props), {
        className: cls("m78 m78-center", className, style),
        style: _object_spread({
            position: attach ? "absolute" : undefined
        }, style),
        children: children
    }));
};
_Center.displayName = "Center";
