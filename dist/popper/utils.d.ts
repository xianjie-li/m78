import React from 'react';
import { GetPopperMetasBound } from './getPopperMetas';
import { PopperTriggerType } from './types';
/** 传入dom时原样返回，传入包含dom对象的ref时返回current，否则返回undefined */
export declare function getRefDomOrDom(target?: HTMLElement | React.MutableRefObject<any>): HTMLElement | undefined;
/** 检测是否为合法的GetPopperMetasBound */
export declare function isPopperMetasBound(arg: any): GetPopperMetasBound | undefined;
/** 根据PopperTriggerType获取启用的事件类型 */
export declare function getTriggerType(type: PopperTriggerType | PopperTriggerType[]): {
    hover: boolean;
    click: boolean;
    focus: boolean;
};
