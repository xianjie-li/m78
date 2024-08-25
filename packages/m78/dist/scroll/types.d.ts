import { ComponentBaseProps } from "../common/index.js";
import React from "react";
import { SetState, UseMeasureBound } from "@m78/hooks";
import { _defaultProps } from "./common.js";
import { SpringValue } from "react-spring";
import type { ScrollTriggerState } from "@m78/trigger/scroll.js";
import type { useScroll } from "@m78/trigger/react/use-scroll.js";
/** 滚动类型 */
export declare enum ScrollDirection {
    x = "x",
    y = "y",
    xy = "xy",
    none = "none"
}
export type ScrollDirectionKeys = keyof typeof ScrollDirection;
export type ScrollDirectionUnion = ScrollDirection | ScrollDirectionKeys;
export type ScrollPullDownAnimateValues = {
    /** Y轴移动距离 */
    y: SpringValue<number>;
    /** 控制指示器图标旋转 */
    rotate: SpringValue<number>;
    /** 已拖动的比例 */
    ratio: SpringValue<number>;
    /** 下拉正处于运行状态 */
    running: boolean;
};
export type ScrollPullDownCustomer = React.ReactNode
/** offset - 当前下拉偏移值, ratio - 下拉比例 */
 | ((springValues: ScrollPullDownAnimateValues) => React.ReactNode);
/** Scroll组件Props */
export interface ScrollProps extends ComponentBaseProps {
    /** ScrollDirection.xy | 滚动方向 */
    direction?: ScrollDirectionUnion;
    /** 显示的内容 */
    children?: React.ReactNode;
    /** 对应方向包含可滚动区域时显示阴影标记 */
    indicator?: boolean;
    /** true | 显示滚动条 */
    scrollbar?: boolean;
    /** false | 在可滚动的方向显示滚动指示器 */
    scrollIndicator?: boolean;
    /** 启用迷你滚动条 */
    miniBar?: boolean;
    /** 滚动时触发 */
    onScroll?: (meta: ScrollTriggerState) => void;
    /** 容器级放置的额外节点, 用于功能扩展 */
    wrapExtra?: React.ReactNode;
    /** 用于控制滚动的实例 */
    instanceRef?: React.Ref<ScrollInstance>;
    /** 内部容器节点 */
    innerRef?: React.Ref<HTMLDivElement>;
    /** 用于获取内部滚动容器dom */
    innerWrapRef?: React.RefObject<HTMLDivElement>;
    /** 内容容器节点的额外style */
    contStyle?: React.CSSProperties;
    /** 内容容器节点的额外className */
    contClassName?: string;
    /** 禁止滚动 */
    disabledScroll?: boolean;
    /** 在光标操作时使用模拟的拖拽滚动, 开启后下拉刷新相关配置失效 */
    dragScroll?: boolean;
    /** 下拉触发, 传入即视为启用下拉 */
    onPullDown?: () => Promise<any>;
    /** 自定义指示器节点 */
    pullDownIndicator?: ScrollPullDownCustomer;
    /** 添加额外的下拉加载文本 */
    pullDownText?: ScrollPullDownCustomer;
    /** 指示节点是否旋转 */
    pullDownIndicatorRotate?: boolean;
    /** 使用自定义节点完全替换默认节点 */
    pullDownNode?: ScrollPullDownCustomer;
    /** 上拉加载触发, 传入即视为启用上拉加载 */
    onPullUp?: () => Promise<any>;
    /** 0.7 | 触发上拉加载所需的距离比例 */
    pullUpTriggerRatio?: number;
}
/** 组件实例 */
export interface ScrollInstance extends ReturnType<typeof useScroll> {
    /** 手动触发下拉 */
    triggerPullDown: () => Promise<void>;
}
export interface _ScrollContext {
    props: ScrollProps & typeof _defaultProps;
    scroller: ReturnType<typeof useScroll>;
    state: {
        /** 对应轴是否开启了滚动且可滚动 */
        enableStatus: {
            x: boolean;
            y: boolean;
        };
        /** x轴可见控制 */
        xVisible: boolean;
        /** y轴可见控制 */
        yVisible: boolean;
        /** 滚动容器在x轴的填充区域, 用于隐藏原始滚动条 */
        xPadding: number;
        /** 滚动容器在y轴的填充区域, 用于隐藏原始滚动条 */
        yPadding: number;
        /** 以下属性滚动时从scroller同步, 用于控制滚动标记显示 */
        touchTop: boolean;
        touchBottom: boolean;
        touchLeft: boolean;
        touchRight: boolean;
        xMax: number;
        yMax: number;
        /** 下拉正在执行 */
        pullDownRunning: boolean;
        /** 无限滚动尺寸 */
        infiniteWidth: number;
        infiniteHeight: number;
        /** 是否是常见的移动设备 */
        isMobile: boolean;
    };
    setState: SetState<_ScrollContext["state"]>;
    self: {
        /** 自动关闭滚动条时使用的计时器 */
        delayHiddenTimer: any;
        /** 用于临时锁定自动关闭滚动条(即为true时不关闭) */
        delayHiddenLock: boolean;
        /** 上拉触发锁定 */
        pullUpLock: boolean;
        /** 最后触发上拉时间 */
        pullUpTriggerTime?: number;
        /** 保证触发间隔的计时器 */
        pullUpTimer?: any;
        /** 是否是在顶部触发的下拉 */
        pullDownFlag?: boolean;
    };
    /** 控制容器启用滚动的css style object */
    directionStyle: React.CSSProperties;
    /** 内容容器的实时bound信息 */
    bound: UseMeasureBound;
    /** 下拉刷新是否启用 */
    pullDownEnabled: boolean;
    /** x轴滚动是否启用 */
    xEnabled: boolean;
    /** y轴滚动是否启用 */
    yEnabled: boolean;
    innerWrapRef: React.RefObject<HTMLDivElement>;
}
//# sourceMappingURL=types.d.ts.map