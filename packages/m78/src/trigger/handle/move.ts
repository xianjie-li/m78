import { getEventOffset, getEventXY } from "@m78/utils";
import { _getListMap } from "../common";
import { _buildEvent } from "../methods";
import {
  TriggerType,
  type TriggerOption,
  type TriggerTargetData,
  type _TriggerContext,
} from "../types";

interface MoveRecord {
  /** 对应的事件配置 */
  option: TriggerOption;
  /** 原始事件对象 */
  nativeEvent: Event;
  /** 触发项的 TriggerTargetData */
  data: TriggerTargetData;
  /** 是否是新增项 */
  isNew: boolean;
}

/** 实现move */
export function _moveImpl(ctx: _TriggerContext) {
  // 已启用的项
  const movingList: MoveRecord[] = [];

  function trigger(e: MouseEvent | TouchEvent) {
    if (ctx.trigger.dragging) return;

    const isTouchEnd = e.type === "touchend" || e.type === "touchcancel";

    if (isTouchEnd) {
      clear();
      return;
    }

    const [clientX, clientY] = getEventXY(e);

    const { eventList } = ctx.getEventList({
      xy: [clientX, clientY],
      type: TriggerType.move,
    });

    const eventMap = _getListMap(eventList);

    // 用于反向检测新增的项
    const existMap = new Map<TriggerOption, true>();

    // 移除项
    const remove: MoveRecord[] = [];

    // 获取不再存在的项
    for (let i = movingList.length - 1; i >= 0; i--) {
      const cur = movingList[i];

      existMap.set(cur.option, true);

      if (!eventMap.has(cur.option)) {
        movingList.splice(i, 1);
        remove.push(cur);
      }
    }

    // 获取新增的项
    // 获取到eventList中新增的项, 即不存在于 movingList, 将其作为新增项
    eventList.forEach((i) => {
      if (!existMap.has(i.option)) {
        movingList.push({
          option: i.option,
          nativeEvent: e,
          data: i,
          isNew: true,
        });
      }
    });

    // 移除项通知
    remove.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.data.bound);

      const event = _buildEvent({
        type: TriggerType.move,
        target: i.option,
        nativeEvent: e,
        last: true,
        first: false,
        data: i.option.data,
        offsetX,
        offsetY,
        x: clientX,
        y: clientY,
        eventMeta: ctx.getDataByOption(i.option), // data可能已失效, 需要重新获取
      });

      ctx.handleEvent(event);
      i.option.handler(event);
    });

    // 通知所有move项
    movingList.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.data.bound);

      const event = _buildEvent({
        type: TriggerType.move,
        target: i.option,
        nativeEvent: e,
        first: i.isNew,
        last: false,
        data: i.option.data,
        offsetX,
        offsetY,
        x: clientX,
        y: clientY,
        eventMeta: i.data,
      });

      i.isNew = false;
      i.nativeEvent = e;

      const curNewData = eventMap.get(i.option);

      // 更新缓存的对象
      if (curNewData) {
        Object.assign(i.data, curNewData);
      }

      ctx.handleEvent(event);
      i.option.handler(event);
    });

    ctx.trigger.moving = movingList.length > 0;
  }

  function clear() {
    // 将已启用项移除
    movingList.forEach((i) => {
      const e = i.nativeEvent as TouchEvent;
      const [clientX, clientY] = getEventXY(e);
      const [offsetX, offsetY] = getEventOffset(e, i.data.bound);

      const event = _buildEvent({
        type: TriggerType.move,
        target: i.option,
        nativeEvent: i.nativeEvent,
        last: true,
        first: false,
        data: i.option.data,
        offsetX,
        offsetY,
        x: clientX,
        y: clientY,
        eventMeta: ctx.getDataByOption(i.option),
      });

      ctx.handleEvent(event);
      i.option.handler(event);
    });

    movingList.length = 0;

    ctx.trigger.moving = false;
  }

  // 是否有已触发的事件
  function hasTrigger() {
    return movingList.length > 0;
  }

  return {
    trigger,
    clear,
    hasTrigger,
  };
}
