import { useUpdateEffect } from "@m78/hooks";
import { useEffect, useImperativeHandle, useMemo } from "react";
import { isMobileDevice } from "@m78/utils";
export function _useLifeCycle(ctx, methods, bar, pull) {
    var bound = ctx.bound, props = ctx.props, setState = ctx.setState, scroller = ctx.scroller;
    var instance = useMemo(function() {
        return {};
    }, []);
    /** 更新设备类型 */ useEffect(function() {
        setState({
            isMobile: isMobileDevice()
        });
    }, []);
    /** 暴露实例 */ useImperativeHandle(props.instanceRef, function() {
        return Object.assign(instance, scroller, {
            triggerPullDown: pull.onPullDown
        });
    });
    /**
   * 内容容器尺寸变更
   * - 刷新滚动条
   * */ useUpdateEffect(function() {
        if (!bound.width && !bound.height) return;
        bar.refresh();
    }, [
        bound.width,
        bound.height
    ]);
    /** 滚动总控制 */ function onScroll(meta) {
        var _props_onScroll;
        (_props_onScroll = props.onScroll) === null || _props_onScroll === void 0 ? void 0 : _props_onScroll.call(props, meta);
        bar.onScroll(meta);
        pull.onScroll(meta);
        // 同步需要的meta信息到状态中, setState在值相同时会跳过render, 所以这里不用担心性能
        setState({
            touchTop: meta.touchTop,
            touchBottom: meta.touchBottom,
            touchLeft: meta.touchLeft,
            touchRight: meta.touchRight,
            xMax: meta.xMax,
            yMax: meta.yMax
        });
    }
    return {
        onScroll: onScroll
    };
}
