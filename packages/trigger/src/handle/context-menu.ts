import { _TriggerContext, TriggerType } from "../types.js";
import { getEventOffset, getEventXY } from "@m78/utils";
import { _buildEvent } from "../methods.js";

/** 实现contextMenu */
export function _contextMenuImpl(ctx: _TriggerContext) {
  // 背景: contextMenu事件在除了移动ios的设备外都能很好的触发, 为了更好的兼容性, 只能通过自定义事件来模拟

  function contextMenu(e: MouseEvent | TouchEvent, isSimulation = false) {
    if (!isSimulation && !ctx.shouldPreventDefaultContextMenu) {
      // contextMenu会导致drag等事件的关闭触发异常, 这里手动进行一次清理防止意外情况
      ctx.clear();
    }

    if (!isSimulation && ctx.shouldPreventDefaultContextMenu) {
      e.preventDefault();
      ctx.shouldPreventDefaultContextMenu = false;
      return;
    }

    const [x, y, isTouch] = getEventXY(e);

    const { eventList } = ctx.getEventList({
      xy: [x, y],
      type: TriggerType.contextMenu,
      dom: e.target as HTMLElement,
    });

    // 阻止标准的contextmenu事件执行
    if (eventList.length && isTouch) {
      ctx.shouldPreventDefaultContextMenu = true;
    }

    if (eventList.length && !isTouch) {
      e.preventDefault();
    }

    eventList.forEach((i) => {
      const [offsetX, offsetY] = getEventOffset(e, i.bound);

      const event = _buildEvent({
        type: TriggerType.contextMenu,
        target: i.option,
        nativeEvent: e,
        x,
        y,
        offsetX,
        offsetY,
        active: false,
        last: true,
        data: i.option.data,
        eventMeta: i,
      });

      ctx.handleEvent(event);
      i.option.handler(event);
    });
  }

  // 触控设备模拟contextmenu事件
  function simulationContextMenu(e: TouchEvent) {
    if (ctx.trigger.dragging) return;
    contextMenu(e, true);
  }

  return {
    contextMenu,
    simulationContextMenu,
  };
}
