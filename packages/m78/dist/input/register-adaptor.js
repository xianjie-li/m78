import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import { m78Config } from "../config/index.js";
import { _Input } from "./input.js";
import clsx from "clsx";
/** Input的table绑定 */ export var tableInputAdaptor = function(arg) {
    var _arg_element_props;
    return arg.binder(arg.element, {
        className: clsx("m78-table_input", arg.element.props.className),
        defaultValue: arg.value,
        border: false,
        autoFocus: true,
        clear: false,
        textArea: true,
        charCount: false,
        autoSize: false,
        onChange: arg.change,
        onSearch: function() {
            arg.submit();
        },
        style: _object_spread_props(_object_spread({}, (_arg_element_props = arg.element.props) === null || _arg_element_props === void 0 ? void 0 : _arg_element_props.style), {
            borderRadius: 0
        })
    });
};
var adaptor = {
    element: /*#__PURE__*/ _jsx(_Input, {}),
    tableAdaptor: tableInputAdaptor,
    name: "Input"
};
var adaptors = m78Config.get().formAdaptors;
m78Config.set({
    formAdaptors: _to_consumable_array(adaptors).concat([
        adaptor
    ])
});
