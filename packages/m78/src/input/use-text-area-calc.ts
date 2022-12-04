import { useEffect, useRef, useState } from "react";
import { isString } from "@m78/utils";
import { _InputContext } from "./types.js";

/** textArea相关逻辑 */
export function _useTextAreaCalc(ctx: _InputContext) {
  /** textarea的高度 用于设置了autoSize时动态调整高度 */
  const [textAreaHeight, setTextAreaHeight] = useState(0);

  /* 实现textarea autoSize */
  const cloneText = useRef<any>();

  /* 实现textarea autoSize */
  useEffect(() => {
    if (ctx.textArea && ctx.autoSize) {
      cloneText.current = ctx.inputRef!.current.cloneNode();
      cloneText.current.style.position = "absolute";
      cloneText.current.style.visibility = "hidden";

      const parent = ctx.inputRef!.current.parentNode;

      if (parent) {
        parent.appendChild(cloneText.current);
      }

      calcTextHeight();
    }
  }, []);

  function calcTextHeight(val?: string) {
    if (!ctx.textArea || !ctx.autoSize || !cloneText.current) return;
    cloneText.current.value = isString(val) ? val : ctx.value;

    const h = cloneText.current.scrollHeight;

    const diff = textAreaHeight - h;

    // 防止输入时出现异常抖动
    if (Math.abs(diff) < 5) return;

    setTextAreaHeight(h);
  }

  return [textAreaHeight, calcTextHeight] as const;
}
