import _define_property from "@swc/helpers/src/_define_property.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { IconInfo } from "@m78/icons/info.js";
import { IconSuccess } from "@m78/icons/success.js";
import { IconCloseOne } from "@m78/icons/close-one.js";
import { IconAttention } from "@m78/icons/attention.js";
import { Status } from "../types/index.js";
export function StatusIconInfo(props) {
    return /*#__PURE__*/ _jsx(IconInfo, _object_spread_props(_object_spread({
        fill: [
            "#333",
            "var(--m78-color)"
        ]
    }, props), {
        theme: "multi-color"
    }));
}
export function StatusIconSuccess(props) {
    return /*#__PURE__*/ _jsx(IconSuccess, _object_spread_props(_object_spread({
        fill: [
            "#333",
            "var(--m78-color-success)"
        ]
    }, props), {
        theme: "multi-color"
    }));
}
export function StatusIconWarning(props) {
    return /*#__PURE__*/ _jsx(IconAttention, _object_spread_props(_object_spread({
        fill: [
            "#333",
            "var(--m78-color-warning)"
        ]
    }, props), {
        theme: "multi-color"
    }));
}
export function StatusIconError(props) {
    return /*#__PURE__*/ _jsx(IconCloseOne, _object_spread_props(_object_spread({
        fill: [
            "#333",
            "var(--m78-color-error)"
        ]
    }, props), {
        theme: "multi-color"
    }));
}
var _obj;
export var statusIconMap = (_obj = {}, _define_property(_obj, Status.info, StatusIconInfo), _define_property(_obj, Status.success, StatusIconSuccess), _define_property(_obj, Status.warning, StatusIconWarning), _define_property(_obj, Status.error, StatusIconError), _obj);
