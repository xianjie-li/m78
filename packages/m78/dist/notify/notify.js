import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useMemo } from "react";
import { MASK_NAMESPACE, Size, Status, statusIconMap } from "../common/index.js";
import { IconClose } from "@m78/icons/icon-close.js";
import { Spin } from "../spin/index.js";
import { isArray, isFunction, pick } from "@m78/utils";
import createRenderApi from "@m78/render-api";
import { animated, config, useSpring } from "react-spring";
import { Button } from "../button/index.js";
import { useOverlaysMask } from "../overlay/index.js";
import { Transition } from "../transition/index.js";
import { Portal } from "../portal/index.js";
import { useMeasure } from "@m78/hooks";
import { NotifyPosition } from "./types.js";
import { _notifyQuickerBuilder, _initTransition, _useFixPad, _useInteractive, _useToggleController } from "./common.js";
var keys = Object.keys(NotifyPosition);
/**
 * 容器, 分类不同方向的notify并在对应方向渲染
 * */ export function _NotifyWrap(param) {
    var _children = param.children, children = _children === void 0 ? [] : _children;
    var lists = useMemo(function() {
        var map = {};
        children.forEach(function(item) {
            var props = item.props;
            var pos = props.position || NotifyPosition.center;
            if (!isArray(map[pos])) {
                map[pos] = [];
            }
            map[pos].push(item);
        });
        return map;
    }, [
        children
    ]);
    return keys.map(function(key) {
        var ref;
        return ((ref = lists[key]) === null || ref === void 0 ? void 0 : ref.length) && /*#__PURE__*/ _jsx("div", {
            className: "m78-notify_container m78-notify_".concat(key),
            children: lists[key]
        }, key);
    });
}
/**
 * 实现组件
 * */ export function notify(props) {
    var render = function render() {
        if (isFunction(customer)) {
            return /*#__PURE__*/ _jsx("div", {
                ref: ref1,
                className: "m78-notify_custom",
                children: customer(props)
            });
        }
        var statusIcon = statusIconMap[status];
        return /*#__PURE__*/ _jsxs("div", {
            ref: ref1,
            className: "m78-notify_item-main m78-notify_normal",
            children: [
                /*#__PURE__*/ _jsx(Spin, {
                    open: loading,
                    full: true,
                    inline: true,
                    size: Size.small
                }),
                statusIcon && /*#__PURE__*/ _jsx("div", {
                    className: "m78-notify_normal_leading",
                    children: statusIcon
                }),
                /*#__PURE__*/ _jsxs("div", {
                    className: "m78-notify_normal_cont",
                    children: [
                        props.title && /*#__PURE__*/ _jsx("div", {
                            className: "m78-notify_normal_title",
                            style: fixPad.title,
                            children: props.title
                        }),
                        content && /*#__PURE__*/ _jsx("div", {
                            style: fixPad.cont,
                            children: content
                        }),
                        props.actions && /*#__PURE__*/ _jsx("div", {
                            className: "m78-notify_normal_actions",
                            children: props.actions(props)
                        })
                    ]
                }),
                hasDuration && /*#__PURE__*/ _jsx(animated.div, {
                    style: {
                        width: process ? process.to(function(x) {
                            return "".concat(x.toFixed(2), "%");
                        }) : 0
                    },
                    className: "m78-notify_process"
                }),
                cancel && /*#__PURE__*/ _jsx(Button, {
                    icon: true,
                    size: Size.small,
                    className: "m78-notify_close-btn",
                    style: fixPadIcon,
                    onClick: function() {
                        return props.onChange(false);
                    },
                    children: /*#__PURE__*/ _jsx(IconClose, {
                        style: {
                            fontSize: 12
                        }
                    })
                })
            ]
        });
    };
    var status = props.status, content = props.content, open = props.open, cancel = props.cancel, _loading = props.loading, loading = _loading === void 0 ? false : _loading, _duration = props.duration, duration = _duration === void 0 ? 1200 : _duration, _position = props.position, position = _position === void 0 ? NotifyPosition.center : _position, customer = props.customer;
    // 此区间内视为有效duration
    var hasDuration = duration < 1000000;
    var ref = _sliced_to_array(useMeasure(), 2), bound = ref[0], ref1 = ref[1];
    var _ref = useSpring(function() {
        return _object_spread_props(_object_spread({}, _initTransition), {
            config: config.stiff
        });
    }), __ref = _sliced_to_array(_ref, 2), process = __ref[0].process, api = __ref[1], styles = _object_without_properties(_ref[0], [
        "process"
    ]);
    var share = {
        hasDuration: hasDuration,
        duration: duration,
        position: position,
        open: open,
        api: api,
        props: props,
        bound: bound
    };
    /**
   * 显示/隐藏相关行为控制
   * */ var dOpen = _useToggleController(share);
    /**
   * 根据是否开启了关闭按钮动态设置偏移, 防止其遮挡文字
   * */ var ref2 = _sliced_to_array(_useFixPad(share), 2), fixPad = ref2[0], fixPadIcon = ref2[1];
    /**
   * 所有启用了mask的overlay
   * */ var overlaysMask = useOverlaysMask({
        enable: dOpen && props.mask
    });
    /**
   * 处理props.interactive
   * */ var interactive = _useInteractive(share);
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            /*#__PURE__*/ _jsx(Portal, {
                namespace: MASK_NAMESPACE,
                children: /*#__PURE__*/ _jsx(Transition, {
                    open: dOpen && overlaysMask.isFirst,
                    type: "fade",
                    className: "m78 m78-mask",
                    mountOnEnter: true,
                    unmountOnExit: true
                })
            }),
            /*#__PURE__*/ _jsx(animated.div, {
                style: styles,
                className: "m78-notify_item",
                onMouseEnter: interactive.start,
                onMouseLeave: interactive.stop,
                onTouchStart: interactive.start,
                onTouchEnd: interactive.stop,
                children: render()
            })
        ]
    });
}
/** 创建api */ export var _notify = createRenderApi({
    component: notify,
    wrap: _NotifyWrap,
    namespace: "m78-notify"
});
/** 简单的loading实现 */ export function _loading(content) {
    var opt = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var o = pick(opt, [
        "position",
        "mask",
        "minDuration"
    ]);
    return _notify.render(_object_spread_props(_object_spread({
        minDuration: 800,
        mask: true
    }, o), {
        duration: Infinity,
        customer: function() {
            return /*#__PURE__*/ _jsx(Spin, {
                text: content
            });
        }
    }));
}
/** 快捷通知 */ var _notifyQuicker = _notifyQuickerBuilder();
var _notifyInfo = _notifyQuickerBuilder(Status.info);
var _notifySuccess = _notifyQuickerBuilder(Status.success);
var _notifyError = _notifyQuickerBuilder(Status.error);
var _notifyWarning = _notifyQuickerBuilder(Status.warning);
export var _quickers = {
    quicker: _notifyQuicker,
    info: _notifyInfo,
    error: _notifyError,
    success: _notifySuccess,
    warning: _notifyWarning
};
