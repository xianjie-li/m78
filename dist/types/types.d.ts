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
export declare type Size = 'large' | 'small';
export declare type FullSize = 'big' | Size;
export interface DataSourceItem<ValType = any> {
    /** 选项名 */
    label: React.ReactNode;
    /** 选项值, 默认与label相同 */
    value: ValType;
}
