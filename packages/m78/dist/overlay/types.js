import React from "react";
/** 在使用api调用时所有应该剔除的props */ export var omitApiProps = [
    "defaultOpen",
    "open",
    "onChange",
    "children",
    "childrenAsTarget",
    "triggerType",
    "onUpdate",
    "onDispose",
    "innerRef",
    "instanceRef"
];
export var OverlayDirection;
(function(OverlayDirection) {
    OverlayDirection["topStart"] = "topStart";
    OverlayDirection["top"] = "top";
    OverlayDirection["topEnd"] = "topEnd";
    OverlayDirection["leftStart"] = "leftStart";
    OverlayDirection["left"] = "left";
    OverlayDirection["leftEnd"] = "leftEnd";
    OverlayDirection["bottomStart"] = "bottomStart";
    OverlayDirection["bottom"] = "bottom";
    OverlayDirection["bottomEnd"] = "bottomEnd";
    OverlayDirection["rightStart"] = "rightStart";
    OverlayDirection["right"] = "right";
    OverlayDirection["rightEnd"] = "rightEnd";
})(OverlayDirection || (OverlayDirection = {}));
export var OverlayUpdateType;
(function(OverlayUpdateType) {
    OverlayUpdateType[OverlayUpdateType["xy"] = 0] = "xy";
    OverlayUpdateType[OverlayUpdateType["alignment"] = 1] = "alignment";
    OverlayUpdateType[OverlayUpdateType["target"] = 2] = "target";
})(OverlayUpdateType || (OverlayUpdateType = {}));
