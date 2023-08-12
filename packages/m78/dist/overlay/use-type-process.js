import { usePrev, useUpdateEffect } from "@m78/hooks";
import { ensureArray } from "@m78/utils";
import { TriggerType } from "../trigger/index.js";
/**
 * 对triggerType从其他类型变更为active的情况进行特殊处理
 *
 * - 主要是让overlay能更方便的实现嵌套菜单(事件需要通过click打开, 然后切换为active, 具体可见menu组件)
 * */ export function _useTypeProcess(ctx) {
    var self = ctx.self, props = ctx.props;
    var typeArray = ensureArray(props.triggerType);
    var triggerTypeString = typeArray.join("");
    var prev = usePrev({
        type: typeArray
    });
    useUpdateEffect(function() {
        if (!prev) return;
        var prevHasActive = prev.type.includes(TriggerType.active);
        var currentHasActive = typeArray.includes(TriggerType.active);
        // 标记需要在内容区失焦后关闭
        if (!prevHasActive && currentHasActive) {
            self.shouldCloseFlag = true;
        }
    }, [
        triggerTypeString
    ]);
}
