import React, { type ReactElement } from "react";
import { type TriggerOption, type TriggerListener } from "../types.js";
import { type AnyObject } from "@m78/utils";
export interface TriggerProps extends Omit<TriggerOption, "handler" | "target"> {
    /** 事件处理程序 */
    onTrigger: TriggerListener;
    /** 事件目标元素, 其渲染结果必须是单个非文本的dom节点, 否则会导致事件监听点异常  */
    element?: ReactElement;
    /** 与element完全相同, 用于兼容react命名风格 */
    children?: ReactElement;
    /** trigger对应的dom节点的ref */
    innerRef?: React.Ref<HTMLElement | null>;
}
/** 通过hooks便捷的绑定trigger实例 */
export declare function useTrigger(props: TriggerProps): {
    node: React.JSX.Element | null;
    el: HTMLElement;
};
/** 通过组件的形式便捷的绑定trigger实例 */
export declare function Trigger(props: TriggerProps & AnyObject): React.JSX.Element | null;
export declare namespace Trigger {
    var displayName: string;
}
//# sourceMappingURL=trigger.d.ts.map