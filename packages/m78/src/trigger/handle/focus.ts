import { _TriggerContext, _TriggerTargetData, TriggerType } from "../types.js";
import { _buildEvent } from "../methods.js";
import { triggerClearEvent } from "../common.js";

export function _focusImpl(ctx: _TriggerContext) {
  const { trigger, config } = ctx;

  // 最后进行mousedown/touchstart的时间
  let lastDownTime = 0;

  function focus(e: FocusEvent) {
    if (e.target === window) return;
    if (!ctx.typeEnableMap[TriggerType.focus]) return;
    if (config.preCheck && !config.preCheck(TriggerType.focus, e)) return;

    const focusList = ctx.targetList.filter((i) => {
      if (i.isBound) return false;

      // 子级或自身聚焦时, 都视为focus
      return i.dom.contains(e.target as Node);
    });

    ctx.currentFocus = focusList;

    const _isInteractiveFocus = isInteractiveFocus();

    focusList.forEach((i) => {
      const event = _buildEvent({
        type: TriggerType.focus,
        target: i.origin,
        nativeEvent: e,
        focus: true,
        isInteractiveFocus: _isInteractiveFocus,
        data: i.meta.data,
      });

      trigger.event.emit(event);
    });
  }

  function blur(e: FocusEvent) {
    if (e.target === window) return;
    if (!ctx.typeEnableMap[TriggerType.focus]) return;
    if (config.preCheck && !config.preCheck(TriggerType.focus, e)) return;

    const blurList: _TriggerTargetData[] = [];
    const focusList: _TriggerTargetData[] = [];

    ctx.currentFocus.forEach((i) => {
      if (!i.dom.contains(e.target as Node)) {
        focusList.push(i);
        return;
      }

      blurList.push(i);
    });

    ctx.currentFocus = focusList;

    const _isInteractiveFocus = isInteractiveFocus();

    blurList.forEach((i) => {
      const event = _buildEvent({
        type: TriggerType.focus,
        target: i.origin,
        nativeEvent: e,
        focus: false,
        first: false,
        last: true,
        isInteractiveFocus: _isInteractiveFocus,
        data: i.meta.data,
      });

      trigger.event.emit(event);
    });
  }

  // 通过mousedown/touchstart,进行focus标记, 帮助区分是点击触发还是通过键盘触发
  function focusBeforeMark() {
    lastDownTime = Date.now();
  }

  // 检测是通过点击还是通过键盘或命令式出发
  function isInteractiveFocus() {
    return Date.now() - lastDownTime < 20;
  }

  // 清理所有未关闭的focus事件, 并进行通知
  function clear() {
    const _isInteractiveFocus = isInteractiveFocus();

    ctx.currentFocus.forEach((i) => {
      const event = _buildEvent({
        type: TriggerType.focus,
        target: i.origin,
        nativeEvent: triggerClearEvent,
        focus: false,
        first: false,
        last: true,
        isInteractiveFocus: _isInteractiveFocus,
        data: i.meta.data,
      });

      trigger.event.emit(event);
    });

    ctx.currentFocus = [];
  }

  return {
    focus,
    blur,
    focusBeforeMark,
    isInteractiveFocus,
    clear,
  };
}
