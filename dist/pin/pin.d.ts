import React, { RefObject } from 'react';
import { ComponentBaseProps } from 'm78/types';
interface PinProps extends ComponentBaseProps {
    /** 指定目标元素，默认为第一个可滚动父元素 */
    target?: HTMLElement | RefObject<any>;
    /** 需要滚动固定的内容 (不能是文本节点、如果包含特殊定位(absolute等), 最好由外层节点控制) */
    children?: React.ReactNode;
    /** 禁用顶部固钉 */
    disableTop?: boolean;
    /** 禁用底部固钉 */
    disableBottom?: boolean;
    /** 0 | 距离顶部此距离时触发 */
    offsetTop?: number;
    /** 0 | 距离顶部此距离时触发 */
    offsetBottom?: number;
}
/**
 * 指定元素后，在元素滚动范围内生效
 * */
declare const Pin: ({ target, offsetTop, offsetBottom, children, style, className, disableBottom, disableTop, }: PinProps) => JSX.Element;
export default Pin;
