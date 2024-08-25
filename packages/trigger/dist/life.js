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
    var lastTriggerTime = 0;
    // 处理光标切换
    function handleCursor(e) {
        var eventMeta = e.eventMeta, active = e.active, first = e.first, last = e.last, type = e.type, timeStamp = e.timeStamp;
        var typeMap = eventMeta.typeMap, cursor = eventMeta.cursor;
        // 如果有新事件入场, 忽略旧事件
        if (timeStamp <= lastTriggerTime) return;
        if (type === TriggerType.drag && cursor.drag) {
            if (first) document.documentElement.style.cursor = cursor.drag;
            if (last) document.documentElement.style.cursor = "";
            if (first || last) {
                lastTriggerTime = timeStamp;
            }
        }
        if (trigger.dragging) return;
        var curCursor = typeMap.get(TriggerType.drag) ? cursor.dragActive : cursor.active;
        if (type === TriggerType.active && curCursor) {
            document.documentElement.style.cursor = active ? curCursor : "";
            lastTriggerTime = timeStamp;
        }
    }
}
