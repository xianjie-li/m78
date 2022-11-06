import { AnyFunction } from "./types";

/**
 * 便捷的按键和点击事件绑定
 * @param handle - 时间处理函数
 * @param spaceTrigger - 按下空格时是否触发
 * */
export function keypressAndClick(handle: AnyFunction, spaceTrigger = true) {
  return {
    onClick: handle,
    onKeyPress: (e: any) => {
      const code = e.code;

      if (code === "Enter" || (spaceTrigger && code === "Space")) {
        handle?.();
      }
    },
  };
}
