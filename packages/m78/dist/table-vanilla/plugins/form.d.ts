import { FormInstance, FormSchema } from "../../form-vanilla/index.js";
import { NamePath } from "@m78/utils";
import { TableKey } from "../types/base-type.js";
import { TablePlugin } from "../plugin.js";
import { TableCell, TableColumn } from "../types/items.js";
import { TableMutationEvent } from "./mutation.js";
import { RejectMeta } from "@m78/verify";
import { TableReloadLevel } from "./life.js";
import { _TableInteractiveCorePlugin } from "./interactive-core.js";
export declare class _TableFormPlugin extends TablePlugin implements TableForm {
    wrapNode: HTMLElement;
    formInstances: Record<string, FormInstance | void>;
    errors: Record<string, RejectMeta | void>;
    cellErrors: Record<string, Record<string, string | void> | void>;
    rowChanged: Record<string, boolean>;
    errorNodes: HTMLElement[];
    rowChangedNodes: HTMLElement[];
    cellChanged: Record<string, TableCell>;
    cellChangedNodes: HTMLElement[];
    editStatus: {
        required: boolean;
        cell: TableCell;
    }[];
    editStatusMap: Record<string, {
        required: boolean;
        cell: TableCell;
    } | void>;
    editStatusNodes: HTMLElement[];
    invalidCellMap: Record<string, TableCell[] | undefined>;
    invalidStatusMap: Record<string, boolean>;
    invalidStatus: TableCell[];
    invalidNodes: HTMLElement[];
    interactive: _TableInteractiveCorePlugin;
    beforeInit(): void;
    mounted(): void;
    beforeDestroy(): void;
    loadStage(level: TableReloadLevel, isBefore: boolean): void;
    mutation: (e: TableMutationEvent) => void;
    rendering(): void;
    validCheck(cell: TableCell): boolean;
    getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;
    getFormChanged(): boolean;
    getData(): any[];
    getChangedData(): any[];
    resetFormState(): void;
    verify(rowKey?: TableKey): Promise<any[]>;
    verifyChanged(): Promise<any[]>;
    /** 获取指定单元格最后一次参与验证后的错误 */
    getCellError(cell: TableCell): string;
    /** 获取指定列的可编辑信息, 不可编辑时返回null */
    getEditStatus(col: TableColumn): {
        required: boolean;
        cell: TableCell;
    } | null;
    private verifyCommon;
    private verifySpecifiedRow;
    private reset;
    private updateEditStatus;
    private updateValidStatus;
    private updateValidRelate;
    private getErrorList;
    private getRowMarkList;
    private getChangedList;
    private initForm;
    private getDataCommon;
}
/** table定制版的FormSchema */
export interface TableFormSchema extends Omit<FormSchema, "list"> {
}
/** form相关配置 */
export interface TableFormConfig {
    /** 用于校验字段的schema */
    schema?: TableFormSchema[];
}
/** 对外暴露的form相关方法 */
export interface TableForm {
    /** 执行校验, 未通过时会抛出VerifyError类型的错误, 这是使用者唯一需要处理的错误类型 */
    verify: (rowKey?: TableKey) => Promise<any[]>;
    /** 对变更行执行校验, 未通过时会抛出VerifyError类型的错误, 这是使用者唯一需要处理的错误类型 */
    verifyChanged: () => Promise<any[]>;
    /** 获取发生过变更的行 */
    getChangedData(): any[];
    /** 获取当前数据 */
    getData(): any[];
    /** 获取指定行或单元格的变更状态 */
    getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;
    /** 整个表格的表单是否发生或变更 */
    getFormChanged(): boolean;
    /** 重置当前的错误信息/变更状态等 */
    resetFormState(): void;
}
//# sourceMappingURL=form.d.ts.map