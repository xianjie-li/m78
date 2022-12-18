import { usePrev, UseTriggerType, useUpdateEffect } from "@m78/hooks";
import { ensureArray } from "@m78/utils";
/**
 * 对triggerType从click -> active变更做一下特殊处理
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
        var prevHasClick = prev.type.includes(UseTriggerType.click);
        var currentHasActive = typeArray.includes(UseTriggerType.active);
        // 标记需要再内容区失焦后关闭
        if (prevHasClick && currentHasActive) {
            self.shouldCloseFlag = true;
            console.log("change");
        }
    }, [
        triggerTypeString
    ]);
}
