export var TriggerOverrideStrategy;
(function(TriggerOverrideStrategy) {
    /** 持久事件的独占权, 若存在多个possess事件, 取最后注册的 */ TriggerOverrideStrategy[TriggerOverrideStrategy["possess"] = 0] = "possess";
    /** 跳过当前事件, 转移执行权 */ TriggerOverrideStrategy[TriggerOverrideStrategy["transfer"] = 1] = "transfer";
    /** 允许和其他非possess事件并行执行 */ TriggerOverrideStrategy[TriggerOverrideStrategy["parallel"] = 2] = "parallel";
})(TriggerOverrideStrategy || (TriggerOverrideStrategy = {}));
export var TriggerType;
(function(TriggerType) {
    /** 点击 */ TriggerType["click"] = "click";
    /**
   * 根据不同的事件源, 触发方式不同:
   * - 支持光标的设备, 在鼠标移动到上方时触发
   * - 支持touch的设备, 短暂按住后触发, 与contextMenu在触控设备下触发方式相同, 区别是active会在松开手指后关闭
   * */ TriggerType["active"] = "active";
    /** 获取焦点和失去焦点, 仅dom类型的target有效 */ TriggerType["focus"] = "focus";
    /**
   * 根据不同的事件源, 触发方式不同:
   * - 支持光标的设备表现为右键点击
   * - 支持touch的设备, 短暂按住后触发, 与active在触控设备下触发方式相同, 区别是active会在松开手指后关闭
   * */ TriggerType["contextMenu"] = "contextMenu";
    /** 光标或触摸点在目标上方移动 */ TriggerType["move"] = "move";
    /** 对目标进行拖动 */ TriggerType["drag"] = "drag";
})(TriggerType || (TriggerType = {}));
