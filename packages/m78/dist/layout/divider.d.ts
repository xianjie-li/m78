import React from "react";
import { ComponentBaseProps } from "../common/index.js";
interface DividerProps extends ComponentBaseProps {
    /** false | 是否为垂直分割线 */
    vertical?: boolean;
    /** 分割线厚度 */
    size?: number;
    /** 颜色 */
    color?: string;
    /** 12 | 间距 */
    margin?: number;
    /** 放置于分割线内的文本 */
    children?: React.ReactNode;
    /** 传入children时, 控制其对齐位置 */
    align?: "start" | "center" | "end";
}
export declare const _Divider: {
    ({ vertical, color, margin, children, style, className, align, size, }: DividerProps): React.JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=divider.d.ts.map