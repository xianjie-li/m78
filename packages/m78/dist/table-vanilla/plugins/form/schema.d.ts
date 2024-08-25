import { TableRow } from "../../types/items.js";
import { TableKey } from "../../types/base-type.js";
import { _SchemaData } from "./types.js";
import { _MixinBase } from "./base.js";
export interface _MixinSchema extends _MixinBase {
}
export declare class _MixinSchema {
    getSchemas(row: TableRow | TableKey, update?: boolean): _SchemaData;
}
//# sourceMappingURL=schema.d.ts.map