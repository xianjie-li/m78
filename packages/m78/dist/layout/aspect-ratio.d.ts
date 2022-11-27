import React from "react";
import { ComponentBasePropsWithAny } from "../common/index.js";
interface AspectRatioProps extends ComponentBasePropsWithAny {
    /** 1 | 网格项的宽高比 */
    ratio?: number;
    /** 内容 */
    children?: React.ReactNode;
}
export declare const _AspectRatio: {
    ({ ratio, children, className, style, ...props }: AspectRatioProps): JSX.Element;
    displayName: string;
};
export {};
//# sourceMappingURL=aspect-ratio.d.ts.map