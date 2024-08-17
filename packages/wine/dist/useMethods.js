import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import _clamp from "lodash/clamp.js";
import { useFn } from "@m78/hooks";
import _throttle from "lodash/throttle.js";
import { isNumber } from "@m78/utils";
import { WineBound } from "./types.js";
import { calcAlignment, getFullSize, getPresetPosition, getSizeByState, getTipNodeStatus, offsetTuple2Obj, sizeTuple2Obj } from "./common.js";
import { DEFAULT_FULL_LIMIT_BOUND, NO_LIMIT_AREA } from "./consts.js";
import { updateZIndexEvent } from "./event.js";
export function useMethods(context) {
    var state = context.state, self = context.self, wrapElRef = context.wrapElRef, headerElRef = context.headerElRef, insideState = context.insideState, setInsideState = context.setInsideState, spApi = context.spApi;
    /** 更新窗口、bound、warp等信息 (不触发render), 在窗口位置、尺寸等变更完毕后应该调用此方法 */ function refreshDeps() {
        if (self.unmounted) return;
        var w = wrapElRef.current.offsetWidth;
        var h = wrapElRef.current.offsetHeight;
        var headerW = headerElRef.current.offsetWidth;
        var headerH = headerElRef.current.offsetHeight;
        var winW = window.innerWidth;
        var winH = window.innerHeight;
        self.wrapSize = [
            w,
            h
        ];
        self.headerSize = [
            headerW,
            headerH
        ];
        self.availableSize = [
            winW - w,
            winH - h
        ];
        self.winSize = [
            winW,
            winH
        ];
        self.fullSize = getFullSize(state);
        setBound();
    }
    /** 计算并设置bound */ function setBound() {
        var _self_availableSize = _sliced_to_array(self.availableSize, 2), availableW = _self_availableSize[0], availableH = _self_availableSize[1];
        var _self_wrapSize = _sliced_to_array(self.wrapSize, 2), wrapW = _self_wrapSize[0], wrapH = _self_wrapSize[1];
        self.windowBound = {
            left: 0,
            top: 0,
            right: availableW,
            bottom: availableH
        };
        if (state.bound === WineBound.window) {
            self.bound = self.windowBound;
            return;
        }
        if (state.bound === WineBound.safeArea) {
            var minOffset = sizeTuple2Obj(self.headerSize).h;
            self.bound = {
                left: -wrapW + minOffset,
                top: 0,
                right: availableW + wrapW - minOffset,
                bottom: availableH + wrapH - minOffset
            };
            return;
        }
        self.bound = NO_LIMIT_AREA;
    }
    /** 设置XY并更新到self中的快捷方式，同时也支持传入其他配置 */ function setXY(x, y, extra) {
        self.x = Math.floor(_clamp(x, self.bound.left, self.bound.right));
        self.y = Math.floor(_clamp(y, self.bound.top, self.bound.bottom));
        if (insideState.isFull) {
            setInsideState({
                isFull: false
            });
        }
        var res = spApi.start(_object_spread({
            x: self.x,
            y: self.y,
            immediate: true,
            default: true
        }, extra));
        return Promise.all(res);
    }
    /** 根据当前窗口信息和alignment设置窗口位置, 如果包含缓存的窗口信息则使用缓存信息 */ function resize() {
        var _ref = _sliced_to_array(self.memoXY || [], 2), x = _ref[0], y = _ref[1];
        var _ref1 = _sliced_to_array(self.memoWrapSize || [], 2), width = _ref1[0], height = _ref1[1];
        var flb = _object_spread({}, DEFAULT_FULL_LIMIT_BOUND, state.limitBound);
        // 没有历史尺寸
        if (!isNumber(width) || !isNumber(height)) {
            var _getSizeByState = _sliced_to_array(getSizeByState(state), 2), w = _getSizeByState[0], h = _getSizeByState[1];
            width = w;
            height = h;
        }
        // 没有历史位置
        if (!isNumber(x) || !isNumber(y)) {
            var pos = calcAlignment(state.alignment, flb, self);
            x = pos[0];
            y = pos[1];
        }
        /** 防止当前限制影响定位 */ self.bound = NO_LIMIT_AREA;
        setXY(x, y, {
            width: width,
            height: height
        }).then(function() {
            refreshDeps();
        });
    }
    /** 最大化窗口 */ function full() {
        var _state_limitBound, _state_limitBound1;
        if (insideState.isFull) return;
        memoWinState();
        /** 防止当前限制影响定位 */ self.bound = NO_LIMIT_AREA;
        setXY(((_state_limitBound = state.limitBound) === null || _state_limitBound === void 0 ? void 0 : _state_limitBound.left) || DEFAULT_FULL_LIMIT_BOUND.left, ((_state_limitBound1 = state.limitBound) === null || _state_limitBound1 === void 0 ? void 0 : _state_limitBound1.top) || DEFAULT_FULL_LIMIT_BOUND.top, {
            width: self.fullSize[0],
            height: self.fullSize[1]
        }).then(function() {
            refreshDeps();
            setInsideState({
                isFull: true
            });
        });
    }
    /** 置顶窗口 */ function top() {
        updateZIndexEvent.emit(insideState.id);
        if (!insideState.isTop) {
            var _state_onActive;
            setInsideState({
                isTop: true
            });
            (_state_onActive = state.onActive) === null || _state_onActive === void 0 ? void 0 : _state_onActive.call(state);
        }
    }
    /** 设置到指定的预设位置 */ function setPresetPosition(pos) {
        var flb = _object_spread({}, DEFAULT_FULL_LIMIT_BOUND, state.limitBound);
        self.fullSize;
        var size = getPresetPosition(pos, self.fullSize, flb);
        setXY(size.left, size.top, {
            width: size.width,
            height: size.height
        }).then(refreshDeps);
    }
    /** 记录创建基础状态，尺寸、位置等，用于还原 */ function memoWinState() {
        var flb = _object_spread({}, DEFAULT_FULL_LIMIT_BOUND, state.limitBound);
        self.memoWrapSize = self.wrapSize;
        /** 根据fullLimitBound进行修正，防止默认最大化切换为最小化时窗口跳到最左上角 */ self.memoXY = [
            Math.max(self.x, flb.left),
            Math.max(self.y, flb.top)
        ];
    }
    /** 根据光标位置和warp位置来计算光标在wrap上所处位置 */ function getCursorWrapOffset(xy) {
        var wrapBound = wrapElRef.current.getBoundingClientRect();
        var cursorXY = offsetTuple2Obj(xy);
        return [
            cursorXY.x - wrapBound.left,
            cursorXY.y - wrapBound.top
        ];
    }
    /** 根据当前状态和光标时间状态重新设置提示节点 */ var refreshTipNode = useFn(function(xy, down) {
        if (!self.tipNode) return;
        var tipNodeStatus = getTipNodeStatus(self.fullSize, xy, state.limitBound);
        if (!down) {
            hideTipNode();
            if (tipNodeStatus) {
                var size = tipNodeStatus;
                setXY(size.left, size.top, {
                    width: size.width,
                    height: size.height
                }).then(refreshDeps);
            }
            return;
        }
        if (tipNodeStatus) {
            showTipNode();
            Object.entries(tipNodeStatus).forEach(function(param) {
                var _param = _sliced_to_array(param, 2), key = _param[0], val = _param[1];
                if (self.tipNode) {
                    var oldVal = self.tipNode.style[key];
                    var valStr = "".concat(val, "px");
                    if (valStr !== oldVal) {
                        self.tipNode.style[key] = valStr;
                    }
                }
            });
        } else {
            hideTipNode();
        }
    }, function(fn) {
        return _throttle(fn, 10);
    });
    /** 隐藏提示节点 */ function hideTipNode() {
        if (!self.tipNode) return;
        if (self.tipNode.style.visibility !== "hidden") {
            self.tipNode.style.visibility = "hidden";
            self.tipNode.style.opacity = "0";
        }
    }
    /** 显示提示节点 */ function showTipNode() {
        if (!self.tipNode) return;
        if (self.tipNode.style.visibility !== "visible") {
            self.tipNode.style.visibility = "visible";
            self.tipNode.style.opacity = "1";
        }
    }
    return {
        refreshDeps: refreshDeps,
        setXY: setXY,
        resize: resize,
        full: full,
        getCursorWrapOffset: getCursorWrapOffset,
        top: top,
        setPresetPosition: setPresetPosition,
        refreshTipNode: refreshTipNode
    };
}
