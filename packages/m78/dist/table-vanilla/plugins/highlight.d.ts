/** 高亮行/列/单元格, 并滚动至首个高亮项 */
import { TablePlugin } from "../plugin.js";
import { TableCell } from "../types/items.js";
import { TableKey } from "../types/base-type.js";
/** 单元格, 行, 列高亮/自动滚动 */
export declare class _TableHighlightPlugin extends TablePlugin implements TableHighlight {
    beforeInit(): void;
    locate(cell: string | string[]): TableCell;
    highlight(cell: string | string[], autoScroll?: boolean): void;
    highlightColumn(column: TableKey | TableKey[], autoScroll?: boolean): void;
    highlightRow(row: TableKey | TableKey[], autoScroll?: boolean): void;
}
export interface TableHighlight {
    /**
     * 定位到指定元素, 若元素不在视口, 自动将其滚动到视口内最靠近的位置, 传入多个cell时, 会定位到最靠近左上角的cell
     *
     * 返回最终定位到的单元格
     * */
    locate(cell: TableKey | TableKey[]): TableCell;
    /** 高亮指定的单元格, 传入autoScroll时会在单元格不可见时自动滚动到单元格位置, 默认为true */
    highlight(cell: TableKey | TableKey[], autoScroll?: boolean): void;
    /** 高亮指定的行, 传入autoScroll时会在单元格不可见时自动滚动到单元格位置, 默认为true */
    highlightRow(row: TableKey | TableKey[], autoScroll?: boolean): void;
    /** 高亮指定的列, 传入autoScroll时会在单元格不可见时自动滚动到单元格位置, 默认为true */
    highlightColumn(column: TableKey | TableKey[], autoScroll?: boolean): void;
}
//# sourceMappingURL=highlight.d.ts.map