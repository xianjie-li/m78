import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { getEventOffset, getEventXY } from "@m78/utils";
import { _getListMap } from "../common.js";
import { _buildEvent } from "../methods.js";
import { TriggerType } from "../types.js";
/** 实现move */ export function _moveImpl(ctx) {
    // 已启用的项
    var movingList = [];
    function trigger(e) {
        if (ctx.trigger.dragging) return;
        var isTouchEnd = e.type === "touchend" || e.type === "touchcancel";
        if (isTouchEnd) {
            clear();
            return;
        }
        var _getEventXY = _sliced_to_array(getEventXY(e), 2), clientX = _getEventXY[0], clientY = _getEventXY[1];
        var eventList = ctx.getEventList({
            xy: [
                clientX,
                clientY
            ],
            type: TriggerType.move,
            dom: e.target
        }).eventList;
        var eventMap = _getListMap(eventList);
        // 用于反向检测新增的项
        var existMap = new Map();
        // 移除项
        var remove = [];
        // 获取不再存在的项
        for(var i = movingList.length - 1; i >= 0; i--){
            var cur = movingList[i];
            existMap.set(cur.option, true);
            if (!eventMap.has(cur.option)) {
                movingList.splice(i, 1);
                remove.push(cur);
            }
        }
        // 获取新增的项
        // 获取到eventList中新增的项, 即不存在于 movingList, 将其作为新增项
        eventList.forEach(function(i) {
            if (!existMap.has(i.option)) {
                movingList.push({
                    option: i.option,
                    nativeEvent: e,
                    data: i,
                    isNew: true
                });
            }
        });
        // 移除项通知
        remove.forEach(function(i) {
            var _getEventOffset = _sliced_to_array(getEventOffset(e, i.data.bound), 2), offsetX = _getEventOffset[0], offsetY = _getEventOffset[1];
            var event = _buildEvent({
                type: TriggerType.move,
                target: i.option,
                nativeEvent: e,
                last: true,
                first: false,
                data: i.option.data,
                offsetX: offsetX,
                offsetY: offsetY,
                x: clientX,
                y: clientY,
                eventMeta: ctx.getDataByOption(i.option)
            });
            ctx.handleEvent(event);
            i.option.handler(event);
        });
        // 通知所有move项
        movingList.forEach(function(i) {
            var _getEventOffset = _sliced_to_array(getEventOffset(e, i.data.bound), 2), offsetX = _getEventOffset[0], offsetY = _getEventOffset[1];
            var event = _buildEvent({
                type: TriggerType.move,
                target: i.option,
                nativeEvent: e,
                first: i.isNew,
                last: false,
                data: i.option.data,
                offsetX: offsetX,
                offsetY: offsetY,
                x: clientX,
                y: clientY,
                eventMeta: i.data
            });
            i.isNew = false;
            i.nativeEvent = e;
            var curNewData = eventMap.get(i.option);
            // 更新缓存的对象
            if (curNewData) {
                Object.assign(i.data, curNewData);
            }
            ctx.handleEvent(event);
            i.option.handler(event);
        });
        ctx.trigger.moving = movingList.length > 0;
    }
    function clear() {
        // 将已启用项移除
        movingList.forEach(function(i) {
            var e = i.nativeEvent;
            var _getEventXY = _sliced_to_array(getEventXY(e), 2), clientX = _getEventXY[0], clientY = _getEventXY[1];
            var _getEventOffset = _sliced_to_array(getEventOffset(e, i.data.bound), 2), offsetX = _getEventOffset[0], offsetY = _getEventOffset[1];
            var event = _buildEvent({
                type: TriggerType.move,
                target: i.option,
                nativeEvent: i.nativeEvent,
                last: true,
                first: false,
                data: i.option.data,
                offsetX: offsetX,
                offsetY: offsetY,
                x: clientX,
                y: clientY,
                eventMeta: ctx.getDataByOption(i.option)
            });
            ctx.handleEvent(event);
            i.option.handler(event);
        });
        movingList.length = 0;
        ctx.trigger.moving = false;
    }
    // 是否有已触发的事件
    function hasTrigger() {
        return movingList.length > 0;
    }
    return {
        trigger: trigger,
        clear: clear,
        hasTrigger: hasTrigger
    };
}
