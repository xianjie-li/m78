import React, { useMemo } from "react";
import ReactDom from "react-dom";
import { getPortalsNode } from "@m78/utils";
var testEnv = process.env.NODE_ENV === "test";
export var _Portal = function(param) {
    var children = param.children, namespace = param.namespace;
    var dom = useMemo(function() {
        return getPortalsNode(namespace, {
            className: "m78-root m78"
        });
    }, [
        namespace
    ]);
    if (testEnv) return children;
    return /*#__PURE__*/ ReactDom.createPortal(children, dom);
};
_Portal.displayName = "Portal";
