import React from 'react';
interface SpacerProps {
    /** 宽度 */
    width?: number;
    /** 16 | 高度,  */
    height?: number;
    /** 如果子项传入一个列表，会在每一个子项间设置间距 */
    children?: React.ReactElement[];
}
declare const Spacer: ({ width, height, children }: SpacerProps) => any;
export default Spacer;
