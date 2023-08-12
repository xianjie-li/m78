/// <reference types="lodash" />
import { _TriggerContext, _TriggerTargetData, TriggerEvent, TriggerTarget } from "./types.js";
import { BoundSize } from "@m78/utils";
/** 根据当前的ctx.type更新typeEnableMap */
export declare function _updateTypeEnableMap(ctx: _TriggerContext): void;
/** 更新所有项的bound */
export declare function _updateAllBound(ctx: _TriggerContext): void;
export declare function _updateTargetList(ctx: _TriggerContext): void;
/** 更新传入项的bound */
export declare function _updateBound(data: _TriggerTargetData): void;
/** 节流版本的_updateBound */
export declare const _updateAllBoundThrottle: import("lodash").DebouncedFunc<typeof _updateAllBound>;
/** 通过TriggerTarget初始化data */
export declare function _targetInit(target: TriggerTarget): _TriggerTargetData;
/** 构建一个所有项均为初始值的TriggerEvent */
export declare function _buildEvent(initProp: {
    type: TriggerEvent["type"];
    nativeEvent: TriggerEvent["nativeEvent"];
    target: TriggerEvent["target"];
} & Partial<TriggerEvent>): TriggerEvent;
/** 检测节点是否为boundSize对象 */
export declare function _isBound(target: any): target is BoundSize;
/** 添加用于禁用默认touch行为的各种css */
export declare function _addPreventCls(dom: HTMLElement): void;
/** 移除用于禁用默认touch行为的各种css */
export declare function _removePreventCls(dom: HTMLElement): void;
//# sourceMappingURL=methods.d.ts.map