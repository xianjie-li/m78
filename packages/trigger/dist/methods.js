import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { isNumber } from "@m78/utils";
/** 检测节点是否为boundSize对象 */ export function _isBound(target) {
    return isNumber(target.left) && isNumber(target.top) && isNumber(target.width) && isNumber(target.height);
}
/** 构建一个所有项均为初始值的TriggerEvent */ export function _buildEvent(initProp) {
    return _object_spread_props(_object_spread({
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
        eventMeta: {}
    }, initProp), {
        data: initProp.data || {},
        timeStamp: Date.now()
    });
}
