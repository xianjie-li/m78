import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useFn } from "@m78/hooks";
import { animated, useSpring } from "react-spring";
import React, { useEffect, useRef } from "react";
import clsx from "clsx";
import clamp from "lodash/clamp.js";
import { Toggle } from "../fork/index.js";
import { _BAR_MAX_SIZE_RATIO, _BAR_MIN_SIZE_RATIO, _RESERVE_BAR_SIZE } from "./common.js";
import { useDrag } from "@use-gesture/react";
/* # # # # # # # # # # # # # # # # #
 * ## 成员
 * - _useBarImpl 实现单个滚动条的逻辑
 * - _useBar 汇总xy轴滚动条并处理两者统一逻辑
 *
 * ## 实现流程
 * 隐藏原生滚动条, 实现自定义滚动条, 操作滚动条时更新容器滚动位置, 容器滚动时更新滚动条位置
 *
 * ## 隐藏原生滚动条
 * 必须节点两个, 一个parent, 一个child, 需要做两类处理, 一类是不占用容器空间的滚动条(macOS), 一类是占用的(windows)
 * - 对于占用空间的滚动条, 需要手动计算容器的 client/offset 尺寸, 并设置为右下偏移
 * - 对于不会占用容器的滚动条, 通过 css 添加一个固定的右/底部偏移即可实现
 * # # # # # # # # # # # # # # # # # */ /** 滚动条实现/汇总 */ export function _useBar(ctx) {
    var state = ctx.state, setState = ctx.setState, self = ctx.self, scroller = ctx.scroller, directionStyle = ctx.directionStyle, props = ctx.props, bound = ctx.bound;
    var yBar = _useBarImpl(ctx, {
        isY: true,
        delayHidden: delayHidden
    });
    var xBar = _useBarImpl(ctx, {
        isY: false,
        delayHidden: delayHidden
    });
    /* # # # # # # # # # # # # # # # # #
   * 钩子区
   * # # # # # # # # # # # # # # # # # */ useEffect(function() {
        if (!props.scrollbar) return;
        var newState = {};
        // 滚动条启用状态同步
        var status = getEnableStatus();
        if (status.x !== state.enableStatus.x || status.y !== state.enableStatus.y) {
            state.enableStatus = status;
        }
        xBar.refreshScrollPosition();
        yBar.refreshScrollPosition();
        var wrap = ctx.innerWrapRef.current;
        var barXSize = wrap.offsetWidth - wrap.clientWidth;
        var barYSize = wrap.offsetHeight - wrap.clientHeight;
        newState.xPadding = _RESERVE_BAR_SIZE + barXSize;
        newState.yPadding = _RESERVE_BAR_SIZE + barYSize;
        setState(newState);
    }, [
        props.direction,
        bound.width,
        bound.height,
        props.scrollbar
    ]);
    /* # # # # # # # # # # # # # # # # #
   * 方法区
   * # # # # # # # # # # # # # # # # # */ function onScroll(meta) {
        if (!props.scrollbar) return;
        meta.isScrollX && xBar.refreshScrollPosition(meta.x / meta.xMax);
        meta.isScrollY && yBar.refreshScrollPosition(meta.y / meta.yMax);
        // if (!self.delayHiddenLock) {
        var key = "";
        // isScroll不是完全可靠的, 所以这里严格鉴别
        if (meta.isScrollX) key = "x";
        if (meta.isScrollY) key = "y";
        if (key) {
            setState(_define_property({}, "".concat(key, "Visible"), true));
        }
        // }
        delayHidden();
    }
    /** 刷新滚动条 */ function refresh() {
        if (!props.scrollbar) return;
        yBar.refresh();
        xBar.refresh();
    }
    function delayHidden() {
        var delay = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 800;
        if (self.delayHiddenLock) return;
        clearTimeout(self.delayHiddenTimer);
        self.delayHiddenTimer = setTimeout(function() {
            setState({
                xVisible: false,
                yVisible: false
            });
        }, delay);
    }
    /** 检测各轴是否开启了滚动及是否可滚动 */ function getEnableStatus() {
        var meta = scroller.get();
        return {
            x: !!meta.xMax && directionStyle.overflowX === "scroll",
            y: !!meta.yMax && directionStyle.overflowY === "scroll"
        };
    }
    return {
        refresh: refresh,
        onScroll: onScroll,
        barNode: /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                xBar.barNode,
                yBar.barNode
            ]
        }),
        /** 设置到滚动容器, 主要用于滚动条占用容器位置的浏览器去掉滚动条位置 */ offsetStyle: {
            bottom: "-".concat(state.yPadding, "px"),
            right: "-".concat(state.xPadding, "px")
        }
    };
}
/** 单个滚动条实现, isY用于 */ export function _useBarImpl(ctx, param) {
    var isY = param.isY, delayHidden = param.delayHidden;
    var state = ctx.state, self = ctx.self, scroller = ctx.scroller, props = ctx.props;
    var _useSpring = _sliced_to_array(useSpring(function() {
        return {
            from: {
                /** thumb位置 */ offset: 0,
                /** thumb在对应轴的尺寸 */ size: 0
            },
            config: {
                clamp: true
            }
        };
    }, []), 2), sp = _useSpring[0], api = _useSpring[1];
    var barRef = useRef(null);
    /* # # # # # # # # # # # # # # # # #
   * 钩子区
   * # # # # # # # # # # # # # # # # # */ /**
   * thumb拖动
   * */ var bind = useDrag(onDrag, {
        /** 开始位置 */ from: function() {
            return isY ? [
                0,
                sp.offset.get()
            ] : [
                sp.offset.get(),
                0
            ];
        },
        /** 拖动阈值 */ bounds: function() {
            var barEl = barRef.current;
            var thumbEl = barEl.childNodes[0];
            return {
                top: 0,
                left: 0,
                right: !isY ? barEl.offsetWidth - thumbEl.offsetWidth : 0,
                bottom: isY ? barEl.offsetHeight - thumbEl.offsetHeight : 0
            };
        },
        preventDefault: true
    });
    /* # # # # # # # # # # # # # # # # #
   * 方法区
   * # # # # # # # # # # # # # # # # # */ /** 根据比例设置刷新滚动条位置 */ function refreshScrollPosition() {
        var offsetRatio = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
        if (!props.scrollbar) return;
        offsetRatio = clamp(offsetRatio, 0, 1);
        var wrapEl = ctx.innerWrapRef.current;
        var barEl = barRef.current;
        if (!wrapEl) return;
        var sizeRatio = isY ? wrapEl.offsetHeight / wrapEl.scrollHeight : wrapEl.offsetWidth / wrapEl.scrollWidth;
        var barSize = isY ? barEl.clientHeight : barEl.clientWidth;
        // 限制thumb的最大尺寸, 看起来会更舒服
        var thumbSize = Math.max(Math.min(barSize / _BAR_MAX_SIZE_RATIO, sizeRatio * barSize), _BAR_MIN_SIZE_RATIO);
        // 防止超出轨道
        if (thumbSize > barSize) thumbSize = barSize;
        api.start({
            offset: offsetRatio * (barSize - thumbSize),
            size: thumbSize,
            immediate: true
        });
    }
    /** 刷新滚动条, 用于容器尺寸/内容等变更时 */ function refresh() {
        if (!props.scrollbar) return;
        var offset = sp.offset.get();
        refreshScrollPosition(offset2Ratio(offset));
    }
    /** 拖动thumb */ function onDrag(e) {
        e.event.stopPropagation();
        /** 锁定自动关闭 防止干扰 */ if (e.first) {
            onActive();
            self.delayHiddenLock = true;
        }
        /** 触发自动关闭 */ if (e.last) {
            self.delayHiddenLock = false;
        }
        var offset = isY ? e.offset[1] : e.offset[0];
        scroll(offset2Ratio(offset));
        api.start({
            offset: offset,
            immediate: true
        });
    }
    /** 根据偏移点相对轨道开始的距离获取该位置的比例 */ function offset2Ratio(offset) {
        var barEl = barRef.current;
        var thumbEl = barEl.childNodes[0];
        var thumbSize = isY ? thumbEl.offsetHeight : thumbEl.offsetWidth;
        // 以轨道尺寸减thumb尺寸作为比例计算最大值
        var size = isY ? barEl.offsetHeight : barEl.offsetWidth;
        size -= thumbSize;
        return offset / size;
    }
    /** 滚动到指定比例的位置 */ function scroll(ratio) {
        ratio = clamp(ratio, 0, 1);
        var meta = scroller.get();
        scroller.scroll(_define_property({
            immediate: true
        }, isY ? "y" : "x", ratio * (isY ? meta.yMax : meta.xMax)));
    }
    /** 滚动条处于活动状态, 禁止自动隐藏 */ var onActive = useFn(function() {
        if (self.delayHiddenLock) return;
        clearTimeout(self.delayHiddenTimer);
    });
    /** 通知滚动条失活 */ var onUnActive = useFn(function() {
        delayHidden();
    });
    /** 显示滚动条, 并触发延迟自动关闭 */ var showBar = useFn(function() {
        ctx.setState(_define_property({}, "".concat(isY ? "y" : "x", "Visible"), true));
        delayHidden(1600);
    });
    /** 滚动条thumb点击 */ var onBarClick = useFn(function(e) {
        e.stopPropagation();
        var visible = isY ? state.yVisible : state.xVisible;
        // 隐藏时改为显示滚动条
        if (!visible) {
            showBar();
            refresh();
            return;
        }
    });
    /** 轨道点击, 滚动位置到同比例位置 */ var onTrackClick = useFn(function(e) {
        e.stopPropagation();
        var visible = isY ? state.yVisible : state.xVisible;
        // 隐藏时改为线上滚动条
        if (!visible) {
            showBar();
            refresh();
            return;
        }
        var rect = barRef.current.getBoundingClientRect();
        var size = isY ? barRef.current.offsetHeight : barRef.current.offsetWidth;
        var offset = isY ? e.clientY - rect.top : e.clientX - rect.left;
        // 这里不使用offset2Ratio是为了使定位位置更接近点击的轨道位置的比例
        var ratio = offset / size;
        // 接近两端时直接滚动到底
        if (ratio <= 0.08) ratio = 0;
        if (ratio >= 0.92) ratio = 1;
        scroll(ratio);
    });
    /* # # # # # # # # # # # # # # # # #
   * 计算值
   * # # # # # # # # # # # # # # # # # */ var isVisible = isY ? state.yVisible : state.xVisible;
    var offsetKey = isY ? "y" : "x";
    var sizeKey = isY ? "height" : "width";
    var _obj;
    // 有代码依赖于scroll_bar.childNode[0] 获取thumb元素, 若要改变接口需同步更改对应代码
    var barNode = /*#__PURE__*/ _jsx(Toggle, {
        when: isY ? state.enableStatus.y : state.enableStatus.x,
        children: /*#__PURE__*/ _jsx("div", {
            className: clsx("m78-scroll_bar", "__".concat(isY ? "y" : "x")),
            style: {
                opacity: isVisible ? 1 : 0
            },
            ref: barRef,
            onTouchMove: onActive,
            onTouchEnd: onUnActive,
            onMouseMove: onActive,
            onMouseLeave: onUnActive,
            onClick: onTrackClick,
            children: /*#__PURE__*/ _jsx(animated.div, _object_spread({
                className: "m78-scroll_bar_thumb",
                style: (_obj = {}, _define_property(_obj, offsetKey, sp.offset.to(function(o) {
                    return "".concat(o, "px");
                })), _define_property(_obj, sizeKey, sp.size.to(function(o) {
                    return "".concat(o, "px");
                })), _obj),
                onClick: onBarClick
            }, bind()))
        })
    });
    return {
        barNode: barNode,
        refreshScrollPosition: refreshScrollPosition,
        refresh: refresh
    };
}
