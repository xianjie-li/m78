import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Transition, TransitionBase, TransitionType } from "../transition/index.js";
import React from "react";
import clsx from "clsx";
import { Portal } from "../portal/index.js";
import { animated } from "react-spring";
import { isFunction } from "@m78/utils";
import { MASK_NAMESPACE } from "../common/index.js";
import { _Arrow as Arrow } from "./arrow.js";
import { _getArrowBasePosition, dragContext, overlayTransitionConfig } from "./common.js";
import { _MountTrigger as MountTrigger } from "./mount-trigger.js";
var AnimatedArrow = animated(Arrow);
export function _useRender(ctx, lifeCycle) {
    var props = ctx.props, state = ctx.state, arrowSp = ctx.arrowSp, open = ctx.open, containerRef = ctx.containerRef, overlaysMask = ctx.overlaysMask, trigger = ctx.trigger, sp = ctx.sp, methods = ctx.methods;
    function renderArrow() {
        var _props_arrowProps;
        if (!methods.isArrowEnable()) return false;
        var _props_arrowSize = _sliced_to_array(props.arrowSize, 2), w = _props_arrowSize[0], h = _props_arrowSize[1];
        var _$_getArrowBasePosition = _getArrowBasePosition(state.lastDirection, props.arrowSize), rotate = _$_getArrowBasePosition.rotate, pos = _object_without_properties(_$_getArrowBasePosition, [
            "rotate"
        ]);
        return /*#__PURE__*/ _jsx(AnimatedArrow, _object_spread_props(_object_spread({}, props.arrowProps), {
            width: w,
            height: h,
            style: _object_spread_props(_object_spread({}, (_props_arrowProps = props.arrowProps) === null || _props_arrowProps === void 0 ? void 0 : _props_arrowProps.style, pos), {
                transform: arrowSp.offset.to(function(o) {
                    return "rotate(".concat(rotate, "deg) translate3d(").concat(o, "px, 0, 0)");
                })
            })
        }));
    }
    function renderContent() {
        var transition = props.transition;
        var TransitionComponent = transition ? TransitionBase : Transition;
        return /*#__PURE__*/ React.createElement(TransitionComponent, {
            open: open,
            type: props.transitionType,
            className: clsx("m78-overlay", props.className, state.lastDirection && "__".concat(state.lastDirection)),
            style: props.style,
            mountOnEnter: props.mountOnEnter,
            unmountOnExit: props.unmountOnExit,
            from: transition === null || transition === void 0 ? void 0 : transition.from,
            to: transition === null || transition === void 0 ? void 0 : transition.to,
            springProps: _object_spread({
                config: overlayTransitionConfig
            }, props.springProps),
            innerRef: props.innerRef,
            onTouchStart: methods.activeContent,
            onClick: methods.activeContent,
            onMouseEnter: methods.activeContent,
            onMouseLeave: methods.unActiveContent
        }, /*#__PURE__*/ _jsxs(dragContext.Provider, {
            value: {
                onDrag: methods.onDragHandle,
                getXY: methods.getDragInitXY,
                getBound: methods.getDragBound
            },
            children: [
                isFunction(props.content) ? props.content(ctx.customRenderMeta) : props.content,
                /*#__PURE__*/ _jsx(MountTrigger, {
                    onMount: lifeCycle.onContentMount,
                    onUnmount: lifeCycle.onContentUnmount
                }),
                renderArrow()
            ]
        }));
    }
    function renderMask() {
        var _props_maskProps;
        return /*#__PURE__*/ _jsx(Transition, _object_spread_props(_object_spread({}, props.maskProps), {
            open: open && overlaysMask.isFirst,
            type: TransitionType.fade,
            className: clsx("m78 m78-mask", (_props_maskProps = props.maskProps) === null || _props_maskProps === void 0 ? void 0 : _props_maskProps.className),
            mountOnEnter: true,
            unmountOnExit: true
        }));
    }
    function render() {
        var _props_extraProps, _props_extraProps1;
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsxs(Portal, {
                    namespace: props.namespace,
                    children: [
                        /*#__PURE__*/ _jsx(Portal, {
                            namespace: MASK_NAMESPACE,
                            children: renderMask()
                        }),
                        /*#__PURE__*/ _jsx(animated.div, _object_spread_props(_object_spread({
                            tabIndex: -1
                        }, props.extraProps), {
                            ref: containerRef,
                            className: clsx("m78 m78-overlay_wrap", (_props_extraProps = props.extraProps) === null || _props_extraProps === void 0 ? void 0 : _props_extraProps.className),
                            style: _object_spread_props(_object_spread({}, (_props_extraProps1 = props.extraProps) === null || _props_extraProps1 === void 0 ? void 0 : _props_extraProps1.style, sp), {
                                visibility: open ? "visible" : "hidden",
                                zIndex: props.zIndex,
                                opacity: sp.isHidden.to(function(hide) {
                                    return hide ? 0 : 1;
                                }),
                                pointerEvents: sp.isHidden.to(function(hide) {
                                    return hide ? "none" : undefined;
                                })
                            }),
                            children: renderContent()
                        }))
                    ]
                }),
                trigger.node
            ]
        });
    }
    return render();
}
