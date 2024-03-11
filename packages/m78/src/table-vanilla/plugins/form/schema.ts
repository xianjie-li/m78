import { TablePlugin } from "../../plugin.js";
import { TableRow } from "../../types/items.js";
import { TableKey } from "../../types/base-type.js";
import { _SchemaData } from "./types.js";

export interface _MixinSchema extends TablePlugin {}

export class _MixinSchema {
  // 获取指定行的schemas信息, 没有则创建, 可传入update来主动更新
  private getSchemas(row: TableRow | TableKey, update = false): _SchemaData {
    const _row: TableRow = this.table.isRowLike(row)
      ? row
      : this.table.getRow(row);

    if (!update) {
      const cache = this.schemaDatas.get(_row.key);
      if (cache) return cache;
    }

    const verify = this.getVerify();

    return verify.withValues(_row.data, () => {
      const { schemas, invalidNames, schemasFlat } = verify.getSchemas();

      const invalid = new Map<TableKey, true>();

      invalidNames.forEach((k) => invalid.set(stringifyNamePath(k), true));

      const data: _SchemaData = {
        schemas: schemas.schemas || [],
        rootSchema: schemas,
        invalid,
        invalidNames,
        schemasFlat,
      };

      this.schemaDatas.set(_row.key, data);

      return data;
    });
  }
}
