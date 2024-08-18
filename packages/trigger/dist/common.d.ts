import type { EmptyFunction } from "@m78/utils";
import { TriggerOverrideStrategy, TriggerCursorMap, type TriggerTargetData, type TriggerOption } from "./types.js";
export declare const _defaultLevel = 0;
export declare const _defaultOverrideStrategy = TriggerOverrideStrategy.parallel;
export declare const _defaultCursorConf: Required<TriggerCursorMap>;
/** move事件的触发频率(ms) */
export declare const _triggerLimit = 60;
/** 含first/last的事件的进延迟 */
export declare const _triggerInDelay: number;
/** 含first/last的事件的出延迟 */
export declare const _triggerOutDelay = 140;
/** longpress延迟 */
export declare const _longPressDelay = 380;
/** drag触发的最小拖动距离 */
export declare const _dragMinDistance = 3;
/** 用于为move事件进行节流, 限制每秒触发的频率 */
export declare function _createLimitTrigger(): (enable: boolean, e: Event, cb: EmptyFunction) => void;
/** 将传入的 TriggerTargetData[] 转换为以 option 为 key 的 map */
export declare function _getListMap(list: TriggerTargetData[]): Map<TriggerOption, TriggerTargetData>;
//# sourceMappingURL=common.d.ts.map