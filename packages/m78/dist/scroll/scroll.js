import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useMemo, useRef } from "react";
import { _defaultProps, _getScrollStyleByDirection, _RESERVE_BAR_SIZE } from "./common.js";
import clsx from "clsx";
import { useMeasure, useScroll, useSelf, useSetState } from "@m78/hooks";
import { _useBar } from "./use-bar.js";
import { _useLifeCycle } from "./use-life-cycle.js";
import { _useMethod } from "./use-method.js";
import { _useIndicator } from "./use-indicator.js";
import { _usePullActions } from "./use-pull-actions.js";
import { animated } from "react-spring";
import { _useDragScroll } from "./use-drag-scroll.js";
/**
 * 下拉卡主
 * 鼠标放到滚动条位置时显示滚动条
 * 滚动条偶尔不自动隐藏, 显示逻辑优化
 * */ export var _Scroll = function(p) {
    var onScroll = function onScroll(meta) {
        lifeCycle.onScroll(meta);
    };
    var props = p;
    var direction = props.direction;
    var _innerWrapRef = useRef(null);
    var innerWrapRef = p.innerWrapRef || _innerWrapRef;
    /** 组件状态 */ var ref = _sliced_to_array(useSetState({
        enableStatus: {
            x: false,
            y: false
        },
        xVisible: false,
        yVisible: false,
        xPadding: _RESERVE_BAR_SIZE,
        yPadding: _RESERVE_BAR_SIZE,
        touchTop: false,
        touchBottom: false,
        touchLeft: false,
        touchRight: false,
        xMax: 0,
        yMax: 0,
        pullDownRunning: false,
        infiniteWidth: 0,
        infiniteHeight: 0,
        isMobile: true
    }), 2), state = ref[0], setState = ref[1];
    /** 组件实例属性 */ var self = useSelf({
        delayHiddenTimer: 0,
        delayHiddenLock: false,
        pullUpLock: false
    });
    /** 滚动容器样式 */ var directionStyle = useMemo(function() {
        return _getScrollStyleByDirection(direction);
    }, [
        direction
    ]);
    /** 滚动控制器 */ var scroller = useScroll({
        el: innerWrapRef,
        throttleTime: 0,
        onScroll: onScroll
    });
    /** 监听滚动容器变更 */ var ref1 = _sliced_to_array(useMeasure(undefined, 200), 2), bound = ref1[0], contRef = ref1[1];
    /** 上下文对象, 用于切分代码 */ var ctx = {
        props: props,
        scroller: scroller,
        state: state,
        setState: setState,
        self: self,
        directionStyle: directionStyle,
        bound: bound,
        pullDownEnabled: !!props.onPullDown && !props.dragScroll,
        xEnabled: directionStyle.overflowX === "scroll",
        yEnabled: directionStyle.overflowY === "scroll",
        innerWrapRef: innerWrapRef
    };
    /** 滚动条相关 */ var bar = _useBar(ctx);
    /** 上下拉相关 */ var pull = _usePullActions(ctx);
    /** 拖拽滚动 */ _useDragScroll(ctx);
    /** 方法 */ var methods = _useMethod(ctx);
    /** 钩子 */ var lifeCycle = _useLifeCycle(ctx, methods, bar, pull);
    /** 滚动标记 */ var indicator = _useIndicator(ctx, methods);
    return /*#__PURE__*/ _jsxs("div", {
        ref: p.innerRef,
        className: clsx("m78 m78-scroll", props.className, "__".concat(direction), props.miniBar && "__mini-bar"),
        style: props.style,
        children: [
            /*#__PURE__*/ _jsx(animated.div, {
                className: "m78-scroll_wrap",
                style: _object_spread_props(_object_spread({}, props.disabledScroll ? {} : directionStyle, bar.offsetStyle), {
                    y: pull.springStyle.y,
                    userSelect: ctx.pullDownEnabled || props.dragScroll ? "none" : undefined
                }),
                ref: innerWrapRef,
                children: /*#__PURE__*/ _jsx("div", {
                    className: clsx("m78-scroll_cont", props.contClassName),
                    style: props.contStyle,
                    ref: contRef,
                    children: props.children
                })
            }),
            props.wrapExtra,
            bar.barNode,
            indicator,
            pull.pullDownNode
        ]
    });
};
_Scroll.displayName = "Scroll";
_Scroll.defaultProps = _defaultProps;
