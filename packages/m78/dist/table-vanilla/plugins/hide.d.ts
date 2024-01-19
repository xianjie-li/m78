import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { _TableMetaDataPlugin } from "./meta-data.js";
import { SelectManager } from "@m78/utils";
/**
 * 表格列隐藏
 *
 * 通过为隐藏项添加meta.ignore实现, ignore状态为额外维护的, 放置与默认的产生冲突
 * */
export declare class _TableHidePlugin extends TablePlugin {
    metaData: _TableMetaDataPlugin;
    hideChecker: SelectManager<any, any>;
    beforeInit(): void;
    loadStage(stage: TableLoadStage, isBefore: boolean): void;
    handle(): void;
    /** 是否为隐藏列 */
    isHideColumn(key: TableKey): boolean;
}
//# sourceMappingURL=hide.d.ts.map