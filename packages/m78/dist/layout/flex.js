import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import cls from "clsx";
function getClasses(mainAlign, crossAlign) {
    var styObj = {};
    if (mainAlign) {
        styObj["m78-main-".concat(mainAlign)] = true;
    }
    if (crossAlign) {
        styObj["m78-cross-".concat(crossAlign)] = true;
    }
    return styObj;
}
var _Column = function(_param) {
    var children = _param.children, style = _param.style, className = _param.className, mainAlign = _param.mainAlign, crossAlign = _param.crossAlign, innerRef = _param.innerRef, ppp = _object_without_properties(_param, [
        "children",
        "style",
        "className",
        "mainAlign",
        "crossAlign",
        "innerRef"
    ]);
    return /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, ppp), {
        className: cls("m78 m78-column", className, getClasses(mainAlign, crossAlign)),
        style: style,
        ref: innerRef,
        children: children
    }));
};
var _Row = function(_param) {
    var children = _param.children, style = _param.style, className = _param.className, mainAlign = _param.mainAlign, _param_crossAlign = _param.crossAlign, crossAlign = _param_crossAlign === void 0 ? "start" : _param_crossAlign, innerRef = _param.innerRef, ppp = _object_without_properties(_param, [
        "children",
        "style",
        "className",
        "mainAlign",
        "crossAlign",
        "innerRef"
    ]);
    return /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, ppp), {
        ref: innerRef,
        className: cls("m78 m78-row", className, getClasses(mainAlign, crossAlign)),
        style: style,
        children: children
    }));
};
var _Flex = function(_param) {
    var _param_flex = _param.flex, flex = _param_flex === void 0 ? 1 : _param_flex, children = _param.children, order = _param.order, style = _param.style, className = _param.className, align = _param.align, innerRef = _param.innerRef, ppp = _object_without_properties(_param, [
        "flex",
        "children",
        "order",
        "style",
        "className",
        "align",
        "innerRef"
    ]);
    return /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, ppp), {
        ref: innerRef,
        className: cls("m78 m78-flex", className, align && "m78-self-".concat(align)),
        style: _object_spread({
            flex: flex,
            order: order
        }, style),
        children: children
    }));
};
_Column.displayName = "Column";
_Row.displayName = "Row";
_Flex.displayName = "Flex";
export { _Column, _Row, _Flex };
