import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import cls from "clsx";
import { useDelayToggle } from "@m78/hooks";
import { Transition } from "../transition/index.js";
import { _SpinIcon } from "./spin-icon.js";
export var _Spin = function(_param) {
    var size = _param.size, inline = _param.inline, _param_text = _param.text, text = _param_text === void 0 ? "" : _param_text, full = _param.full, _param_open = _param.open, open = _param_open === void 0 ? true : _param_open, className = _param.className, _param_minDuration = _param.minDuration, minDuration = _param_minDuration === void 0 ? 300 : _param_minDuration, offset = _param.offset, props = _object_without_properties(_param, [
        "size",
        "inline",
        "text",
        "full",
        "open",
        "className",
        "minDuration",
        "offset"
    ]);
    var innerShow = useDelayToggle(open, minDuration);
    var _obj;
    return /*#__PURE__*/ _jsx(Transition, _object_spread_props(_object_spread({}, props), {
        open: innerShow,
        type: "fade",
        mountOnEnter: true,
        unmountOnExit: true,
        className: cls(className, "m78 m78-spin", (_obj = {}, _define_property(_obj, "__".concat(size), !!size), _define_property(_obj, "__inline", inline), _define_property(_obj, "__full", full), _obj)),
        children: /*#__PURE__*/ _jsxs("div", {
            className: "m78-spin_inner",
            style: {
                top: offset
            },
            children: [
                /*#__PURE__*/ _jsx(_SpinIcon, {
                    className: "m78-spin_unit"
                }),
                text && /*#__PURE__*/ _jsxs("span", {
                    className: "m78-spin_text",
                    children: [
                        text,
                        /*#__PURE__*/ _jsx("span", {
                            className: "m78-spin_ellipsis"
                        })
                    ]
                })
            ]
        })
    }));
};
_Spin.displayName = "Spin";
