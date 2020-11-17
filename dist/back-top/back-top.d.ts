import React, { RefObject } from 'react';
import { ComponentBaseProps } from 'm78/types';
interface BackTopProps extends ComponentBaseProps {
    /**
     * 目标滚动容器
     * - 如果未传入会查找第一个可滚动的父级，且挂载到body下
     * - 如果传入，挂载到组件所在位置并以传入节点作为滚动目标
     * */
    target?: HTMLElement | RefObject<HTMLElement>;
    /** 自定义内容 */
    children?: React.ReactNode;
    /** 500 | 滚动达到此高度时出现 */
    threshold?: number;
    /** 200 | 防抖时间(ms) */
    debounceTime?: number;
}
declare const BackTop: ({ target, debounceTime, threshold, children, className, style, }: BackTopProps) => JSX.Element;
export default BackTop;
