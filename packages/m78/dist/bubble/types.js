import React from "react";
export var BubbleType;
(function(BubbleType) {
    BubbleType[/** 简单的文本提示 */ "tooltip"] = "tooltip";
    BubbleType[/** 展示一些稍微复杂内容 */ "popper"] = "popper";
    BubbleType[/** 进行快捷询问 */ "confirm"] = "confirm";
})(BubbleType || (BubbleType = {}));
/** 应从Overlay中移除的props */ export var omitBubbleOverlayProps = [
    "xy",
    "alignment"
];
