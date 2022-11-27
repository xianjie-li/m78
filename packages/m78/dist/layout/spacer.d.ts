import React from "react";
import { ComponentBasePropsWithAny } from "../common/index.js";
interface SpacerProps extends ComponentBasePropsWithAny {
    /** 宽度 */
    width?: number;
    /** 16 | 高度,  */
    height?: number;
    /** 如果子项传入一个列表，会在每一个子项间设置间距 */
    children?: React.ReactElement[];
}
/** pad space */
declare const _Spacer: {
    ({ width, height, children, ...props }: SpacerProps): any;
    displayName: string;
};
export { _Spacer };
//# sourceMappingURL=spacer.d.ts.map