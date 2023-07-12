import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { TableCell, TableCellWithDom, TableRow } from "../types/items.js";
/** 在单元格/行/列上设置半透明遮挡物进行禁用 */
export declare class _TableDisablePlugin extends TablePlugin {
    disabled: boolean;
    /** 禁用行 */
    rows: DisabledMap;
    /** 禁用单元格 */
    cells: DisabledMap;
    /** 禁用列 */
    columns: DisabledMap;
    beforeInit(): void;
    cellRender(cell: TableCellWithDom): void;
    isDisabled: TableDisable["isDisabledRow"];
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
interface DisabledMap {
    [key: string]: 1 | 0;
}
/** 禁用相关的api */
export interface TableDisable {
    /** 表格是否禁用 */
    isDisabled(): boolean;
    /** 指定行是否禁用 */
    isDisabledRow(key: TableKey): boolean;
    /** 指定行是否禁用 */
    isDisabledColumn(key: TableKey): boolean;
    /** 指定单元格是否禁用 */
    isDisabledCell(key: string): boolean;
    /** 获取禁用的行 */
    getDisabledRows(): TableRow[];
    /** 获取禁用的列 */
    getDisabledColumns(): TableRow[];
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
export {};
//# sourceMappingURL=disable.d.ts.map