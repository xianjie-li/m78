import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { TriggerType } from "../types.js";
import { getEventOffset } from "@m78/utils";
import { _buildEvent } from "../methods.js";
export function _clickImpl(ctx) {
    var trigger = ctx.trigger, config = ctx.config;
    function click(e) {
        if (!trigger.enable) return;
        if (config.preCheck && !config.preCheck(TriggerType.click, e)) return;
        var items = ctx.getTargetDataByXY(e.clientX, e.clientY, true, e.target);
        items.forEach(function(i) {
            var _getEventOffset = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = _getEventOffset[0], offsetY = _getEventOffset[1];
            var event = _buildEvent({
                type: TriggerType.click,
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
    }
    return click;
}
