import { _TriggerContext, TriggerInstance } from "./types.js";
import { _targetOperationImpl } from "./target-operation.js";
import { _checkGetter } from "./getter.js";
import { _eventImpl } from "./event.js";
import { _actionImpl } from "./action.js";
import { _lifeImpl } from "./life.js";

/**
 * 构建工厂, 用于支持多实例, 在大部分情况下, 推荐使用默认实例, 方便管理冲突的事件
 * */
export function _create() {
  const ctx = {
    optionMap: new Map(),
    keepAliveData: new Map(),
    optionList: [],
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

  return ctx.trigger;
}
