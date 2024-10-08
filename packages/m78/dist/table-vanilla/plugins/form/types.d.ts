import { FormRejectOrValues, FormSchema, FormSchemaWithoutName } from "@m78/form";
import { TableKey } from "../../types/base-type.js";
import { AnyFunction, AnyObject, NamePath } from "@m78/utils";
/** 标记相关的form配置 */
export interface TableFormMarkConfig {
    /** 行包含错误/变更时, 在行头显示标记 */
    rowMark?: boolean;
    /** 单元格变更时, 在上方显示变更标记 */
    cellChangedMark?: boolean;
    /** 列可交互时(通常是可编辑), 列头显示标记 */
    interactiveMark?: boolean;
}
/** form相关配置 */
export interface TableFormConfig extends TableFormMarkConfig {
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
    verify: () => Promise<FormRejectOrValues<TableDataLists>>;
    /** 校验指定行, 返回元组: [错误, 当前行数据] */
    verifyRow: (rowKey: TableKey) => Promise<FormRejectOrValues>;
    /**
     * 同verify, 但仅对新增和变更行执行校验, 返回元组: [错误, 被校验的行]
     *
     * - 若包含错误, 校验会在首个错误行停止
     * */
    verifyUpdated: () => Promise<FormRejectOrValues<TableDataLists>>;
    /** 获取当前数据相关的内容, 包含: 所有数据 / 新增 / 变更 / 删除的数据, 以及一些数据相关的状态 */
    getData(): Promise<TableDataLists>;
    /** 获取各类型的变更的数量/状态等 */
    getChangeStatus(): TableDataStatus;
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
/** 数据变更相关的内容 */
export interface TableDataStatus {
    /** 当前数据长度 */
    length: number;
    /** 新增的行 */
    add: number;
    /** 发生过变更的行, 不含新增行 */
    change: number;
    /** 新增和变更的行 */
    update: number;
    /** 移除的行 */
    remove: number;
    /** 发生了数据排序 (不包含增删数据导致的索引变更) */
    sorted: boolean;
}
export interface _SchemaData {
    schemas: FormSchema[];
    rootSchema: FormSchemaWithoutName;
    schemasFlat: Map<string, FormSchema>;
    invalid: Map<TableKey, true>;
    invalidNames: NamePath[];
}
//# sourceMappingURL=types.d.ts.map