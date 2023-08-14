import { _TriggerContext, TriggerType } from "../types.js";
import { getEventOffset, isMobileDevice } from "@m78/utils";
import { _buildEvent } from "../methods.js";
import { _eventXyGetter } from "../common.js";

export function _contextMenuImpl(ctx: _TriggerContext) {
  const { trigger, config } = ctx;

  function contextMenu(e: MouseEvent) {
    if (!ctx.typeEnableMap[TriggerType.contextMenu]) return;
    if (config.preCheck && !config.preCheck(TriggerType.contextMenu, e)) return;

    const items = ctx.getTargetDataByXY(
      e.clientX,
      e.clientY,
      true,
      e.target as HTMLElement
    );

    if (items.length) {
      e.preventDefault();
    }

    // 移动设备使用模拟的行为触发, 因为在ios等设备context不可用
    if (isMobileDevice()) return;

    items.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.bound);

      const event = _buildEvent({
        type: TriggerType.contextMenu,
        target: i.origin,
        nativeEvent: e,
        x: e.clientX,
        y: e.clientY,
        offsetX,
        offsetY,
        active: true,
        last: true,
        data: i.meta.data,
      });

      trigger.event.emit(event);
    });
  }

  const state = {
    timer: null as any,
    moveCount: 0,
  };

  // 模拟contextmenu事件
  function simulationStart(e: TouchEvent) {
    if (!ctx.typeEnableMap[TriggerType.contextMenu]) return;
    if (config.preCheck && !config.preCheck(TriggerType.contextMenu, e)) return;

    const [clientX, clientY] = _eventXyGetter(e);

    const items = ctx.getTargetDataByXY(
      clientX,
      clientY,
      true,
      e.target as HTMLElement
    );

    state.moveCount = 0;

    state.timer = setTimeout(() => {
      state.timer = null;

      if (state.moveCount > 4) return;

      items.forEach((i) => {
        const [offsetX, offsetY] = getEventOffset(e, i.bound);

        const event = _buildEvent({
          type: TriggerType.contextMenu,
          target: i.origin,
          nativeEvent: e,
          x: clientX,
          y: clientY,
          offsetX,
          offsetY,
          active: true,
          last: true,
          data: i.meta.data,
        });

        trigger.event.emit(event);
      });
    }, 360);
  }

  function simulationMove() {
    if (!ctx.typeEnableMap[TriggerType.contextMenu]) return;
    state.moveCount++;
  }

  function simulationEnd() {
    if (!ctx.typeEnableMap[TriggerType.contextMenu]) return;
    clear();
  }

  function clear() {
    if (state.timer) {
      clearTimeout(state.timer);
      state.timer = null;
    }
  }

  return {
    clear,
    contextMenu,
    simulationStart,
    simulationMove,
    simulationEnd,
  };
}
