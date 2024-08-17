import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useDrag } from "react-use-gesture";
import _clamp from "lodash/clamp.js";
import { useRef } from "react";
import { isNumber } from "@m78/utils";
import { WineDragPosition } from "./types.js";
import { sizeTuple2Obj } from "./common.js";
import { MIN_SIZE } from "./consts.js";
export function useDragResize(type, ctx, methods) {
    var ref = useRef(null);
    var wrapElRef = ctx.wrapElRef, self = ctx.self, spApi = ctx.spApi, insideState = ctx.insideState, setInsideState = ctx.setInsideState;
    useDrag(function(param) {
        var _param_xy = _sliced_to_array(param.xy, 2), x = _param_xy[0], y = _param_xy[1];
        var wrapBound = wrapElRef.current.getBoundingClientRect();
        // 最终的动画对象
        var aniObj = {
            immediate: true
        };
        if (type === WineDragPosition.R) {
            aniObj.width = getRightMeta(wrapBound, [
                x,
                y
            ]);
        }
        if (type === WineDragPosition.B) {
            aniObj.height = getBottomMeta(wrapBound, [
                x,
                y
            ]);
        }
        if (type === WineDragPosition.L) {
            Object.assign(aniObj, getLeftMeta(wrapBound, [
                x,
                y
            ]));
        }
        if (type === WineDragPosition.T) {
            Object.assign(aniObj, getTopMeta(wrapBound, [
                x,
                y
            ]));
        }
        if (type === WineDragPosition.RB) {
            aniObj.width = getRightMeta(wrapBound, [
                x,
                y
            ]);
            aniObj.height = getBottomMeta(wrapBound, [
                x,
                y
            ]);
        }
        if (type === WineDragPosition.LB) {
            Object.assign(aniObj, getLeftMeta(wrapBound, [
                x,
                y
            ]));
            aniObj.height = getBottomMeta(wrapBound, [
                x,
                y
            ]);
        }
        if (type === WineDragPosition.LT) {
            Object.assign(aniObj, getLeftMeta(wrapBound, [
                x,
                y
            ]));
            Object.assign(aniObj, getTopMeta(wrapBound, [
                x,
                y
            ]));
        }
        if (type === WineDragPosition.RT) {
            Object.assign(aniObj, getTopMeta(wrapBound, [
                x,
                y
            ]));
            aniObj.width = getRightMeta(wrapBound, [
                x,
                y
            ]);
        }
        if (isNumber(aniObj.x)) self.x = aniObj.x;
        if (isNumber(aniObj.y)) self.y = aniObj.y;
        Promise.all(spApi.start(aniObj)).then(function() {
            methods.refreshDeps();
            if (insideState.isFull) setInsideState({
                isFull: false
            });
        });
    }, {
        domTarget: ref
    });
    function getRightMeta(wrapBound, param) {
        var _param = _sliced_to_array(param, 1), x = _param[0];
        /** 最终宽度 = 当前宽度 + 鼠标x位置 - 右侧位置 */ var w = wrapBound.width + x - wrapBound.right;
        /** wLimit = bound位置 + wrap尺寸 - wrap相反方向偏移 */ var wLimit = self.windowBound.right + wrapBound.width - wrapBound.left;
        return _clamp(w, 300, wLimit);
    }
    function getBottomMeta(wrapBound, param) {
        var _param = _sliced_to_array(param, 2), y = _param[1];
        var h = wrapBound.height + y - wrapBound.bottom;
        var hLimit = self.windowBound.bottom + wrapBound.height - wrapBound.top;
        return _clamp(h, sizeTuple2Obj(self.headerSize).h, hLimit);
    }
    function getLeftMeta(wrapBound, param) {
        var _param = _sliced_to_array(param, 1), x = _param[0];
        /** 最终宽度 = 右侧位置 - 鼠标x位置 */ var w = wrapBound.right - x;
        /** wLimit = 右侧位置 */ var wLimit = wrapBound.right;
        return {
            x: _clamp(x, self.windowBound.left, wrapBound.right - MIN_SIZE),
            width: _clamp(w, MIN_SIZE, wLimit)
        };
    }
    function getTopMeta(wrapBound, param) {
        var _param = _sliced_to_array(param, 2), y = _param[1];
        var h = wrapBound.bottom - y;
        var hLimit = wrapBound.bottom;
        return {
            y: _clamp(y, self.windowBound.top, wrapBound.bottom - MIN_SIZE),
            height: _clamp(h, MIN_SIZE, hLimit)
        };
    }
    return ref;
}
