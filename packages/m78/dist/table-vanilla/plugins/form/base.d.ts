import { TablePlugin } from "../../plugin.js";
import { FormRejectMetaItem, FormVerifyInstance } from "@m78/form";
import { TableKey } from "../../types/base-type.js";
import { _SchemaData } from "./types.js";
import { _TableInteractivePlugin } from "../interactive.js";
import { _TableSoftRemovePlugin } from "../soft-remove.js";
import { AnyFunction, AnyObject } from "@m78/utils";
import { TableCell, TableRow } from "../../types/items.js";
import { TableAttachData } from "../getter.js";
/** 在不同混合中可能都会用到的通用项 */
export interface _MixinBase extends TablePlugin {
}
export declare class _MixinBase {
    wrapNode: HTMLElement;
    verifyInstance: FormVerifyInstance;
    cellErrors: Map<TableKey, Map<TableKey, FormRejectMetaItem>>;
    rowChanged: Map<TableKey, true>;
    cellChanged: Map<TableKey, true>;
    defaultValues: Map<TableKey, AnyObject>;
    schemaDatas: Map<TableKey, _SchemaData>;
    addRecordMap: Map<TableKey, boolean>;
    removeRecordMap: Map<TableKey, AnyObject>;
    allRemoveRecordMap: Map<TableKey, AnyObject>;
    sortRecordMap: Map<TableKey, {
        /** 原索引 */
        originIndex: number;
        /** 当前索引 */
        currentIndex: number;
    }>;
    interactive: _TableInteractivePlugin;
    softRemove: _TableSoftRemovePlugin;
    editStatusMap: Map<TableKey, {
        required: boolean;
        cell: TableCell;
    }>;
    invalidList: {
        position: TableAttachData;
        cell: TableCell;
    }[];
    schemasMarkCB: AnyFunction;
    editStatusNodes: HTMLElement[];
    invalidNodes: HTMLElement[];
    errorsList: {
        message: string;
        position: TableAttachData;
        cell: TableCell;
    }[];
    updateErrorsCB: AnyFunction;
    errorsNodes: HTMLElement[];
    rowMarkList: {
        row: TableRow;
        position: TableAttachData;
        hasError: boolean;
    }[];
    updateRowMarkCB: AnyFunction;
    rowChangedNodes: HTMLElement[];
    changedCellList: TableAttachData[];
    changedCellCB: AnyFunction;
    cellChangedNodes: HTMLElement[];
    /** 获取verify实例 */
    getVerify(): FormVerifyInstance;
}
//# sourceMappingURL=base.d.ts.map