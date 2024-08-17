import {
  _TriggerContext,
  TriggerType,
  type TriggerOption,
  type TriggerTargetData,
} from "../types.js";
import { getEventOffset, getEventXY } from "@m78/utils";
import { _buildEvent } from "../methods.js";
import { _dragMinDistance } from "../common.js";

// 记录drag的一些信息
interface DragRecord {
  /** 最后的位置 */
  clientX: number;
  clientY: number;
  /** 最后的offset */
  offsetX: number;
  offsetY: number;
  /** 记录的总移动距离 */
  movementX: number;
  movementY: number;
  /** 事件目标 */
  target: TriggerOption;
  /** 事件对应的 TriggerTargetData */
  eventData: TriggerTargetData;
  /** 对应的原生事件 */
  nativeEvent: Event;
}

export function _dragImpl(ctx: _TriggerContext) {
  const { trigger } = ctx;

  const dragRecord = new Map<TriggerOption, DragRecord>();

  // 记录鼠标或触摸点按下后移动的总距离
  let lastXPoint = 0;
  let lastYPoint = 0;
  let xDistance = 0;
  let yDistance = 0;

  // 鼠标左键点击时进行标记, 用于在move中触发drag, 用于过滤简单点击和drag
  let dragTriggerFlag = false;

  function start(e: TouchEvent | MouseEvent) {
    const [clientX, clientY] = getEventXY(e);

    const { eventList } = ctx.getEventList({
      xy: [clientX, clientY],
      type: TriggerType.drag,
      dom: e.target as HTMLElement,
    });

    eventList.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.bound);

      const record: DragRecord = {
        clientX,
        clientY,
        movementX: 0,
        movementY: 0,
        offsetX,
        offsetY,
        target: i.option,
        eventData: i,
        nativeEvent: e,
      };

      const event = _buildEvent({
        type: TriggerType.drag,
        nativeEvent: e,
        target: i.option,
        x: clientX,
        y: clientY,
        offsetX,
        offsetY,
        data: i.option.data,
        eventMeta: i,
      });

      dragRecord.set(i.option, record);

      ctx.handleEvent(event);
      i.option.handler(event);
    });

    const dragging = dragRecord.size !== 0;

    trigger.dragging = dragging;

    if (dragging) {
      ctx.event.activeHandle.clear();
      ctx.event.focusHandle.clear();
      ctx.event.moveHandle.clear();
    }

    return dragging;
  }

  function move(e: TouchEvent | MouseEvent) {
    moveAndEnd(e, false);
  }

  function end(e: TouchEvent | MouseEvent) {
    dragTriggerFlag = false;

    lastXPoint = 0;
    lastYPoint = 0;
    xDistance = 0;
    yDistance = 0;

    moveAndEnd(e, true);
  }

  function moveAndEnd(
    e: TouchEvent | MouseEvent | null,
    isEnd: boolean,
    isCancel = false
  ) {
    trigger.dragging = dragRecord.size !== 0;

    if (!trigger.dragging) return;

    const list = Array.from(dragRecord.values());

    let clientX = 0;
    let clientY = 0;

    if (!isCancel && e) {
      [clientX, clientY] = getEventXY(e);
    }

    list.forEach((i) => {
      let deltaX = 0;
      let deltaY = 0;

      if (!isCancel && e) {
        const freshEventData = ctx.updateTargetData(i.eventData);

        i.eventData = freshEventData;

        [i.offsetX, i.offsetY] = getEventOffset(e, freshEventData.bound);

        deltaX = clientX - i.clientX;
        deltaY = clientY - i.clientY;

        i.clientX = clientX;
        i.clientY = clientY;

        i.movementX += deltaX;
        i.movementY += deltaY;
      }

      const event = _buildEvent({
        type: TriggerType.drag,
        nativeEvent: e || i.nativeEvent,
        target: i.target,
        first: false,
        last: isEnd,
        x: i.clientX,
        y: i.clientY,
        offsetX: i.offsetX,
        offsetY: i.offsetY,
        deltaX,
        deltaY,
        movementX: i.movementX,
        movementY: i.movementY,
        data: i.target.data,
        eventMeta: i.eventData,
      });

      isEnd && dragRecord.delete(i.target);

      ctx.handleEvent(event);
      i.target.handler(event);
    });
  }

  function clear() {
    moveAndEnd(null, true, true);
  }

  // 辅助drag记录事件开始点
  function startMark(e: MouseEvent | TouchEvent) {
    dragTriggerFlag = true;

    const [x, y] = getEventXY(e);

    lastXPoint = x;
    lastYPoint = y;
    xDistance = 0;
    yDistance = 0;
  }

  // 在move事件中处理drag事件开始/move
  function dragTrigger(e: MouseEvent | TouchEvent) {
    if (dragTriggerFlag) {
      const [x, y] = getEventXY(e);

      const xDiff = Math.abs(x - lastXPoint);
      const yDiff = Math.abs(y - lastYPoint);

      xDistance += xDiff;
      yDistance += yDiff;

      if (xDistance > _dragMinDistance || yDistance > _dragMinDistance) {
        start(e);
        dragTriggerFlag = false;
      }
    } else {
      move(e);
    }
  }

  return {
    start,
    move,
    end,
    clear,
    startMark,
    dragTrigger,
  };
}
