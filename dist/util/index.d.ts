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
declare const stopPropagation: {
    onClick(e: React.SyntheticEvent): void;
};
/** 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined */
export declare function getRefDomOrDom(target?: any): HTMLElement | undefined;
/** 获取窗口的滚动位置 */
export declare function getDocScrollOffset(): {
    x: number;
    y: number;
};
/** 指定错误消息和组件命名空间来抛出一个错误 */
export declare function throwError(errorMsg: string, namespace?: string): never;
export { stopPropagation };
export * from './types';
