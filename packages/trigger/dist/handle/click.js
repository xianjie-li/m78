import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { TriggerType } from "../types.js";
import { getEventOffset } from "@m78/utils";
import { _buildEvent } from "../methods.js";
export function _clickImpl(ctx) {
    var trigger = ctx.trigger;
    function click(e) {
        if (!trigger.enable) return;
        var eventList = ctx.getEventList({
            xy: [
                e.clientX,
                e.clientY
            ],
            dom: e.target,
            type: TriggerType.click,
            looseXYCheck: true
        }).eventList;
        eventList.forEach(function(i) {
            var _getEventOffset = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = _getEventOffset[0], offsetY = _getEventOffset[1];
            var event = _buildEvent({
                type: TriggerType.click,
                target: i.option,
                nativeEvent: e,
                x: e.clientX,
                y: e.clientY,
                offsetX: offsetX,
                offsetY: offsetY,
                active: true,
                last: true,
                data: i.option.data,
                eventMeta: i
            });
            ctx.handleEvent(event);
            i.option.handler(event);
        });
    }
    return click;
}
