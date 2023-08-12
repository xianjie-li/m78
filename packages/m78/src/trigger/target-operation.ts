import { _TriggerContext } from "./types.js";
import { ensureArray } from "@m78/utils";
import { _targetInit, _updateTargetList } from "./methods.js";

/** 实现对事件的增删 */
export function _targetOperationImpl(ctx: _TriggerContext) {
  const { trigger } = ctx;

  trigger.add = (target) => {
    const tList = ensureArray(target).map(_targetInit);

    tList.forEach((t) => {
      ctx.eventMap.set(t.origin, t);
    });

    _updateTargetList(ctx);
  };

  trigger.delete = (target) => {
    const tList = ensureArray(target);

    tList.forEach((t) => {
      ctx.eventMap.delete(t);
    });

    _updateTargetList(ctx);
  };

  trigger.clear = () => {
    ctx.eventMap.clear();

    _updateTargetList(ctx);
  };

  trigger.size = () => {
    return ctx.eventMap.size;
  };
}
