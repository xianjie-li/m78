import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Row, Tile } from "../layout/index.js";
import { IconRight } from "@m78/icons/right.js";
import classNames from "clsx";
import { LayStyle } from "./types.js";
import { statusIconMap } from "../common/index.js";
function _Lay(_param) {
    var arrow = _param.arrow, disabled = _param.disabled, size = _param.size, _itemStyle = _param.itemStyle, itemStyle = _itemStyle === void 0 ? LayStyle.none : _itemStyle, _effect = _param.effect, effect = _effect === void 0 ? true : _effect, active = _param.active, trailing = _param.trailing, _crossAlign = _param.crossAlign, crossAlign = _crossAlign === void 0 ? "center" : _crossAlign, className = _param.className, style = _param.style, status = _param.status, highlight = _param.highlight, ppp = _object_without_properties(_param, [
        "arrow",
        "disabled",
        "size",
        "itemStyle",
        "effect",
        "active",
        "trailing",
        "crossAlign",
        "className",
        "style",
        "status",
        "highlight"
    ]);
    var leading = ppp.leading;
    if (leading === undefined) {
        var StatusIcon = statusIconMap[status];
        if (StatusIcon) {
            leading = /*#__PURE__*/ _jsx(StatusIcon, {});
        }
    }
    return /*#__PURE__*/ _jsx(Tile, _object_spread_props(_object_spread({}, ppp), {
        leading: leading,
        style: style,
        className: classNames("m78-lay", className, disabled && "__disabled", effect && "__effect", size && "__".concat(size), active && "__active", itemStyle && "__".concat(itemStyle), status && "__status", status && "__".concat(status), highlight && "__highlight"),
        trailing: (trailing || arrow) && /*#__PURE__*/ _jsxs(Row, {
            crossAlign: "center",
            children: [
                trailing,
                arrow && /*#__PURE__*/ _jsx(IconRight, {
                    className: "m78-lay_arrow"
                })
            ]
        }),
        crossAlign: crossAlign
    }));
}
_Lay.displayName = "Lay";
export { _Lay };
