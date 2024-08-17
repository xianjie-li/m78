import { TriggerType } from "./types.js";
export function _lifeImpl(ctx) {
    var event = ctx.event, trigger = ctx.trigger;
    ctx.clear = function() {
        event.focusHandle.clear();
        event.moveHandle.clear();
        event.activeHandle.clear();
        event.dragHandle.clear();
    };
    ctx.handleEvent = function(e) {
        handleCursor(e);
        handlerPrevent(e);
    };
    var isPrevent = false;
    var runningCount = 0;
    // 处理某些默认行为禁用, 目前仅提供自动禁用用户文本选择
    function handlerPrevent(e) {
        // 跳过特定事件
        if (e.type === TriggerType.click || e.type === TriggerType.focus || e.type === TriggerType.contextMenu) {
            return;
        }
        if (e.first && e.last) return;
        if (e.first) {
            runningCount++;
        }
        if (e.last) {
            runningCount = Math.max(runningCount - 1, 0);
        }
        if (runningCount > 0 && !isPrevent) {
            isPrevent = true;
            document.documentElement.style.userSelect = "none";
        }
        if (runningCount <= 0 && isPrevent) {
            isPrevent = false;
            runningCount = 0;
            document.documentElement.style.userSelect = "";
        }
    }
    // 处理光标切换
    function handleCursor(param) {
        var eventMeta = param.eventMeta, active = param.active, first = param.first, last = param.last, type = param.type;
        var typeMap = eventMeta.typeMap, cursor = eventMeta.cursor;
        if (type === TriggerType.drag) {
            if (first) document.documentElement.style.cursor = cursor.drag;
            if (last) document.documentElement.style.cursor = "";
        }
        if (trigger.dragging) return;
        if (type === TriggerType.active) {
            var curCursor = typeMap.get(TriggerType.drag) ? cursor.dragActive : cursor.active;
            document.documentElement.style.cursor = active ? curCursor : "";
        }
    }
}
