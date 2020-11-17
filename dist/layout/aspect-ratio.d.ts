import React from 'react';
import { ComponentBaseProps } from 'm78/types';
interface AspectRatioProps extends ComponentBaseProps {
    /** 1 | 网格项的宽高比 */
    ratio?: number;
    children?: React.ReactNode;
}
declare const AspectRatio: ({ ratio, children, className, style }: AspectRatioProps) => JSX.Element;
export default AspectRatio;
