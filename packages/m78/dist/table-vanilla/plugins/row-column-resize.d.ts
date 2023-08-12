/// <reference types="lodash" />
import { TablePlugin } from "../plugin.js";
import { RafFunction } from "@m78/utils";
import { TableColumn, TableItems, TableRow } from "../types/items.js";
import { TriggerInstance, TriggerEvent, TriggerTargetMeta } from "../../trigger/index.js";
/** 列/行重置大小 */
export declare class _TableRowColumnResize extends TablePlugin {
    /** 提示线 */
    xLine: HTMLDivElement;
    yLine: HTMLDivElement;
    /** 显示重置后大小 */
    sizeBlock: HTMLDivElement;
    wrap: HTMLDivElement;
    /** 标识resize把手的key */
    static VIRTUAL_COLUMN_HANDLE_KEY: string;
    static VIRTUAL_ROW_HANDLE_KEY: string;
    /** 最小/大列尺寸 */
    static MIN_COLUMN_WIDTH: number;
    static MAX_COLUMN_WIDTH: number;
    /** 最小/大行尺寸 */
    static MIN_ROW_HEIGHT: number;
    static MAX_ROW_HEIGHT: number;
    /** 虚拟节点触发事件 */
    trigger: TriggerInstance;
    rafCaller: RafFunction;
    rafClearFn: () => void;
    /** 拖动中 */
    dragging: boolean;
    /** 是否触发了hover */
    activating: boolean;
    /** 轴偏移 */
    dragOffsetX: number;
    dragOffsetY: number;
    initialized(): void;
    rendered(): void;
    beforeDestroy(): void;
    /** 每次render后根据ctx.lastViewportItems更新虚拟拖拽节点 */
    renderedDebounce: import("lodash").DebouncedFunc<() => void>;
    /** 生成虚拟节点 */
    createBound(wrapBound: DOMRect, last: TableItems, isRow: boolean): TriggerTargetMeta[];
    triggerDispatch: (e: TriggerEvent) => void;
    hoverHandle: ({ target, active }: TriggerEvent) => void;
    dragHandle: ({ target, first, last, deltaX, deltaY }: TriggerEvent) => void;
    scrollHandle: () => void;
    /** 更新column配置 */
    updateColumnSize(column: TableColumn, diff: number): void;
    /** 更新row配置 */
    updateRowSize(row: TableRow, diff: number): void;
    /** 显示并更新xLine位置 */
    updateXTipLine(x: number, bound: TriggerTargetMeta): void;
    /** 显示并更新yLine位置 */
    updateYTipLine(y: number, bound: TriggerTargetMeta): void;
    /** 隐藏xLine */
    hideXTipLine(): void;
    /** 隐藏yLine */
    hideYTipLine(): void;
}
//# sourceMappingURL=row-column-resize.d.ts.map