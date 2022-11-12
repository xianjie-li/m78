import React from "react";
import { isFunction } from "@m78/utils";
export function _createState(seed, useState) {
    var _State = function(param) {
        var children = param.children, selector = param.selector, equalFn = param.equalFn;
        var state = useState(selector, equalFn);
        if (isFunction(children)) {
            return children(state);
        }
        return null;
    };
    return _State;
}
