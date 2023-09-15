import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { isObject } from "@m78/utils";
import React from "react";
/** 默认的表单 onChange 值获取器 */ export var _defaultValueGetter = function(value) {
    if (isObject(value) && "target" in value && "value" in value.target) {
        return value.target.value;
    }
    return value;
};
/** 默认适配器 */ export var _defaultAdaptor = function(args) {
    if (!args.element) return null;
    return /*#__PURE__*/ React.cloneElement(args.element, _object_spread_props(_object_spread({}, args.element.props), {
        value: args.bind.value,
        onChange: args.bind.onChange
    }));
};
/** 作为回退使用的默认customer */ export var _defaultCustomer = function(el) {
    return el;
};
export var EMPTY_NAME = "__EMPTY_NAME__";
export var EMPTY_LIST_NAME = "__EMPTY_LIST_NAME__";
