import { TriggerType } from "./types.js";
import { _moveActiveImpl } from "./handle/move-active.js";
import { _clickImpl } from "./handle/click.js";
import { _focusImpl } from "./handle/focus.js";
import { _contextMenuImpl } from "./handle/context-menu.js";
import { _dragImpl } from "./handle/drag.js";
// event的核心实现部分
export function _eventImpl(ctx) {
    var mouseDown = function mouseDown(e) {
        if (hasRecentlyTouch()) return;
        if (!trigger.enable) return;
        var valid = dragHandle.start(e);
        valid && dragTrailingBind();
    };
    var mouseMove = function mouseMove(e) {
        if (hasRecentlyTouch()) return;
        if (!trigger.enable) return;
        moveActiveHandle.moveActive(e);
    };
    var mouseUp = function mouseUp() {
        if (hasRecentlyTouch()) return;
        if (!trigger.enable) return;
        lastMouseTime = Date.now();
    };
    var mouseDragMove = function mouseDragMove(e) {
        if (hasRecentlyTouch()) return;
        if (!trigger.enable) return;
        dragHandle.move(e);
    };
    var mouseDragUp = function mouseDragUp(e) {
        dragTrailingUnBind();
        if (hasRecentlyTouch()) return;
        if (!trigger.enable) return;
        lastMouseTime = Date.now();
        dragHandle.end(e);
    };
    var mouseLeave = function mouseLeave(e) {
        if (hasRecentlyTouch()) return;
        if (!trigger.enable) return;
        moveActiveHandle.clearMove(e);
        moveActiveHandle.clearActive(e);
    };
    var touchStart = function touchStart(e) {
        if (hasRecentlyMouse()) return;
        if (!trigger.enable) return;
        touchTrailingBind(e);
        dragHandle.start(e);
        contextMenuHandle.simulationStart(e);
    };
    var touchMove = function touchMove(e) {
        if (hasRecentlyMouse()) return;
        if (!trigger.enable) return;
        moveActiveHandle.moveActive(e);
        dragHandle.move(e);
        contextMenuHandle.simulationMove();
    };
    var touchEnd = function touchEnd(e) {
        touchTrailingUnBind(e);
        if (hasRecentlyMouse()) return;
        if (!trigger.enable) return;
        lastTouchTime = Date.now();
        moveActiveHandle.clearMove(e);
        moveActiveHandle.clearActive(e);
        dragHandle.end(e);
        contextMenuHandle.simulationEnd();
    };
    var hasRecentlyTouch = function hasRecentlyTouch() {
        return Date.now() - lastTouchTime < 50;
    };
    var hasRecentlyMouse = function hasRecentlyMouse() {
        return Date.now() - lastMouseTime < 50;
    };
    var bind = // 根据当前type绑定事件
    function bind() {
        var typeEnableMap = ctx.typeEnableMap;
        if (typeEnableMap[TriggerType.click]) {
            container.addEventListener("click", clickHandle);
        }
        if (typeEnableMap[TriggerType.focus]) {
            window.addEventListener("focus", focusHandle.focus, true);
            window.addEventListener("blur", focusHandle.blur, true);
        }
        if (typeEnableMap[TriggerType.active] || typeEnableMap[TriggerType.drag] || typeEnableMap[TriggerType.move] || typeEnableMap[TriggerType.contextMenu]) {
            container.addEventListener("mousedown", mouseDown);
            container.addEventListener("mouseup", mouseUp);
            container.addEventListener("mousemove", mouseMove);
            container.addEventListener("touchstart", touchStart);
        }
        if (typeEnableMap[TriggerType.active] || typeEnableMap[TriggerType.move]) {
            container.addEventListener("mouseleave", mouseLeave);
        }
        if (typeEnableMap[TriggerType.contextMenu]) {
            container.addEventListener("contextmenu", contextMenuHandle.contextMenu);
        }
        window.addEventListener("mousedown", focusHandle.focusBeforeMark, true);
        window.addEventListener("touchstart", focusHandle.focusBeforeMark, true);
    };
    var unbind = // 解绑事件
    function unbind() {
        container.removeEventListener("click", clickHandle);
        window.removeEventListener("focus", focusHandle.focus, true);
        window.removeEventListener("blur", focusHandle.blur, true);
        container.removeEventListener("mousedown", mouseDown);
        container.removeEventListener("mouseup", mouseUp);
        container.removeEventListener("mousemove", mouseMove);
        container.removeEventListener("mouseleave", mouseLeave);
        container.removeEventListener("touchstart", touchStart);
        container.removeEventListener("contextmenu", contextMenuHandle.contextMenu);
        window.removeEventListener("mousedown", focusHandle.focusBeforeMark, true);
        window.removeEventListener("touchstart", focusHandle.focusBeforeMark, true);
    };
    var touchTrailingBind = // touch后续事件需要绑定在触发的target上, 否则移除会导致事件中断
    function touchTrailingBind(startE) {
        startE.target.addEventListener("touchmove", touchMove);
        startE.target.addEventListener("touchend", touchEnd);
        startE.target.addEventListener("touchcancel", touchEnd);
    };
    var touchTrailingUnBind = function touchTrailingUnBind(endE) {
        endE.target.removeEventListener("touchmove", touchMove);
        endE.target.removeEventListener("touchend", touchEnd);
        endE.target.removeEventListener("touchcancel", touchEnd);
    };
    var dragTrailingBind = // 拖动后续事件绑定
    function dragTrailingBind() {
        window.addEventListener("mousemove", mouseDragMove);
        window.addEventListener("mouseup", mouseDragUp);
    };
    var dragTrailingUnBind = function dragTrailingUnBind() {
        window.removeEventListener("mousemove", mouseDragMove);
        window.removeEventListener("mouseup", mouseDragUp);
    };
    var container = ctx.container, trigger = ctx.trigger;
    var clickHandle = _clickImpl(ctx);
    var focusHandle = _focusImpl(ctx);
    var moveActiveHandle = _moveActiveImpl(ctx);
    var dragHandle = _dragImpl(ctx);
    var contextMenuHandle = _contextMenuImpl(ctx);
    // 标记touch/mouse事件是否正在触发
    // 在chrome devtool mobile模式中, 点击或按下一段时间都会触发mouse系列的事件, 需要标识阻止两者之前互相影响
    var lastTouchTime = 0;
    var lastMouseTime = 0;
    return {
        bind: bind,
        unbind: unbind,
        clickHandle: clickHandle,
        focusHandle: focusHandle,
        moveActiveHandle: moveActiveHandle,
        contextMenuHandle: contextMenuHandle,
        dragHandle: dragHandle
    };
}
