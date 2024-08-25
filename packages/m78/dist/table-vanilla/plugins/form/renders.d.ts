import { _MixinBase } from "./base.js";
import { TableCell } from "../../types/items.js";
import { _MixinSchema } from "./schema.js";
import { _MixinStatus } from "./status.js";
export interface _MixinRenders extends _MixinBase, _MixinStatus, _MixinSchema {
}
/** 渲染各种form标记 */
export declare class _MixinRenders {
    prepareSchemasMark(): void;
    updateSchemasMark(): void;
    /** 获取指定单元格最后一次参与验证后的错误字符串 */
    getCellError(cell: TableCell): string;
    prepareErrors(): void;
    updateErrors(): void;
    prepareRowMark(): void;
    updateRowMark(): void;
    prepareChangedCell(): void;
    updateChangedCell(): void;
}
//# sourceMappingURL=renders.d.ts.map