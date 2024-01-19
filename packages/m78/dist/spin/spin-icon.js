import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import clsx from "clsx";
var S = 200;
var S_HALF = S / 2;
var BW = 60;
var BW_HALF = BW / 2;
var R = 100 - BW_HALF;
var ROUND_SIZE = Math.PI * S;
export function _SpinIcon(props) {
    return /*#__PURE__*/ _jsxs("svg", _object_spread_props(_object_spread({}, props), {
        width: S,
        height: S,
        viewBox: "0 0 ".concat(S, " ").concat(S),
        fill: "transparent",
        className: clsx("m78-spin-svg", props.className),
        children: [
            /*#__PURE__*/ _jsx("circle", {
                cx: S_HALF,
                cy: S_HALF,
                r: R,
                strokeWidth: BW,
                className: "m78-spin-svg_bg"
            }),
            /*#__PURE__*/ _jsx("circle", {
                cx: S_HALF,
                cy: S_HALF,
                r: R,
                strokeWidth: BW,
                stroke: "url(#Gradient1)",
                strokeDasharray: "".concat(ROUND_SIZE, " ").concat(ROUND_SIZE),
                strokeLinecap: "round",
                children: /*#__PURE__*/ _jsx("animate", {
                    attributeName: "stroke-dashoffset",
                    values: "".concat(ROUND_SIZE, ";0;").concat(ROUND_SIZE),
                    dur: "5s",
                    repeatCount: "indefinite"
                })
            }),
            /*#__PURE__*/ _jsx("defs", {
                children: /*#__PURE__*/ _jsxs("linearGradient", {
                    id: "Gradient1",
                    children: [
                        /*#__PURE__*/ _jsx("stop", {
                            offset: "0%",
                            className: "m78-spin-svg_stop1"
                        }),
                        /*#__PURE__*/ _jsx("stop", {
                            offset: "100%",
                            className: "m78-spin-svg_stop2"
                        })
                    ]
                })
            })
        ]
    }));
}
_SpinIcon.displayName = "SpinIcon";
