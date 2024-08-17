import { _createLimitTrigger, _longPressDelay } from "./common.js";
import { _activeImpl } from "./handle/active.js";
import { _clickImpl } from "./handle/click.js";
import { _contextMenuImpl } from "./handle/context-menu.js";
import { _dragImpl } from "./handle/drag.js";
import { _focusImpl } from "./handle/focus.js";
import { _moveImpl } from "./handle/move.js";
import { _TriggerContext } from "./types.js";

// event的核心实现部分
export function _eventImpl(ctx: _TriggerContext) {
  const { trigger } = ctx;

  const clickHandle = _clickImpl(ctx);
  const focusHandle = _focusImpl(ctx);
  const activeHandle = _activeImpl(ctx);
  const moveHandle = _moveImpl(ctx);
  const dragHandle = _dragImpl(ctx);
  const contextMenuHandle = _contextMenuImpl(ctx);

  const moveLimitTrigger = _createLimitTrigger();
  const activeLimitTrigger = _createLimitTrigger();

  // 在开发时的chrome devtool mobile模式中, 点击或按下一段时间都会触发mouse系列的事件, 需要标识阻止两者之前互相影响
  let lastTouchTime = 0;
  let lastMouseTime = 0;

  // longpress计时器
  let longPressTimer: any;

  function mouseDown(e: MouseEvent) {
    lastMouseTime = e.timeStamp;

    if (hasRecentlyTouch(e)) return;
    if (!trigger.enable) return;

    // 仅左键点击进行标记
    if (e.button === 0) {
      dragHandle.startMark(e);
    }
  }

  function mouseMove(e: MouseEvent) {
    lastMouseTime = e.timeStamp;

    if (hasRecentlyTouch(e)) return;
    if (!trigger.enable) return;

    moveLimitTrigger(
      // 有move项触发时, 取消节流, 实时触发
      !moveHandle.hasTrigger(),
      e,
      () => moveHandle.trigger(e)
    );

    activeLimitTrigger(true, e, () => activeHandle.trigger(e));

    dragHandle.dragTrigger(e);
  }

  function mouseUp(e: MouseEvent) {
    lastMouseTime = e.timeStamp;

    if (hasRecentlyTouch(e)) return;
    if (!trigger.enable) return;

    dragHandle.end(e);
  }

  function touchStart(e: TouchEvent) {
    lastTouchTime = e.timeStamp;

    if (hasRecentlyMouse(e)) return;
    if (!trigger.enable) return;

    touchTrailingBind(e);

    longPressTimer = setTimeout(() => longPress(e), _longPressDelay);

    dragHandle.startMark(e);
  }

  function touchMove(e: TouchEvent) {
    lastTouchTime = e.timeStamp;

    if (hasRecentlyMouse(e)) return;
    if (!trigger.enable) return;

    if (longPressTimer) clearTimeout(longPressTimer);

    moveHandle.trigger(e);

    dragHandle.dragTrigger(e);
  }

  function touchEnd(e: TouchEvent) {
    lastTouchTime = e.timeStamp;

    touchTrailingUnBind(e);

    if (hasRecentlyMouse(e)) return;
    if (!trigger.enable) return;

    if (longPressTimer) clearTimeout(longPressTimer);

    moveHandle.trigger(e);

    activeHandle.clear(e);

    dragHandle.end(e);
  }

  function hasRecentlyTouch(e: Event) {
    return e.timeStamp - lastTouchTime < 50;
  }

  function hasRecentlyMouse(e: Event) {
    return e.timeStamp - lastMouseTime < 50;
  }

  function longPress(e: TouchEvent) {
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

  return {
    bind,
    unbind,
    clickHandle,
    focusHandle,
    activeHandle,
    moveHandle,
    contextMenuHandle,
    dragHandle,
  };
}
