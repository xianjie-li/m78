import { TriggerType, _TriggerContext, type TriggerEvent } from "./types.js";

export function _lifeImpl(ctx: _TriggerContext) {
  const { event, trigger } = ctx;

  ctx.clear = () => {
    event.focusHandle.clear();

    event.moveHandle.clear();

    event.activeHandle.clear();

    event.dragHandle.clear();
  };

  ctx.handleEvent = (e) => {
    handleCursor(e);
    handlerPrevent(e);
  };

  let isPrevent = false;
  let runningCount = 0;

  // 处理某些默认行为禁用, 目前仅提供自动禁用用户文本选择
  function handlerPrevent(e: TriggerEvent) {
    // 跳过特定事件
    if (
      e.type === TriggerType.click ||
      e.type === TriggerType.focus ||
      e.type === TriggerType.contextMenu
    ) {
      return;
    }

    if (e.first && e.last) return;

    if (e.first) {
      runningCount++;
    }

    if (e.last) {
      runningCount = Math.max(runningCount - 1, 0);
    }

    if (runningCount > 0 && !isPrevent) {
      isPrevent = true;
      document.documentElement.style.userSelect = "none";
    }

    if (runningCount <= 0 && isPrevent) {
      isPrevent = false;
      runningCount = 0;
      document.documentElement.style.userSelect = "";
    }
  }

  let lastTriggerTime = 0;

  // 处理光标切换
  function handleCursor(e: TriggerEvent) {
    const { eventMeta, active, first, last, type, timeStamp } = e;
    const { typeMap, cursor } = eventMeta;

    // 如果有新事件入场, 忽略旧事件
    if (timeStamp <= lastTriggerTime) return;

    if (type === TriggerType.drag && cursor.drag) {
      if (first) document.documentElement.style.cursor = cursor.drag;
      if (last) document.documentElement.style.cursor = "";

      if (first || last) {
        lastTriggerTime = timeStamp;
      }
    }

    if (trigger.dragging) return;

    const curCursor = typeMap.get(TriggerType.drag)
      ? cursor.dragActive
      : cursor.active;

    if (type === TriggerType.active && curCursor) {
      document.documentElement.style.cursor = active ? curCursor : "";
      lastTriggerTime = timeStamp;
    }
  }
}
