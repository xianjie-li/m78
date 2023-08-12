import { _TriggerContext, TriggerType } from "./types.js";
import { _moveActiveImpl } from "./handle/move-active.js";
import { _clickImpl } from "./handle/click.js";
import { _focusImpl } from "./handle/focus.js";
import { _contextMenuImpl } from "./handle/context-menu.js";
import { _dragImpl } from "./handle/drag.js";

// event的核心实现部分
export function _eventImpl(ctx: _TriggerContext) {
  const { container, trigger } = ctx;

  const clickHandle = _clickImpl(ctx);
  const focusHandle = _focusImpl(ctx);
  const moveActiveHandle = _moveActiveImpl(ctx);
  const dragHandle = _dragImpl(ctx);
  const contextMenuHandle = _contextMenuImpl(ctx);

  // 标记touch/mouse事件是否正在触发
  // 在chrome devtool mobile模式中, 点击或按下一段时间都会触发mouse系列的事件, 需要标识阻止两者之前互相影响
  let lastTouchTime = 0;
  let lastMouseTime = 0;

  function mouseDown(e: MouseEvent) {
    if (hasRecentlyTouch()) return;
    if (!trigger.enable) return;
    const valid = dragHandle.start(e);

    valid && dragTrailingBind();
  }

  function mouseMove(e: MouseEvent) {
    if (hasRecentlyTouch()) return;
    if (!trigger.enable) return;

    moveActiveHandle.moveActive(e);
  }

  function mouseUp() {
    if (hasRecentlyTouch()) return;
    if (!trigger.enable) return;

    lastMouseTime = Date.now();
  }

  function mouseDragMove(e: MouseEvent) {
    if (hasRecentlyTouch()) return;
    if (!trigger.enable) return;

    dragHandle.move(e);
  }

  function mouseDragUp(e: MouseEvent) {
    dragTrailingUnBind();

    if (hasRecentlyTouch()) return;
    if (!trigger.enable) return;

    lastMouseTime = Date.now();
    dragHandle.end(e);
  }

  function mouseLeave(e: MouseEvent) {
    if (hasRecentlyTouch()) return;
    if (!trigger.enable) return;

    moveActiveHandle.moveActive(e);
  }

  function touchStart(e: TouchEvent) {
    if (hasRecentlyMouse()) return;
    if (!trigger.enable) return;

    touchTrailingBind(e);
    dragHandle.start(e);
    contextMenuHandle.simulationStart(e);
  }

  function touchMove(e: TouchEvent) {
    if (hasRecentlyMouse()) return;
    if (!trigger.enable) return;

    moveActiveHandle.moveActive(e);
    dragHandle.move(e);
    contextMenuHandle.simulationMove();
  }

  function touchEnd(e: TouchEvent) {
    touchTrailingUnBind(e);

    if (hasRecentlyMouse()) return;
    if (!trigger.enable) return;

    lastTouchTime = Date.now();

    moveActiveHandle.clearMove(e);
    moveActiveHandle.clearActive(e);
    dragHandle.end(e);
    contextMenuHandle.simulationEnd();
  }

  function hasRecentlyTouch() {
    return Date.now() - lastTouchTime < 50;
  }

  function hasRecentlyMouse() {
    return Date.now() - lastMouseTime < 50;
  }

  // 根据当前type绑定事件
  function bind() {
    const typeEnableMap = ctx.typeEnableMap;

    if (typeEnableMap[TriggerType.click]) {
      container.addEventListener("click", clickHandle);
    }

    if (typeEnableMap[TriggerType.focus]) {
      window.addEventListener("focus", focusHandle.focus, true);
      window.addEventListener("blur", focusHandle.blur, true);
    }

    if (
      typeEnableMap[TriggerType.active] ||
      typeEnableMap[TriggerType.drag] ||
      typeEnableMap[TriggerType.move] ||
      typeEnableMap[TriggerType.contextMenu]
    ) {
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
  }

  // 解绑事件
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
  }

  // touch后续事件需要绑定在触发的target上, 否则移除会导致事件中断
  function touchTrailingBind(startE: TouchEvent) {
    startE.target!.addEventListener("touchmove", touchMove as any);
    startE.target!.addEventListener("touchend", touchEnd as any);
    startE.target!.addEventListener("touchcancel", touchEnd as any);
  }

  function touchTrailingUnBind(endE: TouchEvent) {
    endE.target!.removeEventListener("touchmove", touchMove as any);
    endE.target!.removeEventListener("touchend", touchEnd as any);
    endE.target!.removeEventListener("touchcancel", touchEnd as any);
  }

  // 拖动后续事件绑定
  function dragTrailingBind() {
    window.addEventListener("mousemove", mouseDragMove);
    window.addEventListener("mouseup", mouseDragUp);
  }

  function dragTrailingUnBind() {
    window.removeEventListener("mousemove", mouseDragMove);
    window.removeEventListener("mouseup", mouseDragUp);
  }

  return {
    bind,
    unbind,
    clickHandle,
    focusHandle,
    moveActiveHandle,
    contextMenuHandle,
    dragHandle,
  };
}
