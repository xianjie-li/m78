import React from 'react';
import { ComponentBaseProps } from 'm78/types';
export interface SpinProps extends ComponentBaseProps {
    /** 大小 */
    size?: 'small' | 'large';
    /** 内联模式 */
    inline?: boolean;
    /** '加载中' | 提示文本 */
    text?: React.ReactNode;
    /** 使spin充满父元素(需要父元素是static以外的定位元素) */
    full?: boolean;
    /** 适合黑色主题的应用中使用，文字变为白色，当设置了full时，背景遮罩将会变成带透明通道的黑色 */
    dark?: boolean;
    /** true | 是否显示加载状态 */
    show?: boolean;
    /** 包裹组件样式 */
    style?: React.CSSProperties;
    /** 包裹组件的类名 */
    className?: string;
    /** 300 | 延迟显示/隐藏loading的毫秒数 */
    loadingDelay?: number;
}
