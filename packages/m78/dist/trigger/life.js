import { TriggerType } from "./types.js";
import { setNamePathValue } from "@m78/utils";
export function _lifeImpl(ctx) {
    var event = ctx.event;
    ctx.clearPending = function(conf) {
        if (conf[TriggerType.focus]) {
            event.focusHandle.clear();
        }
        if (conf[TriggerType.move]) {
            event.moveActiveHandle.clearMove();
        }
        if (conf[TriggerType.active]) {
            event.moveActiveHandle.clearActive();
        }
        if (conf[TriggerType.drag]) {
            event.dragHandle.clear();
        }
        if (conf[TriggerType.contextMenu]) {
            event.contextMenuHandle.clear();
        }
    };
    ctx.clearAllPending = function() {
        var clearObj = {};
        Object.keys(TriggerType).forEach(function(k) {
            clearObj[k] = true;
        });
        ctx.clearPending(clearObj);
    };
    ctx.trigger.destroy = function() {
        // 清理尚未结束的事件
        ctx.clearAllPending();
        ctx.trigger.clear();
        ctx.targetList = [];
        setNamePathValue(ctx, "trigger", null);
    };
}
