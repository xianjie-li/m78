import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from "react";
import { _Row } from "./flex.js";
import cls from "clsx";
import { isTruthyOrZero } from "@m78/utils";
var _Tile = function(_param) {
    var className = _param.className, title = _param.title, desc = _param.desc, leading = _param.leading, trailing = _param.trailing, crossAlign = _param.crossAlign, innerRef = _param.innerRef, overflowVisible = _param.overflowVisible, children = _param.children, foot = _param.foot, ppp = _object_without_properties(_param, [
        "className",
        "title",
        "desc",
        "leading",
        "trailing",
        "crossAlign",
        "innerRef",
        "overflowVisible",
        "children",
        "foot"
    ]);
    var _title = useMemo(function() {
        if (isTruthyOrZero(title)) return title;
        return children;
    }, [
        title,
        children
    ]);
    return /*#__PURE__*/ _jsxs(_Row, _object_spread_props(_object_spread({}, ppp), {
        innerRef: innerRef,
        className: cls("m78-tile", className),
        crossAlign: crossAlign,
        children: [
            leading && /*#__PURE__*/ _jsx("div", {
                className: "m78-tile_leading",
                children: leading
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "m78-tile_main",
                style: {
                    overflow: overflowVisible ? undefined : "hidden"
                },
                children: [
                    _title && /*#__PURE__*/ _jsx("div", {
                        className: "m78-tile_cont",
                        children: _title
                    }),
                    desc && /*#__PURE__*/ _jsx("div", {
                        className: "m78-tile_desc",
                        children: desc
                    })
                ]
            }),
            trailing && /*#__PURE__*/ _jsx("div", {
                className: "m78-tile_trailing",
                children: trailing
            }),
            foot && /*#__PURE__*/ _jsx("div", {
                className: "m78-tile_foot",
                children: foot
            })
        ]
    }));
};
_Tile.displayName = "Tile";
export { _Tile };
