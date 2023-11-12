import { TablePlugin } from "../plugin.js";
import { TableConfig } from "../types/config.js";
/** 重置级别2的所有配置, 未在其中的所有配置默认为级别1 */
export declare const level2ConfigKeys: (keyof TableConfig)[];
/** 不能通过table.config()变更的配置 */
declare const configCanNotChange: readonly ["el", "primaryKey", "plugins", "viewEl", "viewContentEl", "eventCreator"];
type TableConfigCanNotChanges = typeof configCanNotChange[number];
export declare class _TableConfigPlugin extends TablePlugin implements TableConfigInstance {
    beforeInit(): void;
    getConfig: () => TableConfig;
    setConfig: (config?: Omit<Partial<TableConfig>, TableConfigCanNotChanges>, keepPosition?: boolean) => void | TableConfig;
}
export interface TableConfigInstance {
    /** 获取当前配置 */
    getConfig(): TableConfig;
    /**
     * 更改配置, 可单个或批量更改配置, 配置更新后会自动reload()
     * - 可传入keepPosition保持当前滚动位置
     * - 此外, 每调用只应传入发生变更的配置项, 因为不同的配置有不同的重置级别, 某些配置只需要部分更新, 而另一些则需要完全更新
     *
     * 会完全重置表格的配置: ["data", "columns", "rows", "cells"]
     *
     * 不能更新的配置: ["el", "primaryKey", "plugins", "viewEl", "viewContentEl", "eventCreator"]
     *
     * ## example
     * ```ts
     * table.config({ rowHeight: 40, columnWidth: 150 }); // 批量更改
     * table.config({ rowHeight: 40 }); // 单个更改
     * ```
     * */
    setConfig(config: Omit<Partial<TableConfig>, TableConfigCanNotChanges>, keepPosition?: boolean): void;
}
export {};
//# sourceMappingURL=config.d.ts.map