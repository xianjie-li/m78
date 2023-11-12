import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { ensureArray, isFunction } from "@m78/utils";
import { Button } from "../button/index.js";
import { Spin } from "../spin/index.js";
import { Result } from "../result/index.js";
import { Lay } from "../lay/index.js";
import { IllustrationEmpty1, Size, Status, StatusIconError } from "../common/index.js";
import clsx from "clsx";
import { COMMON_NS, FORK_NS, Translation } from "../i18n/index.js";
var _AsyncRender = function(param) {
    var children = param.children, send = param.send, loading = param.loading, error = param.error, timeout = param.timeout, hasData = param.hasData, forceRender = param.forceRender, loadingFull = param.loadingFull, className = param.className, style = param.style, _loadingText = param.loadingText, loadingText = _loadingText === void 0 ? "" : _loadingText, _emptyText = param.emptyText, emptyText = _emptyText === void 0 ? "" : _emptyText, _errorText = param.errorText, errorText = _errorText === void 0 ? "" : _errorText, _timeoutText = param.timeoutText, timeoutText = _timeoutText === void 0 ? "" : _timeoutText, customLoading = param.customLoading, customNotice = param.customNotice, customEmpty = param.customEmpty;
    var renderForks = function renderForks() {
        if (loading) {
            return customLoading || /*#__PURE__*/ _jsx(Spin, {
                text: loadingText || /*#__PURE__*/ _jsx(Translation, {
                    ns: FORK_NS,
                    children: function(t) {
                        return t("loading");
                    }
                }),
                className: "ptb-12",
                full: loadingFull
            });
        }
        if (error || timeout) {
            var title = timeout ? timeoutNode : errorNode;
            var msg = (error === null || error === void 0 ? void 0 : error.message) || (typeof error === "string" ? error : "");
            return customNotice ? customNotice(title, msg) : /*#__PURE__*/ _jsx(Lay, {
                status: Status.error,
                leading: /*#__PURE__*/ _jsx(StatusIconError, {}),
                crossAlign: "start",
                title: title,
                effect: false,
                desc: /*#__PURE__*/ _jsxs("div", {
                    children: [
                        msg && /*#__PURE__*/ _jsx("div", {
                            className: "color-error",
                            children: msg
                        }),
                        /*#__PURE__*/ _jsxs("div", {
                            style: {
                                padding: "8px 0 4px"
                            },
                            children: [
                                send ? /*#__PURE__*/ _jsx(Translation, {
                                    ns: FORK_NS,
                                    children: function(t) {
                                        return t("retry tip with button");
                                    }
                                }) : /*#__PURE__*/ _jsx(Translation, {
                                    ns: FORK_NS,
                                    children: function(t) {
                                        return t("retry tip");
                                    }
                                }),
                                reloadBtn
                            ]
                        })
                    ]
                })
            });
        }
        if (!hasData && !loading) {
            return customEmpty || /*#__PURE__*/ _jsx(Result, {
                size: Size.small,
                icon: /*#__PURE__*/ _jsx(IllustrationEmpty1, {
                    height: 120
                }),
                desc: emptyText || /*#__PURE__*/ _jsx(Translation, {
                    ns: COMMON_NS,
                    children: function(t) {
                        return t("empty");
                    }
                }),
                style: {
                    padding: 0
                },
                actions: reloadBtn
            });
        }
    };
    var renderFeedback = function renderFeedback() {
        return /*#__PURE__*/ _jsx("div", {
            className: clsx("m78 m78-fork", className),
            style: style,
            children: feedbackNode
        });
    };
    var renderChild = function() {
        return isFunction(children) ? children() : children;
    };
    var errorNode = errorText || /*#__PURE__*/ _jsx(Translation, {
        ns: FORK_NS,
        children: function(t) {
            return t("error");
        }
    });
    var timeoutNode = timeoutText || /*#__PURE__*/ _jsx(Translation, {
        ns: FORK_NS,
        children: function(t) {
            return t("timeout");
        }
    });
    // 重试按钮
    var reloadBtn = send ? /*#__PURE__*/ _jsx(Button, {
        onClick: send,
        color: "primary",
        text: true,
        size: "small",
        style: {
            top: -1 /* 视觉居中 */ 
        },
        children: /*#__PURE__*/ _jsx(Translation, {
            ns: FORK_NS,
            children: function(t) {
                return t("reload");
            }
        })
    }) : null;
    var feedbackNode = renderForks();
    return /*#__PURE__*/ _jsxs(_Fragment, {
        children: [
            (!feedbackNode || forceRender) && renderChild(),
            feedbackNode && renderFeedback()
        ]
    });
};
/* 根据条件渲染或卸载内部的组件 */ var _If = function(param) {
    var when = param.when, children = param.children;
    when = !!when;
    var isFuncChild = isFunction(children);
    return when && (isFuncChild ? children() : children);
};
/**
 * 显示或隐藏内容
 *
 * 组件内部通过设置 display: 'none' 隐藏元素，如果子节点不是 ReactElement，会被包裹在一个 div 中
 *  */ var _Toggle = function(param) {
    var when = param.when, children = param.children;
    var hideChild = function hideChild() {
        var hideProps = {
            display: "none"
        };
        // 克隆并返回一个reactElement的隐藏版本(需要其支持style参数)
        var hideReactElement = function(rEl, key) {
            return /*#__PURE__*/ React.cloneElement(rEl, {
                key: key,
                style: _object_spread({}, rEl.props.style, hideProps)
            });
        };
        if (/*#__PURE__*/ React.isValidElement(children)) {
            return hideReactElement(children);
        }
        return /*#__PURE__*/ _jsx("div", {
            style: hideProps,
            children: children
        });
    };
    return when ? children : hideChild();
};
/* 搭配If或Toggle使用, 只渲染内部的第一个when为true的If/Toggle, 所有项的when都未命中时,匹配第一个非If/Toggle的元素 */ var _Switch = function(param) {
    var children = param.children;
    var arrChild = ensureArray(children);
    var lastNotWhen = null;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = arrChild[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var child = _step.value;
            var isBuiltType = child.type === _If || child.type === _Toggle;
            if (!isBuiltType && lastNotWhen === null) {
                lastNotWhen = child;
                continue;
            }
            var open = !!child.props.when;
            if (open) {
                return child;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return lastNotWhen;
};
_AsyncRender.displayName = "AsyncRender";
_If.displayName = "If";
_Toggle.displayName = "Toggle";
_Switch.displayName = "Switch";
export { _If, _Switch, _Toggle, _AsyncRender };
