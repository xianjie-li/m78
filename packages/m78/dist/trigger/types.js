export var TriggerType;
(function(TriggerType) {
    TriggerType[/** 点击 */ "click"] = "click";
    TriggerType[/**
   * 根据不同的事件源, 触发方式不同:
   * - 支持光标的设备, 在鼠标悬浮时触发
   * - 支持touch的设备, 按住并轻微移动后触发
   *
   * 默认在开始和结束都包含了短暂的延迟, 开始延迟在某些提示类组件快速划过时可以避免触发, 结束延迟可以在气泡渲染等场景下在鼠标移动到内容区前避免关闭
   * */ "active"] = "active";
    TriggerType[/** 获取焦点和失去焦点, 仅dom类型的target有效 */ "focus"] = "focus";
    TriggerType[/** 通常是鼠标的右键点击, 在移动设备按下一段时间后触发 */ "contextMenu"] = "contextMenu";
    TriggerType[/** 光标或触摸点在目标上方移动 */ "move"] = "move";
    TriggerType[/** 目标拖动 */ "drag"] = "drag";
})(TriggerType || (TriggerType = {}));
