import { _TriggerContext, _TriggerTargetData } from "./types.js";
import { BoundSize, isNumber } from "@m78/utils";
import { _updateAllBoundThrottle } from "./methods.js";

/** 实现目标点检测相关的方法 */
export function _checkImpl(ctx: _TriggerContext) {
  const { trigger } = ctx;

  trigger.hasTargetByXY = (x, y, triggerTarget) => {
    _updateAllBoundThrottle(ctx);

    for (let i = 0; i < ctx.targetList.length; i++) {
      const cur = ctx.targetList[i];

      if (inBoundCheck(x, y, cur.bound)) {
        if (triggerTarget && cur.dom) {
          const isContain = cur.dom.contains(triggerTarget);

          if (isContain) {
            return true;
          } else {
            continue;
          }
        }

        return true;
      }
    }

    return false;
  };

  trigger.getTargetByXY = (xOrConf, y?: number, zIndexCheck?: boolean) => {
    if (isNumber(xOrConf)) {
      return ctx
        .getTargetDataByXY(xOrConf, y!, zIndexCheck)
        .map((i) => i.origin);
    }

    return ctx
      .getTargetDataByXY(
        xOrConf.x,
        xOrConf.y,
        xOrConf.zIndexCheck,
        xOrConf.triggerTarget
      )
      .map((i) => i.origin);
  };

  ctx.getTargetDataByXY = (x, y, zIndexCheck, triggerTarget) => {
    _updateAllBoundThrottle(ctx);

    const data = ctx.targetList.filter((i) => inBoundCheck(x, y, i.bound));

    if (!data.length) return data;
    if (!zIndexCheck && !triggerTarget) return data;

    let filterList: _TriggerTargetData[] = [];
    let max = 0;

    data.forEach((i) => {
      if (triggerTarget && i.dom) {
        const isContain = i.dom.contains(triggerTarget);

        if (isContain) {
          if (!zIndexCheck) {
            filterList.push(i);
          }
        } else {
          return;
        }
      }

      const z = i.meta.zIndex || 0;

      if (z > max) {
        max = z;
        filterList = [i];
      }

      if (z === max) {
        filterList.push(i);
      }
    });

    return filterList;
  };

  /** 检测xy是否在指定bound内 */
  function inBoundCheck(x: number, y: number, bound: BoundSize) {
    const { left, top, width, height } = bound;
    return x >= left && x <= left + width && y >= top && y <= top + height;
  }
}
