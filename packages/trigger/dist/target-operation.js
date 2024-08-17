import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { ensureArray, isString } from "@m78/utils";
/** 实现对事件的增删 */ export function _targetOperationImpl(ctx) {
    var trigger = ctx.trigger;
    // 更新optionList, 应在每次optionMap变更时调用
    function updateOptionList() {
        ctx.optionList.length = 0;
        ctx.optionMap.forEach(function(item) {
            if (_instanceof(item, Map)) {
                item.forEach(function(it) {
                    ctx.optionList.push(it);
                });
            } else {
                ctx.optionList.push(item);
            }
        });
    }
    function upsetKeepAliveData(i) {
        if (!ctx.keepAliveData.get(i)) {
            ctx.keepAliveData.set(i, {});
        }
    }
    trigger.on = function(target, key) {
        target = ensureArray(target);
        if (key) {
            var option = ctx.optionMap.get(key);
            if (!option || !_instanceof(option, Map)) {
                option = new Map();
                ctx.optionMap.set(key, option);
            }
            target.forEach(function(i) {
                upsetKeepAliveData(i);
                option.set(i, i);
            });
        } else {
            target.forEach(function(i) {
                upsetKeepAliveData(i);
                ctx.optionMap.set(i, i);
            });
        }
        updateOptionList();
    };
    trigger.off = function(target) {
        if (isString(target)) {
            var map = ctx.optionMap.get(target);
            if (map) {
                map.forEach(function(i) {
                    ctx.keepAliveData.delete(i);
                });
            }
            ctx.optionMap.delete(target);
        } else {
            ensureArray(target).forEach(function(i) {
                ctx.keepAliveData.delete(i);
                ctx.optionMap.delete(i);
            });
        }
        updateOptionList();
    };
    trigger.clear = function() {
        ctx.optionList = [];
        ctx.optionMap.clear();
        ctx.keepAliveData.clear();
    };
    trigger.size = function() {
        return ctx.optionList.length;
    };
}
