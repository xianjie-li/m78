import { isNumber } from "@m78/utils";
import { _updateAllBoundThrottle } from "./methods.js";
/** 实现目标点检测相关的方法 */ export function _checkImpl(ctx) {
    var inBoundCheck = /** 检测xy是否在指定bound内 */ function inBoundCheck(x, y, bound) {
        var left = bound.left, top = bound.top, width = bound.width, height = bound.height;
        return x >= left && x <= left + width && y >= top && y <= top + height;
    };
    var trigger = ctx.trigger;
    trigger.hasTargetByXY = function(x, y, triggerTarget) {
        _updateAllBoundThrottle(ctx);
        for(var i = 0; i < ctx.targetList.length; i++){
            var cur = ctx.targetList[i];
            if (inBoundCheck(x, y, cur.bound)) {
                if (triggerTarget && cur.dom) {
                    var isContain = cur.dom.contains(triggerTarget);
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
    trigger.getTargetByXY = function(xOrConf, y, zIndexCheck) {
        if (isNumber(xOrConf)) {
            return ctx.getTargetDataByXY(xOrConf, y, zIndexCheck).map(function(i) {
                return i.origin;
            });
        }
        return ctx.getTargetDataByXY(xOrConf.x, xOrConf.y, xOrConf.zIndexCheck, xOrConf.triggerTarget).map(function(i) {
            return i.origin;
        });
    };
    ctx.getTargetDataByXY = function(x, y, zIndexCheck, triggerTarget) {
        _updateAllBoundThrottle(ctx);
        var data = ctx.targetList.filter(function(i) {
            return inBoundCheck(x, y, i.bound);
        });
        if (!data.length) return data;
        if (!zIndexCheck && !triggerTarget) return data;
        var filterList = [];
        var max = 0;
        data.forEach(function(i) {
            if (triggerTarget && i.dom) {
                var isContain = i.dom.contains(triggerTarget);
                if (isContain) {
                    if (!zIndexCheck) {
                        filterList.push(i);
                    }
                } else {
                    return;
                }
            }
            var z = i.meta.zIndex || 0;
            if (z > max) {
                max = z;
                filterList = [
                    i
                ];
            }
            if (z === max) {
                filterList.push(i);
            }
        });
        return filterList;
    };
}
