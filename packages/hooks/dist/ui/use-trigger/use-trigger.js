import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useImperativeHandle } from "react";
import { dumpFn, ensureArray } from "@m78/utils";
import { useFn, useSelf, useSetState } from "../../index.js";
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
   * - 不支持鼠标且支持touch的设备 - 按住一段时间
   *
   * 此事件自动附加了一个触发延迟, 用于在大部分场景下获得更好的体验(比如鼠标快速划过)
   * */ "active"] = "active";
    UseTriggerType[/** 通常是鼠标的副键点击, 在移动设备, 按住超过一定时间后也会触发, 这和active在移动设备的行为一致, 所以不建议将两者混合使用 */ "contextMenu"] = "contextMenu";
})(UseTriggerType || (UseTriggerType = {}));
var ActiveType;
(function(ActiveType) {
    ActiveType[ActiveType["undefined"] = 0] = "undefined";
    ActiveType[ActiveType["mouse"] = 1] = "mouse";
    ActiveType[ActiveType["touch"] = 2] = "touch";
})(ActiveType || (ActiveType = {}));
var createNilEvent = function(type, e, target, data) {
    return {
        type: type,
        active: false,
        focus: false,
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        nativeEvent: e,
        target: target,
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
/** 根据touch事件和目标节点生成事件对象 */ function touchGen(e, ele, data) {
    var touch = e.changedTouches[0];
    if (!touch || !ele) return null;
    var tBound = ele.getBoundingClientRect();
    return offsetSet(createNilEvent(UseTriggerType.active, e, ele, data), {
        x: touch.clientX,
        y: touch.clientY,
        offsetX: touch.clientX - tBound.left,
        offsetY: touch.clientY - tBound.top
    });
}
/**
 * 用来为一个ReactElement绑定常用的触发事件
 * */ export function useTrigger(config) {
    var element = config.element, type = config.type, onTrigger = config.onTrigger, _active = config.active, active = _active === void 0 ? {} : _active, innerRef = config.innerRef, data = _object_without_properties(config, [
        "element",
        "type",
        "onTrigger",
        "active",
        "innerRef"
    ]);
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
        var event = offsetSet(createNilEvent(UseTriggerType.click, e, state.el, data), e);
        trigger(event);
    });
    var focusHandle = useFn(function(e) {
        e.stopPropagation();
        var event = createNilEvent(UseTriggerType.focus, e, state.el, data);
        event.focus = true;
        trigger(event);
    });
    var blurHandle = useFn(function(e) {
        e.stopPropagation();
        var event = createNilEvent(UseTriggerType.focus, e, state.el, data);
        event.data = data;
        trigger(event);
    });
    // active start基础逻辑
    var activeEnterHandle = useFn(function(e, aType) {
        if (self.activeType && self.activeType !== aType) return;
        self.activeType = aType;
        var d = triggerDelay;
        // 如果未设置, 根据类型为其设置默认值
        if (d === undefined) {
            if (aType === ActiveType.mouse) d = 140;
            if (aType === ActiveType.touch) d = 400;
        }
        activeDelayHelper(function() {
            var event = aType === ActiveType.mouse ? offsetSet(createNilEvent(UseTriggerType.active, e, state.el, data), e) : touchGen(e, state.el, data);
            if (!event) return;
            self.active = true;
            event.active = true;
            trigger(event);
        }, d);
    });
    // active end基础逻辑
    var activeLeaveHandle = useFn(function(e, aType) {
        if (self.activeType && self.activeType !== aType) return;
        self.activeType = aType;
        clearTimeout(self.activeTimer);
        activeDelayHelper(function() {
            self.active = false;
            var event = aType === ActiveType.mouse ? offsetSet(createNilEvent(UseTriggerType.active, e, state.el, data), e) : touchGen(e, state.el, data);
            if (!event) return;
            trigger(event);
        }, leaveDelay);
    });
    var mouseEnterHandle = useFn(function(e) {
        activeEnterHandle(e, ActiveType.mouse);
    });
    var mouseLeaveHandle = useFn(function(e) {
        activeLeaveHandle(e, ActiveType.mouse);
    });
    var touchStartHandle = useFn(function(e) {
        activeEnterHandle(e, ActiveType.touch);
    });
    var touchEndHandle = useFn(function(e) {
        activeLeaveHandle(e, ActiveType.touch);
    });
    var contextMenuHandle = useFn(function(e) {
        var hasContext = has(UseTriggerType.contextMenu);
        // context点击, 获取touch式的active时, 阻止上下文菜单
        if (hasContext || has(UseTriggerType.active) && self.activeType === 2) {
            e.preventDefault();
        }
        if (!hasContext) return;
        var event = offsetSet(createNilEvent(UseTriggerType.contextMenu, e, state.el, data), e);
        trigger(event);
    });
    var ref = _sliced_to_array(useSetState({
        el: null
    }), 2), state = ref[0], setState = ref[1];
    useImperativeHandle(innerRef, function() {
        return state.el;
    }, [
        state.el
    ]);
    // 通过ref测量element实际渲染的dom
    var refCallback = useFn(function(node) {
        if (!node) return;
        if (state.el !== node.nextSibling) {
            setState({
                el: node.nextSibling
            });
        }
        // 从dom中删除测量节点
        if (node && node.parentNode) {
            var parentNode = node.parentNode;
            var back = parentNode.removeChild.bind(parentNode);
            // 直接删除节点会导致react-refresh等刷新节点时报错, 所以需要添加一些补丁代码进行处理, 减少对dom树的破坏
            // 主要是为了使兄弟级的css选择器(~ +等)能保持正常运行
            // parentNode.appendChild(n);
            parentNode.removeChild = function() {
                for(var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++){
                    arg[_key] = arguments[_key];
                }
                try {
                    back.apply(void 0, _to_consumable_array(arg));
                } catch (e) {
                    dumpFn(e);
                }
            };
            parentNode.removeChild(node);
        }
    });
    // 事件绑定
    useEffect(function() {
        var el = state.el;
        if (!el) return;
        if (has(UseTriggerType.click)) {
            el.addEventListener("click", clickHandle);
        }
        if (has(UseTriggerType.focus)) {
            el.addEventListener("focus", focusHandle);
            el.addEventListener("blur", blurHandle);
        }
        if (has(UseTriggerType.active)) {
            el.addEventListener("mouseenter", mouseEnterHandle);
            el.addEventListener("mouseleave", mouseLeaveHandle);
            el.addEventListener("touchstart", touchStartHandle);
            el.addEventListener("touchend", touchEndHandle);
        }
        // active内部故意没有处理preventDefault, 因为会导致contextmenu不触发, 放到contextMenu事件中一起处理
        el.addEventListener("contextmenu", contextMenuHandle);
        // 综合考虑还是主动为用户禁用默认行为, 在触控设备上自动添加阻止默认行为css
        if ("ontouchstart" in document.documentElement && (has(UseTriggerType.active) || has(UseTriggerType.contextMenu))) {
            el.style.touchAction = "none";
            el.style.userSelect = "none";
        }
        return function() {
            el.removeEventListener("click", clickHandle);
            el.removeEventListener("focus", focusHandle);
            el.removeEventListener("blur", blurHandle);
            el.removeEventListener("mouseenter", mouseEnterHandle);
            el.removeEventListener("mouseleave", mouseLeaveHandle);
            el.removeEventListener("touchstart", touchStartHandle);
            el.removeEventListener("touchend", touchEndHandle);
            el.removeEventListener("contextmenu", contextMenuHandle);
        };
    }, [
        state.el
    ].concat(_to_consumable_array(types)));
    return {
        node: /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ React.isValidElement(element) && /*#__PURE__*/ _jsx("span", {
                    style: {
                        display: "none"
                    },
                    ref: refCallback
                }, String(Math.random())),
                element
            ]
        }),
        el: state.el
    };
}
export function Trigger(config) {
    var trigger = useTrigger(_object_spread_props(_object_spread({}, config), {
        element: config.children,
        children: undefined
    }));
    return trigger.node;
}
