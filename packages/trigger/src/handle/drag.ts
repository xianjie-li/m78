import {
  _TriggerContext,
  TriggerType,
  type TriggerEvent,
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
  /** 开始事件 */
  startEvent: TriggerEvent;
}

// 挂载到OptionItem的私有属性
interface PrivateProps {
  /** 该事件在x轴移动的总距离 */
  distanceX: number;
  /** 该事件在y轴移动的总距离 */
  distanceY: number;
}

/** 在拖动超过bound边界时产生的阻尼系数 */
const BoundDamping = 0.16;

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

  // 从OptionItem中获取事件的私有状态
  function getEventData(option: TriggerOption): PrivateProps {
    const cur = ctx.keepAliveData.get(option)!;

    if (!cur.drag) {
      cur.drag = {
        distanceX: 0,
        distanceY: 0,
      };
    }

    return cur.drag as PrivateProps;
  }

  // 从OptionItem中设置事件的私有状态
  function setEventData(option: TriggerOption, args: PrivateProps) {
    const cur = getEventData(option);
    Object.assign(cur, args);
  }

  function start(e: TouchEvent | MouseEvent) {
    const [clientX, clientY] = getEventXY(e);

    const { eventList } = ctx.getEventList({
      xy: [clientX, clientY],
      type: TriggerType.drag,
      dom: e.target as HTMLElement,
    });

    eventList.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.bound);

      const distance = getEventData(i.option);

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
        distanceX: distance.distanceX,
        distanceY: distance.distanceY,
      });

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
        startEvent: event,
      };

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

      // 上次事件记录的位置
      const distance = getEventData(i.target);

      let distanceX = 0;
      let distanceY = 0;

      if (!isCancel && e) {
        const freshEventData = ctx.updateTargetData(i.eventData);

        i.eventData = freshEventData;

        [i.offsetX, i.offsetY] = getEventOffset(e, freshEventData.bound);

        deltaX = clientX - i.clientX;
        deltaY = clientY - i.clientY;

        const [movementX, movementY] = clampBound({
          record: i,
          deltaX,
          deltaY,
          isEnd,
        });

        i.clientX = clientX;
        i.clientY = clientY;

        i.movementX = movementX;
        i.movementY = movementY;

        distanceX = distance.distanceX + i.movementX;
        distanceY = distance.distanceY + i.movementY;
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
        distanceX,
        distanceY,
      });

      if (isEnd) {
        dragRecord.delete(i.target);
        setEventData(i.target, {
          distanceX,
          distanceY,
        });
      }

      ctx.handleEvent(event);
      i.target.handler(event);
    });
  }

  // 将拖动位置限制在边界内
  function clampBound(args: {
    record: DragRecord;
    deltaX: number;
    deltaY: number;
    isEnd: boolean;
  }) {
    const { record, deltaX, deltaY, isEnd } = args;
    const dragBound = record.target.dragBound;

    // 移动后位置
    const nextMovementX = record.movementX + deltaX;
    const nextMovementY = record.movementY + deltaY;

    if (!dragBound) return [nextMovementX, nextMovementY];

    // 最终应用的位置
    let x = nextMovementX;
    let y = nextMovementY;

    const startBound = record.startEvent.eventMeta.bound;

    const xMin = -startBound.left + dragBound.left;
    const xMax =
      dragBound.left + dragBound.width - (startBound.left + startBound.width);

    const yMin = -startBound.top + dragBound.top;
    const yMax =
      dragBound.top + dragBound.height - (startBound.top + startBound.height);

    // 当前未超出, 移动后超出, 为防止单次移动距离过大元素直接移出, 将其设置到边界位置
    if (record.movementX > xMin && nextMovementX < xMin) {
      x = xMin;
    }
    if (record.movementX < xMax && nextMovementX > xMax) {
      x = xMax;
    }
    if (record.movementY > yMin && nextMovementY < yMin) {
      y = yMin;
    }
    if (record.movementY < yMax && nextMovementY > yMax) {
      y = yMax;
    }

    const lessLeft = nextMovementX < xMin;
    const thenRight = nextMovementX > xMax;

    // 移动后超出边界, 添加阻尼效果
    if (lessLeft || thenRight) {
      if (isEnd) {
        if (lessLeft) x = xMin;
        if (thenRight) x = xMax;
      } else {
        const limitDeltaX = deltaX * BoundDamping;
        x = record.movementX + limitDeltaX;
      }
    }

    const lessTop = nextMovementY < yMin;
    const thenBottom = nextMovementY > yMax;

    if (lessTop || thenBottom) {
      if (isEnd) {
        if (lessTop) y = yMin;
        if (thenBottom) y = yMax;
      } else {
        const limitDeltaY = deltaY * BoundDamping;
        y = record.movementY + limitDeltaY;
      }
    }

    return [x, y];
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
