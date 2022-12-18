import React from "react";
import { AnyFunction, BoundSize, TupleNumber } from "@m78/utils";
import { TransitionType } from "../transition/index.js";
import { useSame, UseTriggerEvent, UseTriggerType } from "@m78/hooks";
import { _ArrowBasePosition, _ClampBound, _Context, _DirectionMeta, _DirectionMetaMap, _DragContext, OverlayDirectionKeys, OverlayDirectionUnion, OverlayProps, OverlayRenderOption } from "./types.js";
export declare const _defaultAlignment: TupleNumber;
export declare const _defaultProps: {
    namespace: string;
    transitionType: TransitionType;
    zIndex: number;
    clickAwayClosable: boolean;
    clickAwayQueue: boolean;
    lockScroll: boolean;
    arrowSize: number[];
    offset: number;
    triggerType: UseTriggerType;
    autoFocus: boolean;
};
export declare const transitionConfig: {
    readonly tension: 210;
    readonly friction: 20;
};
/** 箭头和目标之间的补白 */
export declare const _arrowSpace = 4;
export declare const dragContext: React.Context<_DragContext>;
/** 检测入参是否为BoundSize */
export declare function isBound(a: any): a is BoundSize;
/**
 * alignment转换为实际xy
 * @param alignment - align配置
 * @param size - 容器尺寸
 * */
export declare function _calcAlignment(alignment: TupleNumber, size: TupleNumber): number[];
/** 当要为其他上层组件创建api时, 通过此函数来剔除不必要的props */
export declare function getApiProps(props: OverlayProps): OverlayRenderOption;
declare type SameConfig = Parameters<typeof useSame>[1];
/**
 * 所有弹层类组件共享的useSame包装, 用于统一mask显示
 * */
export declare function useOverlaysMask(config?: SameConfig): {
    index: number;
    list: import("@m78/hooks").SameItem<unknown>[];
    id: string;
    isFirst: boolean;
    isLast: boolean;
};
/**
 * 所有弹层类组件共享的useSame包装, 用于统一clickAway
 * */
export declare function useOverlaysClickAway(config?: SameConfig, namespace?: string): {
    index: number;
    list: import("@m78/hooks").SameItem<unknown>[];
    id: string;
    isFirst: boolean;
    isLast: boolean;
};
/** useTrigger回调 */
export declare function _onTrigger(e: UseTriggerEvent, setOpen: AnyFunction, self: _Context["self"]): void;
/**
 * 根据t, c获取内容在OverlayDirection各个位置上的坐标信息_DirectionMeta
 * */
export declare function _getDirections(t: BoundSize, c: BoundSize, clampBound: _ClampBound, offset?: number): _DirectionMetaMap;
/**
 * 接收_DirectionMetaMap和指定的方向, 在该方向不可用时依次选取 lastDirection > 相反方向 > 其他备选方向
 * @param direction - 指定方向
 * @param directions - 所有可用方向
 * @param lastDirection - 最后一次使用的方向
 * */
export declare function _flip(direction: OverlayDirectionKeys, directions: _DirectionMetaMap, lastDirection?: OverlayDirectionKeys): _DirectionMeta;
/**
 * 在所在轴超出窗口时, 修正位置避免遮挡
 * number为监听的实际偏移值
 * boolean表示气泡是否应该隐藏或弱化显示, 超出可见区域一个t尺寸时为true
 * */
export declare function _preventOverflow(dMeta: _DirectionMeta, t: BoundSize, c: BoundSize, clampBound: _ClampBound, [w, h]: NonNullable<OverlayProps["arrowSize"]>): [_DirectionMeta, number, boolean];
/**
 * 获取箭头的的基础位置
 * */
export declare function _getArrowBasePosition(direction: OverlayDirectionUnion, [w, h]: NonNullable<OverlayProps["arrowSize"]>): _ArrowBasePosition;
/** 指定方向是否是x轴 */
export declare function _isX(direction: OverlayDirectionUnion): boolean;
/** 指定的方向是否是右或者上 */
export declare function _isRightOrTop(direction: OverlayDirectionUnion): boolean;
/** 是否为非Start和End的方向 */
export declare function _isLTRB(direction: OverlayDirectionUnion): boolean;
export declare function _isStart(direction: OverlayDirectionUnion): boolean;
export declare function _isEnd(direction: OverlayDirectionUnion): boolean;
/** 从一组dom中获取最小bound */
export declare function _getMinClampBound(els: HTMLElement[]): _ClampBound;
export {};
//# sourceMappingURL=common.d.ts.map