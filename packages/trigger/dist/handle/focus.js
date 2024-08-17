import { TriggerType } from "../types.js";
import { _buildEvent } from "../methods.js";
export function _focusImpl(ctx) {
    // 最后进行mousedown/touchstart的时间
    var lastDownTime = 0;
    var currentFocus = [];
    function focus(e) {
        if (e.target === window) return;
        var eventList = ctx.getEventList({
            type: TriggerType.focus,
            filter: function(i) {
                if (i.isVirtual) return false;
                // 子级或自身聚焦时, 都视为focus
                return i.dom.contains(e.target);
            }
        }).eventList;
        currentFocus = eventList;
        var _isTapFocus = isTapFocus();
        eventList.forEach(function(i) {
            var event = _buildEvent({
                type: TriggerType.focus,
                target: i.option,
                nativeEvent: e,
                focus: true,
                isTapFocus: _isTapFocus,
                data: i.option.data,
                eventMeta: i
            });
            ctx.handleEvent(event);
            i.option.handler(event);
        });
    }
    function blur(e) {
        if (e.target === window) return;
        if (!currentFocus.length) return;
        // 需要保留的focus
        var blurList = [];
        // 需要移除的focus
        var focusList = [];
        currentFocus.forEach(function(i) {
            // 保留仍在focus内部的节点
            if (!i.dom.contains(e.target)) {
                focusList.push(i);
                return;
            }
            // 其他节点失焦
            blurList.push(i);
        });
        currentFocus = focusList;
        var _isTapFocus = isTapFocus();
        blurList.forEach(function(i) {
            var event = _buildEvent({
                type: TriggerType.focus,
                target: i.option,
                nativeEvent: e,
                focus: false,
                first: false,
                last: true,
                isTapFocus: _isTapFocus,
                data: i.option.data,
                eventMeta: i
            });
            ctx.handleEvent(event);
            i.option.handler(event);
        });
    }
    // 通过mousedown/touchstart,进行focus标记, 帮助区分是点击触发还是通过键盘触发
    function focusBeforeMark() {
        lastDownTime = Date.now();
    }
    // 检测是通过点击还是通过键盘或命令式出发
    function isTapFocus() {
        return Date.now() - lastDownTime < 20;
    }
    // 清理所有未关闭的focus事件, 并进行通知
    function clear() {
        var _isTapFocus = isTapFocus();
        currentFocus.forEach(function(i) {
            var event = _buildEvent({
                type: TriggerType.focus,
                target: i.option,
                nativeEvent: new Event("M78_FOCUS_CLEAR"),
                focus: false,
                first: false,
                last: true,
                isTapFocus: _isTapFocus,
                data: i.option.data,
                eventMeta: ctx.getDataByOption(i.option)
            });
            ctx.handleEvent(event);
            i.option.handler(event);
        });
        currentFocus = [];
    }
    return {
        focus: focus,
        blur: blur,
        focusBeforeMark: focusBeforeMark,
        clear: clear
    };
}
