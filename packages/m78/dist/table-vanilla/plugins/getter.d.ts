import { TablePlugin } from "../plugin.js";
import { BoundSize, TupleNumber } from "@m78/utils";
import { TableKey, TablePointInfo, TablePosition } from "../types/base-type.js";
import { TableCell, TableColumn, TableItems, TableItemsFull, TableRow } from "../types/items.js";
import { TableMergeData } from "../types/context.js";
export declare class _TableGetterPlugin extends TablePlugin implements TableGetter {
    init(): void;
    transformViewportPoint([x, y]: TablePosition, fixedOffset?: number): TablePointInfo;
    transformContentPoint(pos: TablePosition): TablePointInfo;
    getAreaBound(p1: TablePosition, p2?: TablePosition): TableItems;
    getBoundItems(target: BoundSize | TablePosition, skipFixed?: boolean): TableItems;
    /**
     * 内部使用的getBoundItems, 包含了startRowIndex等额外返回
     * - 注意, 返回的index均对应dataFixedSortList/columnsFixedSortList而不是配置中的data
     * */
    getBoundItemsInner(target: BoundSize | TupleNumber, skipFixed?: boolean): TableItemsFull;
    getViewportItems(): TableItems;
    /** 获取指定行的TableRow */
    getRow(key: TableKey): TableRow;
    getColumn(key: TableKey): TableColumn;
    getCellKey(rowKey: TableKey, columnKey: TableKey): string;
    /** 根据单元格key获取cell */
    getCellByStrKey(key: string): TableCell;
    /** 获取指定行, 列坐标对应的TableCell */
    getCell(rowKey: TableKey, columnKey: TableKey): TableCell;
    /** 获取指定列左侧的距离 */
    getBeforeSizeX(index: number): number;
    /** 获取指定行上方的距离 */
    getBeforeSizeY(index: number): number;
    /** 二分查找, 包含了对无效项的处理, 返回分别表示:  小于, 等于, 大于, 无效 , 当处于无效项时, 需要向前左/右选区第一个有效项后继续 */
    binarySearch(list: any[], comparator: (item: any, index: number) => -1 | 0 | 1 | null): any;
    getKeyByRowIndex(ind: number): TableKey;
    getKeyByColumnIndex(ind: number): TableKey;
    getIndexByRowKey(key: TableKey): number;
    getIndexByColumnKey(key: TableKey): number;
    getKeyByRowData(cur: any): TableKey;
    isColumnExist(key: TableKey): boolean;
    isRowExist(key: TableKey): boolean;
    isColumnExistByIndex(ind: number): boolean;
    isRowExistByIndex(ind: number): boolean;
    /** 处理merge项, 防止cell列表重复推入相同项, 并在确保cell中包含被合并项的父项, 回调返回true时表示以处理, 需要跳过后续流程 */
    cellMergeHelper(list: TableCell[]): (cell: TableCell) => boolean;
    getMergeData(cell: TableCell): TableMergeData;
    getMergedData(cell: TableCell): [TableKey, TableKey];
    /** 获取指定索引前的所有忽略项 */
    getBeforeIgnoreX(index: number): number[];
    /** 获取指定索引前的所有忽略项 */
    getBeforeIgnoreY(index: number): number[];
}
/** 选择器 */
export interface TableGetter {
    /**
     * 获取指定区域的row/column/cell, 点的取值区间为[0, 内容总尺寸]
     * @param target - 可以是包含区域信息的bound对象, 也可以是表示[x, y]的位置元组
     * @param skipFixed - false | 是否跳过fixed项获取
     * */
    getBoundItems(target: BoundSize | TablePosition, skipFixed?: boolean): TableItems;
    /**
     * 获取当前视口内可见的row/column/cell */
    getViewportItems(): TableItems;
    /** 获取两个点区间内的元素, 点的区间为: [0, 内容总尺寸] */
    getAreaBound(p1: TablePosition, p2?: TablePosition): TableItems;
    /**
     * 根据表格视区内的点获取基于内容尺寸的点, 传入点的区间为: [0, 表格容器尺寸].
     * - 可传入fixedOffset来对fixed项的判定区域增加或减少
     * */
    transformViewportPoint([x, y]: TablePosition, fixedOffset?: number): TablePointInfo;
    /**
     * 转换内容区域的点为表格视区内的点, 传入点的区间为: [0, 表格内容尺寸].
     * 包含了对缩放的处理
     * */
    transformContentPoint([x, y]: TablePosition): TablePointInfo;
    /** 获取指定行 */
    getRow(key: TableKey): TableRow;
    /** 获取指定列 */
    getColumn(key: TableKey): TableColumn;
    /** 获取指定单元格 */
    getCell(rowKey: TableKey, columnKey: TableKey): TableCell;
    /** 根据行和列的key生成cell key */
    getCellKey(rowKey: TableKey, columnKey: TableKey): TableKey;
    /** 根据单元格key获取cell */
    getCellByStrKey(key: string): TableCell;
    /** 获取指定索引记录的key. 注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.data中项的索引 */
    getKeyByRowIndex(ind: number): TableKey;
    /** 获取指定column的key.  注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.columns中项的索引 */
    getKeyByColumnIndex(ind: number): TableKey;
    /** 获取key的row索引. 注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.data中项的索引 */
    getIndexByRowKey(key: TableKey): number;
    /** 获取key的column索引.  注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.columns中项的索引 */
    getIndexByColumnKey(key: TableKey): number;
    /** 指定key的数据是否存在 */
    isRowExist(key: TableKey): boolean;
    /** 指定key的列是否存在 */
    isColumnExist(key: TableKey): boolean;
    /** 获取被合并信息, 若有返回则表示是一个被合并项 */
    getMergedData(cell: TableCell): [TableKey, TableKey] | undefined;
    /** 获取合并信息, 若有返回则表示是一个合并项 */
    getMergeData(cell: TableCell): TableMergeData | undefined;
    /** 从数据上获取key */
    getKeyByRowData(cur: any): TableKey;
}
//# sourceMappingURL=getter.d.ts.map