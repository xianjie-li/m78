import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useContext } from "react";
import { _useMediaQuery } from "../media-query/hooks.js";
import { isArray, isNumber } from "@m78/utils";
import cls from "clsx";
import { _getCurrentMqProps } from "./common.js";
import { dumpFn } from "@m78/utils";
var MAX_COLUMN = 12;
/** 每列宽度 */ var ONE_COLUMN = 100 / MAX_COLUMN;
var context = /*#__PURE__*/ React.createContext({});
/** 根据列数获取宽度 */ var getStyleValue = function(n) {
    if (isNumber(n)) return "".concat(n * ONE_COLUMN, "%");
};
/** gutter */ var getPadding = function(gutter) {
    var isRevers = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    // 取负数
    var sing = isRevers ? -1 : 1;
    if (isNumber(gutter)) return gutter / 2 * sing;
    if (isArray(gutter) && gutter.length === 2) {
        return "".concat(gutter[0] / 2 * sing, "px ").concat(gutter[1] / 2 * sing, "px");
    }
};
function _Cells(props) {
    var children = props.children, gutter = props.gutter, _wrap = props.wrap, wrap = _wrap === void 0 ? true : _wrap, mainAlign = props.mainAlign, crossAlign = props.crossAlign, className = props.className, style = props.style, innerRef = props.innerRef, ppp = _object_without_properties(props, [
        "children",
        "gutter",
        "wrap",
        "mainAlign",
        "crossAlign",
        "className",
        "style",
        "innerRef"
    ]);
    return /*#__PURE__*/ _jsx(context.Provider, {
        value: props,
        children: /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, ppp), {
            ref: innerRef,
            className: cls("m78 m78-cell", className),
            style: style,
            children: /*#__PURE__*/ _jsx("div", {
                className: cls("m78-cell_cont", wrap && "m78-flex-wrap", mainAlign && "m78-main-".concat(mainAlign), crossAlign && "m78-cross-".concat(crossAlign)),
                style: {
                    margin: getPadding(gutter, true)
                },
                children: children
            })
        }))
    });
}
function _Cell(props) {
    var children = props.children, // exclude
    a = props.col, b = props.offset, c = props.move, d = props.order, e = props.flex, g = props.align, f = props.hidden, h = props.className, i = props.style, xs = props.xs, sm = props.sm, md = props.md, lg = props.lg, xl = props.xl, xxl = props.xxl, ppp = _object_without_properties(props, [
        "children",
        "col",
        "offset",
        "move",
        "order",
        "flex",
        "align",
        "hidden",
        "className",
        "style",
        "xs",
        "sm",
        "md",
        "lg",
        "xl",
        "xxl"
    ]);
    // ignore lint
    dumpFn(a, b, c, d, e, f, g, h, i, f, xs, sm, md, xl, xxl, lg);
    var mq = _useMediaQuery();
    var mqMeta = mq.meta;
    var gutter = useContext(context).gutter;
    if (!mqMeta) return null;
    var current = _getCurrentMqProps(mqMeta, props);
    var col = current.col, offset = current.offset, move = current.move, order = current.order, flex = current.flex, hidden = current.hidden, align = current.align, className = current.className, style = current.style;
    return /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, ppp), {
        className: cls("m78 m78-cell_col", className, align && "m78-self-".concat(align)),
        style: _object_spread_props(_object_spread({}, style), {
            width: getStyleValue(col),
            padding: getPadding(gutter),
            marginLeft: getStyleValue(offset),
            left: getStyleValue(move),
            order: order,
            flex: flex,
            display: hidden ? "none" : undefined
        }),
        children: children
    }));
}
_Cells.displayName = "Cells";
_Cell.displayName = "Cell";
export { _Cells, _Cell };
