import { _TriggerContext, TriggerTargetData, TriggerType } from "../types.js";
import { _buildEvent } from "../methods.js";

export function _focusImpl(ctx: _TriggerContext) {
  // 最后进行mousedown/touchstart的时间
  let lastDownTime = 0;

  let currentFocus: TriggerTargetData[] = [];

  function focus(e: FocusEvent) {
    if (e.target === window) return;

    const { eventList } = ctx.getEventList({
      type: TriggerType.focus,
      filter: (i) => {
        if (i.isVirtual) return false;

        // 子级或自身聚焦时, 都视为focus
        return i.dom.contains(e.target as Node);
      },
    });

    currentFocus = eventList;

    const _isTapFocus = isTapFocus();

    eventList.forEach((i) => {
      const event = _buildEvent({
        type: TriggerType.focus,
        target: i.option,
        nativeEvent: e,
        focus: true,
        isTapFocus: _isTapFocus,
        data: i.option.data,
        eventMeta: i,
      });

      ctx.handleEvent(event);
      i.option.handler(event);
    });
  }

  function blur(e: FocusEvent) {
    if (e.target === window) return;

    if (!currentFocus.length) return;

    // 需要保留的focus
    const blurList: TriggerTargetData[] = [];
    // 需要移除的focus
    const focusList: TriggerTargetData[] = [];

    currentFocus.forEach((i) => {
      // 保留仍在focus内部的节点
      if (!i.dom.contains(e.target as Node)) {
        focusList.push(i);
        return;
      }

      // 其他节点失焦
      blurList.push(i);
    });

    currentFocus = focusList;

    const _isTapFocus = isTapFocus();

    blurList.forEach((i) => {
      const event = _buildEvent({
        type: TriggerType.focus,
        target: i.option,
        nativeEvent: e,
        focus: false,
        first: false,
        last: true,
        isTapFocus: _isTapFocus,
        data: i.option.data,
        eventMeta: i,
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
    const _isTapFocus = isTapFocus();

    currentFocus.forEach((i) => {
      const event = _buildEvent({
        type: TriggerType.focus,
        target: i.option,
        nativeEvent: new Event("M78_FOCUS_CLEAR"),
        focus: false,
        first: false,
        last: true,
        isTapFocus: _isTapFocus,
        data: i.option.data,
        eventMeta: ctx.getDataByOption(i.option), // data可能已失效, 需要重新获取
      });

      ctx.handleEvent(event);
      i.option.handler(event);
    });

    currentFocus = [];
  }

  return {
    focus,
    blur,
    focusBeforeMark,
    clear,
  };
}
