import { FormInstance, FormSchema } from "../../form-vanilla/index.js";
import { AnyObject, NamePath } from "@m78/utils";
import { TableKey } from "../types/base-type.js";
import { TablePlugin } from "../plugin.js";
import { TableCell, TableColumn } from "../types/items.js";
import { TableMutationDataEvent, TableMutationEvent, TableMutationValueEvent } from "./mutation.js";
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
    addRecordMap: Map<TableKey, boolean>;
    removeRecordMap: Map<TableKey, AnyObject>;
    sortRecordMap: Map<TableKey, {
        /** 原索引 */
        originIndex: number;
        /** 当前索引 */
        currentIndex: number;
    }>;
    interactive: _TableInteractiveCorePlugin;
    beforeInit(): void;
    mounted(): void;
    beforeDestroy(): void;
    loadStage(level: TableReloadLevel, isBefore: boolean): void;
    mutation: (e: TableMutationEvent) => void;
    rendering(): void;
    valueMutation: (e: TableMutationValueEvent) => void;
    dataMutation: (e: TableMutationDataEvent) => void;
    validCheck(cell: TableCell): boolean;
    getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;
    getTableChanged(): boolean;
    /** 检测是否发生了数据排序 */
    getSortedStatus(): boolean;
    getData(): TableDataLists<AnyObject>;
    resetFormState(): void;
    verify(): Promise<TableDataLists>;
    verifyRow(rowKey?: TableKey): Promise<AnyObject>;
    verifyChanged(): Promise<TableDataLists>;
    /** 获取指定单元格最后一次参与验证后的错误 */
    getCellError(cell: TableCell): string;
    /** 获取指定列的可编辑信息, 不可编辑时返回null */
    getEditStatus(col: TableColumn): {
        required: boolean;
        cell: TableCell;
    } | null;
    private verifyCommon;
    private verifySpecifiedRow;
    private resetDataRecords;
    private reset;
    private updateEditStatus;
    private updateValidStatus;
    private updateValidRelate;
    private getErrorList;
    private getRowMarkList;
    private getChangedList;
    private initForm;
    /** 遍历数据, 返回所有数据 */
    private eachData;
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
    verify: () => Promise<TableDataLists>;
    /** 验证指定行 */
    verifyRow: (rowKey?: TableKey) => Promise<AnyObject>;
    /** 对变更行执行校验, 未通过时会抛出VerifyError类型的错误, 这是使用者唯一需要处理的错误类型 */
    verifyChanged: () => Promise<TableDataLists>;
    /**
     * 获取当前数据, 返回内容包含: 所有数据/新增/变更/删除数据
     *
     * 关于排序数据:
     * 除了手动的排序操作, 新增/删除数据也会导致数据排序变动, 预先记录的排序状态随着后续操作都会变得不准确, 如果要保存排序状态,
     * 通常由两种方式: 一是统一提交并通过TableDataLists.all获取最终的完整顺序. 二是在mutation事件中根据排序的变更实时进行保存.
     * */
    getData(): TableDataLists;
    /** 获取指定行或单元格的变更状态, 数据变更, 被新增/删除均视为变更, 数据排序变更不视为变更 */
    getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;
    /** 表格是否发生过数据变更, 排序, 增删数据 */
    getTableChanged(): boolean;
    /** 重置当前的错误信息/变更状态等 */
    resetFormState(): void;
}
export interface TableDataLists<D = AnyObject> {
    /** 所有数据 */
    all: D[];
    /** 新增的行 */
    add: D[];
    /** 发生过变更的行(不含新增行) */
    change: D[];
    /** 新增和变更的行 */
    update: D[];
    /** 移除的行 */
    remove: D[];
    /** 是否发生了数据排序 */
    sorted: boolean;
}
//# sourceMappingURL=form.d.ts.map