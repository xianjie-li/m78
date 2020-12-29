import React from 'react';
import { MountExistBase } from 'm78/popper/utils';
import { ComponentBaseProps } from 'm78/types/types';
export declare enum ExpandIconPosition {
    left = "left",
    bottom = "bottom",
    right = "right"
}
/** Expansion和ExpansionPane通用的props */
export interface ExpansionBase extends MountExistBase {
    /** 禁用 */
    disabled?: boolean;
    /** true | 是否开启展开/收起动画 */
    transition?: boolean;
    /** true | extend | 如果为true，在第一次启用时才真正挂载内容 */
    /** false | extend | 是否在关闭时卸载内容 */
    /** 去除所有非必要样式 */
    noStyle?: boolean;
    /**
     * 自定义展开标识图标
     * - 如果将className添加到节点上，会在展开时为其设置旋转, 也可以通过open自行配置
     * - 配置此项后expandIconPosition会失效，需要可以手动通过left top控制位置
     * */
    expandIcon?: React.ReactNode | ((open: boolean, className: string) => React.ReactNode);
    /** left | 展开图标的位置 */
    expandIconPosition?: ExpandIconPosition | 'left' | 'bottom' | 'right';
}
export interface ExpansionProps extends ExpansionBase, ComponentBaseProps {
    /** 所有展开项的name数组(受控) */
    opens?: string[];
    /** 默认的展开项name数组(不受控) */
    defaultOpens?: string[];
    /** 展开项改变时触发 */
    onChange?: (nextOpens: string[]) => void;
    /** 开启手风琴效果，所有Pane同时只会有一个被打开 */
    accordion?: boolean;
    /** 渲染在内部的元素，内部所有带name的ExpansionPane会受此组件控制 */
    children?: React.ReactNode;
}
export interface ExpansionPaneProps extends ExpansionBase, ComponentBaseProps {
    /** 该Pane的标识，只有传入此项才会被父级Expansion识别, 不传时作为独立组件使用 */
    name?: string;
    /** 是否展开(受控) */
    open?: boolean;
    /** 默认是否展开 */
    defaultOpen?: boolean;
    /** 展开状态改变 */
    onChange?: (open: boolean) => void;
    /** 顶部内容 */
    header?: React.ReactNode;
    /** 面板内容 */
    children?: React.ReactNode;
    /** 顶部操作区内容 */
    actions?: React.ReactNode;
    /** 完全替换掉整个顶部内容 */
    headerNode?: React.ReactElement | null;
}
