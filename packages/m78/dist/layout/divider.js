import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import cls from "clsx";
export var _Divider = function(param) {
    var vertical = param.vertical, width = param.width, height = param.height, color = param.color, _margin = param.margin, margin = _margin === void 0 ? 12 : _margin;
    var marginStr = vertical ? "0 ".concat(margin, "px") : "".concat(margin, "px 0");
    return /*#__PURE__*/ _jsx("div", {
        className: cls("m78 m78-divider", vertical && "__vertical"),
        style: {
            width: width,
            height: height,
            backgroundColor: color,
            margin: marginStr
        }
    });
};
_Divider.displayName = "Divider";
