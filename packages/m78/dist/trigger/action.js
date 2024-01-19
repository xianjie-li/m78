import { ensureArray } from "@m78/utils";
import { _updateTypeEnableMap } from "./methods.js";
// 实例操作
export function _actionImpl(ctx) {
    var trigger = ctx.trigger, event = ctx.event;
    var cursor = "";
    Object.defineProperties(trigger, {
        dragging: {
            get: function get() {
                return ctx.dragging;
            }
        },
        activating: {
            get: function get() {
                return ctx.activating;
            }
        },
        cursor: {
            get: function get() {
                return cursor;
            },
            set: function set(cur) {
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
    function getType() {
        return ctx.type;
    }
    function setType(type) {
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
    }
    function getEnable() {
        return ctx.enable;
    }
    function setEnable(enable) {
        var prev = ctx.enable;
        ctx.enable = enable;
        // 关闭时, 清理所有未完成事件
        if (prev && !enable) {
            ctx.clearAllPending();
        }
    }
}
