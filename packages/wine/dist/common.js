import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { WineDragPosition } from "./types.js";
import { DEFAULT_FULL_LIMIT_BOUND, TIP_NODE_KEY } from "./consts.js";
/** 根据alignment值获取x, y值 */ export function calcAlignment(alignment, limit, self) {
    var _self_availableSize = _sliced_to_array(self.availableSize, 2), aW = _self_availableSize[0], aH = _self_availableSize[1];
    var w = aW - limit.left - limit.right;
    var h = aH - limit.top - limit.bottom;
    var _alignment = _sliced_to_array(alignment, 2), aX = _alignment[0], aY = _alignment[1];
    var x = w * aX;
    var y = h * aY;
    return [
        x + limit.left,
        y + limit.top
    ];
}
/** 根据[number, height]格式的元组取{ w, h }格式的对象 */ export function sizeTuple2Obj(sizeT) {
    return {
        w: sizeT[0],
        h: sizeT[1]
    };
}
/** sizeTuple2Obj的偏移版本` */ export function offsetTuple2Obj(offsetT) {
    return {
        x: offsetT[0],
        y: offsetT[1]
    };
}
/** 根据state状态获取当前尺寸 */ export function getSizeByState(state) {
    var w;
    var h;
    var _getFullSize = _sliced_to_array(getFullSize(state), 2), fW = _getFullSize[0], fH = _getFullSize[1];
    if (state.width) w = state.width;
    if (state.height) h = state.height;
    // 横纵屏与不同的方式作用sizeRatio, 横屏以高度为基准，竖屏一宽度为基准
    if (fW > fH) {
        if (!h) h = state.sizeRatio * fH;
        if (!w) w = h * 1.3;
    } else {
        if (!w) w = state.sizeRatio * fW;
        if (!h) h = w / 1.3;
    }
    return [
        Math.min(Math.floor(w), fW),
        Math.min(Math.floor(h), fH)
    ];
}
/** 创建一个空的dom节点 */ export function getTipNode() {
    if (typeof window === "undefined") return;
    if (typeof window.document === "undefined") return;
    var el = document.getElementById(TIP_NODE_KEY);
    if (el) return el;
    var div = document.createElement("div");
    div.id = TIP_NODE_KEY;
    div.className = "m78-wine_tip-node";
    document.body.appendChild(div);
    return div;
}
// /** 检测指定的xy点是否在 */
// export function checkPointerInBound([x, y]: TupleNumber, bound: BoundSize) {
//   return (
//     x >= bound.left &&
//     x <= bound.left + bound.width &&
//     y >= bound.top &&
//     y <= bound.top + bound.height
//   );
// }
/** 便捷获取尺寸对象 */ export function sizeBoundHelper(left, top, width, height) {
    return {
        top: top,
        left: left,
        width: width,
        height: height
    };
}
/** 获取预设方向的尺寸和位置 */ export function getPresetPosition(pos, param, flb) {
    var _param = _sliced_to_array(param, 2), fW = _param[0], fH = _param[1];
    /* 全屏高度的一半 */ var fHHalf = fH / 2;
    /* 全屏宽度的一半 */ var fWHalf = fW / 2;
    if (pos === WineDragPosition.T) return sizeBoundHelper(flb.left, flb.top, fW, fHHalf);
    if (pos === WineDragPosition.R) return sizeBoundHelper(fWHalf + flb.left, flb.top, fWHalf, fH);
    if (pos === WineDragPosition.B) return sizeBoundHelper(flb.left, fHHalf + flb.top, fW, fHHalf);
    if (pos === WineDragPosition.L) return sizeBoundHelper(flb.left, flb.top, fWHalf, fH);
    if (pos === WineDragPosition.LT) return sizeBoundHelper(flb.left, flb.top, fWHalf, fHHalf);
    if (pos === WineDragPosition.LB) return sizeBoundHelper(flb.left, fHHalf + flb.top, fWHalf, fHHalf);
    if (pos === WineDragPosition.RT) return sizeBoundHelper(fWHalf + flb.left, flb.top, fWHalf, fHHalf);
    return sizeBoundHelper(fWHalf + flb.left, fHHalf + flb.top, fWHalf, fHHalf);
}
/** 传入光标位置、屏幕相关信息，获取触发tip节点的方向信息, 依次插入路全屏大小,  */ export function getTipNodeStatus(fullSize, xy, limitBound) {
    var _fullSize = _sliced_to_array(fullSize, 2), fW = _fullSize[0], fH = _fullSize[1];
    var flb = _object_spread({}, DEFAULT_FULL_LIMIT_BOUND, limitBound);
    var _xy = _sliced_to_array(xy, 2), x = _xy[0], y = _xy[1];
    /* 以下4变量偏移1px是为了防止全屏时光标无法移动到边缘外，所以主动减少区域 */ // 可用区域右侧
    var avaRight = flb.left + fW - 1;
    // 可用区域底部
    var avaBottom = flb.top + fH - 1;
    /** 光标是否在水平方向的中部 */ var cursorInHorizontalCenter = x > flb.left + 1 && x < avaRight;
    /** 光标是否在垂直方向的中部 */ var cursorInVerticalCenter = y > flb.top + 1 && y < avaBottom;
    var inTop = y <= flb.top && cursorInHorizontalCenter;
    if (inTop) return getPresetPosition(WineDragPosition.T, fullSize, flb);
    var inRight = x >= avaRight && cursorInVerticalCenter;
    if (inRight) return getPresetPosition(WineDragPosition.R, fullSize, flb);
    var inBottom = y >= avaBottom && cursorInHorizontalCenter;
    if (inBottom) return getPresetPosition(WineDragPosition.B, fullSize, flb);
    var inLeft = x <= flb.left && cursorInVerticalCenter;
    if (inLeft) return getPresetPosition(WineDragPosition.L, fullSize, flb);
    var inLT = x <= flb.left && y <= flb.top;
    if (inLT) return getPresetPosition(WineDragPosition.LT, fullSize, flb);
    var inLB = x <= flb.left && y >= avaBottom;
    if (inLB) return getPresetPosition(WineDragPosition.LB, fullSize, flb);
    var inRT = x >= avaRight && y <= flb.top;
    if (inRT) return getPresetPosition(WineDragPosition.RT, fullSize, flb);
    var inRB = x >= avaRight && y >= avaBottom;
    if (inRB) return getPresetPosition(WineDragPosition.RB, fullSize, flb);
}
/** 根据state获取fullSize */ export function getFullSize(_state) {
    var fullSize = [
        window.innerWidth,
        window.innerHeight
    ];
    if (_state.limitBound) {
        var flb = _object_spread({}, DEFAULT_FULL_LIMIT_BOUND, _state.limitBound);
        var fW = fullSize[0] - flb.left - flb.right;
        var fH = fullSize[1] - flb.top - flb.bottom;
        fullSize = [
            fW,
            fH
        ];
    }
    return fullSize;
}
