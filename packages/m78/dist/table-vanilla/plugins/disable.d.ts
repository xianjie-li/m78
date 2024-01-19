import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { TableCell, TableCellWithDom, TableColumn, TableRow } from "../types/items.js";
import { SelectManager } from "@m78/utils";
import { TableReloadOptions } from "./life.js";
/** 在单元格/行/列上设置半透明遮挡物, 目前仅用于组件内部api设置临时禁用状态, 如拖动排序时, 为拖动列显示禁用样式 */
export declare class _TableDisablePlugin extends TablePlugin implements TableDisable {
    disabled: boolean;
    rowChecker: SelectManager<TableKey>[];
    columnChecker: SelectManager<TableKey>[];
    cellChecker: SelectManager<TableKey>[];
    /** 禁用行 */
    rows: SelectManager;
    /** 禁用单元格 */
    cells: SelectManager;
    /** 禁用列 */
    columns: SelectManager;
    cellRender(cell: TableCellWithDom): void;
    private clear;
    reload(opt: TableReloadOptions): void;
    beforeDestroy(): void;
    isDisabled: TableDisable["isDisabled"];
    isDisabledRow: TableDisable["isDisabledRow"];
    isDisabledColumn: TableDisable["isDisabledColumn"];
    isDisabledCell: TableDisable["isDisabledCell"];
    getDisabledRows: TableDisable["getDisabledRows"];
    getDisabledColumns: TableDisable["getDisabledColumns"];
    getDisabledCells: TableDisable["getDisabledCells"];
    setRowDisable: TableDisable["setRowDisable"];
    setColumnDisable: TableDisable["setColumnDisable"];
    setCellDisable: TableDisable["setCellDisable"];
    disable: TableDisable["disable"];
    clearDisable(): void;
}
/** 禁用相关的api */
export interface TableDisable {
    /** 表格是否禁用 */
    isDisabled(): boolean;
    /** 指定行是否禁用 */
    isDisabledRow(key: TableKey): boolean;
    /** 指定列是否禁用 */
    isDisabledColumn(key: TableKey): boolean;
    /** 指定单元格是否禁用 */
    isDisabledCell(key: TableKey): boolean;
    /** 获取禁用的行 */
    getDisabledRows(): TableRow[];
    /** 获取禁用的列 */
    getDisabledColumns(): TableColumn[];
    /** 获取禁用的单元格 */
    getDisabledCells(): TableCell[];
    /** 设置表格禁用状态 */
    disable(disable: boolean): void;
    /**
     * 设置行禁用
     * @param keys - 行key
     * @param disable - true | 要设置的禁用状态
     * @param merge - true | 设置为false可保留之前的行禁用
     * */
    setRowDisable(keys: TableKey[], disable?: boolean, merge?: boolean): void;
    /**
     * 设置列禁用
     * @param keys - 列key
     * @param disable - true | 要设置的禁用状态
     * @param merge - true | 设置为false可保留之前的行禁用
     * */
    setColumnDisable(keys: TableKey[], disable?: boolean, merge?: boolean): void;
    /**
     * 设置列禁用
     * @param keys - 单元格key
     * @param disable - true | 要设置的禁用状态
     * @param merge - true | 设置为false可保留之前的行禁用
     * */
    setCellDisable(keys: TableKey[], disable?: boolean, merge?: boolean): void;
    /** 清理所有禁用状态 */
    clearDisable(): void;
}
//# sourceMappingURL=disable.d.ts.map