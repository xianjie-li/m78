import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
import { OverlayDirection } from "../../../overlay/index.js";
import { useSelf, useSetState } from "@m78/hooks";
import { Bubble } from "../../../bubble/index.js";
import clsx from "clsx";
import { Divider } from "../../../layout/index.js";
import { TableFeedback } from "../../../table-vanilla/index.js";
import { createRandString, isTruthyOrZero } from "@m78/utils";
import { _injector } from "../../table.js";
import { _useStateAct } from "../../injector/state.act.js";
import { renderCommonHandle } from "../../render/use-custom-render.js";
export function _Feedback() {
    var props = _injector.useProps();
    var _injector_useDeps = _injector.useDeps(_useStateAct), state = _injector_useDeps.state, rcPlugins = _injector_useDeps.rcPlugins;
    var bubbleRef = useRef(null);
    var fbSelf = useSelf({
        delayNode: null,
        // 延迟更新位置, 防止闪烁
        lastUpdate: null
    });
    var _useSetState = _sliced_to_array(useSetState({
        content: null,
        open: false,
        // 在已打开状态下, 需要延迟更新content, 否则会导致内容闪动
        delayContent: null
    }), 2), fbState = _useSetState[0], setFbState = _useSetState[1];
    state.instance.event.feedback.useEvent(function(e) {
        var /*#__PURE__*/ _React;
        var _e_;
        var isClose = ((_e_ = e[0]) === null || _e_ === void 0 ? void 0 : _e_.type) === TableFeedback.close;
        var first = e[0];
        if (isClose || !first) {
            setFbState({
                open: false
            });
            return;
        }
        var content = e.map(function(item, index) {
            if (!item.text) return null;
            // 包含单元格但单元格未挂载时忽略
            if (item.cell && !item.cell.isMount) return null;
            var node = item.text;
            if (item.type === TableFeedback.overflow && item.cell) {
                var arg = renderCommonHandle({
                    props: props,
                    state: state,
                    cell: item.cell,
                    rcPlugins: rcPlugins
                });
                if (isTruthyOrZero(arg.prevElement)) {
                    node = arg.prevElement;
                }
            }
            return(// eslint-disable-next-line react/jsx-key
            /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        className: clsx(item.type === TableFeedback.error && "color-error"),
                        style: {
                            maxHeight: 120,
                            overflow: "auto"
                        },
                        children: node
                    }),
                    index !== e.length - 1 && /*#__PURE__*/ _jsx(Divider, {
                        margin: 4
                    })
                ]
            }));
        }).filter(function(i) {
            return !!i;
        });
        if (!content.length) return;
        var node = (_React = React).createElement.apply(_React, [
            "div",
            {
                key: createRandString()
            }
        ].concat(_to_consumable_array(content)));
        var lastUpdate = function() {
            if (first.bound) {
                bubbleRef.current.updateTarget(first.bound, true);
            } else if (first.dom) {
                bubbleRef.current.updateTarget(first.dom, true);
            }
        };
        if (!fbState.open) {
            setFbState({
                open: true,
                content: node
            });
            lastUpdate();
        }
        setFbState({
            content: node
        });
        fbSelf.lastUpdate = lastUpdate;
    });
    useEffect(function() {
        if (fbSelf.lastUpdate) {
            fbSelf.lastUpdate();
            fbSelf.lastUpdate = null;
        }
    }, [
        fbState.content
    ]);
    return /*#__PURE__*/ _jsx(Bubble, {
        style: {
            maxWidth: 300
        },
        clickAwayQueue: false,
        direction: OverlayDirection.top,
        arrow: false,
        offset: 4,
        open: fbState.open,
        content: fbState.content,
        instanceRef: bubbleRef,
        escapeClosable: false
    });
}
