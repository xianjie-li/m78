import { TriggerEvent } from "./types.js";
import { BoundSize } from "@m78/utils";
/** 检测节点是否为boundSize对象 */
export declare function _isBound(target: any): target is BoundSize;
/** 构建一个所有项均为初始值的TriggerEvent */
export declare function _buildEvent(initProp: {
    type: TriggerEvent["type"];
    nativeEvent: TriggerEvent["nativeEvent"];
    target: TriggerEvent["target"];
} & Partial<TriggerEvent>): TriggerEvent;
//# sourceMappingURL=methods.d.ts.map