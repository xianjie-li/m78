import {
  _MoveActiveRecord,
  _TriggerContext,
  TriggerTarget,
  TriggerType,
} from "../types.js";
import { _buildEvent } from "../methods.js";
import { getEventOffset, isNumber, isTruthyOrZero } from "@m78/utils";
import { _eventXyGetter, triggerClearEvent } from "../common.js";

// 实现move & active
export function _moveActiveImpl(ctx: _TriggerContext) {
  const { trigger, config } = ctx;

  // 处理move
  function moveActive(e: MouseEvent | TouchEvent) {
    const [clientX, clientY] = _eventXyGetter(e);

    const items = ctx.getTargetDataByXY(
      clientX,
      clientY,
      true,
      e.target as HTMLElement
    );

    // 对不在move/active状态中的项进行清理和通知
    if (ctx.typeEnableMap[TriggerType.move]) {
      clearMove(e, (target) => !items.find((i) => i.origin === target));
    }

    if (ctx.typeEnableMap[TriggerType.active]) {
      clearActive(e, (target) => !items.find((i) => i.origin === target));
    }

    // 对move状态的项进行通知
    items.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.bound);

      let moveRecord = ctx.moveRecord.get(i.origin);
      let activeRecord = ctx.activeRecord.get(i.origin);

      const moveFirst = !moveRecord;

      const freshRecord = {
        clientX,
        clientY,
        target: i.origin,
      };

      const activeCheckPrevent =
        config.preCheck && !config.preCheck(TriggerType.active, e);

      const moveCheckPrevent =
        config.preCheck && !config.preCheck(TriggerType.move, e);

      // active
      if (
        ctx.typeEnableMap[TriggerType.active] &&
        !activeCheckPrevent &&
        !trigger.dragging // 拖动中不触发
      ) {
        // active record处理
        if (activeRecord) {
          Object.assign(activeRecord, freshRecord);
        } else {
          activeRecord = {
            ...freshRecord,
            isActivating: false,
            delayTimer: null,
            delayLeaveTimer: null,
            meta: i.meta,
          };
        }

        const triggerActive = () => {
          const activeEvent = _buildEvent({
            type: TriggerType.active,
            target: i.origin,
            nativeEvent: e,
            active: true,
            last: false,
            data: i.meta.data,
          });

          activeRecord!.isActivating = true;

          ctx.activating = true;

          trigger.event.emit(activeEvent);
        };

        // 清理延迟关闭计时器
        clearInactiveTimer(activeRecord.target);

        // 延迟触发
        if (!activeRecord!.isActivating) {
          ctx.activeRecord.set(i.origin, activeRecord!);
          delayTriggerActive(activeRecord!, triggerActive);
        }
      }

      // move
      if (ctx.typeEnableMap[TriggerType.move] && !moveCheckPrevent) {
        let moveDeltaX = 0;
        let moveDeltaY = 0;

        // more record处理
        if (moveRecord) {
          moveDeltaX = clientX - moveRecord.clientX;
          moveDeltaY = clientY - moveRecord.clientY;

          Object.assign(moveRecord, freshRecord);
        } else {
          moveRecord = {
            ...freshRecord,
            isActivating: false,
            meta: i.meta,
          };

          ctx.moveRecord.set(i.origin, moveRecord!);
        }

        const moveEvent = _buildEvent({
          type: TriggerType.move,
          target: i.origin,
          nativeEvent: e,
          x: clientX,
          y: clientY,
          offsetX,
          offsetY,
          active: true,
          first: moveFirst,
          last: false,
          deltaX: moveDeltaX,
          deltaY: moveDeltaY,
          data: i.meta.data,
        });

        trigger.event.emit(moveEvent);
      }
    });
  }

  // 延迟启用相关逻辑
  function delayTriggerActive(record: _MoveActiveRecord, trigger: Function) {
    // 若存在延迟关闭, 将其取消
    clearInactiveTimer(record.target);

    if (isTruthyOrZero(record.delayTimer)) return;

    const { firstDelay } = getDelayConfig(record);

    if (firstDelay) {
      record.delayTimer = setTimeout(trigger, firstDelay);
    } else {
      trigger();
    }
  }

  // 延迟关闭相关逻辑
  function delayTriggerInactive(record: _MoveActiveRecord, trigger: Function) {
    const target = record.target;

    clearInactiveTimer(target);

    const { lastDelay } = getDelayConfig(record);

    if (lastDelay) {
      const nTimer = setTimeout(trigger, lastDelay);
      const cur = ctx.activeRecord.get(target);
      if (cur) cur.delayLeaveTimer = nTimer;
    } else {
      trigger();
    }
  }

  // 如果存在延迟关闭计时器, 将其取消
  function clearInactiveTimer(target: TriggerTarget) {
    const cur = ctx.activeRecord.get(target);
    if (!cur) return;
    const timer = cur.delayLeaveTimer;
    if (isTruthyOrZero(timer)) {
      clearTimeout(timer);
      cur.delayLeaveTimer = null;
    }
  }

  // 根据配置或项配置获取first/last延迟时间
  function getDelayConfig(record: _MoveActiveRecord) {
    let firstDelay = 80;
    let lastDelay = 140;

    const configActive = ctx.config.active || {};
    const itemActive = record.meta.active || {};

    if (isNumber(configActive.firstDelay)) firstDelay = configActive.firstDelay;
    if (isNumber(configActive.lastDelay)) lastDelay = configActive.lastDelay;

    if (isNumber(itemActive.firstDelay)) firstDelay = itemActive.firstDelay;
    if (isNumber(itemActive.lastDelay)) lastDelay = itemActive.lastDelay;

    return {
      firstDelay,
      lastDelay,
    };
  }

  // 清理所有未关闭的active事件, 并进行通知
  function clearActive(e?: Event, filter?: (target: TriggerTarget) => boolean) {
    // 对不在active状态中的项进行通知
    Array.from(ctx.activeRecord.values()).forEach((record) => {
      if (filter && !filter(record.target)) return;

      // 若存在延迟启用 , 将其取消
      if (record.delayTimer) {
        clearTimeout(record.delayTimer);
        record.delayTimer = null;
      }

      if (record.delayLeaveTimer) return;

      if (!record.isActivating) return;

      const activeEvent = _buildEvent({
        type: TriggerType.active,
        target: record.target,
        nativeEvent: e || triggerClearEvent,
        active: false,
        first: false,
        last: true,
        data: record.meta.data,
      });

      const triggerInactive = () => {
        ctx.activeRecord.delete(record.target);

        if (ctx.activeRecord.size === 0) {
          ctx.activating = false;
        }

        trigger.event.emit(activeEvent);
      };

      delayTriggerInactive(record, triggerInactive);
    });
  }

  // 清理所有未关闭的move事件, 并进行通知
  function clearMove(e?: Event, filter?: (target: TriggerTarget) => boolean) {
    // 对不在move状态中的项进行通知
    Array.from(ctx.moveRecord.values()).forEach((record) => {
      if (filter && !filter(record.target)) return;

      ctx.moveRecord.delete(record.target);

      const moveEvent = _buildEvent({
        type: TriggerType.move,
        target: record.target,
        nativeEvent: e || triggerClearEvent,
        active: false,
        first: false,
        last: true,
        data: record.meta.data,
      });

      trigger.event.emit(moveEvent);
    });
  }

  return {
    moveActive,
    clearActive,
    clearMove,
  };
}
