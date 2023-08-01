import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useEffect } from "react";
import { defer } from "@m78/utils";
import { useDrag } from "react-use-gesture";
import { WineDragPosition } from "./types";
import { useDragResize } from "./useDragResize";
import { OPEN_FALSE_ANIMATION, OPEN_TRUE_ANIMATION } from "./consts";
import { updateZIndexEvent } from "./event";
import { getTipNode } from "./common";
export function useLifeCycle(ctx, methods) {
    var spApi = ctx.spApi, state = ctx.state, headerElRef = ctx.headerElRef, self = ctx.self, setInsideState = ctx.setInsideState, insideState = ctx.insideState;
    var refreshDeps = methods.refreshDeps, resize = methods.resize, setXY = methods.setXY, full = methods.full;
    // 标记销毁
    useEffect(function() {
        return function() {
            self.unmounted = true;
        };
    }, []);
    // 初始化
    useEffect(function() {
        self.tipNode = getTipNode();
        // none状态下会影响尺寸计算
        Promise.all(spApi.start({
            immediate: true,
            display: "block"
        })).then(function() {
            refreshDeps();
            // 防止窗口未设置偏移时抖动
            spApi.start({
                visibility: "visible",
                immediate: true
            });
            state.initFull ? full() : resize();
            defer(function() {
                setInsideState({
                    headerHeight: self.headerSize[1]
                });
            });
        });
    }, []);
    // 窗口尺寸变更时刷新尺寸相关信息
    useEffect(function() {
        window.addEventListener("resize", refreshDeps);
        return function() {
            return window.removeEventListener("resize", refreshDeps);
        };
    }, []);
    // 控制开关显示
    useEffect(function() {
        var ignore = false;
        if (state.open) {
            spApi.start({
                immediate: true,
                display: "block"
            });
            Promise.all(spApi.start(OPEN_TRUE_ANIMATION)).then(function() {
                // 动画结束后获取焦点
                ctx.wrapElRef.current && ctx.wrapElRef.current.focus();
            });
            // 置顶
            methods.top();
        } else {
            Promise.all(spApi.start(OPEN_FALSE_ANIMATION)).then(function() {
                if (ignore) return;
                spApi.start({
                    immediate: true,
                    display: "none"
                });
            });
        }
        return function() {
            ignore = true;
        };
    }, [
        state.open
    ]);
    // 监听置顶还原
    updateZIndexEvent.useEvent(function(id) {
        if (insideState.isTop && id !== insideState.id) {
            setInsideState({
                isTop: false
            });
        }
    });
    useDrag(function(param) {
        var _memo = param.memo, memo = _memo === void 0 ? [] : _memo, xy = param.xy, down = param.down, _delta = _sliced_to_array(param.delta, 2), dX = _delta[0], dY = _delta[1], event = param.event, tap = param.tap;
        event.preventDefault();
        if (tap) return;
        /*
       * cursorOffset记录事件开始时相对wrap左上角的位置
       * distance记录移动的总距离
       * */ var _memo1 = _sliced_to_array(memo, 2), cursorOffset = _memo1[0], distance = _memo1[1];
        var _cursorOffset = cursorOffset || methods.getCursorWrapOffset(xy);
        setXY(xy[0] - _cursorOffset[0], xy[1] - _cursorOffset[1]);
        if (distance && distance > 60) {
            methods.refreshTipNode(xy, down);
        }
        return [
            _cursorOffset,
            (distance || 0) + Math.abs(dX) + Math.abs(dY)
        ];
    }, {
        domTarget: headerElRef,
        filterTaps: true,
        eventOptions: {
            passive: false
        }
    });
    ctx.dragLineRRef = useDragResize(WineDragPosition.R, ctx, methods);
    ctx.dragLineLRef = useDragResize(WineDragPosition.L, ctx, methods);
    ctx.dragLineBRef = useDragResize(WineDragPosition.B, ctx, methods);
    ctx.dragLineTRef = useDragResize(WineDragPosition.T, ctx, methods);
    ctx.dragLineLTRef = useDragResize(WineDragPosition.LT, ctx, methods);
    ctx.dragLineRTRef = useDragResize(WineDragPosition.RT, ctx, methods);
    ctx.dragLineRBRef = useDragResize(WineDragPosition.RB, ctx, methods);
    ctx.dragLineLBRef = useDragResize(WineDragPosition.LB, ctx, methods);
}
