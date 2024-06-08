import { TriggerEvent } from "./types.js";
import { BoundSize, isNumber } from "@m78/utils";

/** 检测节点是否为boundSize对象 */
export function _isBound(target: any): target is BoundSize {
  return (
    isNumber(target.left) &&
    isNumber(target.top) &&
    isNumber(target.width) &&
    isNumber(target.height)
  );
}

/** 构建一个所有项均为初始值的TriggerEvent */
export function _buildEvent(
  initProp: {
    type: TriggerEvent["type"];
    nativeEvent: TriggerEvent["nativeEvent"];
    target: TriggerEvent["target"];
  } & Partial<TriggerEvent>
): TriggerEvent {
  return {
    first: true,
    last: false,
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    active: false,
    focus: false,
    isTapFocus: false,
    movementX: 0,
    movementY: 0,
    deltaX: 0,
    deltaY: 0,
    eventMeta: {} as any,
    ...initProp,
    data: initProp.data || {},
  };
}
