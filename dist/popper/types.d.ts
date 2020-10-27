import React, { Ref } from 'react';
import { SetState } from '@lxjx/hooks/dist/type';
import { SpringStartFn, SpringValue } from 'react-spring';
import { ComponentBaseProps } from '../types/types';
import { defaultProps } from './popper';
import { getTriggerType } from './utils';
export declare type PopperTriggerType = 'hover' | 'click' | 'focus';
export interface PopperRef {
    /**
     * 刷新气泡状态
     * @param animation - 决定是否开启动画
     * */
    refresh(animation?: boolean): void;
}
/** 自定义Popper组件 */
export interface PopperPropsCustom extends PopperProps {
    /** 设置显示状态 */
    setShow(patch: boolean | ((prevState: boolean) => boolean)): void;
    /** 当前显示状态 */
    show: boolean;
}
/** 描述位置和尺寸的必要信息 */
export interface Bound {
    right: number;
    bottom: number;
    left: number;
    top: number;
}
export interface BoundWithVisible extends Bound {
    /** 部分遮挡 */
    visible: boolean;
    /** 已完全不可见 */
    hidden: boolean;
}
/** 描述尺寸的必要信息 */
export interface Size {
    width: number;
    height: number;
}
/** 描述了所有方向气泡位置信息的对象 */
export declare type PopperDirectionInfo = {
    [key in DirectionKeys]: Bound;
};
/** 包含了具体可见性的PopperDirectionInfo */
export declare type PopperDirectionInfoWidthVisible = {
    [key in DirectionKeys]: BoundWithVisible;
};
/** 所有可能出现的方向 */
export declare type DirectionKeys = 'topStart' | 'top' | 'topEnd' | 'leftStart' | 'left' | 'leftEnd' | 'bottomStart' | 'bottom' | 'bottomEnd' | 'rightStart' | 'right' | 'rightEnd';
export interface Share {
    props: PopperProps & typeof defaultProps;
    state: {
        /** 目标元素，如果不为undefined，则气泡挂载点为dom类型 */
        elTarget?: HTMLElement;
        /** 目标元素，如果不为undefined，则气泡挂载点为Bound类型 */
        boundTarget?: Bound;
        /** 滚动元素 */
        wrapEl?: HTMLElement;
        /** 当前方向 */
        direction: DirectionKeys;
    };
    setState: SetState<Share['state']>;
    self: {
        /** 实现延迟隐藏(鼠标移出不马上隐藏) */
        hideTimer?: any;
        /** 实现延迟渲染(鼠标移出不马上出现)  */
        showTimer?: any;
        /** 上一个show */
        lastShow: boolean;
        /** 因为所有方向不可见而隐藏, 用于阻止由于此原因隐藏后再次进场的动画 */
        allHide: boolean;
    };
    /** 设置显示状态 */
    setShow(patch: boolean | ((prev: boolean) => boolean)): void;
    /** 当前显示状态 */
    show: boolean;
    /** 事件启用状态 */
    triggerType: ReturnType<typeof getTriggerType>;
    /** 气泡包裹元素 */
    popperEl: React.MutableRefObject<HTMLDivElement>;
    /** 气泡宽度 */
    mWidth: number;
    /** 气泡高度 */
    mHeight: number;
    /** 节点是否挂载 */
    mount: boolean;
    /** 唯一选择器 */
    targetSelector: string;
    /** 设置动画值 */
    set: SpringStartFn<{
        xy: number[];
        opacity: number;
        scale: number;
    }>;
    /** 动画属性 */
    spProps: {
        xy: SpringValue<number[]>;
        opacity: SpringValue<number>;
        scale: SpringValue<number>;
    };
}
export interface PopperProps extends ComponentBaseProps {
    /** tooltip | 气泡框类型 */
    type?: 'tooltip' | 'popper' | 'confirm';
    /** 气泡内容 */
    content?: React.ReactNode;
    /**
     * 子元素, 作为气泡的定位目标, 子元素包含以下限制
     * - 只能包含一个直接子节点
     * - 该节点能够支持className、onMouseEnter、onMouseLeave、onFocus、onClick等props
     * */
    children?: React.ReactElement;
    /** 'top' | 气泡方向, 会根据气泡的遮挡情况自动调整 */
    direction?: DirectionKeys;
    /** 'hover' | 气泡的触发方式 */
    trigger?: PopperTriggerType | PopperTriggerType[];
    /**
     * 直接指定 [目标元素/指向目标元素的ref/表示位置的Bound对象] 作为定位目标
     * - 优先级大于children
     * - 如果使用bound，需要自行保证它的memo性，频繁的地址变更会造成性能损耗
     * */
    target?: HTMLElement | Bound | React.RefObject<HTMLElement>;
    /** 禁用 */
    disabled?: boolean;
    /** 标题，type为popper时生效 */
    title?: React.ReactNode;
    /** 获取实例对象 */
    instanceRef?: Ref<PopperRef>;
    /** 通过show/onChange手动控制显示、隐藏 */
    show?: boolean;
    /** 通过show/onChange手动控制显示、隐藏 */
    onChange?(show: boolean): void;
    /** 默认是否显示 */
    defaultShow?: boolean;
    /** true | 默认content会在气泡显示时才进行渲染，设置为false后会将content随组件一起预渲染 */
    mountOnEnter?: boolean;
    /** false | 在气泡隐藏会是否销毁content */
    unmountOnExit?: boolean;
    /** 确认 | 类型为confirm时，确认按钮的文字 */
    confirmText?: React.ReactNode;
    /** 取消 | 类型为confirm时，取消按钮的文字 */
    cancelText?: React.ReactNode;
    /** 点击确认的回调 */
    onConfirm?(): void;
    /** type为confirm时, 此选项用于设置图标 */
    icon?: React.ReactNode;
    /** 定制气泡样式 通过根节点选择器来命中箭头，如 .my-custom + .m78-popper_arrow */
    customer?(props: PopperPropsCustom): JSX.Element;
    /** 包裹元素，作为气泡边界的标识，并会在滚动时对气泡进行更新, 默认为第一个滚动父元素 */
    wrapEl?: HTMLElement | React.RefObject<any>;
    /** 12 | 气泡的偏移位置 */
    offset?: number;
}
