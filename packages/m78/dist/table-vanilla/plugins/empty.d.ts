import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableReloadOptions } from "./life.js";
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
    loadStage(stage: TableLoadStage, isBefore: boolean): void;
    rendered(): void;
    /** 更新empty节点状态, 并根据需要移除data中的占位数据 */
    private update;
}
export interface TableEmptyConfig {
    /** 自定义空节点 */
    emptyNode?: HTMLElement;
    /** 100 | 空节点占用的高度, autoSize未开启时, 会以表格实际高度为准 */
    emptySize?: number;
}
//# sourceMappingURL=empty.d.ts.map