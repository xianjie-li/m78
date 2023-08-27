import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { TriggerType } from "../types.js";
import { getEventOffset, isMobileDevice } from "@m78/utils";
import { _buildEvent } from "../methods.js";
import { _eventXyGetter } from "../common.js";
export function _contextMenuImpl(ctx) {
    var contextMenu = function contextMenu(e) {
        if (!ctx.typeEnableMap[TriggerType.contextMenu]) return;
        if (config.preCheck && !config.preCheck(TriggerType.contextMenu, e)) return;
        var items = ctx.getTargetDataByXY(e.clientX, e.clientY, true, e.target);
        if (items.length) {
            e.preventDefault();
        }
        // 移动设备使用模拟的行为触发, 因为在ios等设备context不可用
        if (isMobileDevice()) return;
        items.forEach(function(i) {
            var ref = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = ref[0], offsetY = ref[1];
            var event = _buildEvent({
                type: TriggerType.contextMenu,
                target: i.origin,
                nativeEvent: e,
                x: e.clientX,
                y: e.clientY,
                offsetX: offsetX,
                offsetY: offsetY,
                active: true,
                last: true,
                data: i.meta.data
            });
            trigger.event.emit(event);
        });
    };
    var simulationStart = // 模拟contextmenu事件
    function simulationStart(e) {
        if (!ctx.typeEnableMap[TriggerType.contextMenu]) return;
        if (config.preCheck && !config.preCheck(TriggerType.contextMenu, e)) return;
        var ref = _sliced_to_array(_eventXyGetter(e), 2), clientX = ref[0], clientY = ref[1];
        var items = ctx.getTargetDataByXY(clientX, clientY, true, e.target);
        state.moveCount = 0;
        state.timer = setTimeout(function() {
            state.timer = null;
            if (state.moveCount > 4) return;
            items.forEach(function(i) {
                var ref = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = ref[0], offsetY = ref[1];
                var event = _buildEvent({
                    type: TriggerType.contextMenu,
                    target: i.origin,
                    nativeEvent: e,
                    x: clientX,
                    y: clientY,
                    offsetX: offsetX,
                    offsetY: offsetY,
                    active: true,
                    last: true,
                    data: i.meta.data
                });
                trigger.event.emit(event);
            });
        }, 360);
    };
    var simulationMove = function simulationMove() {
        if (!ctx.typeEnableMap[TriggerType.contextMenu]) return;
        state.moveCount++;
    };
    var simulationEnd = function simulationEnd() {
        if (!ctx.typeEnableMap[TriggerType.contextMenu]) return;
        clear();
    };
    var clear = function clear() {
        if (state.timer) {
            clearTimeout(state.timer);
            state.timer = null;
        }
    };
    var trigger = ctx.trigger, config = ctx.config;
    var state = {
        timer: null,
        moveCount: 0
    };
    return {
        clear: clear,
        contextMenu: contextMenu,
        simulationStart: simulationStart,
        simulationMove: simulationMove,
        simulationEnd: simulationEnd
    };
}
