import { ensureArray, isArray, isString } from "@m78/utils";
import { _TriggerContext, type TriggerOption } from "./types.js";

/** 实现对事件的增删 */
export function _targetOperationImpl(ctx: _TriggerContext) {
  const { trigger } = ctx;

  trigger.on = (target, key) => {
    target = ensureArray(target);

    if (key) {
      let list = ctx.groupMap.get(key);

      if (!list) {
        list = [key, target.slice()];
        ctx.groupMap.set(key, list);
      } else {
        list[1].push(...target);
      }
      return;
    }

    ctx.optionList.push(...target);
  };

  trigger.off = (target) => {
    if (isString(target)) {
      const list = ctx.groupMap.get(target);

      ctx.groupMap.delete(target);

      if (list) {
        const ind = ctx.optionList.indexOf(list);

        if (ind > -1) ctx.optionList.splice(ind, 1);
      }

      return;
    }

    const existMap = new Map<TriggerOption, boolean>();

    ensureArray(target).forEach((i) => existMap.set(i, true));

    for (let i = ctx.optionList.length - 1; i >= 0; i--) {
      const tList = ctx.optionList[i];

      if (isArray(tList)) continue;

      if (existMap.has(tList)) ctx.optionList.splice(i, 1);
    }
  };

  trigger.clear = () => {
    ctx.optionList = [];
    ctx.groupMap = new Map();
  };

  trigger.size = () => {
    return ctx.optionList.reduce((p, i) => {
      return p + (isArray(i) ? i[1].length : 1);
    }, 0);
  };
}
