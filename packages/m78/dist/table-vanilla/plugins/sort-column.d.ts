import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
/**
 * 表格列排序
 *
 * sortColumns只配置了部分项时, 先按顺序显示排序后的列, 再显示不再排序中的列, 左右固定项和中间部分分别进行排序
 * */
export declare class _TableSortColumnPlugin extends TablePlugin {
    loadStage(stage: TableLoadStage, isBefore: boolean): void;
    /** 处理sortColumns */
    handle(): void;
    getColumnSortKeys(): TableKey[];
}
export interface TableSortColumn {
    /** 根据当前columns的顺序获取keys */
    getColumnSortKeys(): TableKey[];
}
//# sourceMappingURL=sort-column.d.ts.map