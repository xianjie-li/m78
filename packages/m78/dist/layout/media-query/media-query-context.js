import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useRef } from "react";
import { useFn } from "@m78/hooks";
import { _mediaQueryCtx } from "./context.js";
import { _onChangeHandle } from "./common.js";
import _MediaQueryCalc from "./media-query-calc.js";
/**
 * 将其作为要监听容器的子节点, 能够提供一个独立的MediaQuery上下文，其内部的所有MediaQuery会在此上下文中单独管理, 用于要为窗口以外的节点监听断点时
 * - MediaQueryContext会在容器内挂载一个用于计算尺寸的节点, 你需要容器的position为static以外的值
 * */ export var _MediaQueryContext = function(param) {
    var children = param.children;
    var value = useRef({
        onChange: function() {},
        changeListeners: [],
        meta: null
    });
    value.current.onChange = useFn(function(size) {
        return _onChangeHandle(size, value.current);
    });
    return /*#__PURE__*/ _jsxs(_mediaQueryCtx.Provider, {
        value: value.current,
        children: [
            children,
            /*#__PURE__*/ _jsx(_MediaQueryCalc, {})
        ]
    });
};
_MediaQueryContext.displayName = "MediaQueryContext";
