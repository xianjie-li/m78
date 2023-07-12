import { TablePlugin } from "../plugin.js";
import { TableConfig, TableConfigCanNotChanges } from "../types/config.js";
export declare class _TableConfigPlugin extends TablePlugin {
    init(): void;
    configHandle: (config?: Omit<Partial<TableConfig>, TableConfigCanNotChanges>, keepPosition?: boolean) => void | TableConfig;
}
//# sourceMappingURL=config.d.ts.map