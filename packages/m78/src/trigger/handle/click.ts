import { _TriggerContext, TriggerType } from "../types.js";
import { getEventOffset } from "@m78/utils";
import { _buildEvent } from "../methods.js";

export function _clickImpl(ctx: _TriggerContext) {
  const { trigger, config } = ctx;

  function click(e: MouseEvent) {
    if (!trigger.enable) return;
    if (config.preCheck && !config.preCheck(TriggerType.click, e)) return;

    const items = ctx.getTargetDataByXY(
      e.clientX,
      e.clientY,
      true,
      e.target as HTMLElement
    );

    items.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.bound);

      const event = _buildEvent({
        type: TriggerType.click,
        target: i.origin,
        nativeEvent: e,
        x: e.clientX,
        y: e.clientY,
        offsetX,
        offsetY,
        active: true,
        last: true,
      });

      trigger.event.emit(event);
    });
  }

  return click;
}
