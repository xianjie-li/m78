import { TableCell, TableRow } from "../../types/items.js";
import { _MixinSchema } from "./schema.js";
import { _MixinBase } from "./base.js";
import { TableKey } from "../../types/base-type.js";
import { FormRejectOrValues, FormSchemaWithoutName } from "@m78/form";
import { _MixinData } from "./data.js";
export interface _MixinVerify extends _MixinBase, _MixinSchema, _MixinData {
}
export declare class _MixinVerify {
    /** 获取单元格invalid状态 */
    validCheck(cell: TableCell): boolean;
    /** 初始化verify实例 */
    initVerify(): void;
    verify(): Promise<FormRejectOrValues>;
    verifyUpdated(): Promise<FormRejectOrValues>;
    verifyRow(rowKey: TableKey): Promise<FormRejectOrValues>;
    verifyCommon(onlyUpdated: boolean): Promise<FormRejectOrValues>;
    innerCheck(arg: {
        row?: TableRow | TableKey;
        cell?: TableCell;
        values: any;
        schemas: FormSchemaWithoutName;
    }): Promise<FormRejectOrValues>;
}
//# sourceMappingURL=verify.d.ts.map