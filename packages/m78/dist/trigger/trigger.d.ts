import React, { ReactElement } from "react";
import { TriggerConfig, TriggerEvent, TriggerType } from "./types.js";
import { AnyObject } from "@m78/utils";
export interface UseTriggerProps {
    /** 需要绑定的事件类型 */
    type: TriggerType | TriggerType[];
    /** 事件目标元素, 其渲染结果必须是单个dom节点, 文本或多个dom会导致事件监听异常 */
    element?: ReactElement;
    /** 触发回调 */
    onTrigger?: (e: TriggerEvent) => void;
    /** 控制事件项的active事件行为 */
    active?: TriggerConfig["active"];
    /** trigger对应的dom节点的ref */
    innerRef?: React.Ref<HTMLElement | null>;
    /** 传入时, 会以该key创建单独创建一个trigger实例, 相同key的trigger会共用一个实例, 默认情况下, 会使用内部的默认实例 */
    instanceKey?: string;
}
export interface TriggerProps extends Omit<UseTriggerProps, "element"> {
    /** 事件目标元素, 其渲染结果必须是单个dom节点, 文本或多个dom会导致事件监听异常 */
    children: UseTriggerProps["element"];
}
/** 通过hooks便捷的绑定trigger实例, 未识别的props会传递到事件对象的context属性 */
export declare function _useTrigger(props: UseTriggerProps & AnyObject): {
    node: JSX.Element;
    el: HTMLElement;
};
/** 通过组件便捷的绑定trigger实例, 未识别的props会传递到事件对象的context属性 */
export declare function _Trigger(props: TriggerProps & AnyObject): JSX.Element;
export declare namespace _Trigger {
    var displayName: string;
}
//# sourceMappingURL=trigger.d.ts.map