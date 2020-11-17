import React from 'react';
export interface ComponentBasePropsWithAny extends ComponentBaseProps {
    /** 透传到包裹元素上的属性 */
    [key: string]: any;
}
export interface ComponentBaseProps {
    /** 包裹元素的类名 */
    className?: string;
    /** 包裹元素样式 */
    style?: React.CSSProperties;
}
export declare type Status = 'info' | 'success' | 'warning' | 'error';
export declare enum StatusEnum {
    info = "info",
    success = "success",
    warning = "warning",
    error = "error"
}
export declare type Size = 'large' | 'small';
export declare enum SizeEnum {
    large = "large",
    small = "small"
}
export declare type FullSize = 'big' | Size;
export declare enum FullSizeEnum {
    large = "large",
    small = "small",
    big = "big"
}
export declare enum PositionEnum {
    left = "left",
    top = "top",
    right = "right",
    bottom = "bottom"
}
export declare enum DirectionEnum {
    horizontal = "horizontal",
    vertical = "vertical"
}
export interface DataSourceItem<ValType = any> {
    /** 选项名 */
    label: React.ReactNode;
    /** 选项值, 默认与label相同 */
    value: ValType;
}
