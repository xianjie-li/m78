import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
import cls from "clsx";
import { isArray } from "@m78/utils";
/** pad space */ var _Spacer = function(param) {
    var width = param.width, height = param.height, children = param.children;
    var w;
    var h;
    if (width && !height) {
        w = width;
    }
    if (height && !width) {
        h = height;
    }
    if (!h && !w) {
        h = 16;
    }
    if (children && isArray(children)) {
        var child = children.reduce(function(prev, item, ind) {
            prev.push(item);
            if (ind !== children.length - 1) {
                prev.push(/*#__PURE__*/ _jsx(_Spacer, {
                    width: width,
                    height: height
                }, ind + Math.random()));
            }
            return prev;
        }, []);
        return child;
    }
    return /*#__PURE__*/ _jsx("div", {
        className: cls("m78 m78-spacer", !!w && "__inline"),
        style: {
            width: w,
            height: h
        }
    });
};
_Spacer.displayName = "Spacer";
export { _Spacer };
