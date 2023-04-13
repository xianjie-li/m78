import { _OverlayContext } from "./types.js";
import { usePrev, UseTriggerType, useUpdateEffect } from "@m78/hooks";
import { ensureArray } from "@m78/utils";

/**
 * 对triggerType从其他类型变更为active的情况进行特殊处理
 * - 主要是让overlay能更方便的实现嵌套菜单(事件需要通过click打开, 然后切换为active, 具体可见menu组件)
 * */
export function _useTypeProcess(ctx: _OverlayContext) {
  const { self, props } = ctx;

  const typeArray = ensureArray(props.triggerType);

  const triggerTypeString = typeArray.join("");

  const prev = usePrev({
    type: typeArray,
  });

  useUpdateEffect(() => {
    if (!prev) return;

    const prevHasActive = prev.type.includes(UseTriggerType.active);
    const currentHasActive = typeArray.includes(UseTriggerType.active);

    // 标记需要在内容区失焦后关闭
    if (!prevHasActive && currentHasActive) {
      self.shouldCloseFlag = true;
    }
  }, [triggerTypeString]);
}
