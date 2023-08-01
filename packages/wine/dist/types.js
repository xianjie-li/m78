import React from "react";
export var WineBound;
(function(WineBound) {
    WineBound[/** 窗口范围内 */ "window"] = "window";
    WineBound[/** 安全区域内, 确保不会因为误操作导致无法拖动 */ "safeArea"] = "safeArea";
    WineBound[/** 不限制 */ "noLimit"] = "noLimit";
})(WineBound || (WineBound = {}));
export var WineDragPosition;
(function(WineDragPosition) {
    WineDragPosition[WineDragPosition["L"] = 0] = "L";
    WineDragPosition[WineDragPosition["T"] = 1] = "T";
    WineDragPosition[WineDragPosition["R"] = 2] = "R";
    WineDragPosition[WineDragPosition["B"] = 3] = "B";
    WineDragPosition[WineDragPosition["LT"] = 4] = "LT";
    WineDragPosition[WineDragPosition["RT"] = 5] = "RT";
    WineDragPosition[WineDragPosition["RB"] = 6] = "RB";
    WineDragPosition[WineDragPosition["LB"] = 7] = "LB";
})(WineDragPosition || (WineDragPosition = {}));
