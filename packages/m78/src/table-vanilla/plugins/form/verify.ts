import { TablePlugin } from "../../plugin.js";
import { TableCell } from "../../types/items.js";
import { _MixinSchema } from "./schema.js";

export interface _MixinVerify extends TablePlugin, _MixinSchema {}

export class _MixinVerify {
  // 获取单元格invalid状态
  validCheck(cell: TableCell) {
    const { invalid } = this.getSchemas(cell.row);

    if (!invalid) return true;

    return !invalid.get(cell.column.key);
  }
}
