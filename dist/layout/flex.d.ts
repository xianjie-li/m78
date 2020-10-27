import React from 'react';
import { ComponentBasePropsWithAny } from '../types/types';
interface FlexWrapProps extends ComponentBasePropsWithAny {
    /** 'start' | 主轴对齐方式 */
    mainAlign?: 'center' | 'start' | 'end' | 'around' | 'between' | 'evenly';
    /** 'stretch' | 交叉轴对齐方式 */
    crossAlign?: 'stretch' | 'start' | 'end' | 'center';
    /** 内容 */
    children: React.ReactNode;
}
interface FlexProps extends ComponentBasePropsWithAny {
    /** 1 | 弹性系数 */
    flex?: number | string;
    /** 排序 */
    order?: number;
    /** 单独设置在容器交叉轴上的对齐方式  */
    align?: FlexWrapProps['crossAlign'];
    /** 内容 */
    children?: React.ReactNode;
}
declare const Column: ({ children, style, className, mainAlign, crossAlign, ...ppp }: FlexWrapProps) => JSX.Element;
declare const Row: ({ children, style, className, mainAlign, crossAlign, ...ppp }: FlexWrapProps) => JSX.Element;
declare const Flex: ({ flex, children, order, style, className, align, ...ppp }: FlexProps) => JSX.Element;
export { Column, Row, Flex };
