import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import React, { useMemo } from "react";
import { ensureArray, isFunction } from "@m78/utils";
import { useFn, useSelf } from "../../index.js";
export var UseTriggerType;
(function(UseTriggerType) {
    UseTriggerType[/** 点击 */ "click"] = "click";
    UseTriggerType[/**
   * 获得焦点, 该事件在获取焦点和失去焦点时均会触发, 可通过e.focus判断是否聚焦, 事件的x/y, offsetX/Y等坐标信息始终为0
   * - 需要确保element或其任意子级是focusable的
   * */ "focus"] = "focus";
    UseTriggerType[/**
   * 根据不同的设备, 会有不同的表现, 该事件在开始和结束时均会触发:
   * - 支持鼠标事件的设备 - hover
   * - 不支持鼠标且支持touch的设备 - 按住
   *
   * 此事件自动附加了一个触发延迟, 用于在大部分场景下获得更好的体验(比如鼠标快速划过)
   * */ "active"] = "active";
    UseTriggerType[/** 通常是鼠标的副键点击, 在移动设备, 按住超过一定时间后也会触发, 并且会和通过touch触发的active一同触发, 所以不建议将两者混合使用 */ "contextMenu"] = "contextMenu";
})(UseTriggerType || (UseTriggerType = {}));
var ActiveType;
(function(ActiveType) {
    ActiveType[ActiveType["undefined"] = 0] = "undefined";
    ActiveType[ActiveType["mouse"] = 1] = "mouse";
    ActiveType[ActiveType["touch"] = 2] = "touch";
})(ActiveType || (ActiveType = {}));
var createNilEvent = function(type, e) {
    var data = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
    return {
        type: type,
        active: false,
        focus: false,
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        nativeEvent: e,
        data: data
    };
};
/** 将e2的xy, offsetXY赋值到e的对应属性 */ var offsetSet = function(e, e2) {
    e.x = e2.x || 0;
    e.y = e2.y || 0;
    e.offsetX = e2.offsetX || 0;
    e.offsetY = e2.offsetY || 0;
    return e;
};
/** 根据touch事件和目标节点生成事件对象 */ function touchGen(e, ele) {
    var data = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
    var touch = e.changedTouches[0];
    if (!touch || !ele) return null;
    var tBound = ele.getBoundingClientRect();
    return offsetSet(createNilEvent(UseTriggerType.active, e, data), {
        x: touch.clientX,
        y: touch.clientY,
        offsetX: touch.clientX - tBound.left,
        offsetY: touch.clientY - tBound.top
    });
}
/** 调用eType指定的element.props事件, 自动进行空处理, 用来确保内部事件不会覆盖用户主动向节点传入的事件 */ var elementPropsEventCall = function(element, eType, e) {
    var ref;
    var call = element === null || element === void 0 ? void 0 : (ref = element.props) === null || ref === void 0 ? void 0 : ref[eType];
    if (isFunction(call)) {
        call(e);
    }
};
/**
 * 用来为一个ReactElement绑定常用的触发事件
 * */ export function useTrigger(config) {
    var element = config.element, type = config.type, onTrigger = config.onTrigger, _active = config.active, active = _active === void 0 ? {} : _active, _data = config.data, data = _data === void 0 ? null : _data;
    var triggerDelay = active.triggerDelay, _leaveDelay = active.leaveDelay, leaveDelay = _leaveDelay === void 0 ? 100 : _leaveDelay;
    var types = ensureArray(type);
    var self = useSelf({
        /**
     * 用于防止active绑定的touch和mouse事件冲突, 某些设备同时支持两者, 此配置用于在某一事件触发后永远的禁用另一事件
     * 0为待定 1为mouse 2为touch
     * */ activeType: ActiveType.undefined,
        /** 是否处于active状态中 */ active: false,
        /** active delay 计时器 */ activeTimer: null
    });
    // 保持事件回调引用
    var trigger = useFn(function(e) {
        return onTrigger === null || onTrigger === void 0 ? void 0 : onTrigger(e);
    });
    // 事件是否启用
    var has = useFn(function(key) {
        return types.includes(key);
    });
    /** 处理active事件延迟的帮助函数 */ var activeDelayHelper = useFn(function(cb, delay) {
        clearTimeout(self.activeTimer);
        if (delay) {
            self.activeTimer = setTimeout(cb, Math.max(delay));
            return;
        }
        cb();
    });
    var clickHandle = useFn(function(e) {
        elementPropsEventCall(element, "onClick", e);
        var event = offsetSet(createNilEvent(UseTriggerType.click, e.nativeEvent, data), e.nativeEvent);
        trigger(event);
    });
    var focusHandle = useFn(function(e) {
        elementPropsEventCall(element, "onFocus", e);
        e.stopPropagation();
        var event = createNilEvent(UseTriggerType.focus, e.nativeEvent, data);
        event.focus = true;
        trigger(event);
    });
    var blurHandle = useFn(function(e) {
        elementPropsEventCall(element, "onBlur", e);
        e.stopPropagation();
        var event = createNilEvent(UseTriggerType.focus, e.nativeEvent, data);
        event.data = data;
        trigger(event);
    });
    // active start基础逻辑
    var activeEnterHandle = useFn(function(e, aType, reverseType) {
        if (self.activeType === reverseType) return;
        self.activeType = aType;
        var d = triggerDelay;
        // 如果未设置, 根据类型为其设置默认值
        if (d === undefined) {
            if (aType === ActiveType.mouse) d = 140;
            if (aType === ActiveType.touch) d = 400;
        }
        activeDelayHelper(function() {
            if (self.active) return;
            var event = aType === ActiveType.mouse ? offsetSet(createNilEvent(UseTriggerType.active, e, data), e.nativeEvent) : touchGen(e, e.nativeEvent.currentTarget, data);
            if (!event) return;
            self.active = true;
            event.active = true;
            trigger(event);
        }, d);
    });
    // active end基础逻辑
    var activeLeaveHandle = useFn(function(e, aType) {
        if (self.activeType !== aType) return;
        clearTimeout(self.activeTimer);
        activeDelayHelper(function() {
            if (!self.active) return;
            self.active = false;
            var event = aType === ActiveType.mouse ? offsetSet(createNilEvent(UseTriggerType.active, e, data), e.nativeEvent) : touchGen(e, e.nativeEvent.currentTarget, data);
            if (!event) return;
            trigger(event);
        }, leaveDelay);
    });
    var mouseEnterHandle = useFn(function(e) {
        elementPropsEventCall(element, "onMouseEnter", e);
        activeEnterHandle(e, ActiveType.mouse, ActiveType.touch);
    });
    var mouseLeaveHandle = useFn(function(e) {
        elementPropsEventCall(element, "onMouseLeave", e);
        activeLeaveHandle(e, ActiveType.mouse);
    });
    var touchStartHandle = useFn(function(e) {
        elementPropsEventCall(element, "onTouchStart", e);
        activeEnterHandle(e, ActiveType.touch, ActiveType.mouse);
    });
    var touchEndHandle = useFn(function(e) {
        elementPropsEventCall(element, "onTouchEnd", e);
        activeLeaveHandle(e, ActiveType.touch);
    });
    var contextMenuHandle = useFn(function(e) {
        elementPropsEventCall(element, "onContextMenu", e);
        var hasContext = has(UseTriggerType.contextMenu);
        // context点击, 获取touch式的active时, 阻止上下文菜单
        if (hasContext || has(UseTriggerType.active) && self.activeType === 2) {
            e.preventDefault();
        }
        if (!hasContext) return;
        var event = offsetSet(createNilEvent(UseTriggerType.contextMenu, e.nativeEvent), e.nativeEvent);
        trigger(event);
    });
    var events = useMemo(function() {
        var events = {
            // active会在按压时禁用右键菜单, 防止误触发, 所以此事件触发条件在处理函数内部进行
            onContextMenu: contextMenuHandle
        };
        if (has(UseTriggerType.click)) {
            events["onClick"] = clickHandle;
        }
        if (has(UseTriggerType.focus)) {
            events["onFocus"] = focusHandle;
            events["onBlur"] = blurHandle;
        }
        if (has(UseTriggerType.active)) {
            events["onMouseEnter"] = mouseEnterHandle;
            events["onMouseLeave"] = mouseLeaveHandle;
            events["onTouchStart"] = touchStartHandle;
            events["onTouchEnd"] = touchEndHandle;
        }
        return events;
    }, types);
    return useMemo(function() {
        return /*#__PURE__*/ React.cloneElement(element, _object_spread({}, element.props, events));
    }, [
        events,
        element
    ]);
}
export function Trigger(config) {
    return useTrigger(_object_spread_props(_object_spread({}, config), {
        element: config.children
    }));
}
