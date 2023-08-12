import { _TriggerContext, TriggerType } from "./types.js";
import { ensureArray } from "@m78/utils";
import { _updateTypeEnableMap } from "./methods.js";

// 实例操作
export function _actionImpl(ctx: _TriggerContext) {
  const { trigger, event } = ctx;

  let cursor = "";

  Object.defineProperties(trigger, {
    dragging: {
      get() {
        return ctx.dragging;
      },
    },
    activating: {
      get() {
        return ctx.activating;
      },
    },
    cursor: {
      get() {
        return cursor;
      },
      set(cur: string) {
        cursor = cur;
        ctx.container.style.cursor = cur;
      },
    },
    enable: {
      get: getEnable,
      set: setEnable,
    },
    type: {
      get: getType,
      set: setType,
    },
  });

  function getType(): TriggerType[] {
    return ctx.type;
  }

  function setType(type: TriggerType | TriggerType[]) {
    // 之前启用的事件
    const keys = Object.keys(ctx.typeEnableMap).filter(
      (i) => ctx.typeEnableMap[i]
    );

    ctx.type = ensureArray(type);
    _updateTypeEnableMap(ctx);

    // type更新后被关闭的事件
    const closeMap: Record<string, boolean> = {};

    keys.forEach((i) => {
      if (!ctx.typeEnableMap[i]) {
        closeMap[i] = true;
      }
    });

    // 清理尚未结束的事件
    ctx.clearPending(closeMap);

    event.unbind();
    event.bind();
  }

  function getEnable(): boolean {
    return ctx.enable;
  }

  function setEnable(enable: boolean) {
    const prev = ctx.enable;

    ctx.enable = enable;

    // 关闭时, 清理所有未完成事件
    if (prev && !enable) {
      ctx.clearAllPending();
    }
  }
}
