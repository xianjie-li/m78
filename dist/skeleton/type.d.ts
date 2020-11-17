import React from 'react';
export interface SkeletonFactoryProps {
    /** 要渲染的骨架总数 */
    number?: number;
    /** 显示/隐藏骨架 */
    show?: boolean;
    children?: React.ReactNode;
}
export interface SkeletonProps extends SkeletonFactoryProps {
    /** 6 | 文本行的数量 */
    lineNumber?: number;
    /** 高度 */
    height?: number;
    /** 宽度 */
    width?: number;
    /** #fff | 包裹元素背景色 */
    backgroundColor?: string;
    /** true | 包裹元素是否有阴影 */
    shadow?: boolean;
    /** false | 圆角图片,只在传img时生效 */
    circle?: boolean;
    /** 显示图片占位图，默认false */
    img?: boolean;
}
