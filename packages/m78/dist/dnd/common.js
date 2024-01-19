import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { createContext, useMemo } from "react";
import { isBoolean, isFunction, isObject } from "@m78/utils";
import { createEvent } from "@m78/hooks";
import isEqual from "lodash/isEqual.js";
export var _DEFAULT_GROUP = "M78-DND-DEFAULT-GROUP";
/** 所有分组数据 */ export var _groupMap = _define_property({}, _DEFAULT_GROUP, {
    scrollParents: [],
    dndMap: {}
});
/** 用于为dnd标记层级关系的context */ export var _levelContext = /*#__PURE__*/ createContext({
    level: 0,
    isDefault: true
});
/** 在此比例内的区域视为边缘 */ export var EDGE_RATIO = 0.24;
export var _defaultDNDStatus = {
    dragging: false,
    over: false,
    regular: true,
    left: false,
    right: false,
    top: false,
    bottom: false,
    center: false,
    hasDragging: false
};
export var _defaultDNDEnableInfos = {
    enable: true,
    all: true,
    left: true,
    right: true,
    top: true,
    bottom: true,
    center: true
};
export function _useGroup(groupId) {
    return useMemo(function() {
        if (!groupId) {
            return _groupMap[_DEFAULT_GROUP];
        }
        if (!_groupMap[groupId]) {
            _groupMap[groupId] = {
                scrollParents: [],
                dndMap: {}
            };
        }
        return _groupMap[groupId];
    }, [
        groupId
    ]);
}
/** 判断x, y 是否在指定的DOMRect区间中 */ export function _isBetweenBound(param, x, y) {
    var left = param.left, top = param.top, right = param.right, bottom = param.bottom;
    return x > left && x < right && y > top && y < bottom;
}
/**
 * 通知所有dnd进行状态重置, 应跳过ignoreIds指定的节点, 且状态有变时才进行重置, 否则会造成高频更新,
 * 传入skipEnableReset时, 跳过enables状态的重置
 * */ export var _resetEvent = createEvent();
/** 通知所有dnd同步位置尺寸信息 */ export var _updateEvent = createEvent();
/** 用于处理draggingListen, 通知所有dnd更新 */ export var _draggingEvent = createEvent();
export var _allValueIsTrue = function(obj) {
    return Object.values(obj).every(function(v) {
        return v === true;
    });
};
export var _someValueIsTrue = function(obj) {
    return Object.values(obj).some(function(v) {
        return v === true;
    });
};
export var _getObjectByNewValues = function(obj, value) {
    var newObj = {};
    Object.keys(obj).forEach(function(key) {
        newObj[key] = value;
    });
    return newObj;
};
/** 根据enableDrop获取DNDEnableInfos */ export var _enableDropProcess = function(enableDrop, current, source) {
    var enable = isFunction(enableDrop) ? enableDrop({
        current: current,
        source: source
    }) : enableDrop;
    var enables = _object_spread({}, _getObjectByNewValues(_defaultDNDEnableInfos, false));
    if (isBoolean(enable)) {
        if (enable) {
            return {
                left: true,
                top: true,
                right: true,
                bottom: true,
                center: true,
                enable: true,
                all: true
            };
        } else {
            return enables;
        }
    } else if (isObject(enable)) {
        enables = _object_spread({}, enables, enable);
    }
    return _object_spread_props(_object_spread({}, enables), {
        enable: _someValueIsTrue(enables),
        all: _allValueIsTrue(enables)
    });
};
/** 处理并获取DNDStatus */ export var _statusProcess = function(dnd, enables, x, y) {
    var posEnableInfo = _calcOverStatus(dnd, x, y);
    var status = {
        dragging: false,
        over: true,
        regular: false,
        top: posEnableInfo.top && enables.top,
        bottom: posEnableInfo.bottom && enables.bottom,
        left: posEnableInfo.left && enables.left,
        right: posEnableInfo.right && enables.right,
        center: posEnableInfo.center && enables.center,
        hasDragging: false
    };
    status.over = status.top || status.bottom || status.left || status.right || status.center;
    if (!status.over) {
        status.regular = true;
    }
    return status;
};
/** 计算元光标和指定元素的覆盖状态, 此函数假设光标已在bound范围内 */ export function _calcOverStatus(bound, x, y) {
    var left = bound.left, top = bound.top, right = bound.right, bottom = bound.bottom;
    // 尺寸
    var width = right - left;
    var height = bottom - top;
    // 触发边缘放置的偏移距离
    var triggerXOffset = width * EDGE_RATIO;
    var triggerYOffset = height * EDGE_RATIO;
    // 各方向上的拖动状态
    var dragTop = y < top + triggerYOffset;
    var dragBottom = !dragTop && y > bottom - triggerYOffset;
    var nextShouldPass = !dragTop && !dragBottom;
    var dragRight = nextShouldPass && x > right - triggerXOffset;
    var dragLeft = nextShouldPass && x < left + triggerXOffset;
    var dragCenter = nextShouldPass && !dragRight && !dragLeft;
    return {
        top: dragTop,
        bottom: dragBottom,
        left: dragLeft,
        right: dragRight,
        center: dragCenter
    };
}
/** 根据启用和放置状态判定是否可触发Accept */ export function _checkIfAcceptable(enables, status) {
    if (status.regular) return false;
    if (enables.all && status.over) {
        return true;
    }
    if (enables.left && status.left) return true;
    if (enables.right && status.right) return true;
    if (enables.top && status.top) return true;
    if (enables.bottom && status.bottom) return true;
    return enables.center && status.center;
}
/**
 * 过滤并处理所有在光标区域内的可用dnd节点, 并主要进行以下操作:
 * - 筛选可用并覆盖了光标的dnd
 * - 在初次点击时, 更新所有可见dnd的enable状态
 * - 为满足条件的dnd生成各位置的status
 * */ export function _filterInBoundDNDs(ctx, first, xy) {
    // 所有被光标命中经过启用检测的节点
    var inBoundList = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.entries(ctx.group.dndMap)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), id = _step_value[0], dnd = _step_value[1];
            if (id === ctx.id) continue;
            // 不可见
            if (!dnd.visible) continue;
            var enableDrop = dnd.props.enableDrop;
            var current = dnd.ctx.node;
            var enables = _enableDropProcess(enableDrop, current, ctx.node);
            // 在确认拖动节点后设置到对应dnd状态
            if (first && !isEqual(dnd.ctx.state.enables, enables)) {
                dnd.ctx.setState({
                    enables: enables
                });
            }
            if (!enables.enable) continue;
            // 光标是否在目标区域内
            var inBound = _isBetweenBound(dnd, xy[0], xy[1]);
            // 未在目标区域内
            if (!inBound) continue;
            var status = _statusProcess(dnd, enables, xy[0], xy[1]);
            inBoundList.push({
                dnd: dnd,
                enables: enables,
                status: status
            });
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
    return inBoundList;
}
/**
 * 从一组同时命中的dnd中按照指定规则取出一个作为命中点
 * - 规则: 获取level最高的放置点, 若依然存在多个, 获取挂载时间最靠后的一个
 * */ export function _getCurrentTriggerByMultipleTrigger(inBoundList) {
    var current;
    if (inBoundList.length === 1) {
        current = inBoundList[0];
    } else {
        var list = [];
        var max = 0;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            // 获取level最高的放置点
            for(var _iterator = inBoundList[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var item = _step.value;
                var level = item.dnd.ctx.level;
                if (level > max) {
                    list.splice(0, list.length);
                    max = level;
                    list.push(item);
                    continue;
                }
                if (level === max) {
                    list.push(item);
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
        // 若依然存在多个, 获取挂载时间最靠后的一个
        if (list.length > 1) {
            current = list.reduce(function(prev, curr) {
                if (curr.dnd.ctx.mountTime > prev.dnd.ctx.mountTime) return curr;
                return prev;
            }, list[0]);
        } else {
            current = list[0];
        }
    }
    return current;
}
/** 禁止拖动的元素tagName */ var ignoreReg = /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO)$/;
/**  根据事件元素类型决定是否禁止拖动 */ export function _isIgnoreEl(event, ignoreElFilter) {
    var el = event === null || event === void 0 ? void 0 : event.target;
    if (!el) return false;
    var tagName = el.tagName || "";
    if (ignoreReg.test(tagName)) return true;
    var editable = el.getAttribute && el.getAttribute("contenteditable");
    if (editable) return true;
    if (ignoreElFilter) {
        return ignoreElFilter(el);
    }
    return false;
}
