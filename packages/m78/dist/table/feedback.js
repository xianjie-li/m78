import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
import { OverlayDirection } from "../overlay/index.js";
import { useSelf, useSetState } from "@m78/hooks";
import { TableFeedback } from "../table-vanilla/plugins/event.js";
import { Bubble } from "../bubble/index.js";
import clsx from "clsx";
import { Divider } from "../layout/index.js";
import { isTruthyOrZero } from "@m78/utils";
import { _injector } from "./table.js";
import { _useStateAct } from "./state.act.js";
export function _Feedback() {
    var props = _injector.useProps();
    var state = _injector.useDeps(_useStateAct).state;
    var bubbleRef = useRef(null);
    var fbSelf = useSelf({
        delayNode: null,
        // 延迟更新位置, 防止闪烁
        lastUpdate: null
    });
    var ref = _sliced_to_array(useSetState({
        content: null,
        open: false,
        // 在已打开状态下, 需要延迟更新content, 否则会导致内容闪动
        delayContent: null
    }), 2), fbState = ref[0], setFbState = ref[1];
    state.instance.event.feedback.useEvent(function(e) {
        var /*#__PURE__*/ _React;
        var ref;
        var isClose = ((ref = e[0]) === null || ref === void 0 ? void 0 : ref.type) === TableFeedback.close;
        var first = e[0];
        if (isClose || !first) {
            setFbState({
                open: false
            });
            return;
        }
        var content = e.map(function(item, index) {
            if (!item.text) return null;
            var node = item.text;
            if (item.cell) {
                var render = item.cell.column.config.render;
                var arg = {
                    cell: item.cell,
                    context: props.context || {},
                    table: state.instance
                };
                if (render) {
                    node = render(arg);
                } else if (props.render) {
                    var _node = props.render(arg);
                    if (isTruthyOrZero(_node)) {
                        node = _node;
                    }
                }
            }
            return(// eslint-disable-next-line react/jsx-key
            /*#__PURE__*/ _jsxs("div", {
                className: clsx(item.type === TableFeedback.error && "color-error"),
                children: [
                    node,
                    index !== e.length - 1 && /*#__PURE__*/ _jsx(Divider, {
                        margin: 4
                    })
                ]
            }));
        });
        var node = (_React = React).createElement.apply(_React, [
            "div",
            null
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
