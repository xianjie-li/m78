import React from 'react';
import { SizeKeys } from 'm78/types';
export declare enum ButtonColorEnum {
    blue = "blue",
    red = "red",
    green = "green",
    yellow = "yellow",
    primary = "primary"
}
export interface ButtonProps {
    /** 按钮颜色 */
    color?: 'blue' | 'red' | 'green' | 'yellow' | 'primary' | ButtonColorEnum;
    /** 大小 */
    size?: SizeKeys | 'mini';
    /** 圆形按钮 */
    circle?: boolean;
    /** 边框按钮 */
    outline?: boolean;
    /** 块级按钮 */
    block?: boolean;
    /** icon按钮, children可以是Icon或文字 */
    icon?: boolean;
    text?: boolean;
    /** 设置禁用状态 */
    disabled?: boolean;
    /** 设置加载状态 */
    loading?: boolean;
    /** 仅启用md风格的点击效果 */
    md?: boolean;
    /** 仅启用win风格的点击效果 */
    win?: boolean;
    /** 传入href时，会渲染为a链接 */
    /** 指向内部button的ref */
    innerRef?: React.Ref<HTMLButtonElement>;
}
/** 剔除内部占用属性的原生按钮props */
declare type HTMLBtnOmit = Omit<React.PropsWithoutRef<JSX.IntrinsicElements['button']>, 'color'>;
/** 剔除内部占用属性的原生html link props */
declare type HTMLLinkOmit = Omit<React.PropsWithoutRef<JSX.IntrinsicElements['a']>, 'color' | 'type'>;
export interface ButtonPropsWithHTMLButton extends HTMLBtnOmit, ButtonProps {
}
export interface ButtonPropsWithHTMLLink extends HTMLLinkOmit, ButtonProps {
}
export {};
