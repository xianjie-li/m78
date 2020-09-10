import * as React from 'react';
/** 与@lxjx/sass-base同步，用于js代码的常用屏幕尺寸 */
export declare const SM = 576;
export declare const MD = 768;
export declare const LG = 992;
export declare const XL = 1200;
/** 与@lxjx/sass-base同步，用于js代码的z-index预设值 */
export declare const Z_INDEX = 1000;
export declare const Z_INDEX_DRAWER = 1400;
export declare const Z_INDEX_MODAL = 1800;
export declare const Z_INDEX_MESSAGE = 2200;
/** 禁止冒泡的便捷扩展对象 */
export declare const stopPropagation: {
    onClick(e: React.SyntheticEvent): void;
};
/** 占位函数 */
export declare const dumpFn: (...arg: any[]) => any;
/** 获取指定dom元素的指定样式值 */
export declare function getStyle(obj: HTMLElement, attr: keyof CSSStyleDeclaration): any;
export declare function getFirstScrollParent(ele: HTMLElement): HTMLElement | null;
/**
 * 元素是否在视口可见位置
 * @param el - 待检测元素
 * @param option
 * @param option.fullVisible - 默认完全不可见时才算不可见，设置为true只要元素有部分遮挡即视为不可见
 * @param option.wrapEl - 默认以视口计算可见性，通过此项指定元素
 * */
export declare function checkElementVisible(el: HTMLElement, option?: {
    fullVisible?: boolean;
    wrapEl?: HTMLElement;
}): boolean;
/** 如果入参为truthy或0则返回，否则返回false */
export declare function isTruthyOrZero(arg: any): boolean;
/** 返回入参中第一个truthy值或0 */
export declare function getFirstTruthyOrZero(...args: any): any;
/**
 * 根据传入的node节点查询其所有父节点中是否存在指定节点
 * @param node - 待查询的节点
 * @param matcher - 匹配器，递归接收父节点，返回值决定是否匹配
 * @param depth - 询深度
 * */
export declare function getCurrentParent(node: Element, matcher: (node: Element) => boolean, depth: number): boolean;
