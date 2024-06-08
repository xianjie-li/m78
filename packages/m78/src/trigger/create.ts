import { _TriggerContext, TriggerInstance } from "./types.js";
import { _targetOperationImpl } from "./target-operation.js";
import { _checkGetter } from "./getter.js";
import { _eventImpl } from "./event.js";
import { _actionImpl } from "./action.js";
import { _lifeImpl } from "./life.js";

/**
 * 构建工厂, 可用于支持多实例
 * */
export function _create() {
  const ctx = {
    optionList: [],
    groupMap: new Map(),
    dataMap: new Map(),
    trigger: {
      enable: true,
      dragging: false,
      moving: false,
      activating: false,
      running: false,
    } as TriggerInstance,
    shouldPreventDefaultContextMenu: false,
  } as any as _TriggerContext;

  ctx.event = _eventImpl(ctx);

  _targetOperationImpl(ctx);

  _checkGetter(ctx);

  _actionImpl(ctx);

  _lifeImpl(ctx);

  ctx.event.bind();

  // 光标处理
  // ctx.trigger.event.on((e) => {
  //   if (e.type === TriggerType.active) {
  //     if ("target" in e.target && e.target.cursor) {
  //       ctx.trigger.cursor = e.active ? e.target.cursor : "";
  //     }
  //   }
  // });

  return ctx.trigger;
}
