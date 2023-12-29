import { TablePlugin } from "../plugin.js";
import { TableReloadLevel } from "./life.js";
import { TableColumnLeafConfigFormatted } from "../types/items.js";
import { TableColumnFixed, TableKey } from "../types/base-type.js";
import { _prefix } from "../common.js";

/** 表格列排序 */
export class _TableSortColumnPlugin extends TablePlugin {
  loadStage(level: TableReloadLevel, isBefore: boolean) {
    if (level === TableReloadLevel.index && isBefore) {
      this.handle();
    }
  }

  /** 处理sortColumns */
  handle() {
    const ctx = this.context;

    let sortColumns = this.context.persistenceConfig.sortColumns || [];

    sortColumns = sortColumns.slice();

    if (!sortColumns.length) return;

    if (ctx.hasMergeHeader) {
      console.warn(
        `[${_prefix}] persistenceConfig.sortColumns: Can not sort column when has merge header`
      );
      return;
    }

    const sortMap: { [key: string]: TableColumnLeafConfigFormatted } = {};

    // 不存在于sortColumns中的项
    const regularColumns: TableColumnLeafConfigFormatted[] = [];
    const regularFixedLeft: TableColumnLeafConfigFormatted[] = [];
    const regularFixedRight: TableColumnLeafConfigFormatted[] = [];

    ctx.columns.forEach((i) => {
      const meta = ctx.getColumnMeta(i.key);
      const fake = meta.fake;

      const isChild = ctx.mergeHeaderRelationMap[i.key];

      if (fake && i.fixed === TableColumnFixed.left) {
        // 虚拟固定项不处理
        regularFixedLeft.push(i);
      } else if (fake && i.fixed === TableColumnFixed.right) {
        regularFixedRight.push(i);
      } else if (isChild) {
        // 子项不处理
        regularColumns.push(i);
      } else if (sortColumns.includes(i.key)) {
        // 记录sort项
        sortMap[i.key] = i;
      } else {
        // 不存在的项保持原样
        regularColumns.push(i);
      }
    });

    const indexHKey = sortColumns.indexOf(ctx.xHeaderKey);

    if (indexHKey !== -1) {
      sortColumns.splice(indexHKey, 1);
    }

    const sorted = sortColumns.map((key) => sortMap[key]).filter((i) => !!i);

    const newColumns = [
      ...regularFixedLeft,
      ...sorted,
      ...regularColumns,
      ...regularFixedRight,
    ];

    // 保持引用不变
    ctx.columns.length = 0;
    ctx.columns.push(...newColumns);
  }

  getColumnSortKeys(): TableKey[] {
    const column = this.context.columns;

    const list = column.filter((i) => {
      const meta = this.context.getColumnMeta(i.key);

      // TODO: META
      // 虚拟项
      if (meta.fake || meta.ignore) return false;

      // 子项
      return !this.context.mergeHeaderRelationMap[i.key];
    });

    return list.map((i) => i.key);
  }
}

export interface TableSortColumn {
  /** 根据当前columns的顺序获取keys */
  getColumnSortKeys(): TableKey[];
}
