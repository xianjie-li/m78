import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import clsx from "clsx";
import { _Toolbar } from "../toolbar/toolbar.js";
import ReactDom from "react-dom";
import { Result } from "../../result/index.js";
import { IllustrationEmpty1, Size } from "../../common/index.js";
import { _CustomRender } from "./use-custom-render.js";
import { _CustomEditRender } from "./use-edit-render.js";
import { Scroll } from "../../scroll/index.js";
import React from "react";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
import { COMMON_NS, Translation } from "../../i18n/index.js";
import { _useContextMenuAct } from "../context-menu/use-context-menu.act.js";
import { Spin } from "../../spin/index.js";
export function _useRender() {
    var /*#__PURE__*/ _React;
    var props = _injector.useProps();
    var _injector_useDeps = _injector.useDeps(_useStateAct), state = _injector_useDeps.state, ref = _injector_useDeps.ref, scrollRef = _injector_useDeps.scrollRef, scrollEvent = _injector_useDeps.scrollEvent, scrollContRef = _injector_useDeps.scrollContRef, wrapRef = _injector_useDeps.wrapRef, rcPlugins = _injector_useDeps.rcPlugins;
    var ctxMenu = _injector.useDeps(_useContextMenuAct);
    // 内部引用了ctxMenu.node, 避免递归引用导致类型丢失
    var renderTrigger = ctxMenu.renderTrigger;
    return /*#__PURE__*/ _jsxs("div", {
        className: clsx("m78-table_wrap", props.wrapClassName),
        style: props.wrapStyle,
        tabIndex: 0,
        ref: wrapRef,
        children: [
            state.instance && /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(_Toolbar, {}),
                    state.emptyNode && /*#__PURE__*/ ReactDom.createPortal(props.emptyNode || /*#__PURE__*/ _jsx(Translation, {
                        ns: COMMON_NS,
                        children: function(t) {
                            return /*#__PURE__*/ _jsx(Result, {
                                size: Size.small,
                                icon: /*#__PURE__*/ _jsx(IllustrationEmpty1, {
                                    height: 120
                                }),
                                title: t("empty")
                            });
                        }
                    }), state.emptyNode),
                    /*#__PURE__*/ _jsx(_CustomRender, {}),
                    /*#__PURE__*/ _jsx(_CustomEditRender, {}),
                    (_React = React).createElement.apply(_React, [
                        React.Fragment,
                        null
                    ].concat(_to_consumable_array(rcPlugins.map(function(p) {
                        var _p_rcExtraRender;
                        return (_p_rcExtraRender = p.rcExtraRender) === null || _p_rcExtraRender === void 0 ? void 0 : _p_rcExtraRender.call(p);
                    })))),
                    ctxMenu.node
                ]
            }),
            state.initializing && /*#__PURE__*/ _jsx(Spin, {
                full: true,
                inline: true,
                text: state.initializingTip,
                minDuration: 0
            }),
            state.blockError && /*#__PURE__*/ _jsx("div", {
                className: "m78-table_block-error",
                children: state.blockError
            }),
            renderTrigger(/*#__PURE__*/ _jsx("div", {
                style: props.style,
                className: clsx("m78-table", props.className),
                ref: ref,
                children: /*#__PURE__*/ _jsx(Scroll, {
                    className: "m78-table_view m78-table_expand-size",
                    direction: "xy",
                    // 手动控制
                    disabledScroll: true,
                    innerWrapRef: scrollRef,
                    miniBar: true,
                    scrollIndicator: false,
                    onScroll: scrollEvent.emit,
                    children: /*#__PURE__*/ _jsx("div", {
                        ref: scrollContRef
                    })
                })
            }))
        ]
    });
}
