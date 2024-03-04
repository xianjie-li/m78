import { FormRejectMeta, FormSchema, FormSchemaWithoutName, FormVerifyInstance } from "@m78/form";
import { AnyFunction, AnyObject, NamePath } from "@m78/utils";
import { TableKey } from "../types/base-type.js";
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableCell, TableColumn } from "../types/items.js";
import { TableMutationDataEvent, TableMutationEvent, TableMutationValueEvent } from "./mutation.js";
import { _TableInteractivePlugin } from "./interactive.js";
import { _TableSoftRemovePlugin } from "./soft-remove.js";
export declare class _TableFormPlugin extends TablePlugin implements TableForm {
    wrapNode: HTMLElement;
    verifyInstance: FormVerifyInstance;
    errors: Map<TableKey, FormRejectMeta>;
    cellErrors: Map<TableKey, Map<TableKey, string>>;
    rowChanged: Map<TableKey, true>;
    cellChanged: Map<TableKey, true>;
    defaultValues: Map<TableKey, AnyObject>;
    schemaDatas: Map<TableKey, SchemaData>;
    rowTouched: Map<TableKey, true>;
    cellTouched: Map<TableKey, true>;
    errorNodes: HTMLElement[];
    rowChangedNodes: HTMLElement[];
    cellChangedNodes: HTMLElement[];
    editStatusMap: Map<TableKey, {
        required: boolean;
        cell: TableCell;
    }>;
    editStatusNodes: HTMLElement[];
    invalidNodes: HTMLElement[];
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
    beforeInit(): void;
    mounted(): void;
    beforeDestroy(): void;
    loadStage(stage: TableLoadStage, isBefore: boolean): void;
    rendering(): void;
    mutation: (e: TableMutationEvent) => void;
    valueMutation: (e: TableMutationValueEvent) => void;
    dataMutation: (e: TableMutationDataEvent) => void;
    validCheck(cell: TableCell): boolean;
    getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;
    getTableChanged(): boolean;
    getTouched(rowKey: TableKey, columnKey?: NamePath): boolean;
    getTableTouched(): boolean;
    /** 检测是否发生了数据排序 */
    getSortedStatus(): boolean;
    getData(): TableDataLists<AnyObject>;
    verify(): Promise<TableDataLists<AnyObject>>;
    verifyRow(rowKey?: TableKey): Promise<AnyObject>;
    verifyUpdated(): Promise<TableDataLists<AnyObject>>;
    /** 获取指定单元格最后一次参与验证后的错误字符串 */
    getCellError(cell: TableCell): any;
    /** 获取指定列的可编辑信息, 不可编辑时返回null */
    getEditStatus(col: TableColumn): any;
    private verifyCommon;
    private reset;
    private updateEditStatus;
    private updateValidStatus;
    private updateValidRelate;
    private getErrorList;
    private getRowMarkList;
    private getChangedList;
    private innerCheck;
    /** 获取verify实例 */
    getVerify(): FormVerifyInstance;
    private getSchemas;
    private getFmtData;
    /** 初始化verify实例 */
    private initVerify;
    /** 遍历所有数据(不包含fake/软删除数据)并返回其clone版本
     *
     * - 若cb返回false则跳过并将该条数据从返回list中过滤, 返回0时, 停止遍历, 返回已遍历的值
     * - 数据会对invalid的值进行移除处理, 可通过 handleInvalid 控制
     * */
    private eachData;
    private initNodeWrap;
    private schemaConfigChange;
}
/** form相关配置 */
export interface TableFormConfig {
    /**
     * 用于校验字段的schema
     *
     * 部分schema在table中会被忽略, 如 schema.list
     * */
    schemas?: FormSchema[];
    /** 自定义form实例创建器 */
    formCreator?: AnyFunction;
}
/** 对外暴露的form相关方法 */
export interface TableForm {
    /**
     * 执行校验, 返回元组: [错误, 当前数据信息]
     *
     * - 若包含错误, 校验会在首个错误行停止
     * */
    verify: () => Promise<[FormRejectMeta | null, TableDataLists]>;
    /** 校验指定行, 返回元组: [错误, 当前行数据] */
    verifyRow: (rowKey?: TableKey) => Promise<[FormRejectMeta | null, AnyObject]>;
    /**
     * 同verify, 但仅对新增和变更行执行校验, 返回元组: [错误, 被校验的行]
     *
     * - 若包含错误, 校验会在首个错误行停止
     * */
    verifyUpdated: () => Promise<[FormRejectMeta | null, TableDataLists]>;
    /** 获取当前数据相关的内容, 包含: 所有数据 / 新增 / 变更 / 删除的数据, 以及一些数据相关的状态 */
    getData(): TableDataLists;
    /**
     * 指定行或单元格数据是否变更
     *
     * - 值变更/新增/删除的行均视为变更, 行排序变更时, 行会视为变更, 行下单元格不会 */
    getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;
    /**
     * 表格是否发生过数据变更
     *
     * - 被视为数据变更的场景: 值变更/新增/删除/排序
     * */
    getTableChanged(): boolean;
    /**
     * 指定行或单元格是否发生过操作
     *
     * - 触发touched的场景: 数据操作/验证/新增/删除, 排序变更时, 行会视为touched, 单元格不会 */
    getTouched(rowKey: TableKey, columnKey?: NamePath): boolean;
    /** 指定行或单元格是否发生过操作: 数据操作/验证/新增/删除/排序 */
    getTableTouched(): boolean;
}
/** 数据变更相关的内容 */
export interface TableDataLists<D = AnyObject> {
    /** 所有数据 */
    all: D[];
    /** 新增的行 */
    add: D[];
    /** 发生过变更的行, 不含新增行 */
    change: D[];
    /** 新增和变更的行 */
    update: D[];
    /** 移除的行 */
    remove: D[];
    /** 发生了数据排序 (不包含增删数据导致的索引变更) */
    sorted: boolean;
}
interface SchemaData {
    schemas: FormSchema[];
    rootSchema: FormSchemaWithoutName;
    invalid: Map<TableKey, true>;
    invalidNames: NamePath[];
}
export {};
//# sourceMappingURL=form.d.ts.map