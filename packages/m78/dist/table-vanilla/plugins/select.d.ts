/// <reference types="lodash" />
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { AnyObject, AutoScroll, AutoScrollTriggerConfig } from "@m78/utils";
import { TableKey, TablePointInfo, TablePosition } from "../types/base-type.js";
import { TableInstance } from "../types/instance.js";
import { TableCell, TableCellWithDom, TableItems, TableRow } from "../types/items.js";
import { DragGesture, FullGestureState } from "@use-gesture/vanilla";
import { _TableDisablePlugin } from "./disable.js";
/** 实现选区和选中功能 */
export declare class _TableSelectPlugin extends TablePlugin implements TableSelect {
    /** 选中的行 */
    selectedRows: SelectMap;
    /** 选中的单元格 */
    selectedCells: SelectMap;
    /** 临时选中的行 */
    selectedTempRows: SelectMap;
    /** 临时选中的单元格 */
    selectedTempCells: SelectMap;
    /** 开始点 */
    startPoint: TablePointInfo | null;
    /** 当前触发的事件是否在开始时按下了shift */
    isShift: boolean;
    /** 记录每次事件中移动的总距离 */
    moveDistance: number;
    /** 记录最后一次的非shift down点 */
    lastPoint: TablePosition[] | null;
    /** 处理自动滚动行为间的冲突, 用于记录 autoScrollConflictDisabledConfigGenerate 方法的状态 */
    conflictDisableConfig: AutoScrollTriggerConfig | null;
    /** 边缘自动滚动控制器 */
    autoScroll: AutoScroll;
    /** 开始拖动之前的滚动位置, 用于自动滚动后修正框选区域 */
    autoScrollBeforePosition: TablePosition | null;
    /** 自动滚动距离边缘前的此位置开始触发 */
    static EDGE_SIZE: number;
    /** 拖动控制 */
    drag: DragGesture;
    /** 设置禁用样式 */
    disablePlugin: _TableDisablePlugin;
    beforeInit(): void;
    init(): void;
    mounted(): void;
    reload(): void;
    loadStage(stage: TableLoadStage, isBefore: boolean): void;
    beforeDestroy(): void;
    cellRender(cell: TableCellWithDom): void;
    /** 派发drag到start/move/end */
    dragDispatch: (e: FullGestureState<"drag">) => void;
    /** 选取开始 */
    selectStart: (e: FullGestureState<"drag">) => void;
    /** 选取已开始, 并开始移动 */
    selectMove: import("lodash").DebouncedFunc<(e: FullGestureState<"drag">) => void>;
    /** 选取结束 */
    selectEnd: () => void;
    /** 点击处理 */
    clickHandle: (cell: TableCell) => void;
    isSelectedTempRow: (key: TableKey) => boolean;
    isSelectedTempCell: (key: TableKey) => boolean;
    isSelectedRow: TableInstance["isSelectedRow"];
    isSelectedCell: TableInstance["isSelectedCell"];
    getSelectedRows: TableInstance["getSelectedRows"];
    getSelectedCells: TableInstance["getSelectedCells"];
    getSortedSelectedCells: TableInstance["getSortedSelectedCells"];
    selectRows: TableInstance["selectRows"];
    unselectRows(rowKeys: TableKey | TableKey[]): void;
    selectCells: TableInstance["selectCells"];
    unselectCells(cellKeys: TableKey | TableKey[]): void;
    /**
     * 根据传入的两个点更新临时选中状态
     * - 可传入interceptor来根据命中内容决定是否阻止后续操作
     * - 若没有选中项或interceptor()验证失败, 返回false
     * */
    selectByPoint: (p1: import("@m78/utils").TupleNumber, p2?: TablePosition, interceptor?: ((items: TableItems) => boolean) | undefined) => [boolean, TableItems];
    /**
     * 向selected map中设置行选中, item可以是cell/row的key或实例, 所有设置操作统一在此进行, 方便进行禁用等行为的拦截
     * - 返回false表示该次设置被拦截
     * */
    setSelected(item: any, map: AnyObject): boolean;
    /**
     * 处理固定项移动到边缘的自动滚动和常规拖动自动滚动两个行为的冲突
     * - 如果从固定项开始拖动, 则先禁用该方向的常规自动滚动, 等到移动到非固定项时再启用
     * */
    autoScrollConflictDisabledConfigGenerate(pos: TablePosition): AutoScrollTriggerConfig | undefined;
    /** 框选点在固定区域末尾时, 如果滚动边未贴合, 将其滚动到贴合位置, 一是解决瞬间选择大量数据的问题, 二是更符合直觉, 放置误选 */
    moveFixedEdgeHandle([x, y]: TablePosition): void;
    /** 自动触发滚动便捷的修正位置 */
    getAutoScrollBound(): {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    /** 更新自动滚动判定点 */
    updateAutoScrollBound: () => void;
    clearSelected(): void;
    clearTempSelected(): void;
    isCellSelectable(cell: TableCell): boolean;
    isRowSelectable(row: TableRow): boolean;
    /**
     * 专门用于框选的选区点转换
     * - 从固定区域拖选到非固定区域, 点非固定区开贴近固定区的位置开始计算点
     * - 从非固定区域拖动到固定区域, 若存在滚动位置, 则依然计算常规位置, 否则计算固定区位置
     * */
    transformSelectedPoint(startInfo: TablePointInfo, nowPoint: TablePosition): [TablePosition, TablePosition];
}
interface SelectMap {
    [key: string]: 1;
}
/** 选中相关的配置 */
export interface TableSelectConfig {
    /**
     * true | 配置行选中, 可传boolean进行开关控制或传入函数根据行单独控制
     * - 注意: 行选中与单元格选中是独立的, 禁用行并不会影响对应行单元格的选中, 因为复制粘贴等操作都是很有保留必要的
     * */
    rowSelectable?: boolean | ((row: TableRow) => boolean);
    /** true | 配置单元格选中, 可传boolean进行开关控制或传入函数根据单元格单独控制 */
    cellSelectable?: boolean | ((cell: TableCell) => boolean);
}
/** 选中相关的api */
export interface TableSelect {
    /** 指定行是否选中 */
    isSelectedRow(key: TableKey): boolean;
    /** 指定单元格是否选中 */
    isSelectedCell(key: TableKey): boolean;
    /** 获取选中的行 */
    getSelectedRows(): TableRow[];
    /** 获取选中的单元格 */
    getSelectedCells(): TableCell[];
    /** 获取包含顺序的选中单元格 */
    getSortedSelectedCells(): TableCell[][];
    /** 设置选中的行, 传入merge可保留之前的行选中 */
    selectRows(rowKeys: TableKey | TableKey[], merge?: boolean): void;
    /** 设置选中的单元格, 传入merge可保留之前的单元格选中 */
    selectCells(cellKeys: TableKey | TableKey[], merge?: boolean): void;
    /** 取消选中行 */
    unselectRows(rowKeys: TableKey | TableKey[]): void;
    /** 取消选中单元格 */
    unselectCells(cellKeys: TableKey | TableKey[]): void;
    /** 检测单元格是否可选中 */
    isCellSelectable(cell: TableCell): boolean;
    /** 检测行是否可选中 */
    isRowSelectable(row: TableRow): boolean;
}
export {};
//# sourceMappingURL=select.d.ts.map