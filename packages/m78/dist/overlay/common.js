import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import React from "react";
import { dumpFn, isNumber, omit } from "@m78/utils";
import { config } from "react-spring";
import { TransitionType } from "../transition/index.js";
import { Z_INDEX_MODAL } from "../common/index.js";
import clamp from "lodash/clamp.js";
import { useSame, UseTriggerType } from "@m78/hooks";
import { omitApiProps, OverlayDirection } from "./types.js";
export var _defaultAlignment = [
    0.5,
    0.5
];
export var _defaultProps = {
    namespace: "overlay",
    transitionType: TransitionType.fade,
    zIndex: Z_INDEX_MODAL,
    clickAwayClosable: true,
    clickAwayQueue: true,
    lockScroll: true,
    arrowSize: [
        26,
        8
    ],
    offset: 0,
    triggerType: UseTriggerType.click,
    autoFocus: true
};
export var overlayTransitionConfig = config.stiff;
/** 箭头和目标之间的补白 */ export var _arrowSpace = 4;
export var dragContext = React.createContext({
    onDrag: dumpFn,
    getXY: dumpFn,
    getBound: dumpFn
});
/** 检测入参是否为BoundSize */ export function isBound(a) {
    if (!a) return false;
    return isNumber(a.left) && isNumber(a.top) && isNumber(a.width) && isNumber(a.height);
}
/**
 * alignment转换为实际xy
 * @param alignment - align配置
 * @param size - 容器尺寸
 * */ export function _calcAlignment(alignment, size) {
    var sW = window.innerWidth - size[0];
    var sH = window.innerHeight - size[1];
    var _alignment = _sliced_to_array(alignment, 2), aX = _alignment[0], aY = _alignment[1];
    var x = sW * aX;
    var y = sH * aY;
    return [
        x,
        y
    ];
}
/** 当要为其他上层组件创建api时, 通过此函数来剔除不必要的props */ export function getOverlayApiProps(props) {
    return omit(props, omitApiProps);
}
/**
 * 所有弹层类组件共享的useSame包装, 用于统一mask显示
 * */ export function useOverlaysMask(config) {
    var ref = _sliced_to_array(useSame("m78-overlay-mask", config), 3), index = ref[0], list = ref[1], id = ref[2];
    return {
        index: index,
        list: list,
        id: id,
        isFirst: index === 0,
        isLast: index === list.length - 1
    };
}
var defaultClickAwaySameNameSpace = "m78-overlay-clickAway";
/**
 * 所有弹层类组件共享的useSame包装, 用于统一clickAway
 * */ export function useOverlaysClickAway(config, namespace) {
    var ref = _sliced_to_array(useSame(namespace || defaultClickAwaySameNameSpace, config), 3), index = ref[0], list = ref[1], id = ref[2];
    return {
        index: index,
        list: list,
        id: id,
        isFirst: index === 0,
        isLast: index === list.length - 1
    };
}
/** useTrigger回调 */ export function _onTrigger(e, setOpen, self, props) {
    var ref;
    (ref = props.onTrigger) === null || ref === void 0 ? void 0 : ref.call(props, e);
    if (e.type === UseTriggerType.click) {
        if (self.lastFocusTime) {
            // focus和click前后间隔400ms才触发
            var diff = Date.now() - self.lastFocusTime;
            if (diff > 400) {
                setOpen(function(prev) {
                    return !prev;
                });
            }
        } else {
            setOpen(function(prev) {
                return !prev;
            });
        }
    }
    // 标记正常出发focus, 并在open改变时取消
    if (e.type === UseTriggerType.focus && e.focus) {
        self.lastFocusTime = Date.now();
    }
    if (e.type === UseTriggerType.focus || e.type === UseTriggerType.active) {
        self.currentActiveStatus = e.type === UseTriggerType.focus ? e.focus : e.active;
        if (!self.activeContent || self.currentActiveStatus) {
            setOpen(self.currentActiveStatus);
        } else {
            self.shouldCloseFlag = true;
        }
    }
    if (e.type === UseTriggerType.contextMenu) {
        setOpen(true);
    }
}
/**
 * 根据t, c获取内容在OverlayDirection各个位置上的坐标信息_DirectionMeta
 * */ export function _getDirections(t, c, clampBound) {
    var offset = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
    // 目标和内容的宽度差异的
    var wDiff = t.width - c.width;
    var xCenter = wDiff / 2 + t.left;
    var hDiff = t.height - c.height;
    var yCenter = hDiff / 2 + t.top;
    var _t = t.top - c.height - offset;
    var top = {
        top: _t,
        left: xCenter,
        valid: _t >= clampBound.top,
        direction: OverlayDirection.top
    };
    var topStart = {
        top: top.top,
        left: t.left,
        valid: top.valid,
        direction: OverlayDirection.topStart
    };
    var topEnd = {
        top: top.top,
        left: t.left + wDiff,
        valid: top.valid,
        direction: OverlayDirection.topEnd
    };
    var _bt = t.top + t.height + offset;
    var bottom = {
        top: _bt,
        left: top.left,
        valid: _bt + c.height <= clampBound.bottom,
        direction: OverlayDirection.bottom
    };
    var bottomStart = {
        top: bottom.top,
        left: topStart.left,
        valid: bottom.valid,
        direction: OverlayDirection.bottomStart
    };
    var bottomEnd = {
        top: bottom.top,
        left: topEnd.left,
        valid: bottom.valid,
        direction: OverlayDirection.bottomEnd
    };
    var _l = t.left - c.width - offset;
    var left = {
        top: yCenter,
        left: t.left - c.width - offset,
        valid: _l >= clampBound.left,
        direction: OverlayDirection.left
    };
    var leftStart = {
        top: t.top,
        left: left.left,
        valid: left.valid,
        direction: OverlayDirection.leftStart
    };
    var leftEnd = {
        top: t.top + hDiff,
        left: left.left,
        valid: left.valid,
        direction: OverlayDirection.leftEnd
    };
    var _r = t.left + t.width + offset;
    var right = {
        top: yCenter,
        left: _r,
        valid: _r + c.width <= clampBound.right,
        direction: OverlayDirection.right
    };
    var rightStart = {
        top: t.top,
        left: right.left,
        valid: right.valid,
        direction: OverlayDirection.rightStart
    };
    var rightEnd = {
        top: t.top + hDiff,
        left: right.left,
        valid: right.valid,
        direction: OverlayDirection.rightEnd
    };
    return {
        top: top,
        topStart: topStart,
        topEnd: topEnd,
        bottom: bottom,
        bottomStart: bottomStart,
        bottomEnd: bottomEnd,
        left: left,
        leftStart: leftStart,
        leftEnd: leftEnd,
        right: right,
        rightStart: rightStart,
        rightEnd: rightEnd
    };
}
var flipReverse = {
    top: [
        "bottom",
        "left",
        "right"
    ],
    bottom: [
        "top",
        "left",
        "right"
    ],
    left: [
        "right",
        "top",
        "bottom"
    ],
    right: [
        "left",
        "top",
        "bottom"
    ]
};
/**
 * 接收_DirectionMetaMap和指定的方向, 在该方向不可用时依次选取 lastDirection > 相反方向 > 其他备选方向
 * @param direction - 指定方向
 * @param directions - 所有可用方向
 * @param lastDirection - 最后一次使用的方向
 * */ export function _flip(direction, directions, lastDirection) {
    var current = directions[direction];
    if (current.valid) return current;
    if (lastDirection) {
        var lastCurrent = directions[lastDirection];
        if (lastCurrent.valid) return lastCurrent;
    }
    // 从备选方向中挑选出一个来使用
    var d = direction.replace(/Start|End/, "");
    var reverseList = flipReverse[d];
    var pickCurrent = null;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = reverseList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var item = _step.value;
            var rKey = direction.replace(d, item);
            var next = directions[rKey];
            if (next && next.valid) {
                pickCurrent = next;
                break;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    if (pickCurrent) return pickCurrent;
    // 没有可用的备选方向是, 使用原方向
    return current;
}
/**
 * 在所在轴超出窗口时, 修正位置避免遮挡
 * number为监听的实际偏移值
 * boolean表示气泡是否应该隐藏或弱化显示, 超出可见区域一个t尺寸时为true
 * */ export function _preventOverflow(dMeta, t, c, clampBound, param) {
    var _param = _sliced_to_array(param, 2), w = _param[0], h = _param[1];
    var direction = dMeta.direction;
    // 超出边界后, 保持此距离可见
    var keepOffset = 0;
    // 四个方向的边线, 超出边线距离则该方向不可见
    var lLine = t.left + t.width - clampBound.left;
    var rLine = clampBound.right - t.left;
    var tLine = t.top + t.height - clampBound.top;
    var bLine = clampBound.bottom - t.top;
    var isXDir = _isX(direction);
    var isRT = _isRightOrTop(direction);
    var left = dMeta.left;
    var top = dMeta.top;
    // 各轴上默认情况下的最大最小可用位置
    var xMax = clampBound.right - c.width;
    var yMax = clampBound.bottom - c.height;
    var xMin = clampBound.left;
    var yMin = clampBound.top;
    // x或y轴时候超出
    var xOverflow = lLine < 0 || rLine < 0;
    var yOverflow = tLine < 0 || bLine < 0;
    // 目标和内容的右侧区域
    var contentRight = dMeta.left + c.width;
    var targetRight = t.left + t.width;
    var contentBottom = dMeta.top + c.height;
    var targetBottom = t.top + t.height;
    // 目标超出区域, 添加位置修正
    if (xOverflow) {
        xMax += c.width - keepOffset;
        xMin -= c.width - keepOffset;
        // 修正的轴
        var isXLine = isXDir;
        // 超出边
        if (isXLine && rLine < 0) {
            // 到这里, left已经比实际的少了: c的宽度 + (目标left - 实际left) 即目标和内容在对立方向的差值
            // 其他三个方向大致同理
            left -= c.width + (dMeta.left - t.left);
        }
        if (isXLine && lLine < 0) {
            left += c.width + (targetRight - contentRight);
        }
    }
    if (yOverflow) {
        yMin -= c.height - keepOffset;
        yMax += c.height - keepOffset;
        var isYLine = !isXDir;
        if (isYLine && bLine < 0) {
            top -= c.height + (dMeta.top - t.top);
        }
        if (isYLine && tLine < 0) {
            top += c.height + (targetBottom - contentBottom);
        }
    }
    var finalLeft = clamp(left, xMin, xMax);
    var finalTop = clamp(top, yMin, yMax);
    /** # 箭头处理 */ // 箭头的最左侧坐标
    var arrowLeftBound = isXDir ? finalLeft : finalTop;
    // 内容在其对应轴的尺寸
    var contSize = isXDir ? c.width : c.height;
    // 目标在其对应轴的尺寸
    var targetSize = isXDir ? t.width : t.height;
    // 箭头位置
    var arrowPosition = 0;
    // 基础位置
    if (_isLTRB(direction)) arrowPosition = targetSize / 2 - w / 2;
    if (_isStart(direction)) arrowPosition = 0;
    if (_isEnd(direction)) arrowPosition = targetSize - w;
    // 左侧坐标加基础位置
    arrowPosition = t[isXDir ? "left" : "top"] + arrowPosition;
    var keepSpace = 4;
    // 箭头位置
    var arrowOffset = clamp(arrowPosition - arrowLeftBound, keepSpace, contSize - w - keepSpace * 2 /* 两侧的和 */ );
    if (isRT) arrowOffset = -arrowOffset;
    // xy轴上的箭头和剩余空间
    var yExtraSpace = isXDir ? _arrowSpace + h : 0;
    var xExtraSpace = isXDir ? 0 : _arrowSpace + h;
    // 是否已隐藏, 超出可见区域一个target尺寸视为不可见
    var isHidden = lLine + xExtraSpace < -c.width || rLine + xExtraSpace < -c.width || tLine + yExtraSpace < -c.height || bLine + yExtraSpace < -c.height;
    return [
        _object_spread_props(_object_spread({}, dMeta), {
            left: finalLeft,
            top: finalTop
        }),
        arrowOffset,
        isHidden, 
    ];
}
/**
 * 获取箭头的的基础位置
 * */ export function _getArrowBasePosition(direction, param) {
    var _param = _sliced_to_array(param, 2), w = _param[0], h = _param[1];
    // 旋转后的偏移值
    var offset = (w - h) / 2;
    if (direction.startsWith(OverlayDirection.top)) {
        return {
            bottom: -h,
            left: 0,
            rotate: 180
        };
    }
    if (direction.startsWith(OverlayDirection.bottom)) {
        return {
            top: -h,
            left: 0,
            rotate: 0
        };
    }
    if (direction.startsWith(OverlayDirection.left)) {
        return {
            top: offset,
            right: -offset - h,
            rotate: 90
        };
    }
    if (direction.startsWith(OverlayDirection.right)) {
        return {
            top: offset,
            left: -offset - h,
            rotate: -90
        };
    }
    return null;
}
/** 指定方向是否是x轴 */ export function _isX(direction) {
    return direction.startsWith(OverlayDirection.top) || direction.startsWith(OverlayDirection.bottom);
}
/** 指定的方向是否是右或者上 */ export function _isRightOrTop(direction) {
    return direction.startsWith(OverlayDirection.right) || direction.startsWith(OverlayDirection.top);
}
/** 是否为非Start和End的方向 */ export function _isLTRB(direction) {
    return !/(End|Start)$/.test(direction);
}
export function _isStart(direction) {
    return /Start$/.test(direction);
}
export function _isEnd(direction) {
    return /End$/.test(direction);
}
/** 从一组dom中获取最小bound */ export function _getMinClampBound(els) {
    var _Math, _Math1, _Math2, _Math3;
    var l = [
        0
    ];
    var t = [
        0
    ];
    var r = [
        window.innerWidth
    ];
    var b = [
        window.innerHeight
    ];
    els.forEach(function(el) {
        var bound = el.getBoundingClientRect();
        l.push(bound.left);
        t.push(bound.top);
        r.push(bound.right);
        b.push(bound.bottom);
    });
    return {
        left: (_Math = Math).max.apply(_Math, _to_consumable_array(l)),
        top: (_Math1 = Math).max.apply(_Math1, _to_consumable_array(t)),
        right: (_Math2 = Math).min.apply(_Math2, _to_consumable_array(r)),
        bottom: (_Math3 = Math).min.apply(_Math3, _to_consumable_array(b))
    };
}
