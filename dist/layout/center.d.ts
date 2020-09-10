import React from 'react';
import { ComponentBaseProps } from '../types/types';
interface CenterProps extends ComponentBaseProps {
    /** false | 为true时，将尺寸固定到与父元素一致(需要保证父元素position不是static), 为false时，需要通过className或style执行设置尺寸 */
    attach?: boolean;
    /** 需要居中的单个子元素 */
    children?: React.ReactElement | string;
}
declare const Center: ({ children, attach, className, style }: CenterProps) => JSX.Element;
export default Center;
