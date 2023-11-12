import { OverlayProps } from "../overlay/index.js";
import { PositionUnion } from "../common/index.js";
import React from "react";
/** 应从Overlay中移除的props */
export declare const omitDrawerOverlayProps: readonly ["xy", "alignment", "target", "childrenAsTarget", "offset", "direction", "arrow", "arrowSize", "arrowProps", "transitionType"];
/** 应从Overlay中移除的props */
export type DrawerOmitOverlayKeys = typeof omitDrawerOverlayProps[number];
export type DrawerOmitOverlayProps = Omit<OverlayProps, DrawerOmitOverlayKeys>;
/**
 * DrawerProps 剔除了部分 OverlayProps
 * */
export interface DrawerProps extends DrawerOmitOverlayProps {
    /** 'bottom' | 出现位置 */
    position?: PositionUnion;
    /** 头部内容, 固定在最顶部 */
    header?: React.ReactNode;
    /** 底部内容, 固定在最底部 */
    footer?: React.ReactNode;
}
//# sourceMappingURL=types.d.ts.map