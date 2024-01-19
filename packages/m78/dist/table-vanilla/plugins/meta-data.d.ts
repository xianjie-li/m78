import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { TableReloadOptions } from "./life.js";
import { SelectManager } from "@m78/utils";
/** 根据存储跟行或列数据相关的一些元信息 */
export interface _MetaData {
    /** 表示是由table注入的假数据 */
    fake?: boolean;
    /** 该数据应该在渲染时被忽略 */
    ignore?: boolean;
    /** 该对象关联的某个timer */
    timer?: any;
    /** 当前的reloadKey */
    reloadKey?: string;
    /** 挂载标记 */
    rendered?: boolean;
    /** 表示该数据为新增数据 */
    new?: boolean;
    /** 该项为固定项, 实际所在位置为ref指向的占位数据位置 */
    fixed?: boolean;
}
export interface _MetaMethods {
    /** 获取行元数据 */
    getRowMeta(key: TableKey): _MetaData;
    /** 获取列元数据 */
    getColumnMeta(key: TableKey): _MetaData;
    /** 判断是否是ignore行的快捷方法, 包含了对扩展ignore的处理, 可传入现有meta来避免重新查询 */
    isIgnoreRow(key: TableKey, meta?: _MetaData): boolean;
    /** 判断是否是ignore列的快捷方法, 包含了对扩展ignore的处理, 可传入现有meta来避免重新查询 */
    isIgnoreColumn(key: TableKey, meta?: _MetaData): boolean;
}
/**
 * 管理存储在行/列或其他数据中的元信息以及对应的key
 * */
export declare class _TableMetaDataPlugin extends TablePlugin implements _MetaMethods {
    /** 记录当前reloadKey */
    static RELOAD_KEY: string;
    /** 挂载渲染标记 */
    static RENDERED_KEY: string;
    /** 与对象有关的某个timer */
    static TIMER_KEY: string;
    rowMeta: Map<TableKey, _MetaData>;
    columnMeta: Map<TableKey, _MetaData>;
    cellMeta: Map<TableKey, _MetaData>;
    extraRowIgnoreChecker: SelectManager[];
    extraColumnIgnoreChecker: SelectManager[];
    beforeInit(): void;
    reload(opt: TableReloadOptions): void;
    isIgnoreRow(key: TableKey, meta?: _MetaData): boolean;
    isIgnoreColumn(key: TableKey, meta?: _MetaData): boolean;
    getRowMeta(key: TableKey): _MetaData;
    getColumnMeta(key: TableKey): _MetaData;
}
//# sourceMappingURL=meta-data.d.ts.map