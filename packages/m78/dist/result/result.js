import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import clsx from "clsx";
export var _Result = function(_param) {
    var className = _param.className, icon = _param.icon, title = _param.title, desc = _param.desc, extra = _param.extra, actions = _param.actions, size = _param.size, pp = _object_without_properties(_param, [
        "className",
        "icon",
        "title",
        "desc",
        "extra",
        "actions",
        "size"
    ]);
    return /*#__PURE__*/ _jsxs("div", _object_spread_props(_object_spread({}, pp), {
        className: clsx("m78 m78-result", size && "__".concat(size), className),
        children: [
            icon && /*#__PURE__*/ _jsx("div", {
                className: "m78-result_icon",
                children: icon
            }),
            title && /*#__PURE__*/ _jsx("div", {
                className: "m78-result_title",
                children: title
            }),
            desc && /*#__PURE__*/ _jsx("div", {
                className: "m78-result_desc",
                children: desc
            }),
            extra && /*#__PURE__*/ _jsx("div", {
                className: "m78-result_extra",
                children: extra
            }),
            actions && /*#__PURE__*/ _jsx("div", {
                className: "m78-result_actions",
                children: actions
            })
        ]
    }));
};
_Result.displayName = "Result";
