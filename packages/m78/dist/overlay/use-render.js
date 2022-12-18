import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Transition, TransitionBase, TransitionType } from "../transition/index.js";
import React from "react";
import clsx from "clsx";
import { Portal } from "../portal/index.js";
import { animated } from "react-spring";
import { isFunction } from "@m78/utils";
import { MASK_NAMESPACE } from "../common/index.js";
import { _Arrow as Arrow } from "./arrow.js";
import { _getArrowBasePosition, dragContext, transitionConfig } from "./common.js";
import { _MountTrigger as MountTrigger } from "./mount-trigger.js";
var AnimatedArrow = animated(Arrow);
export function _useRender(ctx, methods, lifeCycle) {
    var renderArrow = function renderArrow() {
        var ref;
        if (!methods.isArrowEnable()) return false;
        var _arrowSize = _sliced_to_array(props.arrowSize, 2), w = _arrowSize[0], h = _arrowSize[1];
        var _ref = _getArrowBasePosition(state.lastDirection, props.arrowSize), rotate = _ref.rotate, pos = _object_without_properties(_ref, [
            "rotate"
        ]);
        return /*#__PURE__*/ _jsx(AnimatedArrow, _object_spread_props(_object_spread({}, props.arrowProps), {
            width: w,
            height: h,
            style: _object_spread_props(_object_spread({}, (ref = props.arrowProps) === null || ref === void 0 ? void 0 : ref.style, pos), {
                transform: arrowSp.offset.to(function(o) {
                    return "rotate(".concat(rotate, "deg) translate3d(").concat(o, "px, 0, 0)");
                })
            })
        }));
    };
    var renderContent = function renderContent() {
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
                config: transitionConfig
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
    };
    var renderMask = function renderMask() {
        var ref;
        return /*#__PURE__*/ _jsx(Transition, _object_spread_props(_object_spread({}, props.maskProps), {
            open: open && overlaysMask.isFirst,
            type: TransitionType.fade,
            className: clsx("m78 m78-mask", (ref = props.maskProps) === null || ref === void 0 ? void 0 : ref.className),
            mountOnEnter: true,
            unmountOnExit: true
        }));
    };
    var render = function render() {
        var ref, ref1;
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
                            className: clsx("m78 m78-overlay_wrap", (ref = props.extraProps) === null || ref === void 0 ? void 0 : ref.className),
                            style: _object_spread_props(_object_spread({}, (ref1 = props.extraProps) === null || ref1 === void 0 ? void 0 : ref1.style, sp), {
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
    };
    var props = ctx.props, state = ctx.state, arrowSp = ctx.arrowSp, open = ctx.open, containerRef = ctx.containerRef, overlaysMask = ctx.overlaysMask, trigger = ctx.trigger, sp = ctx.sp;
    return render();
}
