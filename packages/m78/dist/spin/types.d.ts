import React from "react";
import { FullSizeKeys, FullSize, ComponentBaseProps } from "../common/index.js";
export interface SpinProps extends ComponentBaseProps {
    /** true | 是否显示加载状态 */
    open?: boolean;
    /** 大小 */
    size?: FullSize | FullSizeKeys;
    /**  提示文本 */
    text?: React.ReactNode;
    /** 将text和加载指示器内联对齐*/
    inline?: boolean;
    /** 使spin充满父元素(需要父元素是`position: static`以外的定位元素) */
    full?: boolean;
    /** 开启了full时, 使用此项调整指示器在容器y轴的位置, 取值与常规css单位一致: 30, 30px, 30% */
    offset?: number | string;
    /** 300 | 每次出现的最小持续时间, 防止loading一闪而过 */
    minDuration?: number;
}
//# sourceMappingURL=types.d.ts.map