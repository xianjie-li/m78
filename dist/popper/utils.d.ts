import { Bound, PopperTriggerType } from './types';
/** 检测是否为合法的Bound */
export declare function isPopperBound(arg: any): arg is Bound;
/** 根据PopperTriggerType获取启用的事件类型 */
export declare function getTriggerType(type: PopperTriggerType | PopperTriggerType[]): {
    hover: boolean;
    click: boolean;
    focus: boolean;
    subClick: boolean;
};
export interface MountExistBase {
    /** true | 如果为true，在第一次启用时才真正挂载内容 */
    mountOnEnter?: boolean;
    /** false | 是否在关闭时卸载内容 */
    unmountOnExit?: boolean;
}
