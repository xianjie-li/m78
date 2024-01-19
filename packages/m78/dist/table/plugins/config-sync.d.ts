import { RCTablePlugin } from "../plugin.js";
import React from "react";
import { _RCTableState } from "../types.js";
import { TableInstance, TablePersistenceConfig } from "../../table-vanilla/index.js";
/** 配置持久化器 */
export type TableConfigPersister = (key: string, table: TableInstance) => Promise<void>;
/** 配置读取器 */
export type TableConfigReader = (key: string, table: TableInstance) => Promise<TablePersistenceConfig>;
/**
 * 持久化配置上传/下载
 * */
export declare class _ConfigSyncPlugin extends RCTablePlugin {
    /** 当前使用的持久化器 */
    persister: TableConfigPersister;
    /** 当前使用的配置读取器 */
    reader: TableConfigReader;
    toolbarTrailingCustomer(nodes: React.ReactNode[]): void;
    enable: boolean;
    rcStateInitializer(state: _RCTableState): void;
    rcRuntime(): void;
}
//# sourceMappingURL=config-sync.d.ts.map