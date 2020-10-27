import React from 'react';
import { AnyFunction } from '@lxjx/utils';
export interface ForkProps {
    /** 是否有数据用于显示, 当为truthy值且无其他非常规状态时时，显示子元素 */
    hasData: any;
    /** 当没有任何非常规状态时，显示的内容，如果内容依赖其他数据，可以传入函数 */
    children: React.ReactNode | (() => React.ReactNode);
    /** 是否包含错误, 如果是一个对象且包含message属性，则会用其作为反馈显示 */
    error?: any;
    /** 是否超时 */
    timeout?: boolean;
    /** 是否正在请求 */
    loading?: boolean;
    /** 设置后，即使在loading中，也会强制渲染children */
    forceRenderChild?: boolean;
    /**
     * 默认loading以占位节点形式显示，传入此项会使其脱离文档流并填满父元素, 需要父元素非常规定位元素(position非static)
     * 传入此项时，即使在loading中，也会强制渲染强制渲染children
     * */
    loadingFull?: boolean;
    /** 加载提示文本 */
    loadingText?: React.ReactNode;
    /** 给loading node设置style */
    loadingStyle?: React.CSSProperties;
    /** 当包含异常时(error | timeout), 通过此方法让用户进行更新请求, 传入后会在错误和无数据时显示重新加载按钮 */
    send?: AnyFunction;
    /** '暂无数据' | 空提示文本 */
    emptyText?: React.ReactNode;
}
export interface IfProps {
    /** 任何falsy\truthy值 */
    when?: any;
    /** 待切换的子元素 */
    children?: React.ReactNode;
}
export interface ToggleProps {
    /** 任何falsy\truthy值 */
    when?: any;
    /** 待切换的子元素 */
    children: React.ReactElement;
}
export interface SwitchProps {
    children: React.ReactElement[];
}
