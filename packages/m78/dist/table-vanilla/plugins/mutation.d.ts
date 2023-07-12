import { TablePlugin } from "../plugin.js";
import { AnyObject, NamePath } from "@m78/utils";
import { TableReloadOptions } from "./life.js";
import { TablePersistenceConfig } from "../types/config.js";
import { TableKey } from "../types/base-type.js";
/**
 * 所有config/data变更相关的操作, 变异操作应统一使用此处提供的api, 方便统一处理, 自动生成和处理历史等
 *
 * 配置变更/单元格值编辑/增删行列/行列排序/隐藏列
 * */
export declare class _TableMutationPlugin extends TablePlugin {
    /** 每一次配置变更将变更的key记录, 通过记录来判断是否有变更项 */
    private changedConfigKeys;
    init(): void;
    reload(opt?: TableReloadOptions): void;
    /**
     * 设置ctx.persistenceConfig中的项, 并自动生成历史记录, 设置后, 原有值会被备份(引用类型会深拷贝), 并在执行undo操作时还原
     * */
    setPersistenceConfig: TableMutation["setPersistenceConfig"];
    /** 获取发生变更的持久化配置 */
    getChangedConfigKeys: TableMutation["getChangedConfigKeys"];
    /** 获取当前持久化配置 */
    getPersistenceConfig: TableMutation["getPersistenceConfig"];
    addRow: TableMutation["addRow"];
    removeRow: TableMutation["removeRow"];
    moveRow: TableMutation["moveRow"];
    private moveColumn;
    /** move的通用逻辑, isRow控制是row还是column */
    private moveCommon;
    /** 获取便于move操作的结构 */
    private getMoveData;
    /** 获取方便用于删除/移动等操作的索引数据信息 */
    private getIndexData;
    /** 快速获取fixed虚拟项的index */
    private getFixedIndex;
    /** 根据setPersistenceConfig入参 "尽可能合理" 的方式获取需要高亮的项 */
    private getHighlightKeys;
    /** 对传入的items执行高亮 */
    private highlightHandler;
}
export declare enum TableMutationType {
    /** 持久化配置变更 */
    config = "config",
    /** 记录变更 */
    data = "data"
}
/** TableMutationType.row变更类型 */
export declare enum TableMutationDataType {
    add = "add",
    remove = "remove",
    move = "move"
}
export declare type TableMutationEvent = TableMutationConfigEvent | TableMutationDataEvent;
/** 持久化配置变更事件 */
export interface TableMutationConfigEvent {
    /** 事件类型 */
    type: TableMutationType.config;
    /** 变更的key */
    key: keyof TablePersistenceConfig;
    /** 变更后的值 */
    value: any;
    /** 如果设置的是更深层的配置项, 此字段为变更项的key路径, 否则与key相同 */
    detailKeys: NamePath;
}
/** 持久化配置data变更事件 */
export interface TableMutationDataEvent {
    /** 事件类型 */
    type: TableMutationType.data;
    /** 变更类型 */
    changeType: TableMutationDataType;
    /** 新增的项 */
    add: AnyObject[];
    /** 删除的项 */
    remove: AnyObject[];
    /** 移动的项 */
    move: Array<{
        /** 移动前的index */
        from: number;
        /** 移动后的index */
        to: number;
        /** 在源数据中的from */
        dataFrom: number;
        /** 在源数据中的to */
        dataTo: number;
        /** 移动的行数据 */
        data: AnyObject;
    }>;
}
export interface TableMutation {
    /** 获取发生了变更的持久化配置 */
    getChangedConfigKeys(): (keyof TablePersistenceConfig)[];
    /** 获取当前持久化配置 */
    getPersistenceConfig(): TablePersistenceConfig;
    /**
     * 更新persistenceConfig配置, 并自动生成历史记录, 传入能够描述该操作的actionName有助于在撤销/重做事显示更友好的提示
     *
     * **example**
     * setPersistenceConfig("hideColumns", ["name", "age"]);  // 基本用法
     * setPersistenceConfig(["rows", "id18", "fixed"], true);  // 嵌套用法, 相当于设置 row["id18"].fixed = true
     * */
    setPersistenceConfig(key: NamePath, newValue: any, actionName?: string): void;
    /**
     * 新增记录
     * @param data - 新增的数据
     * @param to - 新增到的位置, 该位置的原有项后移; 不传时, 新增到表格顶部; key不能为固定项, 若传入固定项, 会根据固定位置添加到常规项的开头/结尾
     * @param insertAfter - 为true时数据将移动到指定key的后方 */
    addRow(data: any | any[], to?: TableKey, insertAfter?: boolean): void;
    /** 移除指定的记录 */
    removeRow(key: TableKey | TableKey[]): void;
    /**
     * 将项移动到指定项的位置
     * @param from - 移动项的key
     * @param to - 移动到key指定的位置, 并将该位置的原有项后移
     * @param insertAfter - 为true时数据将移动到指定key的后方 */
    moveRow(from: TableKey | TableKey[], to: TableKey, insertAfter?: boolean): void;
    /**
     * 将列移动到指定项的位置, 包含分组表头时, 无法进行此操作
     * @param from - 移动项的key
     * @param to - 移动到key指定的位置, 并将该位置的原有项后移
     * @param insertAfter - 为true时数据将移动到指定key的后方 */
    moveColumn(from: TableKey | TableKey[], to: TableKey, insertAfter?: boolean): void;
}
//# sourceMappingURL=mutation.d.ts.map