import { TablePlugin } from "../plugin.js";
import { TableColumn, TableRow } from "../types/items.js";
import { DragGesture } from "@use-gesture/vanilla";
import { _TableRowColumnResize } from "./row-column-resize.js";
import { AutoScroll, RafFunction } from "@m78/utils";
import { TablePosition } from "../types/base-type.js";
import { _TableSelectPlugin } from "./select.js";
import { _TableDisablePlugin } from "./disable.js";
/** 表格行/列排序 */
export declare class _TableDragSortPlugin extends TablePlugin {
    /** 拖动控制 */
    drag: DragGesture;
    lastColumns: TableColumn[] | undefined;
    lastRows: TableRow[] | undefined;
    /** 获取当前的行/列resize状态 */
    rcResize: _TableRowColumnResize;
    /** 获取当前的选区插件信息 */
    select: _TableSelectPlugin;
    /** 设置禁用样式 */
    disablePlugin: _TableDisablePlugin;
    /** 正在拖动 */
    dragging: boolean;
    /** 提示节点的容器 */
    wrap: HTMLDivElement;
    /** 提示区域 */
    tipAreaX: HTMLDivElement;
    tipAreaY: HTMLDivElement;
    /** 提示线 */
    tipLineX: HTMLDivElement;
    tipLineY: HTMLDivElement;
    /** 拖动到的目标行 */
    targetRow?: TableRow;
    /** 拖动到的目标列 */
    targetColumn?: TableColumn;
    /** 若为true, 表示拖动的目标之后 */
    isTargetAfter?: boolean;
    /** 边缘自动滚动控制器 */
    autoScroll: AutoScroll;
    rafCaller: RafFunction;
    /** 开始拖动的一些信息记录 */
    firstData?: {
        position: number;
        size: number;
        offset: TablePosition;
        diffOffset: TablePosition;
    };
    mounted(): void;
    reload(): void;
    beforeDestroy(): void;
    triggerMoveRow(rows: TableRow[], target: TableRow, isTargetAfter?: boolean): void;
    triggerMoveColumn(columns: TableColumn[], target: TableColumn, isTargetAfter?: boolean): void;
    /** 将拖动事件派发到对应的行/列事件中 */
    private dragDispatch;
    /** 处理列拖移 */
    private updateColumnNode;
    /** 处理行拖移 */
    private updateRowNode;
    /** 开始拖动时, 记录一些需要在拖动阶段使用的信息, 必须保证isRow对应方向的lastRows/lastColumns存在 */
    private memoFirstData;
    /** 通用的拖动更新逻辑 */
    private updateNodeCommon;
    /** 初始化dom节点 */
    private initNodes;
    /** 更新自动滚动判定点 */
    private updateAutoScrollBound;
}
export interface TableDragSortConfig {
    /** 是否允许拖拽排序行 */
    dragSortRow?: boolean;
    /** 是否允许拖拽排序列 */
    dragSortColumn?: boolean;
}
//# sourceMappingURL=drag-sort.d.ts.map