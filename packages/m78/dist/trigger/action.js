import { ensureArray } from "@m78/utils";
import { _updateTypeEnableMap } from "./methods.js";
// 实例操作
export function _actionImpl(ctx) {
    var getType = function getType() {
        return ctx.type;
    };
    var setType = function setType(type) {
        // 之前启用的事件
        var keys = Object.keys(ctx.typeEnableMap).filter(function(i) {
            return ctx.typeEnableMap[i];
        });
        ctx.type = ensureArray(type);
        _updateTypeEnableMap(ctx);
        // type更新后被关闭的事件
        var closeMap = {};
        keys.forEach(function(i) {
            if (!ctx.typeEnableMap[i]) {
                closeMap[i] = true;
            }
        });
        // 清理尚未结束的事件
        ctx.clearPending(closeMap);
        event.unbind();
        event.bind();
    };
    var getEnable = function getEnable() {
        return ctx.enable;
    };
    var setEnable = function setEnable(enable) {
        var prev = ctx.enable;
        ctx.enable = enable;
        // 关闭时, 清理所有未完成事件
        if (prev && !enable) {
            ctx.clearAllPending();
        }
    };
    var trigger = ctx.trigger, event = ctx.event;
    var cursor = "";
    Object.defineProperties(trigger, {
        dragging: {
            get: function() {
                return ctx.dragging;
            }
        },
        activating: {
            get: function() {
                return ctx.activating;
            }
        },
        cursor: {
            get: function() {
                return cursor;
            },
            set: function(cur) {
                cursor = cur;
                ctx.container.style.cursor = cur;
            }
        },
        enable: {
            get: getEnable,
            set: setEnable
        },
        type: {
            get: getType,
            set: setType
        }
    });
}
