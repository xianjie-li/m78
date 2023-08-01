import { TablePlugin } from "../plugin.js";
import { TableReloadLevel } from "./life.js";
import { TableKey } from "../types/base-type.js";
/**
 * note:
 * sortColumns 和拖拽排序都不支持合并头的场景
 * 需要知道某项是否为子项
 * */
/** 表格列排序 */
export declare class _TableSortColumnPlugin extends TablePlugin {
    loadStage(level: TableReloadLevel, isBefore: boolean): void;
    /** 处理sortColumns */
    handle(): void;
    getColumnSortKeys(): TableKey[];
}
export interface TableSortColumn {
    /** 根据当前columns的顺序获取keys */
    getColumnSortKeys(): TableKey[];
}
//# sourceMappingURL=sort-column.d.ts.map