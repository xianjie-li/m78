import { getEventXY } from "@m78/utils";
import { _getListMap, _triggerOutDelay, _triggerInDelay } from "../common";
import { _buildEvent } from "../methods";
import {
  TriggerType,
  type TriggerOption,
  type TriggerTargetData,
  type _TriggerContext,
} from "../types";

interface ActiveRecord {
  /** 延迟开启计时器 */
  delayTimer?: any;
  /** 延迟关闭计时器 */
  delayLeaveTimer?: any;
  /** 对应的事件配置 */
  option: TriggerOption;
  /** 原始事件对象 */
  nativeEvent: Event;
}

/** 实现active */
export function _activeImpl(ctx: _TriggerContext) {
  // 延迟启用, 且尚未触发的项
  const pendingList: ActiveRecord[] = [];
  // 已启用的项
  const activeList: ActiveRecord[] = [];
  // 正在延迟关闭的项
  const leavingList: ActiveRecord[] = [];

  function trigger(e: MouseEvent | TouchEvent) {
    if (ctx.trigger.dragging) return;

    const [clientX, clientY, isTouch] = getEventXY(e);

    const { eventList } = ctx.getEventList({
      xy: [clientX, clientY],
      type: TriggerType.active,
      dom: e.target as HTMLElement,
    });

    if (isTouch && eventList.length) {
      ctx.shouldPreventDefaultContextMenu = true;
    }

    const eventMap = _getListMap(eventList);

    const existMap = new Map<TriggerOption, ActiveRecord>();

    // 新增的项
    const add: TriggerTargetData[] = [];

    // 新的移除项
    const remove: TriggerOption[] = [];

    // pendingList中的项当前已不存在, 将其移除 (清理计时器)
    for (let i = pendingList.length - 1; i >= 0; i--) {
      const cur = pendingList[i];

      existMap.set(cur.option, cur);

      if (!eventMap.has(cur.option)) {
        clearTimeout(cur.delayTimer);
        cur.delayTimer = undefined;
        pendingList.splice(i, 1);
      }
    }

    // activeList中的项当前已不存在, 将其移除 (添加到延迟关闭项)
    for (let i = activeList.length - 1; i >= 0; i--) {
      const cur = activeList[i];

      existMap.set(cur.option, cur);

      const data = eventMap.get(cur.option);

      if (!data) {
        activeList.splice(i, 1);
        remove.push(cur.option);
      }
    }

    // leavingList中的项重新触发, 取消清理 (清理计时器, 并将数据直接添加回activeList)
    for (let i = leavingList.length - 1; i >= 0; i--) {
      const cur = leavingList[i];

      existMap.set(cur.option, cur);

      if (eventMap.has(cur.option)) {
        clearTimeout(cur.delayLeaveTimer);
        cur.delayLeaveTimer = undefined;
        leavingList.splice(i, 1);
        activeList.push(cur);
      }
    }

    // 获取到eventList中新增的项, 即不存在于pendingList  activeList  leavingList, 将其作为新增项
    eventList.forEach((i) => {
      if (!existMap.has(i.option)) {
        add.push(i);
      }
    });

    // 将移除项添加到 leavingList
    remove.forEach((i) => {
      const activeEvent = _buildEvent({
        type: TriggerType.active,
        target: i,
        nativeEvent: e,
        active: false,
        last: true,
        first: false,
        data: i.data,
        eventMeta: ctx.getDataByOption(i),
      });

      leavingList.push({
        option: i,
        nativeEvent: e,
        delayLeaveTimer: setTimeout(() => {
          const ind = leavingList.findIndex((p) => p.option === i);
          if (ind > -1) {
            leavingList.splice(ind, 1);

            ctx.handleEvent(activeEvent);
            i.handler(activeEvent);
          }
        }, _triggerOutDelay),
      });
    });

    // 将新增项添加到 pendingList
    add.forEach((i) => {
      const activeEvent = _buildEvent({
        type: TriggerType.active,
        target: i.option,
        nativeEvent: e,
        active: true,
        first: true,
        last: false,
        data: i.option.data,
        eventMeta: i,
      });

      const record = {
        option: i.option,
        nativeEvent: e,
        delayTimer: setTimeout(() => {
          const ind = pendingList.findIndex((p) => p.option === i.option);
          if (ind > -1) {
            pendingList.splice(ind, 1);
            activeList.push(record);

            ctx.handleEvent(activeEvent);
            i.option.handler(activeEvent);
          }
        }, _triggerInDelay),
      };

      pendingList.push(record);
    });

    ctx.trigger.activating = activeList.length > 0;
  }

  function clear(e?: TouchEvent) {
    // 清理尚未启用的项
    pendingList.forEach((i) => {
      clearTimeout(i.delayTimer);
    });

    // 将已启用项添加到 leavingList
    activeList.forEach((i) => {
      const activeEvent = _buildEvent({
        type: TriggerType.active,
        target: i.option,
        nativeEvent: e || i.nativeEvent,
        active: false,
        last: true,
        first: false,
        data: i.option.data,
        eventMeta: ctx.getDataByOption(i.option),
      });

      leavingList.push({
        option: i.option,
        nativeEvent: e || i.nativeEvent,
        delayLeaveTimer: setTimeout(() => {
          const ind = leavingList.findIndex((p) => p.option === i.option);
          if (ind > -1) {
            leavingList.splice(ind, 1);

            ctx.handleEvent(activeEvent);
            i.option.handler(activeEvent);
          }
        }, _triggerOutDelay),
      });
    });

    pendingList.length = 0;
    activeList.length = 0;

    ctx.trigger.activating = false;
  }

  return {
    trigger,
    clear,
  };
}
