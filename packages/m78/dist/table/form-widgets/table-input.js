import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from "../../input/index.js";
import { Size } from "../../common/index.js";
import React from "react";
/** Input的table绑定 */ export var tableInput = function(conf) {
    return function(arg) {
        return /*#__PURE__*/ _jsx(Input, _object_spread_props(_object_spread({}, conf), {
            className: "m78-table_input",
            size: Size.small,
            defaultValue: arg.value,
            border: false,
            autoFocus: true,
            clear: false,
            onChange: arg.change,
            onSearch: function() {
                arg.submit();
            }
        }));
    };
};
