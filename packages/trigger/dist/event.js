import { _createLimitTrigger, _longPressDelay } from "./common.js";
import { _activeImpl } from "./handle/active.js";
import { _clickImpl } from "./handle/click.js";
import { _contextMenuImpl } from "./handle/context-menu.js";
import { _dragImpl } from "./handle/drag.js";
import { _focusImpl } from "./handle/focus.js";
import { _moveImpl } from "./handle/move.js";
// event的核心实现部分
export function _eventImpl(ctx) {
    var trigger = ctx.trigger;
    var clickHandle = _clickImpl(ctx);
    var focusHandle = _focusImpl(ctx);
    var activeHandle = _activeImpl(ctx);
    var moveHandle = _moveImpl(ctx);
    var dragHandle = _dragImpl(ctx);
    var contextMenuHandle = _contextMenuImpl(ctx);
    var moveLimitTrigger = _createLimitTrigger();
    var activeLimitTrigger = _createLimitTrigger();
    // 在开发时的chrome devtool mobile模式中, 点击或按下一段时间都会触发mouse系列的事件, 需要标识阻止两者之前互相影响
    var lastTouchTime = 0;
    var lastMouseTime = 0;
    // longpress计时器
    var longPressTimer;
    function mouseDown(e) {
        lastMouseTime = e.timeStamp;
        if (hasRecentlyTouch(e)) return;
        if (!trigger.enable) return;
        // 仅左键点击进行标记
        if (e.button === 0) {
            dragHandle.startMark(e);
        }
    }
    function mouseMove(e) {
        lastMouseTime = e.timeStamp;
        if (hasRecentlyTouch(e)) return;
        if (!trigger.enable) return;
        moveLimitTrigger(// 有move项触发时, 取消节流, 实时触发
        !moveHandle.hasTrigger(), e, function() {
            return moveHandle.trigger(e);
        });
        activeLimitTrigger(true, e, function() {
            return activeHandle.trigger(e);
        });
        dragHandle.dragTrigger(e);
    }
    function mouseUp(e) {
        lastMouseTime = e.timeStamp;
        if (hasRecentlyTouch(e)) return;
        if (!trigger.enable) return;
        dragHandle.end(e);
    }
    function touchStart(e) {
        lastTouchTime = e.timeStamp;
        if (hasRecentlyMouse(e)) return;
        if (!trigger.enable) return;
        touchTrailingBind(e);
        longPressTimer = setTimeout(function() {
            return longPress(e);
        }, _longPressDelay);
        dragHandle.startMark(e);
    }
    function touchMove(e) {
        lastTouchTime = e.timeStamp;
        if (hasRecentlyMouse(e)) return;
        if (!trigger.enable) return;
        if (longPressTimer) clearTimeout(longPressTimer);
        moveHandle.trigger(e);
        dragHandle.dragTrigger(e);
    }
    function touchEnd(e) {
        lastTouchTime = e.timeStamp;
        touchTrailingUnBind(e);
        if (hasRecentlyMouse(e)) return;
        if (!trigger.enable) return;
        if (longPressTimer) clearTimeout(longPressTimer);
        moveHandle.trigger(e);
        activeHandle.clear(e);
        dragHandle.end(e);
    }
    function hasRecentlyTouch(e) {
        return e.timeStamp - lastTouchTime < 50;
    }
    function hasRecentlyMouse(e) {
        return e.timeStamp - lastMouseTime < 50;
    }
    function longPress(e) {
        longPressTimer = undefined;
        activeHandle.trigger(e);
        contextMenuHandle.simulationContextMenu(e);
    }
    // 根据当前type绑定事件
    function bind() {
        window.addEventListener("click", clickHandle);
        window.addEventListener("focus", focusHandle.focus, true);
        window.addEventListener("blur", focusHandle.blur, true);
        window.addEventListener("mousedown", mouseDown);
        window.addEventListener("mouseup", mouseUp);
        window.addEventListener("mousemove", mouseMove);
        window.addEventListener("touchstart", touchStart);
        window.addEventListener("contextmenu", contextMenuHandle.contextMenu);
        // 用于为focus添加标记, 标识是否是通过主动点击触发的focus
        window.addEventListener("mousedown", focusHandle.focusBeforeMark, true);
        window.addEventListener("touchstart", focusHandle.focusBeforeMark, true);
    }
    // 解绑事件
    function unbind() {
        window.removeEventListener("click", clickHandle);
        window.removeEventListener("focus", focusHandle.focus, true);
        window.removeEventListener("blur", focusHandle.blur, true);
        window.removeEventListener("mousedown", mouseDown);
        window.removeEventListener("mouseup", mouseUp);
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("touchstart", touchStart);
        window.removeEventListener("contextmenu", contextMenuHandle.contextMenu);
        window.removeEventListener("mousedown", focusHandle.focusBeforeMark, true);
        window.removeEventListener("touchstart", focusHandle.focusBeforeMark, true);
    }
    // touch后续事件需要绑定在触发的target上, 否则节点移除移除会导致事件中断
    function touchTrailingBind(startE) {
        startE.target.addEventListener("touchmove", touchMove);
        startE.target.addEventListener("touchend", touchEnd);
        startE.target.addEventListener("touchcancel", touchEnd);
    }
    function touchTrailingUnBind(endE) {
        endE.target.removeEventListener("touchmove", touchMove);
        endE.target.removeEventListener("touchend", touchEnd);
        endE.target.removeEventListener("touchcancel", touchEnd);
    }
    return {
        bind: bind,
        unbind: unbind,
        clickHandle: clickHandle,
        focusHandle: focusHandle,
        activeHandle: activeHandle,
        moveHandle: moveHandle,
        contextMenuHandle: contextMenuHandle,
        dragHandle: dragHandle
    };
}
