import React from 'react';
import { ComponentBaseProps } from '../types/types';
export interface ScrollRef {
    /** 结束下拉刷新，将刷新是否成功作为第一个参数传入, 默认成功 */
    pullDownFinish(isSuccess?: boolean): void;
    /** 手动触发下拉刷新，当正在进行下拉或上拉中的任意操作时，调用无效 */
    triggerPullDown(): void;
    /** 结束下拉加载，请求到数据时，将数据长度作为第一个参数传入(用于更友好的反馈，默认为0), 发生错误时，传入参数二, 此时第一个参数会被忽略 */
    pullUpFinish(dataLength?: number, hasError?: boolean): void;
    /** 重置上拉加载, 当没有数据时，上拉加载会被禁用，通过此方法可重新开启 */
    resetPullUp(): void;
    /** 手动触发加载，一般用于首次进入时在合适的时机调用加载数据。
     * skip会传入onPullUp函数用于识别是否需要执行增加页码等操作，在
     * 组件内部，当进行重试、初始化onPullUp调用等操作时会传入true
     * */
    triggerPullUp(skip?: boolean): void;
    /** 滚动到指定位置, 传immediate则跳过动画 */
    scrollTo(to: number, immediate?: boolean): void;
    /** 根据当前位置滚动指定距离, 正数或负数, 传immediate则跳过动画  */
    scrollBy(offset: number, immediate?: boolean): void;
    /** 滚动到指定元素位置，如果是字符，会调用querySelector进行获取，没有找到时不会执行任何操作 */
    scrollToElement(el: HTMLElement | string): void;
    /** 对滚动节点的引用 */
    el: HTMLDivElement;
}
export interface ScrollProps extends ComponentBaseProps {
    /** 下拉刷新开关, 默认关闭 */
    pullDown?: boolean;
    /** 下拉刷新触发回调 */
    onPullDown?: (pullDownFinish: ScrollRef['pullDownFinish']) => void;
    /** 上拉加载开关, 默认关闭 */
    pullUp?: boolean;
    /** 上拉事件触发回调, 当skip为true，说明该操作由内部触发(失败、空数据重试等), 并且不期望执行增加页码等操作，应仅仅执行数据更新 */
    onPullUp?: (pullUpFinish: ScrollRef['pullUpFinish'], skip?: boolean) => void;
    /** 触发上拉加载的距离， 默认160 */
    threshold?: number;
    /** 滚动事件 TODO: 引入正确类型 */
    onScroll?: (meta: any) => void;
    /** 指定onScroll的防抖时间, 注意这会导致onScroll内部不能引用到最新的组件状态，可以理解为防抖后，onScroll回调永远指向你第一次传入的那个函数 */
    throttleTime?: number;
    /**
     * hasData 当前是否有数据. 通常会传入data.length。用于实现更好的首次加载、无数据时的反馈等。
     * 因为Scroll内部是不知道数据总量的， */
    hasData?: boolean;
    /** 是否显示返回顶部 */
    backTop?: boolean;
    children: React.ReactNode;
}
declare const Scroll: React.ForwardRefExoticComponent<ScrollProps & React.RefAttributes<ScrollRef>>;
export default Scroll;
