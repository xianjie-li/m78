import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { TriggerType } from "../types.js";
import { _buildEvent } from "../methods.js";
import { getEventOffset, isTruthyOrZero } from "@m78/utils";
import { _eventXyGetter, triggerClearEvent } from "../common.js";
// 实现move & active
export function _moveActiveImpl(ctx) {
    var moveActive = // 处理move
    function moveActive(e) {
        var ref = _sliced_to_array(_eventXyGetter(e), 3), clientX = ref[0], clientY = ref[1], isTouch = ref[2];
        var items = ctx.getTargetDataByXY(clientX, clientY, true, e.target);
        // 对不在move/active状态中的项进行清理和通知
        if (ctx.typeEnableMap[TriggerType.move]) {
            clearMove(e, function(target) {
                return !items.find(function(i) {
                    return i.origin === target;
                });
            });
        }
        if (ctx.typeEnableMap[TriggerType.active]) {
            clearActive(e, function(target) {
                return !items.find(function(i) {
                    return i.origin === target;
                });
            });
        }
        // 对move状态的项进行通知
        items.forEach(function(i) {
            var ref = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = ref[0], offsetY = ref[1];
            var moveRecord = ctx.moveRecord.get(i.origin);
            var activeRecord = ctx.activeRecord.get(i.origin);
            var moveFirst = !moveRecord;
            var freshRecord = {
                clientX: clientX,
                clientY: clientY,
                target: i.origin
            };
            var activeCheckPrevent = config.preCheck && !config.preCheck(TriggerType.active, e);
            var moveCheckPrevent = config.preCheck && !config.preCheck(TriggerType.move, e);
            // active
            if (ctx.typeEnableMap[TriggerType.active] && !activeCheckPrevent && !trigger.dragging // 拖动中不触发
            ) {
                // active record处理
                if (activeRecord) {
                    Object.assign(activeRecord, freshRecord);
                } else {
                    activeRecord = _object_spread_props(_object_spread({}, freshRecord), {
                        isActivating: false,
                        delayTimer: null,
                        delayLeaveTimer: null,
                        meta: i.meta
                    });
                }
                var triggerActive = function() {
                    var activeEvent = _buildEvent({
                        type: TriggerType.active,
                        target: i.origin,
                        nativeEvent: e,
                        active: true,
                        last: false
                    });
                    activeRecord.isActivating = true;
                    ctx.activating = true;
                    trigger.event.emit(activeEvent);
                };
                // 清理延迟关闭计时器
                clearInactiveTimer(activeRecord.target);
                // 非touch延迟触发
                if (!isTouch && !activeRecord.isActivating) {
                    ctx.activeRecord.set(i.origin, activeRecord);
                    delayTriggerActive(activeRecord, triggerActive);
                }
                // touch延迟触发
                if (isTouch && !activeRecord.isActivating) {
                    ctx.activeRecord.set(i.origin, activeRecord);
                    delayTriggerActive(activeRecord, triggerActive);
                }
            }
            // move
            if (ctx.typeEnableMap[TriggerType.move] && !moveCheckPrevent) {
                var moveDeltaX = 0;
                var moveDeltaY = 0;
                // more record处理
                if (moveRecord) {
                    moveDeltaX = clientX - moveRecord.clientX;
                    moveDeltaY = clientY - moveRecord.clientY;
                    Object.assign(moveRecord, freshRecord);
                } else {
                    moveRecord = _object_spread_props(_object_spread({}, freshRecord), {
                        isActivating: false,
                        meta: i.meta
                    });
                    ctx.moveRecord.set(i.origin, moveRecord);
                }
                var moveEvent = _buildEvent({
                    type: TriggerType.move,
                    target: i.origin,
                    nativeEvent: e,
                    x: clientX,
                    y: clientY,
                    offsetX: offsetX,
                    offsetY: offsetY,
                    active: true,
                    first: moveFirst,
                    last: false,
                    deltaX: moveDeltaX,
                    deltaY: moveDeltaY
                });
                trigger.event.emit(moveEvent);
            }
        });
    };
    var delayTriggerActive = // 延迟启用相关逻辑
    function delayTriggerActive(record, trigger) {
        // 若存在延迟关闭, 将其取消
        clearInactiveTimer(record.target);
        if (isTruthyOrZero(record.delayTimer)) return;
        var firstDelay = getDelayConfig(record).firstDelay;
        if (firstDelay) {
            record.delayTimer = setTimeout(trigger, firstDelay);
        } else {
            trigger();
        }
    };
    var delayTriggerInactive = // 延迟关闭相关逻辑
    function delayTriggerInactive(record, trigger) {
        var target = record.target;
        clearInactiveTimer(target);
        var lastDelay = getDelayConfig(record).lastDelay;
        if (lastDelay) {
            var nTimer = setTimeout(trigger, lastDelay);
            var cur = ctx.activeRecord.get(target);
            if (cur) cur.delayLeaveTimer = nTimer;
        } else {
            trigger();
        }
    };
    var clearInactiveTimer = // 如果存在延迟关闭计时器, 将其取消
    function clearInactiveTimer(target) {
        var cur = ctx.activeRecord.get(target);
        if (!cur) return;
        var timer = cur.delayLeaveTimer;
        if (isTruthyOrZero(timer)) {
            clearTimeout(timer);
            cur.delayLeaveTimer = null;
        }
    };
    var getDelayConfig = // 根据配置或项配置获取first/last延迟时间
    function getDelayConfig(record) {
        var firstDelay = 80;
        var lastDelay = 140;
        var configActive = ctx.config.active || {};
        var itemActive = record.meta.active || {};
        if (configActive.firstDelay) firstDelay = configActive.firstDelay;
        if (configActive.lastDelay) lastDelay = configActive.lastDelay;
        if (itemActive.firstDelay) firstDelay = itemActive.firstDelay;
        if (itemActive.lastDelay) lastDelay = itemActive.lastDelay;
        return {
            firstDelay: firstDelay,
            lastDelay: lastDelay
        };
    };
    var clearActive = // 清理所有未关闭的active事件, 并进行通知
    function clearActive(e, filter) {
        // 对不在active状态中的项进行通知
        Array.from(ctx.activeRecord.values()).forEach(function(record) {
            if (filter && !filter(record.target)) return;
            // 若存在延迟启用 , 将其取消
            if (record.delayTimer) {
                clearTimeout(record.delayTimer);
                record.delayTimer = null;
            }
            if (record.delayLeaveTimer) return;
            if (!record.isActivating) return;
            var activeEvent = _buildEvent({
                type: TriggerType.active,
                target: record.target,
                nativeEvent: e || triggerClearEvent,
                active: false,
                first: false,
                last: true
            });
            var triggerInactive = function() {
                ctx.activeRecord.delete(record.target);
                if (ctx.activeRecord.size === 0) {
                    ctx.activating = false;
                }
                trigger.event.emit(activeEvent);
            };
            delayTriggerInactive(record, triggerInactive);
        });
    };
    var clearMove = // 清理所有未关闭的move事件, 并进行通知
    function clearMove(e, filter) {
        // 对不在move状态中的项进行通知
        Array.from(ctx.moveRecord.values()).forEach(function(record) {
            if (filter && !filter(record.target)) return;
            ctx.moveRecord.delete(record.target);
            var moveEvent = _buildEvent({
                type: TriggerType.move,
                target: record.target,
                nativeEvent: e || triggerClearEvent,
                active: false,
                first: false,
                last: true
            });
            trigger.event.emit(moveEvent);
        });
    };
    var trigger = ctx.trigger, config = ctx.config;
    return {
        moveActive: moveActive,
        clearActive: clearActive,
        clearMove: clearMove
    };
}
