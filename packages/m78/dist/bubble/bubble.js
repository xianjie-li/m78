import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { isValidElement, useMemo } from "react";
import { Overlay, OverlayDirection } from "../overlay/index.js";
import { Size, statusIconMap, Z_INDEX_MESSAGE } from "../common/index.js";
import clsx from "clsx";
import { Button, ButtonColor } from "../button/index.js";
import { Row } from "../layout/index.js";
import { isBoolean, isFunction, omit } from "@m78/utils";
import { BubbleType, omitBubbleOverlayProps } from "./types.js";
import { COMMON_NS, Translation } from "../i18n/index.js";
import { TriggerType } from "@m78/trigger";
var defaultProps = {
    type: BubbleType.tooltip,
    childrenAsTarget: true,
    zIndex: Z_INDEX_MESSAGE,
    namespace: "BUBBLE",
    lockScroll: false,
    direction: OverlayDirection.top,
    arrow: true,
    autoFocus: false
};
var _Bubble = function(p) {
    var render = function render(meta) {
        var StatusIcon = statusIconMap[status] || icon;
        var cont = isFunction(props.content) ? props.content(meta) : props.content;
        if (type === BubbleType.tooltip) return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                StatusIcon && /*#__PURE__*/ _jsx("span", {
                    className: "mr-4 vm",
                    children: /*#__PURE__*/ isValidElement(StatusIcon) ? StatusIcon : /*#__PURE__*/ _jsx(StatusIcon, {})
                }),
                /*#__PURE__*/ _jsx("span", {
                    className: "vm",
                    children: cont
                })
            ]
        });
        if (type === BubbleType.confirm) {
            return /*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsxs(Row, {
                        crossAlign: "start",
                        children: [
                            StatusIcon && /*#__PURE__*/ _jsx("span", {
                                className: "mr-8 fs-20",
                                children: /*#__PURE__*/ isValidElement(StatusIcon) ? StatusIcon : /*#__PURE__*/ _jsx(StatusIcon, {})
                            }),
                            cont
                        ]
                    }),
                    /*#__PURE__*/ _jsxs(Row, {
                        className: "m78-bubble_confirm-btn",
                        mainAlign: "end",
                        children: [
                            /*#__PURE__*/ _jsx(Button, {
                                size: Size.small,
                                onClick: function() {
                                    return meta.setOpen(false);
                                },
                                children: cancelText || /*#__PURE__*/ _jsx(Translation, {
                                    ns: [
                                        COMMON_NS
                                    ],
                                    children: function(t) {
                                        return t("cancel");
                                    }
                                })
                            }),
                            /*#__PURE__*/ _jsx(Button, {
                                size: Size.small,
                                color: ButtonColor.primary,
                                onClick: function() {
                                    onConfirm === null || onConfirm === void 0 ? void 0 : onConfirm();
                                    meta.setOpen(false);
                                },
                                children: confirmText || /*#__PURE__*/ _jsx(Translation, {
                                    ns: [
                                        COMMON_NS
                                    ],
                                    children: function(t) {
                                        return t("confirm");
                                    }
                                })
                            })
                        ]
                    })
                ]
            });
        }
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                title && /*#__PURE__*/ _jsxs("div", {
                    className: "m78-bubble_title",
                    children: [
                        StatusIcon && /*#__PURE__*/ _jsx("span", {
                            className: "mr-4 fs-md",
                            children: /*#__PURE__*/ isValidElement(StatusIcon) ? StatusIcon : /*#__PURE__*/ _jsx(StatusIcon, {})
                        }),
                        title
                    ]
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: "m78-bubble_cont",
                    children: cont
                })
            ]
        });
    };
    var props = _object_spread({}, defaultProps, p);
    var title = props.title, type = props.type, onConfirm = props.onConfirm, cancelText = props.cancelText, confirmText = props.confirmText, icon = props.icon, status = props.status, other = _object_without_properties(props, [
        "title",
        "type",
        "onConfirm",
        "cancelText",
        "confirmText",
        "icon",
        "status"
    ]);
    var overlayProps = useMemo(function() {
        return omit(other, omitBubbleOverlayProps);
    }, [
        props
    ]);
    // 在不同类型下使用不同的mountOnEnter/unmountOnExit默认值
    var _useMemo = _sliced_to_array(useMemo(function() {
        var m = true;
        var unm = false;
        // 提示和确认框使用时渲染, 不用时卸载
        if (type === BubbleType.tooltip || type === BubbleType.confirm) {
            m = true;
            unm = true;
        }
        // 若用户明确传入则使用传入配置
        if (isBoolean(props.mountOnEnter)) m = props.mountOnEnter;
        if (isBoolean(props.unmountOnExit)) unm = props.unmountOnExit;
        return [
            m,
            unm
        ];
    }, [
        type,
        props.mountOnEnter,
        props.unmountOnExit
    ]), 2), mount = _useMemo[0], unmount = _useMemo[1];
    // 在不同类型下使用不同的triggerType默认值
    var triggerType = useMemo(function() {
        var t = type === BubbleType.tooltip ? TriggerType.active : TriggerType.click;
        if (props.triggerType !== undefined) t = props.triggerType;
        return t;
    }, [
        type,
        props.triggerType
    ]);
    return /*#__PURE__*/ _jsx(Overlay, _object_spread_props(_object_spread({}, overlayProps), {
        triggerType: triggerType,
        className: clsx("m78-init m78-bubble", "__".concat(type), props.className),
        content: render,
        mountOnEnter: mount,
        unmountOnExit: unmount
    }));
};
_Bubble.displayName = "Bubble";
export { _Bubble };
