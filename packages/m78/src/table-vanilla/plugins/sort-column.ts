import { TablePlugin } from "../plugin.js";
import { TableReloadLevel } from "./life.js";
import { TableColumnLeafConfigFormatted } from "../types/items.js";
import {
  _TablePrivateProperty,
  TableColumnFixed,
  TableKey,
} from "../types/base-type.js";
import { getNamePathValue } from "@m78/utils";
import { _prefix } from "../common.js";

/**
 * note:
 * sortColumns 和拖拽排序都不支持合并头的场景
 * 需要知道某项是否为子项
 * */

/** 表格列排序 */
export class _TableSortColumnPlugin
  extends TablePlugin
  implements TableSortColumn
{
  beforeInit() {
    this.methodMapper(this.table, ["getColumnSortKeys"]);
  }

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
      const fake = getNamePathValue(i, _TablePrivateProperty.fake);

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
      // 虚拟项
      if (getNamePathValue(i, _TablePrivateProperty.fake)) return false;
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
