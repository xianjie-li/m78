import { TablePlugin } from "../plugin.js";
import { ActionHistory } from "@m78/utils";
export declare class _TableHistoryPlugin extends TablePlugin {
    init(): void;
    beforeDestroy(): void;
    configChangeHandle(changeKeys: string[], isChange: (key: string) => boolean): void;
}
export interface TableHistory {
    /** 记录数据和配置的所有变更操作 */
    history: ActionHistory;
}
export interface TableHistoryConfig {
    /** true | 启用历史记录 */
    history?: boolean;
}
//# sourceMappingURL=history.d.ts.map