import { _DragRecord, _TriggerContext, TriggerType } from "../types.js";
import { _eventXyGetter, triggerClearEvent } from "../common.js";
import { getEventOffset } from "@m78/utils";
import { _buildEvent } from "../methods.js";

export function _dragImpl(ctx: _TriggerContext) {
  const { trigger, config } = ctx;

  function start(e: TouchEvent | MouseEvent) {
    if (!ctx.typeEnableMap[TriggerType.drag]) return;
    if (config.preCheck && !config.preCheck(TriggerType.drag, e)) return;

    const [clientX, clientY] = _eventXyGetter(e);

    const items = ctx.getTargetDataByXY(
      clientX,
      clientY,
      true,
      e.target as HTMLElement
    );

    items.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.bound);

      const record: _DragRecord = {
        clientX,
        clientY,
        movementX: 0,
        movementY: 0,
        offsetX,
        offsetY,
        target: i.origin,
        data: i,
      };

      const event = _buildEvent({
        type: TriggerType.drag,
        nativeEvent: e,
        target: i.origin,
        x: clientX,
        y: clientY,
        offsetX,
        offsetY,
      });

      ctx.dragRecord.set(i.origin, record);

      trigger.event.emit(event);
    });

    const dragging = ctx.dragRecord.size !== 0;

    ctx.dragging = dragging;

    return dragging;
  }

  function move(e: TouchEvent | MouseEvent) {
    moveAndEnd(e, false);
  }

  function end(e: TouchEvent | MouseEvent) {
    moveAndEnd(e, true);
  }

  function moveAndEnd(
    e: TouchEvent | MouseEvent | Event,
    isEnd: boolean,
    isCancel = false
  ) {
    const list = Array.from(ctx.dragRecord.values());

    let clientX = 0;
    let clientY = 0;

    if (isCancel) {
      clientX = 0;
      clientY = 0;
    } else {
      [clientX, clientY] = _eventXyGetter(e as any);
    }

    list.forEach((i) => {
      const { data } = i;

      let deltaX = 0;
      let deltaY = 0;

      if (!isCancel) {
        [i.offsetX, i.offsetY] = getEventOffset(e as any, data.bound);

        deltaX = clientX - i.clientX;
        deltaY = clientY - i.clientY;

        i.clientX = clientX;
        i.clientY = clientY;

        i.movementX += deltaX;
        i.movementY += deltaY;
      }

      const event = _buildEvent({
        type: TriggerType.drag,
        nativeEvent: e,
        target: i.target,
        first: false,
        last: isEnd,
        x: clientX,
        y: clientY,
        offsetX: i.offsetX,
        offsetY: i.offsetY,
        deltaX,
        deltaY,
        movementX: i.movementX,
        movementY: i.movementY,
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
    start,
    move,
    end,
    clear,
  };
}
