import { _TriggerContext } from "./types.js";

// 实例操作
export function _actionImpl(ctx: _TriggerContext) {
  const { trigger } = ctx;

  Object.defineProperties(trigger, {
    running: {
      get() {
        return trigger.dragging || trigger.activating || trigger.moving;
      },
    },
    enable: {
      get: getEnable,
      set: setEnable,
    },
  });

  let _enable = true;

  function getEnable(): boolean {
    return _enable;
  }

  function setEnable(enable: boolean) {
    const prev = _enable;

    _enable = enable;

    // 关闭时, 清理所有未完成事件
    if (prev && !enable) {
      ctx.clear();
    }
  }
}
