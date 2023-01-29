import _define_property from "@swc/helpers/src/_define_property.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { IconInfo } from "@m78/icons/icon-info.js";
import { IconCheckCircle } from "@m78/icons/icon-check-circle.js";
import { IconError } from "@m78/icons/icon-error.js";
import { Status } from "../types/index.js";
export function StatusIconInfo() {
    return /*#__PURE__*/ _jsx(IconInfo, {
        className: "color"
    });
}
export function StatusIconSuccess() {
    return /*#__PURE__*/ _jsx(IconCheckCircle, {
        className: "color-success"
    });
}
export function StatusIconWarning() {
    return /*#__PURE__*/ _jsx(IconError, {
        className: "color-warning"
    });
}
export function StatusIconError() {
    return /*#__PURE__*/ _jsx(IconError, {
        className: "color-error"
    });
}
var _obj;
export var statusIconMap = (_obj = {}, _define_property(_obj, Status.info, /*#__PURE__*/ _jsx(StatusIconInfo, {})), _define_property(_obj, Status.success, /*#__PURE__*/ _jsx(StatusIconSuccess, {})), _define_property(_obj, Status.warning, /*#__PURE__*/ _jsx(StatusIconWarning, {})), _define_property(_obj, Status.error, /*#__PURE__*/ _jsx(StatusIconError, {})), _obj);
