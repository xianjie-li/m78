import { _TriggerContext, TriggerType } from "../types.js";
import { getEventOffset } from "@m78/utils";
import { _buildEvent } from "../methods.js";

export function _clickImpl(ctx: _TriggerContext) {
  const { trigger } = ctx;

  function click(e: MouseEvent) {
    if (!trigger.enable) return;

    const { eventList } = ctx.getEventList({
      xy: [e.clientX, e.clientY],
      type: TriggerType.click,
    });

    eventList.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.bound);

      const event = _buildEvent({
        type: TriggerType.click,
        target: i.option,
        nativeEvent: e,
        x: e.clientX,
        y: e.clientY,
        offsetX,
        offsetY,
        active: true,
        last: true,
        data: i.option.data,
        eventMeta: i,
      });

      ctx.handleEvent(event);
      i.option.handler(event);
    });
  }

  return click;
}
