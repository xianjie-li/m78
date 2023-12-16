import { UseScrollMeta } from "@m78/hooks";
import React from "react";
import { _ScrollContext } from "./types.js";
/** 滚动条实现/汇总 */
export declare function _useBar(ctx: _ScrollContext): {
    refresh: () => void;
    onScroll: (meta: UseScrollMeta) => void;
    barNode: React.JSX.Element;
    /** 设置到滚动容器, 主要用于滚动条占用容器位置的浏览器去掉滚动条位置 */
    offsetStyle: {
        bottom: string;
        right: string;
    };
};
interface _BarImplOption {
    isY: boolean;
    /** 触发滚动条延迟隐藏 */
    delayHidden: (delay?: number) => void;
}
/** 单个滚动条实现, isY用于 */
export declare function _useBarImpl(ctx: _ScrollContext, { isY, delayHidden }: _BarImplOption): {
    barNode: React.JSX.Element;
    refreshScrollPosition: (offsetRatio?: number) => void;
    refresh: () => void;
};
export type _UseBarReturns = ReturnType<typeof _useBar>;
export {};
//# sourceMappingURL=use-bar.d.ts.map