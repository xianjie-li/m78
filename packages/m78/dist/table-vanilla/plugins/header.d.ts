import { TablePlugin } from "../plugin.js";
import { TableCellWithDom } from "../types/items.js";
export declare class _TableHeaderPlugin extends TablePlugin {
    /** 渲染行头内容 */
    cellRender(cell: TableCellWithDom): boolean | void;
    /** 处理行头/表头 */
    process(): void;
    /** 处理表头 */
    handleHeaderY(): void;
    /** 处理行头 */
    handleHeaderX(): void;
    /** 获取默认生成的key */
    getDefaultYKey(rowInd: number): string;
    getDefaultXKey(): string;
}
//# sourceMappingURL=header.d.ts.map