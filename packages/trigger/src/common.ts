import type { EmptyFunction } from "@m78/utils";
import {
  TriggerOverrideStrategy,
  TriggerCursorMap,
  type TriggerTargetData,
  type TriggerOption,
} from "./types.js";

export const _defaultLevel = 0;

export const _defaultOverrideStrategy = TriggerOverrideStrategy.parallel;

export const _defaultCursorConf: Required<TriggerCursorMap> = {
  drag: "grabbing",
  dragActive: "grab",
  active: "pointer",
};

/** move事件的触发频率(ms) */
export const _triggerLimit = 60;

/** 含first/last的事件的进延迟 */
export const _triggerInDelay = 80 - _triggerLimit;

/** 含first/last的事件的出延迟 */
export const _triggerOutDelay = 140;

/** longpress延迟 */
export const _longPressDelay = 380;

/** drag触发的最小拖动距离 */
export const _dragMinDistance = 3;

/** 用于为move事件进行节流, 限制每秒触发的频率 */
export function _createLimitTrigger() {
  const limit = _triggerLimit;
  let last = 0;

  return (enable: boolean, e: Event, cb: EmptyFunction) => {
    if (!enable) {
      cb();
      return;
    }

    const diff = e.timeStamp - last;

    if (diff < limit) return;

    last = e.timeStamp;

    cb();
  };
}

/** 将传入的 TriggerTargetData[] 转换为以 option 为 key 的 map */
export function _getListMap(list: TriggerTargetData[]) {
  const map = new Map<TriggerOption, TriggerTargetData>();

  list.forEach((item) => {
    map.set(item.option, item);
  });

  return map;
}
