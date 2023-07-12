import { TablePlugin } from "../plugin.js";
import { ActionHistory } from "@m78/utils";
export declare class _TableHistoryPlugin extends TablePlugin {
    init(): void;
}
export interface TableHistory {
    /** 记录数据和配置的所有变更操作 */
    history: ActionHistory;
}
//# sourceMappingURL=history.d.ts.map