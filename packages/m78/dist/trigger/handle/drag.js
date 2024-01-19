import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { TriggerType } from "../types.js";
import { _eventXyGetter, triggerClearEvent } from "../common.js";
import { getEventOffset } from "@m78/utils";
import { _buildEvent } from "../methods.js";
export function _dragImpl(ctx) {
    var trigger = ctx.trigger, config = ctx.config;
    function start(e) {
        if (!ctx.typeEnableMap[TriggerType.drag]) return;
        if (config.preCheck && !config.preCheck(TriggerType.drag, e)) return;
        var _$_eventXyGetter = _sliced_to_array(_eventXyGetter(e), 2), clientX = _$_eventXyGetter[0], clientY = _$_eventXyGetter[1];
        var items = ctx.getTargetDataByXY(clientX, clientY, true, e.target);
        items.forEach(function(i) {
            var _getEventOffset = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = _getEventOffset[0], offsetY = _getEventOffset[1];
            var record = {
                clientX: clientX,
                clientY: clientY,
                movementX: 0,
                movementY: 0,
                offsetX: offsetX,
                offsetY: offsetY,
                target: i.origin,
                data: i
            };
            var event = _buildEvent({
                type: TriggerType.drag,
                nativeEvent: e,
                target: i.origin,
                x: clientX,
                y: clientY,
                offsetX: offsetX,
                offsetY: offsetY,
                data: i.meta.data
            });
            ctx.dragRecord.set(i.origin, record);
            trigger.event.emit(event);
        });
        var dragging = ctx.dragRecord.size !== 0;
        ctx.dragging = dragging;
        return dragging;
    }
    function move(e) {
        moveAndEnd(e, false);
    }
    function end(e) {
        moveAndEnd(e, true);
    }
    function moveAndEnd(e, isEnd) {
        var isCancel = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
        var list = Array.from(ctx.dragRecord.values());
        var clientX = 0;
        var clientY = 0;
        if (isCancel) {
            clientX = 0;
            clientY = 0;
        } else {
            var ref;
            ref = _sliced_to_array(_eventXyGetter(e), 2), clientX = ref[0], clientY = ref[1], ref;
        }
        list.forEach(function(i) {
            var data = i.data;
            var deltaX = 0;
            var deltaY = 0;
            if (!isCancel) {
                var ref;
                ref = _sliced_to_array(getEventOffset(e, data.bound), 2), i.offsetX = ref[0], i.offsetY = ref[1], ref;
                deltaX = clientX - i.clientX;
                deltaY = clientY - i.clientY;
                i.clientX = clientX;
                i.clientY = clientY;
                i.movementX += deltaX;
                i.movementY += deltaY;
            }
            var event = _buildEvent({
                type: TriggerType.drag,
                nativeEvent: e,
                target: i.target,
                first: false,
                last: isEnd,
                x: clientX,
                y: clientY,
                offsetX: i.offsetX,
                offsetY: i.offsetY,
                deltaX: deltaX,
                deltaY: deltaY,
                movementX: i.movementX,
                movementY: i.movementY,
                data: data.meta.data
            });
            isEnd && ctx.dragRecord.delete(i.target);
            trigger.event.emit(event);
        });
        ctx.dragging = ctx.dragRecord.size !== 0;
    }
    function clear() {
        moveAndEnd(triggerClearEvent, true, true);
    }
    return {
        start: start,
        move: move,
        end: end,
        clear: clear
    };
}
