import { TriggerOverrideStrategy } from "./types.js";
export var _defaultLevel = 0;
export var _defaultOverrideStrategy = TriggerOverrideStrategy.parallel;
export var _defaultCursorConf = {
    drag: "grabbing",
    dragActive: "grab",
    active: "pointer"
};
/** move事件的触发频率(ms) */ export var _triggerLimit = 60;
/** 含first/last的事件的进延迟 */ export var _triggerInDelay = 80 - _triggerLimit;
/** 含first/last的事件的出延迟 */ export var _triggerOutDelay = 140;
/** longpress延迟 */ export var _longPressDelay = 380;
/** drag触发的最小拖动距离 */ export var _dragMinDistance = 3;
/** 用于为move事件进行节流, 限制每秒触发的频率 */ export function _createLimitTrigger() {
    var limit = _triggerLimit;
    var last = 0;
    return function(enable, e, cb) {
        if (!enable) {
            cb();
            return;
        }
        var diff = e.timeStamp - last;
        if (diff < limit) return;
        last = e.timeStamp;
        cb();
    };
}
/** 将传入的 TriggerTargetData[] 转换为以 option 为 key 的 map */ export function _getListMap(list) {
    var map = new Map();
    list.forEach(function(item) {
        map.set(item.option, item);
    });
    return map;
}
