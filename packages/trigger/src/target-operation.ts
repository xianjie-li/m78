import { ensureArray, isString } from "@m78/utils";
import { _TriggerContext, type TriggerOption } from "./types.js";

/** 实现对事件的增删 */
export function _targetOperationImpl(ctx: _TriggerContext) {
  const { trigger } = ctx;

  // 更新optionList, 应在每次optionMap变更时调用
  function updateOptionList() {
    ctx.optionList.length = 0;

    ctx.optionMap.forEach((item) => {
      if (item instanceof Map) {
        item.forEach((it) => {
          ctx.optionList.push(it);
        });
      } else {
        ctx.optionList.push(item);
      }
    });
  }

  function upsetKeepAliveData(i: TriggerOption) {
    if (!ctx.keepAliveData.get(i)) {
      ctx.keepAliveData.set(i, {});
    }
  }

  trigger.on = (target, key) => {
    target = ensureArray(target);

    if (key) {
      let option = ctx.optionMap.get(key);

      if (!option || !(option instanceof Map)) {
        option = new Map();

        ctx.optionMap.set(key, option);
      }

      target.forEach((i) => {
        upsetKeepAliveData(i);
        (option as Map<TriggerOption, TriggerOption>).set(i, i);
      });
    } else {
      target.forEach((i) => {
        upsetKeepAliveData(i);
        ctx.optionMap.set(i, i);
      });
    }

    updateOptionList();
  };

  trigger.off = (target) => {
    if (isString(target)) {
      const map = ctx.optionMap.get(target) as Map<
        TriggerOption,
        TriggerOption
      >;

      if (map) {
        map.forEach((i) => {
          ctx.keepAliveData.delete(i);
        });
      }

      ctx.optionMap.delete(target);
    } else {
      ensureArray(target).forEach((i) => {
        ctx.keepAliveData.delete(i);
        ctx.optionMap.delete(i);
      });
    }

    updateOptionList();
  };

  trigger.clear = () => {
    ctx.optionList = [];
    ctx.optionMap.clear();
    ctx.keepAliveData.clear();
  };

  trigger.size = () => {
    return ctx.optionList.length;
  };
}
