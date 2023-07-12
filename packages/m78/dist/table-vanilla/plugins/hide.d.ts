import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { TableReloadLevel } from "./life.js";
import { TableColumnLeafConfig } from "../types/items.js";
import { _TableGetterPlugin } from "./getter.js";
/** 表格列隐藏 */
export declare class _TableHidePlugin extends TablePlugin {
    /** 前一次处理中设置的隐藏标记的列, 需要在新的设置中先还原 */
    prevHideColumns: TableColumnLeafConfig[];
    /** 放置所有expandNodes的容器 */
    wrapNodes: HTMLDivElement;
    /** 展开隐藏列的节点 */
    expandNodes: HTMLDivElement[];
    getter: _TableGetterPlugin;
    initialized(): void;
    beforeDestroy(): void;
    rendering(): void;
    loadStage(level: TableReloadLevel, isBefore: boolean): void;
    handle(): void;
    /** 是否为隐藏列 */
    isHideColumn(key: TableKey): boolean;
    /** 渲染标记 */
    renderNodes(): void;
    handleClick: (e: MouseEvent) => void;
    showColumn(key: TableKey): void;
}
//# sourceMappingURL=hide.d.ts.map