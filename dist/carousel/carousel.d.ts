import React, { ReactElement } from 'react';
import { ComponentBaseProps } from '../types/types';
export interface CarouselProps extends ComponentBaseProps {
    /** 子元素，必须为多个直接子元素或子元素数组 */
    children: ReactElement[];
    /** false | 设置滚动方向为纵向, 当为纵向时，必须设置height，否则高度默认为0 */
    vertical?: boolean;
    /** vertical ? 0 : 'auto' | 当vertical为true时，必须设置高度 */
    height?: number | string;
    /** 'auto' | 宽度，与轮播项一致 */
    width?: number | string;
    /** true | 是否开启循环滚动 */
    loop?: boolean;
    /** 0 | 从0开始的默认页码 */
    initPage?: number;
    /** true | 是否开启分页控制和计数器，在横向滚动时，当滚动项总数大于7，计数器会自动更换为数字数据器，纵向模式下计数器永远为图形计数器 */
    control?: boolean;
    /** 强制使用number计数器 */
    forceNumberControl?: boolean;
    /** 自动轮播 */
    autoplay?: number;
    /** 是否开启鼠标滚轮监听 */
    wheel?: boolean;
    /** 是否开启drag */
    drag?: boolean;
    /** 页码改变时触发，在mounted时也会触发，并且会传入first=true */
    onChange?: (currentPage: number, first?: boolean) => void;
    /** 当发生任何可能切换页面的操作(drag、滚动)时触发 */
    onWillChange?: () => void;
    /** onPageSetup */
    onPageSetup?: () => void;
}
export interface CarouselRef {
    /** 跳转到前一页 */
    prev(): void;
    /** 跳转到后一页 */
    next(): void;
    /**
     * 跳转到指定页
     * @param currentPage - 页码
     * @param immediate - 是否跳过动画
     * */
    goTo(currentPage: number, immediate?: boolean): void;
}
declare const Carousel: React.ForwardRefExoticComponent<CarouselProps & React.RefAttributes<CarouselRef>>;
export default Carousel;
