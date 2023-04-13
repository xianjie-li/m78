import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from "react";
import { Button } from "../button/index.js";
import { IconClose } from "@m78/icons/icon-close.js";
import { Spin } from "../spin/index.js";
import { useFormState } from "@m78/hooks";
import cls from "clsx";
import { isFunction, isString, omit } from "@m78/utils";
import { OverlayDragHandle, omitApiProps, Overlay } from "../overlay/index.js";
import createRenderApi from "@m78/render-api";
import { Status, statusIconMap } from "../common/index.js";
import { COMMON_NS, DIALOG_NS, Translation } from "../i18n/index.js";
var defaultProps = {
    width: 350,
    cancel: false,
    confirm: true,
    closeIcon: true,
    loading: false,
    namespace: "DIALOG",
    mask: true
};
var _DialogBase = function(props) {
    var renderDefaultFooter = function renderDefaultFooter() {
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                cancel && /*#__PURE__*/ _jsx(Button, {
                    onClick: function() {
                        return closeHandle();
                    },
                    children: isString(cancel) ? cancel : /*#__PURE__*/ _jsx(Translation, {
                        ns: [
                            COMMON_NS
                        ],
                        children: function(t) {
                            return t("cancel");
                        }
                    })
                }),
                confirm && /*#__PURE__*/ _jsx(Button, {
                    color: "primary",
                    onClick: function() {
                        return closeHandle(true);
                    },
                    children: isString(confirm) ? confirm : /*#__PURE__*/ _jsx(Translation, {
                        ns: [
                            COMMON_NS
                        ],
                        children: function(t) {
                            return t("confirm");
                        }
                    })
                })
            ]
        });
    };
    var renderDefault = function renderDefault() {
        var cont = isFunction(content) ? content(closeHandle) : content;
        var _footer = isFunction(footer) ? footer(closeHandle) : footer;
        var _header = isFunction(header) ? header(closeHandle) : header;
        var statusIcon = statusIconMap[status];
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                draggable && /*#__PURE__*/ _jsx(OverlayDragHandle, {
                    children: function(bind) {
                        return /*#__PURE__*/ _jsx("span", _object_spread_props(_object_spread({}, bind()), {
                            className: "m78-dialog_drag-handle"
                        }));
                    }
                }),
                /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, headerProps), {
                    className: cls("m78-dialog_title", headerProps === null || headerProps === void 0 ? void 0 : headerProps.className),
                    children: _header || /*#__PURE__*/ _jsxs("span", {
                        children: [
                            statusIcon && /*#__PURE__*/ _jsx("span", {
                                className: "mr-4 vm",
                                children: statusIcon
                            }),
                            /*#__PURE__*/ _jsx("span", {
                                className: "vm",
                                children: title || /*#__PURE__*/ _jsx(Translation, {
                                    ns: [
                                        DIALOG_NS
                                    ],
                                    children: function(t) {
                                        return t("default title");
                                    }
                                })
                            })
                        ]
                    })
                })),
                /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, contentProps), {
                    className: cls("m78-dialog_cont", contentProps === null || contentProps === void 0 ? void 0 : contentProps.className),
                    children: cont
                })),
                /*#__PURE__*/ _jsx("div", _object_spread_props(_object_spread({}, footerProps), {
                    className: cls("m78-dialog_footer", footerProps === null || footerProps === void 0 ? void 0 : footerProps.className, {
                        __full: flexBtn
                    }),
                    children: _footer || renderDefaultFooter()
                }))
            ]
        });
    };
    var render = function render() {
        return /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                closeIcon && /*#__PURE__*/ _jsx(Button, {
                    icon: true,
                    className: "m78-dialog_close-icon",
                    onClick: function() {
                        return closeHandle();
                    },
                    size: "small",
                    children: /*#__PURE__*/ _jsx(IconClose, {})
                }),
                /*#__PURE__*/ _jsx(Spin, {
                    full: true,
                    open: innerLoading || loading,
                    text: "请稍候"
                }),
                renderDefault()
            ]
        });
    };
    var width = props.width, title = props.title, cancel = props.cancel, confirm = props.confirm, closeIcon = props.closeIcon, loading = props.loading, flexBtn = props.flexBtn, footer = props.footer, header = props.header, content = props.content, status = props.status, contentProps = props.contentProps, footerProps = props.footerProps, headerProps = props.headerProps, className = props.className, style = props.style, clickAwayClosable = props.clickAwayClosable, onClose = props.onClose, draggable = props.draggable, other = _object_without_properties(props, [
        "width",
        "title",
        "cancel",
        "confirm",
        "closeIcon",
        "loading",
        "flexBtn",
        "footer",
        "header",
        "content",
        "status",
        "contentProps",
        "footerProps",
        "headerProps",
        "className",
        "style",
        "clickAwayClosable",
        "onClose",
        "draggable"
    ]);
    // 和loading共同管理加载状态
    var ref = _sliced_to_array(useState(false), 2), innerLoading = ref[0], setInnerLoading = ref[1];
    /** 代理defaultOpen/open/onChange, 实现对应接口 */ var ref1 = _sliced_to_array(useFormState(props, false, {
        defaultValueKey: "defaultOpen",
        triggerKey: "onChange",
        valueKey: "open"
    }), 2), open = ref1[0], setOpen = ref1[1];
    var closeHandle = function() {
        var _ref = _async_to_generator(function() {
            var isConfirm, r, ret;
            var _arguments = arguments;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        isConfirm = _arguments.length > 0 && _arguments[0] !== void 0 ? _arguments[0] : false;
                        if (!onClose) {
                            setOpen(false);
                            return [
                                2
                            ];
                        }
                        r = onClose(isConfirm);
                        if (r === false) {
                            return [
                                2
                            ];
                        }
                        if (!(r instanceof Object && "then" in r && "catch" in r)) return [
                            3,
                            5
                        ];
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            ,
                            3,
                            4
                        ]);
                        setInnerLoading(true);
                        return [
                            4,
                            r
                        ];
                    case 2:
                        ret = _state.sent();
                        if (ret === false) {
                            return [
                                2
                            ];
                        }
                        setOpen(false);
                        return [
                            3,
                            4
                        ];
                    case 3:
                        setInnerLoading(false);
                        return [
                            7
                        ];
                    case 4:
                        return [
                            2
                        ];
                    case 5:
                        setOpen(false);
                        return [
                            2
                        ];
                }
            });
        });
        return function closeHandle() {
            return _ref.apply(this, arguments);
        };
    }();
    return /*#__PURE__*/ _jsx(Overlay, _object_spread_props(_object_spread({}, other), {
        className: cls("m78 m78-init m78-dialog m78-scroll-bar", className),
        style: _object_spread({
            width: width
        }, style),
        clickAwayClosable: loading ? false : clickAwayClosable,
        open: open,
        onChange: function(nOpen) {
            nOpen ? setOpen(nOpen) : closeHandle();
        },
        content: render()
    }));
};
_DialogBase.defaultProps = defaultProps;
_DialogBase.displayName = "Dialog";
/** 创建全局api */ var api = createRenderApi({
    component: _DialogBase,
    defaultState: {
        mountOnEnter: true,
        unmountOnExit: true
    },
    omitState: function(state) {
        return omit(state, omitApiProps);
    }
});
/** 生成便捷提示api */ var dialogQuickerBuilder = function(status) {
    return function(content, title, cancel) {
        return new Promise(function(resolve, reject) {
            api.render({
                status: status,
                content: content,
                title: title,
                cancel: cancel,
                onClose: function(isConfirm) {
                    isConfirm ? resolve() : reject();
                }
            });
        });
    };
};
var _Dialog = Object.assign(_DialogBase, api, {
    quicker: dialogQuickerBuilder(),
    info: dialogQuickerBuilder(Status.info),
    error: dialogQuickerBuilder(Status.error),
    success: dialogQuickerBuilder(Status.success),
    warning: dialogQuickerBuilder(Status.warning)
});
export { _Dialog };
