import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import { isNumber } from "@m78/utils";
import throttle from "lodash/throttle.js";
import { addCls, removeCls } from "../common/index.js";
/** 根据当前的ctx.type更新typeEnableMap */ export function _updateTypeEnableMap(ctx) {
    ctx.typeEnableMap = {};
    ctx.type.forEach(function(key) {
        ctx.typeEnableMap[key] = true;
    });
}
/** 更新所有项的bound */ export function _updateAllBound(ctx) {
    ctx.targetList.forEach(_updateBound);
}
// 更新targetList
export function _updateTargetList(ctx) {
    ctx.targetList = Array.from(ctx.eventMap.values());
}
/** 更新传入项的bound */ export function _updateBound(data) {
    var isBound = data.isBound, dom = data.dom;
    if (isBound) {
        data.bound = data.meta.target;
    } else {
        var rect = dom.getBoundingClientRect();
        data.bound = {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
        };
    }
}
/** 节流版本的_updateBound */ export var _updateAllBoundThrottle = throttle(_updateAllBound, 100, {
    leading: true,
    trailing: true
});
/** 通过TriggerTarget初始化data */ export function _targetInit(target) {
    var isMetaObj = "target" in target;
    var meta;
    var dom;
    var bound = {
        left: 0,
        top: 0,
        width: 0,
        height: 0
    };
    var isBound = false;
    if (isMetaObj) {
        meta = target;
        if (_isBound(target.target)) {
            bound = target.target;
            isBound = true;
        } else {
            dom = target.target;
        }
    } else {
        meta = {
            target: target
        };
        if (_isBound(target)) {
            bound = target;
            isBound = true;
        } else {
            dom = target;
        }
    }
    return {
        meta: _object_spread({
            zIndex: 0
        }, meta),
        origin: target,
        isBound: isBound,
        bound: bound,
        dom: dom
    };
}
/** 构建一个所有项均为初始值的TriggerEvent */ export function _buildEvent(initProp) {
    return _object_spread({
        first: true,
        last: false,
        x: 0,
        y: 0,
        offsetX: 0,
        offsetY: 0,
        active: false,
        focus: false,
        isInteractiveFocus: false,
        movementX: 0,
        movementY: 0,
        deltaX: 0,
        deltaY: 0,
        data: {}
    }, initProp);
}
/** 检测节点是否为boundSize对象 */ export function _isBound(target) {
    return isNumber(target.left) && isNumber(target.top) && isNumber(target.width) && isNumber(target.height);
}
/** 添加用于禁用默认touch行为的各种css */ export function _addPreventCls(dom) {
    addCls(dom, "m78-trigger_prevent");
}
/** 移除用于禁用默认touch行为的各种css */ export function _removePreventCls(dom) {
    removeCls(dom, "m78-trigger_prevent");
}
