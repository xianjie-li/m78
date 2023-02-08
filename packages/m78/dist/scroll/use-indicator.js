import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect } from "react";
import { If } from "../fork/index.js";
export var _useIndicator = function(ctx, methods) {
    var bound = ctx.bound, props = ctx.props, state = ctx.state, xEnabled = ctx.xEnabled, yEnabled = ctx.yEnabled;
    /** 滚动指示器初始化&更新 */ useEffect(function() {
        methods.refreshIndicator();
    }, [
        bound.width,
        bound.height
    ]);
    if (!props.scrollIndicator) return;
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(If, {
                when: xEnabled && !state.touchLeft,
                children: /*#__PURE__*/ _jsx("div", {
                    className: "m78-scroll_indicator __start"
                })
            }),
            /*#__PURE__*/ _jsx(If, {
                when: xEnabled && !state.touchRight,
                children: /*#__PURE__*/ _jsx("div", {
                    className: "m78-scroll_indicator"
                })
            }),
            /*#__PURE__*/ _jsx(If, {
                when: yEnabled && !state.touchTop,
                children: /*#__PURE__*/ _jsx("div", {
                    className: "m78-scroll_indicator __start __is-y"
                })
            }),
            /*#__PURE__*/ _jsx(If, {
                when: yEnabled && !state.touchBottom,
                children: /*#__PURE__*/ _jsx("div", {
                    className: "m78-scroll_indicator __is-y"
                })
            })
        ]
    });
};
