import React from "react";
import { IfProps, ToggleProps, SwitchProps, AsyncRenderProps } from "./types.js";
declare const _AsyncRender: React.FC<AsyncRenderProps>;
declare const _If: React.FC<IfProps>;
/**
 * 显示或隐藏内容
 *
 * 组件内部通过设置 display: 'none' 隐藏元素，如果子节点不是 ReactElement，会被包裹在一个 div 中
 *  */
declare const _Toggle: {
    ({ when, children }: ToggleProps): React.ReactElement;
    displayName: string;
};
declare const _Switch: React.FC<SwitchProps>;
export { _If, _Switch, _Toggle, _AsyncRender };
//# sourceMappingURL=fork.d.ts.map