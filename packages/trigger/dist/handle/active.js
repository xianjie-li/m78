import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { getEventXY } from "@m78/utils";
import { _getListMap, _triggerOutDelay, _triggerInDelay } from "../common.js";
import { _buildEvent } from "../methods.js";
import { TriggerType } from "../types.js";
/** 实现active */ export function _activeImpl(ctx) {
    // 延迟启用, 且尚未触发的项
    var pendingList = [];
    // 已启用的项
    var activeList = [];
    // 正在延迟关闭的项
    var leavingList = [];
    function trigger(e) {
        if (ctx.trigger.dragging) return;
        var _getEventXY = _sliced_to_array(getEventXY(e), 3), clientX = _getEventXY[0], clientY = _getEventXY[1], isTouch = _getEventXY[2];
        var eventList = ctx.getEventList({
            xy: [
                clientX,
                clientY
            ],
            type: TriggerType.active,
            dom: e.target
        }).eventList;
        if (isTouch && eventList.length) {
            ctx.shouldPreventDefaultContextMenu = true;
        }
        var eventMap = _getListMap(eventList);
        var existMap = new Map();
        // 新增的项
        var add = [];
        // 新的移除项
        var remove = [];
        // pendingList中的项当前已不存在, 将其移除 (清理计时器)
        for(var i = pendingList.length - 1; i >= 0; i--){
            var cur = pendingList[i];
            existMap.set(cur.option, cur);
            if (!eventMap.has(cur.option)) {
                clearTimeout(cur.delayTimer);
                cur.delayTimer = undefined;
                pendingList.splice(i, 1);
            }
        }
        // activeList中的项当前已不存在, 将其移除 (添加到延迟关闭项)
        for(var i1 = activeList.length - 1; i1 >= 0; i1--){
            var cur1 = activeList[i1];
            existMap.set(cur1.option, cur1);
            var data = eventMap.get(cur1.option);
            if (!data) {
                activeList.splice(i1, 1);
                remove.push(cur1.option);
            }
        }
        // leavingList中的项重新触发, 取消清理 (清理计时器, 并将数据直接添加回activeList)
        for(var i2 = leavingList.length - 1; i2 >= 0; i2--){
            var cur2 = leavingList[i2];
            existMap.set(cur2.option, cur2);
            if (eventMap.has(cur2.option)) {
                clearTimeout(cur2.delayLeaveTimer);
                cur2.delayLeaveTimer = undefined;
                leavingList.splice(i2, 1);
                activeList.push(cur2);
            }
        }
        // 获取到eventList中新增的项, 即不存在于pendingList  activeList  leavingList, 将其作为新增项
        eventList.forEach(function(i) {
            if (!existMap.has(i.option)) {
                add.push(i);
            }
        });
        // 将移除项添加到 leavingList
        remove.forEach(function(i) {
            var activeEvent = _buildEvent({
                type: TriggerType.active,
                target: i,
                nativeEvent: e,
                active: false,
                last: true,
                first: false,
                data: i.data,
                eventMeta: ctx.getDataByOption(i)
            });
            leavingList.push({
                option: i,
                nativeEvent: e,
                delayLeaveTimer: setTimeout(function() {
                    var ind = leavingList.findIndex(function(p) {
                        return p.option === i;
                    });
                    if (ind > -1) {
                        leavingList.splice(ind, 1);
                        ctx.handleEvent(activeEvent);
                        i.handler(activeEvent);
                    }
                }, _triggerOutDelay)
            });
        });
        // 将新增项添加到 pendingList
        add.forEach(function(i) {
            var activeEvent = _buildEvent({
                type: TriggerType.active,
                target: i.option,
                nativeEvent: e,
                active: true,
                first: true,
                last: false,
                data: i.option.data,
                eventMeta: i
            });
            var record = {
                option: i.option,
                nativeEvent: e,
                delayTimer: setTimeout(function() {
                    var ind = pendingList.findIndex(function(p) {
                        return p.option === i.option;
                    });
                    if (ind > -1) {
                        pendingList.splice(ind, 1);
                        activeList.push(record);
                        ctx.handleEvent(activeEvent);
                        i.option.handler(activeEvent);
                    }
                }, _triggerInDelay)
            };
            pendingList.push(record);
        });
        ctx.trigger.activating = activeList.length > 0;
    }
    function clear(e) {
        // 清理尚未启用的项
        pendingList.forEach(function(i) {
            clearTimeout(i.delayTimer);
        });
        // 将已启用项添加到 leavingList
        activeList.forEach(function(i) {
            var activeEvent = _buildEvent({
                type: TriggerType.active,
                target: i.option,
                nativeEvent: e || i.nativeEvent,
                active: false,
                last: true,
                first: false,
                data: i.option.data,
                eventMeta: ctx.getDataByOption(i.option)
            });
            leavingList.push({
                option: i.option,
                nativeEvent: e || i.nativeEvent,
                delayLeaveTimer: setTimeout(function() {
                    var ind = leavingList.findIndex(function(p) {
                        return p.option === i.option;
                    });
                    if (ind > -1) {
                        leavingList.splice(ind, 1);
                        ctx.handleEvent(activeEvent);
                        i.option.handler(activeEvent);
                    }
                }, _triggerOutDelay)
            });
        });
        pendingList.length = 0;
        activeList.length = 0;
        ctx.trigger.activating = false;
    }
    return {
        trigger: trigger,
        clear: clear
    };
}
