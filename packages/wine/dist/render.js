import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { animated } from "react-spring";
import React from "react";
import { keypressAndClick } from "@m78/utils";
import { clsx } from "clsx";
/** 渲染内置顶栏 */ export var renderBuiltInHeader = function(props, state, instance, isFull) {
    return /*#__PURE__*/ _jsxs("div", _object_spread_props(_object_spread({
        className: "m78-wine_header"
    }, props), {
        onContextMenu: function(e) {
            return e.preventDefault();
        },
        children: [
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_header-content",
                children: state.header
            }),
            /*#__PURE__*/ _jsxs("div", {
                className: "m78-wine_header-actions",
                onMouseDown: function(e) {
                    return e.stopPropagation();
                },
                children: [
                    /*#__PURE__*/ _jsx("span", _object_spread_props(_object_spread({
                        tabIndex: 0,
                        className: "m78-wine_btn",
                        role: "button",
                        "aria-label": "hide modal"
                    }, keypressAndClick(function() {
                        var _state_onChange;
                        return (_state_onChange = state.onChange) === null || _state_onChange === void 0 ? void 0 : _state_onChange.call(state, false);
                    })), {
                        children: /*#__PURE__*/ _jsx("span", {
                            className: "m78-wine_hide-btn"
                        })
                    })),
                    isFull && /*#__PURE__*/ _jsx("span", _object_spread_props(_object_spread({
                        tabIndex: 0,
                        className: "m78-wine_btn",
                        role: "button",
                        "aria-label": "minimize modal"
                    }, keypressAndClick(instance.resize)), {
                        children: /*#__PURE__*/ _jsx("span", {
                            className: "m78-wine_resize-btn"
                        })
                    })),
                    !isFull && /*#__PURE__*/ _jsx("span", _object_spread_props(_object_spread({
                        tabIndex: 0,
                        className: "m78-wine_btn",
                        role: "button",
                        "aria-label": "maximize modal"
                    }, keypressAndClick(instance.full)), {
                        children: /*#__PURE__*/ _jsx("span", {
                            className: "m78-wine_max-btn"
                        })
                    })),
                    /*#__PURE__*/ _jsx("span", _object_spread_props(_object_spread({
                        tabIndex: 0,
                        className: "m78-wine_btn __warning",
                        role: "button",
                        "aria-label": "close modal"
                    }, keypressAndClick(state.onDispose)), {
                        children: /*#__PURE__*/ _jsx("span", {
                            className: "m78-wine_dispose-btn"
                        })
                    }))
                ]
            })
        ]
    }));
};
/** 渲染主内容 */ export function render(ctx, methods, instance) {
    var state = ctx.state, insideState = ctx.insideState;
    var resize = methods.resize, full = methods.full, top = methods.top;
    var headerCustomer = state.headerCustomer || renderBuiltInHeader;
    return /*#__PURE__*/ _jsxs(animated.div, {
        style: _object_spread(_object_spread_props(_object_spread({}, state.style), {
            zIndex: insideState.isTop ? state.zIndex + 1 : state.zIndex
        }), ctx.spProps),
        className: clsx("m78-wine", state.className, {
            __full: insideState.isFull,
            __active: insideState.isTop
        }),
        ref: ctx.wrapElRef,
        onTouchStart: top,
        onMouseDown: top,
        tabIndex: -1,
        role: "dialog",
        "aria-modal": true,
        children: [
            /*#__PURE__*/ _jsxs("div", {
                className: "m78-wine_decorate",
                children: [
                    headerCustomer({
                        ref: ctx.headerElRef,
                        onDoubleClick: function() {
                            return insideState.isFull ? resize() : full();
                        }
                    }, state, instance, insideState.isFull),
                    /*#__PURE__*/ _jsx("div", {
                        className: "m78-wine_content m78-wine_scrollbar",
                        style: {
                            top: insideState.headerHeight
                        },
                        children: /*#__PURE__*/ _jsx(React.Fragment, {
                            children: state.content
                        })
                    }, insideState.refreshKey)
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_drag-line-l",
                ref: ctx.dragLineLRef
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_drag-line-t",
                ref: ctx.dragLineTRef
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_drag-line-r",
                ref: ctx.dragLineRRef
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_drag-line-b",
                ref: ctx.dragLineBRef
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_drag-line-rb",
                ref: ctx.dragLineRBRef
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_drag-line-lb",
                ref: ctx.dragLineLBRef
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_drag-line-lt",
                ref: ctx.dragLineLTRef
            }),
            /*#__PURE__*/ _jsx("div", {
                className: "m78-wine_drag-line-rt",
                ref: ctx.dragLineRTRef
            })
        ]
    });
}
