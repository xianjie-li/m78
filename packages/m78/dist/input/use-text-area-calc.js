import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useEffect, useRef, useState } from "react";
import { isString } from "@m78/utils";
/** textArea相关逻辑 */ export function _useTextAreaCalc(ctx) {
    /** textarea的高度 用于设置了autoSize时动态调整高度 */ var _useState = _sliced_to_array(useState(0), 2), textAreaHeight = _useState[0], setTextAreaHeight = _useState[1];
    /* 实现textarea autoSize */ var cloneText = useRef();
    /* 实现textarea autoSize */ useEffect(function() {
        if (ctx.textArea && ctx.autoSize) {
            cloneText.current = ctx.inputRef.current.cloneNode();
            cloneText.current.style.position = "absolute";
            cloneText.current.style.visibility = "hidden";
            var parent = ctx.inputRef.current.parentNode;
            if (parent) {
                parent.appendChild(cloneText.current);
            }
            calcTextHeight();
        }
    }, []);
    function calcTextHeight(val) {
        if (!ctx.textArea || !ctx.autoSize || !cloneText.current) return;
        cloneText.current.value = isString(val) ? val : ctx.value;
        var h = cloneText.current.scrollHeight;
        var diff = textAreaHeight - h;
        // 防止输入时出现异常抖动
        if (Math.abs(diff) < 5) return;
        setTextAreaHeight(h);
    }
    return [
        textAreaHeight,
        calcTextHeight
    ];
}
