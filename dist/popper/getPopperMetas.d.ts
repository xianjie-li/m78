/** 用来描述尺寸信息 */
interface GetPopperMetasSource {
    width: number;
    height: number;
}
/** 描述位置和尺寸 */
export interface GetPopperMetasBound {
    width: number;
    height: number;
    left: number;
    top: number;
}
/** 配置 */
interface GetPopperMetasOptions {
    /** 设置包裹元素，默认为窗口 */
    wrap?: HTMLElement | GetPopperMetasBound;
    /** 0 | 偏移距离，对于左/上是减少距离，右/下是增加距离 */
    offset?: number;
    /** top | 预设方向 */
    direction?: GetBoundMetasDirectionKeys;
    /** 前一个方向，用于推测出当前更适合放置气泡的方向, 不传时取 direction */
    prevDirection?: GetBoundMetasDirectionKeys;
}
/** 所有可能出现的方向 */
export declare type GetBoundMetasDirectionKeys = 'topStart' | 'top' | 'topEnd' | 'leftStart' | 'left' | 'leftEnd' | 'bottomStart' | 'bottom' | 'bottomEnd' | 'rightStart' | 'right' | 'rightEnd';
/** 提供给外部适用的一下方向和位置信息 */
export interface GetBoundDirectionItem {
    /** 该方向是否安全可用 */
    safe: boolean;
    /** 改元素在x轴上放置的位置 */
    x: number;
    /** 改元素在x轴上放置的位置 */
    y: number;
    [key: string]: any;
}
/** 表示一个可用位置 */
interface Degrade {
    direction: 'top' | 'right' | 'bottom' | 'left';
    x: number;
    y: number;
    arrowX: number;
}
/** 表示当前所有方向有关信息的对象 */
export declare type GetBoundMetas = {
    [key in GetBoundMetasDirectionKeys]: GetBoundDirectionItem;
};
export interface getPopperMetasReturns {
    /** 所有方向的描述对象 */
    metas: GetBoundMetas;
    /** 气泡是否可见 */
    visible: boolean;
    /** 气泡应显示的位置 */
    currentDirection: GetBoundDirectionItem;
    /** 表示currentDirection的key */
    currentDirectionKey: GetBoundMetasDirectionKeys;
    /** 所有理想位置都不可用，但存在的其他可用位置 */
    degrade?: Degrade;
    /** 没有可用理想位置 */
    notValidDirection?: boolean;
}
/**
 * 根据目标元素和气泡元素的尺寸等获取气泡在目标各位置上的位置和可用信息、是否可见、以及推测当前合适的位置
 * @param source - 气泡元素的dom节点或虚拟尺寸信息
 * @param target - 目标元素的dom节点或虚拟位置信息
 * @param options - 一些额外配置
 * @returns - popper在各个方向上的位置信息和可用情况
 * */
export declare function getPopperMetas(source: HTMLElement | GetPopperMetasSource, target: HTMLElement | GetPopperMetasBound, options?: GetPopperMetasOptions): getPopperMetasReturns;
/**
 * 根据GetBoundMetasReturns和当前位置、前一个位置来从meta中挑选下一个合适的方向, 当返回值3位true时，表示没有可用的位置
 * @param meta - getPopperMetas函数的返回值
 * @param direction - 预设位置, 优先选取
 * @param prevDirection - 表示前一个位置的key
 * */
export declare function getPopperDirectionForMeta(meta: GetBoundMetas, direction: GetBoundMetasDirectionKeys, prevDirection: GetBoundMetasDirectionKeys): [GetBoundDirectionItem, GetBoundMetasDirectionKeys, boolean?];
export {};
