import React from "react";
import { SizeUnion } from "../common/index.js";
export declare enum ButtonColor {
    blue = "blue",
    red = "red",
    green = "green",
    orange = "orange",
    second = "second",
    primary = "primary"
}
export type ButtonColorKeys = keyof typeof ButtonColor;
export type ButtonColorUnion = ButtonColor | ButtonColorKeys;
export interface ButtonProps {
    /** 按钮颜色 */
    color?: ButtonColorUnion;
    /** 尺寸 */
    size?: SizeUnion;
    /** 圆形按钮 */
    circle?: boolean;
    /** 边框按钮 */
    outline?: boolean;
    /** 块级按钮 */
    block?: boolean;
    /** icon按钮, children可以是Icon或文字 */
    icon?: boolean;
    /** 方型按钮图标, 相比icon减少了实际占用空间, 适合在一些布局空间紧凑的地方使用 */
    squareIcon?: boolean;
    text?: boolean;
    /** 设置禁用状态 */
    disabled?: boolean;
    /** 设置加载状态 */
    loading?: boolean;
    /** 指向内部button的ref */
    innerRef?: React.Ref<HTMLButtonElement>;
    /** 代理onClick, 若onClick事件返回了一个promise like对象, 则自动添加loading状态 */
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}
/** 剔除内部占用属性的原生按钮props */
type HTMLBtnOmit = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["button"]>, "color" | "onClick">;
/** 剔除内部占用属性的原生html link props */
type HTMLLinkOmit = Omit<React.PropsWithoutRef<JSX.IntrinsicElements["a"]>, "color" | "type" | "onClick">;
export interface ButtonPropsWithHTMLButton extends HTMLBtnOmit, ButtonProps {
}
export interface ButtonPropsWithHTMLLink extends HTMLLinkOmit, ButtonProps {
}
export {};
//# sourceMappingURL=types.d.ts.map