import { TablePlugin } from "../plugin.js";
import { TableCell, TableColumn, TableRow } from "../types/items.js";
import { TableKey } from "../types/base-type.js";
export declare class _TableIsPlugin extends TablePlugin implements TableIs {
    /** 内部isActive状态 */
    _isActive: boolean;
    /** 可由用户控制的active状态, 和_isActive一起构成active状态  */
    _isControllableActive: boolean;
    beforeInit(): void;
    mounted(): void;
    beforeDestroy(): void;
    isColumnVisible(key: TableKey, partial?: boolean): boolean;
    isRowVisible(key: TableKey, partial?: boolean): boolean;
    isCellVisible(rowKey: TableKey, columnKey: TableKey, partial?: boolean): boolean;
    isRowMount(key: TableKey): boolean;
    isColumnMount(key: TableKey): boolean;
    isFocus(checkChildren?: boolean): boolean;
    isActive(is?: boolean): boolean;
    isColumnExist(key: TableKey): boolean;
    isRowExist(key: TableKey): boolean;
    isColumnExistByIndex(ind: number): boolean;
    isRowExistByIndex(ind: number): boolean;
    isRowLike(row: any): row is TableRow;
    isColumnLike(column: any): column is TableColumn;
    isCellLike(cell: any): cell is TableCell;
    isTableKey(key: any): key is TableKey;
    private visibleCommon;
    private activeEventBind;
    private activeEventUnBind;
    private onActive;
    private onIsActiveCheck;
    private onWindowBlur;
}
export interface TableIs {
    /** 指定列是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
    isColumnVisible(key: TableKey, partial?: boolean): boolean;
    /** 指定行是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
    isRowVisible(key: TableKey, partial?: boolean): boolean;
    /** 指定单元格是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
    isCellVisible(rowKey: TableKey, columnKey: TableKey, partial?: boolean): boolean;
    /** 指定列是否挂载, 与 isColumnVisible(key, true) 非常相似, 但是前者是通过当前位置计算对比, isColumnMount是读取缓存结果, 效率更高 */
    isColumnMount(key: TableKey): boolean;
    /** 指定行是否挂载, 与 isRowVisible(key, true) 非常相似, 但是前者是通过当前位置计算对比, isColumnMount是读取缓存结果, 效率更高 */
    isRowMount(key: TableKey): boolean;
    /** 表格是否聚焦, checkChildren为true时会检测子级是否聚焦 */
    isFocus(checkChildren?: boolean): boolean;
    /**
     * 表格是否处于活动状态, 即: 最近进行过点击, hover, 滚动等, 在某些弹出层打开时
     * - 在某些场景下, 比如开启了自定义弹出层, 可以手动设置false来禁用表格的一些快捷键操作, 但务必在其关闭后重新设为true
     * */
    isActive(is?: boolean): boolean;
    /** 指定key的数据是否存在 */
    isRowExist(key: TableKey): boolean;
    /** 指定key的列是否存在 */
    isColumnExist(key: TableKey): boolean;
    /** 指定index的数据是否存在 */
    isColumnExistByIndex(ind: number): boolean;
    /** 指定index的列是否存在 */
    isRowExistByIndex(ind: number): boolean;
    /** 是否是类似row的结构. 注意, 此方法为粗检测, 结果并不可靠 */
    isRowLike(row: any): row is TableRow;
    /** 是否是类似column的结构. 注意, 此方法为粗检测, 结果并不可靠 */
    isColumnLike(column: any): column is TableColumn;
    /** 是否是类似cell的结构. 注意, 此方法为粗检测, 结果并不可靠 */
    isCellLike(cell: any): cell is TableCell;
    /** 是否是合格的tableKey */
    isTableKey(key: any): key is TableKey;
}
export interface TableIsConfig {
    /** 额外的用于判断table active状态的组件, 用于自定义了外层包裹容器这类的场景 */
    extraActiveCheckEl?: HTMLElement;
}
//# sourceMappingURL=is.d.ts.map