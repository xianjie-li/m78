import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import { Trans as TransLib, Translation as TranslationLib, useTranslation as useTranslationLib } from "react-i18next";
import React from "react";
import { i18n } from "./index.js";
export var _useTranslation = function() {
    for(var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++){
        params[_key] = arguments[_key];
    }
    return useTranslationLib(params[0], _object_spread_props(_object_spread({}, params[1]), {
        i18n: i18n
    }));
};
export var _Translation = function(props) {
    return /*#__PURE__*/ _jsx(TranslationLib, _object_spread_props(_object_spread({}, props), {
        i18n: i18n,
        children: props.children
    }));
};
// @ts-ignore
_Translation.displayName = "Translation";
export var _Trans = function(props) {
    return /*#__PURE__*/ _jsx(TransLib, _object_spread_props(_object_spread({}, props), {
        i18n: i18n
    }));
};
// @ts-ignore
_Trans.displayName = "Translation";
