import { Bound, PopperTriggerType } from './types';
/** 检测是否为合法的Bound */
export declare function isPopperBound(arg: any): arg is Bound;
/** 根据PopperTriggerType获取启用的事件类型 */
export declare function getTriggerType(type: PopperTriggerType | PopperTriggerType[]): {
    hover: boolean;
    click: boolean;
    focus: boolean;
};
interface UseMountExistOption {
    toggle: boolean;
    /** true | 在第一次show为true时才真正挂载内容 */
    mountOnEnter?: boolean;
    /** false | 在show为false时是否卸载内容 */
    unmountOnExit?: boolean;
    /**
     * 延迟设置非mount状态, 单位ms,
     * - 用于在内容包含动画时，在动画结束后在卸载内容
     * - 此值不用必须精准匹配动画时间，只要大于动画时间即可
     * */
    exitDelay?: number;
}
/**
 * 用于便捷的实现mountOnEnter、unmountOnExit接口
 * */
export declare function useMountExist({ toggle, mountOnEnter, unmountOnExit, exitDelay, }: UseMountExistOption): readonly [boolean];
export {};
