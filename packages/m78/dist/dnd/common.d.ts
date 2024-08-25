import { _DNDMapEntry, _GroupState, DNDEnableInfos, DNDNode, DNDPosition, DNDProps, DNDStatus, _Context, _PendingItem, _LevelContext } from "./types.js";
import { AnyObject, Bound, TupleNumber } from "@m78/utils";
export declare const _DEFAULT_GROUP = "M78-DND-DEFAULT-GROUP";
/** 所有分组数据 */
export declare const _groupMap: {
    [key: string]: _GroupState;
};
/** 用于为dnd标记层级关系的context */
export declare const _levelContext: import("react").Context<_LevelContext>;
/** 在此比例内的区域视为边缘 */
export declare const EDGE_RATIO = 0.24;
export declare const _defaultDNDStatus: DNDStatus;
export declare const _defaultDNDEnableInfos: DNDEnableInfos;
export declare function _useGroup(groupId?: string): _GroupState;
/** 判断x, y 是否在指定的DOMRect区间中 */
export declare function _isBetweenBound({ left, top, right, bottom }: Bound, x: number, y: number): boolean;
/**
 * 通知所有dnd进行状态重置, 应跳过ignoreIds指定的节点, 且状态有变时才进行重置, 否则会造成高频更新,
 * 传入skipEnableReset时, 跳过enables状态的重置
 * */
export declare const _resetEvent: import("@m78/hooks").CustomEventWithHook<(ignoreIds?: string[], skipEnableReset?: boolean) => void>;
/** 通知所有dnd同步位置尺寸信息 */
export declare const _updateEvent: import("@m78/hooks").CustomEventWithHook<(useThrottle: boolean, groupId?: string) => void>;
/** 用于处理draggingListen, 通知所有dnd更新 */
export declare const _draggingEvent: import("@m78/hooks").CustomEventWithHook<(id: string, dragging: boolean, groupId?: string) => void>;
export declare const _allValueIsTrue: (obj: AnyObject) => boolean;
export declare const _someValueIsTrue: (obj: AnyObject) => boolean;
export declare const _getObjectByNewValues: (obj: AnyObject, value: boolean) => AnyObject;
/** 根据enableDrop获取DNDEnableInfos */
export declare const _enableDropProcess: (enableDrop: DNDProps["enableDrop"], current: DNDNode, source: DNDNode) => DNDEnableInfos;
/** 处理并获取DNDStatus */
export declare const _statusProcess: (dnd: _DNDMapEntry, enables: DNDEnableInfos, x: number, y: number) => DNDStatus;
/** 计算元光标和指定元素的覆盖状态, 此函数假设光标已在bound范围内 */
export declare function _calcOverStatus(bound: Bound, x: number, y: number): DNDPosition;
/** 根据启用和放置状态判定是否可触发Accept */
export declare function _checkIfAcceptable(enables: DNDEnableInfos, status: DNDStatus): boolean;
/**
 * 过滤并处理所有在光标区域内的可用dnd节点, 并主要进行以下操作:
 * - 筛选可用并覆盖了光标的dnd
 * - 在初次点击时, 更新所有可见dnd的enable状态
 * - 为满足条件的dnd生成各位置的status
 * */
export declare function _filterInBoundDNDs(ctx: _Context, first: boolean, xy: TupleNumber): _PendingItem[];
/**
 * 从一组同时命中的dnd中按照指定规则取出一个作为命中点
 * - 规则: 获取level最高的放置点, 若依然存在多个, 获取挂载时间最靠后的一个
 * */
export declare function _getCurrentTriggerByMultipleTrigger(inBoundList: _PendingItem[]): _PendingItem;
/**  根据事件元素类型决定是否禁止拖动 */
export declare function _isIgnoreEl(event?: any, ignoreElFilter?: DNDProps["ignore"]): boolean;
//# sourceMappingURL=common.d.ts.map