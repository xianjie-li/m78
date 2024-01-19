import React from "react";
export var BubbleType;
(function(BubbleType) {
    /** 简单的文本提示 */ BubbleType["tooltip"] = "tooltip";
    /** 展示一些稍微复杂内容 */ BubbleType["popper"] = "popper";
    /** 进行快捷询问 */ BubbleType["confirm"] = "confirm";
})(BubbleType || (BubbleType = {}));
/** 应从Overlay中移除的props */ export var omitBubbleOverlayProps = [
    "xy",
    "alignment"
];
