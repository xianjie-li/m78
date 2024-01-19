import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableColumnLeafConfigFormatted } from "../types/items.js";
import { TableColumnFixed, TableKey } from "../types/base-type.js";
import { _prefix } from "../common.js";
import { getNamePathValue, isNumber, isUndefined } from "@m78/utils";

/**
 * 表格列排序
 *
 * sortColumns只配置了部分项时, 先按顺序显示排序后的列, 再显示不再排序中的列, 左右固定项和中间部分分别进行排序
 * */
export class _TableSortColumnPlugin extends TablePlugin {
  loadStage(stage: TableLoadStage, isBefore: boolean) {
    if (stage === TableLoadStage.mergePersistenceConfig && !isBefore) {
      this.handle();
    }
  }

  /** 处理sortColumns */
  handle() {
    const ctx = this.context;

    let sortColumns = this.context.persistenceConfig.sortColumns || [];

    if (!sortColumns.length) return;

    sortColumns = sortColumns.slice();

    if (ctx.hasMergeHeader) {
      console.warn(
        `[${_prefix}] persistenceConfig.sortColumns: Can not sort column when has merge header`
      );
      return;
    }

    // 记录sort项的index
    const sortMap: { [key: string]: number } = {};

    sortColumns.forEach((k, index) => (sortMap[k] = index));

    // 存在于sortColumns中的项
    const sortRegularColumns: TableColumnLeafConfigFormatted[] = [];
    const sortFixedLeft: TableColumnLeafConfigFormatted[] = [];
    const sortFixedRight: TableColumnLeafConfigFormatted[] = [];

    // 不存在于sortColumns中的项
    const regularColumns: TableColumnLeafConfigFormatted[] = [];
    const regularFixedLeft: TableColumnLeafConfigFormatted[] = [];
    const regularFixedRight: TableColumnLeafConfigFormatted[] = [];

    let rh: TableColumnLeafConfigFormatted;

    // 克隆并排序当前ctx.columns
    const cloneAndSortColumns = ctx.columns.slice().sort((a, b) => {
      const aInd = sortMap[a.key];
      const bInd = sortMap[b.key];

      const notA = isUndefined(aInd);
      const notB = isUndefined(bInd);

      if (notA && notB) return 0;
      if (notA) return 1; // 后移
      if (notB) return -1; // 保持
      return aInd - bInd;
    });

    cloneAndSortColumns.forEach((i) => {
      const isChild = ctx.mergeHeaderRelationMap[i.key];
      const isSortItem = isNumber(sortMap[i.key]);
      const isRH = ctx.xHeaderKey === i.key;

      const persistenceConf = getNamePathValue(ctx.persistenceConfig, [
        "columns",
        i.key,
      ]);

      // 从持久配置/fixed项中获取
      const fixedConf = persistenceConf?.fixed || i.fixed;

      if (isRH) {
        rh = i;
        return;
      }

      if (isChild) {
        // 合并子项不处理
        regularColumns.push(i);
        return;
      }

      if (fixedConf === TableColumnFixed.left) {
        if (isSortItem) {
          sortFixedLeft.push(i);
        } else {
          regularFixedLeft.push(i);
        }
        return;
      }

      if (fixedConf === TableColumnFixed.right) {
        if (isSortItem) {
          sortFixedRight.push(i);
        } else {
          regularFixedRight.push(i);
        }
        return;
      }

      if (isSortItem) {
        sortRegularColumns.push(i);
      } else {
        regularColumns.push(i);
      }
    });

    const newColumns = [
      rh!,
      ...sortFixedLeft,
      ...regularFixedLeft,
      ...sortRegularColumns,
      ...regularColumns,
      ...sortFixedRight,
      ...regularFixedRight,
    ];

    // 保持引用不变
    ctx.columns.length = 0;
    ctx.columns.push(...newColumns);
  }

  getColumnSortKeys(): TableKey[] {
    const column = this.context.columns;

    const list: TableKey[] = [];

    column.forEach((i) => {
      if (!this.context.mergeHeaderRelationMap[i.key]) {
        list.push(i.key);
      }
    });

    return list;
  }
}

export interface TableSortColumn {
  /** 根据当前columns的顺序获取keys */
  getColumnSortKeys(): TableKey[];
}
