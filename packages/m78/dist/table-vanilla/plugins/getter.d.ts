import { TablePlugin } from "../plugin.js";
import { BoundSize } from "@m78/utils";
import { TableKey, TablePosition } from "../types/base-type.js";
import { TableCell, TableColumn, TableItems, TableRow } from "../types/items.js";
import { TableMergeData } from "../types/context.js";
import { _TableHidePlugin } from "./hide.js";
import { Position } from "../../common/index.js";
export declare class _TableGetterPlugin extends TablePlugin implements TableGetter {
    hide: _TableHidePlugin;
    beforeInit(): void;
    init(): void;
    getContentHeight(): number;
    getContentWidth(): number;
    getMaxX(): number;
    getMaxY(): number;
    getHeight(): number;
    getWidth(): number;
    getX(): number;
    getY(): number;
    getXY(): TablePosition;
    getAreaBound(p1: TablePosition, p2?: TablePosition): TableItems;
    getBoundItems(target: BoundSize | TablePosition, skipFixed?: boolean): TableItems;
    /**
     * 内部使用的getBoundItems, 包含了startRowIndex等额外返回
     * - 注意, 返回的index均对应dataFixedSortList/columnsFixedSortList而不是配置中的data
     * */
    private getBoundItemsInner;
    getViewportItems(): TableItems;
    /** 获取指定行的实例, useCache为false时会跳过缓存重新计算关键属性, 并将最新内容写入缓存 */
    getRow(key: TableKey, useCache?: boolean): TableRow;
    /** 跳过缓存获取最新的row */
    private getFreshRow;
    /** 获取指定列的实例, useCache为false时会跳过缓存重新计算关键属性, 并将最新内容写入缓存 */
    getColumn(key: TableKey, useCache?: boolean): TableColumn;
    /** 跳过缓存获取最新的column */
    private getFreshColumn;
    getCellKey(rowKey: TableKey, columnKey: TableKey): string;
    /** 根据单元格key获取cell */
    getCellByStrKey(key: string): TableCell;
    /** 根据单元格类型获取其文本 */
    getText(cell: TableCell): string;
    getCell(rowKey: TableKey, columnKey: TableKey, useCache?: boolean): TableCell;
    private getFreshCell;
    getNearCell(arg: Parameters<TableGetter["getNearCell"]>[0]): TableCell | void;
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
    /** 处理merge项, 防止cell列表重复推入相同项, 并在确保cell中包含被合并项的父项, 回调返回true时表示以处理, 需要跳过后续流程 */
    private cellMergeHelper;
    getMergeData(cell: TableCell): TableMergeData;
    getMergedData(cell: TableCell): [TableKey, TableKey];
    /** 获取指定索引前的所有忽略项 */
    getBeforeIgnoreX(index: number): number[];
    /** 获取指定索引前的所有忽略项 */
    getBeforeIgnoreY(index: number): number[];
    getAttachPosition(cell: TableCell): TableAttachData;
    getColumnAttachPosition(column: TableColumn): TableAttachData;
    getRowAttachPosition(row: TableRow): TableAttachData;
}
/** 选择器 */
export interface TableGetter {
    /** 获取x */
    getX(): number;
    /** 获取y */
    getY(): number;
    /** 获取y */
    getXY(): TablePosition;
    /** 获取x最大值 */
    getMaxX(): number;
    /** 获取y最大值 */
    getMaxY(): number;
    /** 获取宽度 */
    getWidth(): number;
    /** 获取高度 */
    getHeight(): number;
    /** 内容区域宽度 */
    getContentWidth(): number;
    /** 内容区域高度 */
    getContentHeight(): number;
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
    /** 获取临近的单元格 */
    getNearCell(arg: {
        /** 目标单元格 */
        cell: TableCell;
        /** Position.right | 要获取的方向 */
        position?: Position;
        /** 过滤调无效单元格(返回false) */
        filter?: (cell: TableCell) => boolean;
    }): TableCell | void;
    /** 获取指定索引记录的key. 注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.data中项的索引 */
    getKeyByRowIndex(ind: number): TableKey;
    /** 获取指定column的key.  注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.columns中项的索引 */
    getKeyByColumnIndex(ind: number): TableKey;
    /** 获取key的row索引. 注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.data中项的索引 */
    getIndexByRowKey(key: TableKey): number;
    /** 获取key的column索引.  注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.columns中项的索引 */
    getIndexByColumnKey(key: TableKey): number;
    /** 获取被合并信息, 若有返回则表示是一个被合并项 */
    getMergedData(cell: TableCell): [TableKey, TableKey] | undefined;
    /** 获取合并信息, 若有返回则表示是一个合并项 */
    getMergeData(cell: TableCell): TableMergeData | undefined;
    /** 从数据上获取key */
    getKeyByRowData(cur: any): TableKey;
    /** 获取cell所处画布位置, 需要在单元格位置挂载其他内容而不是挂载到单元格dom内部时非常有用 */
    getAttachPosition(cell: TableCell): TableAttachData;
    /** 获取column所处画布位置, 需要在列位置挂载其他内容而不是挂载到单元格dom内部时非常有用 */
    getColumnAttachPosition(column: TableColumn): TableAttachData;
    /** 获取row所处画布位置, 需要在列位置挂载其他内容而不是挂载到单元格dom内部时非常有用 */
    getRowAttachPosition(row: TableRow): TableAttachData;
}
export interface TableAttachData extends BoundSize {
    /** 应该挂载的zIndex层 */
    zIndex: string;
}
//# sourceMappingURL=getter.d.ts.map