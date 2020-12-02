import { AnyObject } from '@lxjx/utils';
import { DNDProps } from './types';
/** 在多个滚动帮助函数间共享 */
interface AutoScrollCtx {
    /** 是否按下 */
    autoScrollDown: boolean;
    /** 自动滚动的开关 */
    autoScrollToggle: boolean;
    /** 要设置的key */
    autoScrollPosKey: 'scrollLeft' | 'scrollTop';
    /** 每次滚动距离 */
    autoScrollVal: number;
    /** 增加还是减少 1增加 2减少 */
    autoScrollType: 1 | 2;
}
/** 计算元光标和指定元素的覆盖状态 */
export declare function getOverStatus(el: HTMLElement, x: number, y: number, firstScrollParent?: HTMLElement): {
    dragOver: boolean;
    dragTop: boolean;
    dragBottom: boolean;
    dragLeft: boolean;
    dragRight: boolean;
    dragCenter: boolean;
    left: number;
    top: number;
};
/** 判断x, y 是否在指定的DOMRect区间中 */
export declare function isBetween({ left, top, right, bottom }: DOMRect, x: number, y: number): boolean;
/**
 * 计算光标在某个元素四个方向的超出值
 * 不包含滚动条的方向返回值始终为0
 * 元素不包含滚动条时无返回
 * 同时只会有一个方向有值
 * */
export declare function getAutoScrollStatus(el: HTMLElement, x: number, y: number): {
    top: number;
    bottom: number;
    left: number;
    right: number;
} | undefined;
/**
 * 根据getAutoScrollStatus的返回值滚动元素
 * */
export declare function autoScrollByStatus(el: HTMLElement & {
    ctx: AutoScrollCtx;
}, status: ReturnType<typeof getAutoScrollStatus>, down: boolean): void;
/** 根据当前的AutoScrollCtx来自动滚动目标元素 */
export declare function autoScroll(el: HTMLElement & {
    ctx: AutoScrollCtx;
}): void;
/** 对象是否包含属性值都为true的项 */
export declare function allPropertyHasTrue(obj: AnyObject): boolean;
/** 左侧对象的所有值是否都与右侧对象相等 */
export declare function allPropertyIsEqual(obj: AnyObject, obj2: AnyObject): boolean;
/**  根据事件元素类型决定是否禁止拖动 */
export declare function isIgnoreEl(event?: any, ignoreElFilter?: DNDProps['ignoreElFilter']): boolean;
export {};
