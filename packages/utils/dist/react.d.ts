import { AnyFunction } from "./types.js";
/**
 * 便捷的按键和点击事件绑定
 * @param handle - 时间处理函数
 * @param spaceTrigger - 按下空格时是否触发
 * */
export declare function keypressAndClick(handle: AnyFunction, spaceTrigger?: boolean): {
    onClick: AnyFunction;
    onKeyPress: (e: any) => void;
};
//# sourceMappingURL=react.d.ts.map