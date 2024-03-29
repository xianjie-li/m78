import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useRef } from "react";
import { preventTopPull } from "./prevent-top-pull.js";
import { useDrag } from "@use-gesture/react";
import { animated, useSpring } from "react-spring";
import { IconRefresh } from "@m78/icons/refresh.js";
import { _PULL_DOWN_SWIPE_RATIO, _PULL_DOWN_TRIGGER_RATIO } from "./common.js";
import { Column } from "../layout/index.js";
import clsx from "clsx";
import { isFunction } from "@m78/utils";
import { useDestroy } from "@m78/hooks";
export var _usePullActions = function(ctx) {
    var onPullDown = function onPullDown() {
        return _onPullDown.apply(this, arguments);
    };
    var renderPullDownNode = /** 渲染下拉主内容 */ function renderPullDownNode() {
        if (!pullDownEnabled) return null;
        // 默认节点
        var defNode = /*#__PURE__*/ _jsxs(Column, {
            crossAlign: "center",
            className: "m78-scroll_pull-down_cont",
            children: [
                /*#__PURE__*/ _jsx(animated.div, {
                    style: {
                        rotate: props.pullDownIndicatorRotate ? sp.rotate : undefined
                    },
                    className: "m78-scroll_pull-down_indicator",
                    children: /*#__PURE__*/ _jsx("span", {
                        className: clsx("m78-scroll_pull-down_indicator-icon", state.pullDownRunning && props.pullDownIndicatorRotate && "m78-animate-spin-fast"),
                        children: renderPullDownIndicator()
                    })
                }),
                props.pullDownText && /*#__PURE__*/ _jsx("div", {
                    className: "m78-scroll_pull-down_text",
                    children: isFunction(props.pullDownText) ? props.pullDownText(customerValues) : props.pullDownText
                })
            ]
        });
        // 定制节点
        if (props.pullDownNode) {
            defNode = isFunction(props.pullDownNode) ? props.pullDownNode(customerValues) : props.pullDownNode;
        }
        return /*#__PURE__*/ _jsx("div", {
            className: "m78-scroll_pull-down",
            ref: pullDownRef,
            children: /*#__PURE__*/ _jsx(animated.div, {
                style: {
                    y: sp.y
                },
                children: defNode
            })
        });
    };
    var renderPullDownIndicator = /** 渲染下拉图标 */ function renderPullDownIndicator() {
        if (!props.pullDownIndicator) return /*#__PURE__*/ _jsx(IconRefresh, {});
        return isFunction(props.pullDownIndicator) ? props.pullDownIndicator(customerValues) : props.pullDownIndicator;
    };
    var onScroll = function onScroll(meta) {
        return _onScroll.apply(this, arguments);
    };
    var scroller = ctx.scroller, setState = ctx.setState, state = ctx.state, pullDownEnabled = ctx.pullDownEnabled, props = ctx.props, self = ctx.self;
    var _useSpring = _sliced_to_array(useSpring(function() {
        return {
            from: {
                y: 0,
                rotate: 0,
                ratio: 0
            }
        };
    }), 2), sp = _useSpring[0], api = _useSpring[1];
    var pullDownRef = useRef(null);
    useDrag(function(param) {
        var direction = param.direction, _param_movement = _sliced_to_array(param.movement, 2), moveY = _param_movement[1], last = param.last;
        if (state.pullDownRunning) return;
        var meta = scroller.get();
        var isPullDown = direction[1] === 1;
        var maxOffset = pullDownRef.current.clientHeight;
        // 最大旋转圈数
        var maxTurn = 2 * 360;
        var maxY = maxOffset / _PULL_DOWN_SWIPE_RATIO;
        // 旋转比例
        var ratio = moveY / maxY;
        if (last) {
            if (self.pullDownFlag) {
                self.pullDownFlag = false;
                if (ratio >= _PULL_DOWN_TRIGGER_RATIO) {
                    onPullDown();
                } else {
                    api.start({
                        y: 0,
                        rotate: 0,
                        ratio: 0
                    });
                }
            }
        }
        if (!last && meta.touchTop) {
            // 起始位置只能下拉
            if (!isPullDown && moveY <= 0) return;
            self.pullDownFlag = true;
            var y = moveY * _PULL_DOWN_SWIPE_RATIO;
            var rotate = maxTurn * ratio;
            api.start({
                y: y,
                rotate: rotate,
                ratio: ratio,
                immediate: true
            });
        }
    }, {
        target: ctx.innerWrapRef,
        enabled: pullDownEnabled,
        bounds: function() {
            return {
                bottom: pullDownRef.current.clientHeight / _PULL_DOWN_SWIPE_RATIO
            };
        },
        from: [
            0,
            0
        ],
        rubberband: true
    });
    /** 阻止部分浏览器的顶部下拉bounce效果(不完美) */ useEffect(function() {
        if (!ctx.innerWrapRef.current || !pullDownEnabled) return;
        return preventTopPull(ctx.innerWrapRef.current);
    }, [
        ctx.innerWrapRef.current,
        pullDownEnabled
    ]);
    // 清除上拉定时器
    useDestroy(function() {
        return clearTimeout(self.pullUpTimer);
    });
    function _onPullDown() {
        _onPullDown = /** 触发下拉 */ _async_to_generator(function() {
            var maxOffset;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        setState({
                            pullDownRunning: true
                        });
                        maxOffset = pullDownRef.current.clientHeight;
                        return [
                            4,
                            Promise.all(api.start({
                                y: maxOffset,
                                ratio: 1
                            }))
                        ];
                    case 1:
                        _state.sent();
                        return [
                            4,
                            props.onPullDown()
                        ];
                    case 2:
                        _state.sent();
                        return [
                            4,
                            Promise.all(api.start({
                                y: 0,
                                ratio: 0
                            }))
                        ];
                    case 3:
                        _state.sent();
                        api.start({
                            rotate: 0,
                            immediate: true
                        });
                        setState({
                            pullDownRunning: false
                        });
                        return [
                            2
                        ];
                }
            });
        });
        return _onPullDown.apply(this, arguments);
    }
    var customerValues = _object_spread_props(_object_spread({}, sp), {
        running: state.pullDownRunning
    });
    function _onScroll() {
        _onScroll = /** 滚动, 主要用于上拉加载处理 */ _async_to_generator(function(meta) {
            var ratio;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        if (!props.onPullUp) return [
                            2
                        ];
                        ratio = meta.y / meta.yMax;
                        if (!(ratio >= props.pullUpTriggerRatio)) return [
                            3,
                            2
                        ];
                        if (self.pullUpLock) return [
                            2
                        ];
                        self.pullUpLock = true;
                        return [
                            4,
                            props.onPullUp()
                        ];
                    case 1:
                        _state.sent();
                        self.pullUpLock = false;
                        _state.label = 2;
                    case 2:
                        return [
                            2
                        ];
                }
            });
        });
        return _onScroll.apply(this, arguments);
    }
    return {
        springStyle: sp,
        pullDownNode: renderPullDownNode(),
        onPullDown: onPullDown,
        onScroll: onScroll
    };
};
