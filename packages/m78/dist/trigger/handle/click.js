import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { TriggerType } from "../types.js";
import { getEventOffset } from "@m78/utils";
import { _buildEvent } from "../methods.js";
export function _clickImpl(ctx) {
    var click = function click(e) {
        if (!trigger.enable) return;
        if (config.preCheck && !config.preCheck(TriggerType.click, e)) return;
        var items = ctx.getTargetDataByXY(e.clientX, e.clientY, true, e.target);
        items.forEach(function(i) {
            var ref = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = ref[0], offsetY = ref[1];
            var event = _buildEvent({
                type: TriggerType.click,
                target: i.origin,
                nativeEvent: e,
                x: e.clientX,
                y: e.clientY,
                offsetX: offsetX,
                offsetY: offsetY,
                active: true,
                last: true
            });
            trigger.event.emit(event);
        });
    };
    var trigger = ctx.trigger, config = ctx.config;
    return click;
}
