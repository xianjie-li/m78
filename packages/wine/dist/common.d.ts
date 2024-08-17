import { Bound, BoundSize, TupleNumber } from "@m78/utils";
import { _WineContext, WineDragPosition, WineSelf } from "./types.js";
/** 根据alignment值获取x, y值 */
export declare function calcAlignment(alignment: TupleNumber, limit: Bound, self: WineSelf): number[];
/** 根据[number, height]格式的元组取{ w, h }格式的对象 */
export declare function sizeTuple2Obj(sizeT: TupleNumber): {
    w: number;
    h: number;
};
/** sizeTuple2Obj的偏移版本` */
export declare function offsetTuple2Obj(offsetT: TupleNumber): {
    x: number;
    y: number;
};
/** 根据state状态获取当前尺寸 */
export declare function getSizeByState(state: _WineContext["state"]): TupleNumber;
/** 创建一个空的dom节点 */
export declare function getTipNode(): HTMLDivElement | undefined;
/** 便捷获取尺寸对象 */
export declare function sizeBoundHelper(left: number, top: number, width: number, height: number): BoundSize;
/** 获取预设方向的尺寸和位置 */
export declare function getPresetPosition(pos: WineDragPosition, [fW, fH]: TupleNumber, flb: Bound): BoundSize;
/** 传入光标位置、屏幕相关信息，获取触发tip节点的方向信息, 依次插入路全屏大小,  */
export declare function getTipNodeStatus(fullSize: TupleNumber, xy: TupleNumber, limitBound?: Partial<Bound>): BoundSize | undefined;
/** 根据state获取fullSize */
export declare function getFullSize(_state: _WineContext["state"]): TupleNumber;
//# sourceMappingURL=common.d.ts.map