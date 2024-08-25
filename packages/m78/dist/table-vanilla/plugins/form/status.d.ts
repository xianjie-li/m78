import { _MixinBase } from "./base.js";
import { TableKey } from "../../types/base-type.js";
import { NamePath } from "@m78/form";
import { TableColumn } from "../../types/items.js";
import { TableDataStatus } from "./types.js";
export interface _MixinStatus extends _MixinBase {
}
/** form状态相关 */
export declare class _MixinStatus {
    getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;
    getTableChanged(): boolean;
    /** 检测是否发生了数据排序 */
    getSortedStatus(): boolean;
    /** 获取当前显示的列的可编辑情况, 显示的所有行中任意一行的改列可编辑即视为可编辑 */
    getEditStatus(col: TableColumn): {
        required: boolean;
        cell: import("../../types/items.js").TableCell;
    } | null;
    getChangeStatus(): TableDataStatus;
}
//# sourceMappingURL=status.d.ts.map