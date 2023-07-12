import { TablePlugin } from "../plugin.js";
import { TableReloadLevel, TableReloadOptions } from "./life.js";
/** 处理无数据 */
export declare class _TablePluginEmpty extends TablePlugin {
    static EMPTY_ROW_KEY: string;
    isEmpty: boolean;
    /** 空节点 */
    node: HTMLElement;
    /** reloadStage是在init阶段触发的, 需要确保在其之前创建了node */
    beforeInit(): void;
    beforeDestroy(): void;
    reload(opt?: TableReloadOptions): void;
    /** 在index前拦截判断是否是empty, 是则注入占位数据并显示节点, 否则隐藏 */
    loadStage(level: TableReloadLevel, isBefore: boolean): void;
    /** 更新empty节点状态, 并根据需要移除data中的占位数据 */
    update(needClear?: boolean): void;
}
export interface TableEmptyConfig {
    /** 自定义空节点 */
    emptyNode?: HTMLElement;
    /** 100 | 空节点占用的总高度 */
    emptySize?: number;
}
//# sourceMappingURL=empty.d.ts.map