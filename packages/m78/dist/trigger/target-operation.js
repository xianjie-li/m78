import { ensureArray } from "@m78/utils";
import { _targetInit, _updateTargetList } from "./methods.js";
/** 实现对事件的增删 */ export function _targetOperationImpl(ctx) {
    var trigger = ctx.trigger;
    trigger.add = function(target) {
        var tList = ensureArray(target).map(_targetInit);
        tList.forEach(function(t) {
            ctx.eventMap.set(t.origin, t);
        });
        _updateTargetList(ctx);
    };
    trigger.delete = function(target) {
        var tList = ensureArray(target);
        tList.forEach(function(t) {
            ctx.eventMap.delete(t);
        });
        _updateTargetList(ctx);
    };
    trigger.clear = function() {
        ctx.eventMap.clear();
        _updateTargetList(ctx);
    };
    trigger.size = function() {
        return ctx.eventMap.size;
    };
}
