import React from "react";
import { DIVProps } from "../common/index.js";
/** flex wrap */
export interface FlexWrapProps extends DIVProps {
    /** 'start' | 主轴对齐方式 */
    mainAlign?: "center" | "start" | "end" | "around" | "between" | "evenly";
    /** 'start' | 交叉轴对齐方式 */
    crossAlign?: "stretch" | "start" | "end" | "center";
    /** 内容 */
    children: React.ReactNode | React.ReactNode[];
    /** 指向内部包裹dom的ref */
    innerRef?: React.Ref<HTMLDivElement>;
}
/** flex */
export interface FlexProps extends DIVProps {
    /** 1 | 弹性系数 */
    flex?: number | string;
    /** 排序 */
    order?: number;
    /** 单独设置在容器交叉轴上的对齐方式  */
    align?: FlexWrapProps["crossAlign"];
    /** 内容 */
    children?: React.ReactNode;
    /** 指向内部包裹dom的ref */
    innerRef?: React.Ref<HTMLDivElement>;
}
/** tile props */
export interface TileProps extends Omit<DIVProps, "title"> {
    /** 主要内容 */
    title?: React.ReactNode;
    /** title的别名 */
    children?: React.ReactNode;
    /** 次要内容 */
    desc?: React.ReactNode;
    /** 前导内容 */
    leading?: React.ReactNode;
    /** 尾随内容 */
    trailing?: React.ReactNode;
    /** 纵轴的对齐方式 */
    crossAlign?: FlexWrapProps["crossAlign"];
    /** 指向内部包裹dom的ref */
    innerRef?: React.Ref<HTMLDivElement>;
    /** 内容区域超出是否显示, 默认为隐藏, 以适应更多的场景 */
    overflowVisible?: boolean;
}
//# sourceMappingURL=types.d.ts.map