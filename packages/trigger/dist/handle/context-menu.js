import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { TriggerType } from "../types.js";
import { getEventOffset, getEventXY } from "@m78/utils";
import { _buildEvent } from "../methods.js";
/** 实现contextMenu */ export function _contextMenuImpl(ctx) {
    // 背景: contextMenu事件在除了移动ios的设备外都能很好的触发, 为了更好的兼容性, 只能通过自定义事件来模拟
    function contextMenu(e) {
        var isSimulation = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
        if (!isSimulation && !ctx.shouldPreventDefaultContextMenu) {
            // contextMenu会导致drag等事件的关闭触发异常, 这里手动进行一次清理防止意外情况
            ctx.clear();
        }
        if (!isSimulation && ctx.shouldPreventDefaultContextMenu) {
            e.preventDefault();
            ctx.shouldPreventDefaultContextMenu = false;
            return;
        }
        var _getEventXY = _sliced_to_array(getEventXY(e), 3), x = _getEventXY[0], y = _getEventXY[1], isTouch = _getEventXY[2];
        var eventList = ctx.getEventList({
            xy: [
                x,
                y
            ],
            type: TriggerType.contextMenu,
            dom: e.target
        }).eventList;
        // 阻止标准的contextmenu事件执行
        if (eventList.length && isTouch) {
            ctx.shouldPreventDefaultContextMenu = true;
        }
        if (eventList.length && !isTouch) {
            e.preventDefault();
        }
        eventList.forEach(function(i) {
            var _getEventOffset = _sliced_to_array(getEventOffset(e, i.bound), 2), offsetX = _getEventOffset[0], offsetY = _getEventOffset[1];
            var event = _buildEvent({
                type: TriggerType.contextMenu,
                target: i.option,
                nativeEvent: e,
                x: x,
                y: y,
                offsetX: offsetX,
                offsetY: offsetY,
                active: false,
                last: true,
                data: i.option.data,
                eventMeta: i
            });
            ctx.handleEvent(event);
            i.option.handler(event);
        });
    }
    // 触控设备模拟contextmenu事件
    function simulationContextMenu(e) {
        if (ctx.trigger.dragging) return;
        contextMenu(e, true);
    }
    return {
        contextMenu: contextMenu,
        simulationContextMenu: simulationContextMenu
    };
}
