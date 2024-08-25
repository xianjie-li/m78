import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { SelectManager } from "@m78/utils";
import { TableReloadOptions } from "./life.js";
/**
 * 实现软删除
 *
 * 触发mutation事件, 可在 getData().remove 等api中获取被删除项, 同时也应影响 getChanged 等api
 *
 * 也可视作数据变更, 应计入历史记录
 * */
export declare class _TableSoftRemovePlugin extends TablePlugin implements TableSoftRemove {
    private wrapNode;
    private rowMarkNodes;
    remove: SelectManager<TableKey, any>;
    beforeInit(): void;
    mounted(): void;
    init(): void;
    reload(opt: TableReloadOptions): void;
    beforeDestroy(): void;
    rendering(): void;
    softRemove(key: TableKey | TableKey[]): void;
    isSoftRemove(key: TableKey): boolean;
    restoreSoftRemove(key?: TableKey | TableKey[]): void;
    confirmSoftRemove(): void;
    private getRemoveList;
}
/** 软删除相关API */
export interface TableSoftRemove {
    /** 软删除数据, 删除数据不会从表格消失, 而是显示为禁用, 用户可以在保存前随时对其进行恢复 */
    softRemove(key: TableKey | TableKey[]): void;
    /** 检测记录是否被软删除 */
    isSoftRemove(key: TableKey): boolean;
    /** 恢复被软删除的行, 不传key时恢复全部 */
    restoreSoftRemove(key?: TableKey | TableKey[]): void;
    /** 将当前标记为软删除的行彻底删除 */
    confirmSoftRemove(): void;
}
//# sourceMappingURL=soft-remove.d.ts.map