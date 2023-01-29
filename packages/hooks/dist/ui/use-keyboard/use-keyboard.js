import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import { useEffect, useMemo } from "react";
import { createRandString, getPlatform } from "@m78/utils";
export var UseKeyboardTriggerType;
(function(UseKeyboardTriggerType) {
    UseKeyboardTriggerType["down"] = "down";
    UseKeyboardTriggerType["up"] = "up";
})(UseKeyboardTriggerType || (UseKeyboardTriggerType = {}));
export var UseKeyboardModifier;
(function(UseKeyboardModifier) {
    UseKeyboardModifier["alt"] = "alt";
    UseKeyboardModifier["ctrl"] = "ctrl";
    UseKeyboardModifier["meta"] = "meta";
    UseKeyboardModifier["shift"] = "shift";
    UseKeyboardModifier[/** 特定于系统的控制建, mac上为command, win上位ctrl */ "sysCmd"] = "sysCmd";
})(UseKeyboardModifier || (UseKeyboardModifier = {}));
/** 全局事件是否绑定, 延迟绑定, 以兼容ssr */ var init = false;
/** 存放所有事件, 这样能在每一次render时快速通过hash更新事件的最新配置, 而不用进行遍历 */ var eventMap = new Map();
/** 映射浏览器事件名为hook特有的 */ var typeMapper = function(type) {
    if (type === "keydown") return UseKeyboardTriggerType.down;
    if (type === "keyup") return UseKeyboardTriggerType.up;
};
/** 所有hook共享一个全局事件 */ function initBind() {
    if (init) return;
    init = true;
    document.addEventListener("keydown", handle);
    document.addEventListener("keyup", handle);
}
function handle(e) {
    var eventList = Array.from(eventMap.values()).reverse();
    eventList.sort(function(a, b) {
        return b.priority - a.priority;
    });
    // 标记同键位事件是否调用过, key是 修饰键 + 按钮
    var triggerFlags = new Map();
    var platform = getPlatform();
    var event = {
        code: e.code,
        key: e.key,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        sysCmdKey: platform.mac ? e.metaKey : e.ctrlKey,
        repeat: e.repeat,
        isComposing: e.isComposing,
        type: typeMapper(e.type),
        nativeEvent: e
    };
    // 共用一个事件对象, 防篡改
    Object.freeze(event);
    var flagKey = event.code;
    if (event.altKey) flagKey += "+".concat(UseKeyboardModifier.alt);
    if (event.ctrlKey) flagKey += "+".concat(UseKeyboardModifier.ctrl);
    if (event.metaKey) flagKey += "+".concat(UseKeyboardModifier.meta);
    if (event.shiftKey) flagKey += "+".concat(UseKeyboardModifier.shift);
    if (event.sysCmdKey) flagKey += "+".concat(UseKeyboardModifier.sysCmd);
    eventList.forEach(function(opt) {
        if (!opt.enable) return;
        if (opt.type !== event.type) return;
        if (opt.code.length && !opt.code.includes(event.code)) return;
        if (opt.modifier.length && !opt.modifier.every(function(i) {
            return flagKey.includes("+".concat(i));
        })) {
            return;
        }
        if (opt.cover && triggerFlags.get(flagKey)) return;
        opt.onTrigger(event);
        triggerFlags.set(flagKey, true);
    });
}
/** 默认配置 */ var defaultOption = {
    enable: true,
    type: UseKeyboardTriggerType.down,
    priority: 0,
    cover: false,
    code: [],
    modifier: []
};
/**
 * 订阅键盘事件
 * - 此hook主要目的是简化按键事件的绑定和分派, 不处理兼容性, 如果需要兼容旧的浏览器, 需要自行处理兼容
 * - 订阅时间越晚的事件越先触发
 * */ export function useKeyboard(option) {
    var opt = _object_spread({}, defaultOption, option);
    useMemo(function() {
        return initBind();
    }, []);
    /** 事件的唯一id */ var eventId = useMemo(function() {
        return createRandString();
    }, []);
    // 实时更新事件对象
    eventMap.set(eventId, opt);
    // 清理
    useEffect(function() {
        return function() {
            eventMap.delete(eventId);
        };
    }, []);
}
