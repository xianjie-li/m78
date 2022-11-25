import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo } from "react";
import { _Row } from "./flex";
import cls from "clsx";
import { isTruthyOrZero } from "@m78/utils";
var _Tile = function(_param) {
    var className = _param.className, title = _param.title, desc = _param.desc, leading = _param.leading, trailing = _param.trailing, crossAlign = _param.crossAlign, innerRef = _param.innerRef, overflowVisible = _param.overflowVisible, children = _param.children, ppp = _object_without_properties(_param, [
        "className",
        "title",
        "desc",
        "leading",
        "trailing",
        "crossAlign",
        "innerRef",
        "overflowVisible",
        "children"
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
        className: cls("m78 m78-tile", className),
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
                        className: "m78-tile_title",
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
            })
        ]
    }));
};
export { _Tile };
