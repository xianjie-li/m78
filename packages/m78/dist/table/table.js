import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useImperativeHandle, useMemo, useRef } from "react";
import { _usePropsEffect } from "./use-props.js";
import clsx from "clsx";
import { Scroll } from "../scroll/index.js";
import { createEvent, useSelf, useSetState } from "@m78/hooks";
import { _useMethods } from "./methods.js";
import { _useLife } from "./life.js";
import ReactDom from "react-dom";
import { Result } from "../result/index.js";
import { IconDrafts } from "@m78/icons/icon-drafts.js";
import { Size } from "../common/index.js";
import { _CustomRender, _useCustomRender } from "./use-custom-render.js";
import { _useEvent } from "./use-event.js";
import { _Toolbar } from "./toolbar/toolbar.js";
import { _CustomEditRender, _useEditRender } from "./use-edit-render.js";
import { _Feedback } from "./feedback.js";
import { _useFilterForm } from "./filter/use-filter-form.js";
export function _Table(props) {
    /** 实例容器 */ var ref = useRef(null);
    /** 滚动容器 */ var scrollRef = useRef(null);
    /** 滚动内容 */ var scrollContRef = useRef(null);
    var self = useSelf({
        renderMap: {},
        editMap: {}
    });
    var ref1 = _sliced_to_array(useSetState({
        selectedRows: [],
        rowCount: 0,
        instance: null
    }), 2), state = ref1[0], setState = ref1[1];
    var ctx = {
        props: props,
        self: self,
        state: state,
        setState: setState,
        ref: ref,
        scrollRef: scrollRef,
        scrollContRef: scrollContRef,
        filterForm: _useFilterForm(props),
        scrollEvent: useMemo(function() {
            return createEvent();
        }, [])
    };
    ctx.editRender = _useEditRender(ctx);
    ctx.customRender = _useCustomRender(ctx);
    var methods = _useMethods(ctx);
    _useLife(ctx, methods);
    _usePropsEffect(props, methods.updateInstance);
    _useEvent(ctx);
    useImperativeHandle(props.instanceRef, function() {
        return state.instance;
    }, [
        state.instance, 
    ]);
    return /*#__PURE__*/ _jsxs("div", {
        className: clsx("m78-table_wrap", props.wrapClassName),
        style: props.wrapStyle,
        children: [
            state.instance && /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(_Toolbar, {
                        ctx: ctx
                    }),
                    state.emptyNode && /*#__PURE__*/ ReactDom.createPortal(props.emptyNode || /*#__PURE__*/ _jsx(Result, {
                        size: Size.small,
                        icon: /*#__PURE__*/ _jsx(IconDrafts, {
                            className: "color-disabled"
                        }),
                        title: "No data" // TODO: i18
                    }), state.emptyNode),
                    /*#__PURE__*/ _jsx(_CustomRender, {
                        ctx: ctx
                    }),
                    /*#__PURE__*/ _jsx(_CustomEditRender, {
                        ctx: ctx
                    }),
                    /*#__PURE__*/ _jsx(_Feedback, {
                        ctx: ctx
                    })
                ]
            }),
            /*#__PURE__*/ _jsx("div", {
                style: props.style,
                className: clsx("m78-table", props.className),
                ref: ref,
                children: /*#__PURE__*/ _jsx(Scroll, {
                    className: "m78-table_view m78-table_expand-size",
                    direction: "xy",
                    disabledScroll: true,
                    innerWrapRef: scrollRef,
                    miniBar: true,
                    scrollIndicator: false,
                    onScroll: ctx.scrollEvent.emit,
                    children: /*#__PURE__*/ _jsx("div", {
                        ref: scrollContRef
                    })
                })
            })
        ]
    });
}
_Table.displayName = "Table";