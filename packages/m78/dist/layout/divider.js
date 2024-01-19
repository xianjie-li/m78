import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Column, Row } from "./index.js";
import clsx from "clsx";
export var _Divider = function(param) {
    var vertical = param.vertical, color = param.color, _param_margin = param.margin, margin = _param_margin === void 0 ? 12 : _param_margin, children = param.children, style = param.style, className = param.className, align = param.align, size = param.size;
    var renderLine = function renderLine(styleObj, cls) {
        return /*#__PURE__*/ _jsx("div", {
            className: clsx("m78 m78-divider", vertical && "__vertical", cls),
            style: styleObj
        });
    };
    var marginStr = vertical ? "0 ".concat(margin, "px") : "".concat(margin, "px 0");
    var styleBaseObj = {
        backgroundColor: color,
        margin: marginStr,
        color: color
    };
    if (!children) {
        return renderLine(_object_spread_props(_object_spread({}, styleBaseObj, style), _define_property({}, vertical ? "width" : "height", size)), className);
    }
    // 带内容的分割线, 平分内容区域
    if (vertical) {
        return /*#__PURE__*/ _jsxs(Column, {
            className: clsx("m78-divider_column", align && "__".concat(align), className),
            style: style,
            crossAlign: "center",
            children: [
                renderLine(styleBaseObj),
                /*#__PURE__*/ _jsx("span", {
                    className: "m78-divider_node",
                    children: children
                }),
                renderLine(styleBaseObj)
            ]
        });
    }
    return /*#__PURE__*/ _jsxs(Row, {
        className: clsx("m78-divider_row", align && "__".concat(align), className),
        style: style,
        crossAlign: "center",
        children: [
            renderLine(styleBaseObj),
            /*#__PURE__*/ _jsx("span", {
                className: "m78-divider_node",
                children: children
            }),
            renderLine(styleBaseObj)
        ]
    });
};
_Divider.displayName = "Divider";
