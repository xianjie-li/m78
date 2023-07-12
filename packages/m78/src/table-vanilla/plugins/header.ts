import { AnyObject, setNamePathValue, stringifyNamePath } from "@m78/utils";
import { _getCellKey } from "../common.js";
import { TablePlugin } from "../plugin.js";
import {
  _TablePrivateProperty,
  TableColumnFixed,
  TableRenderCtx,
  TableRowFixed,
} from "../types/base-type.js";
import { TableConfig } from "../types/config.js";

import {
  TableCellWithDom,
  TableColumnBranchConfig,
  TableColumnConfig,
  TableColumnLeafConfigFormatted,
} from "../types/items.js";

export class _TableHeaderPlugin extends TablePlugin {
  /** 渲染行头内容 */
  cellRender(cell: TableCellWithDom, ctx: TableRenderCtx): boolean | void {
    const isCrossHeader = cell.row.isHeader && cell.column.isHeader;

    if (isCrossHeader) {
      ctx.disableDefaultRender = true;
    }

    if (ctx.isFirstRender && isCrossHeader) {
      cell.dom.innerHTML = "<span>行号</span>"; // TODO: i18n
      return;
    }
  }

  /** 处理行头/表头 */
  process() {
    this.handleHeaderY();
    this.handleHeaderX();
  }

  /** 处理表头 */
  handleHeaderY() {
    const ctx = this.context;
    const conf = this.config;

    ctx.mergeHeaderRelationMap = {};

    /** 将columns扁平化并处理namePath类型的key */
    const columns: TableColumnLeafConfigFormatted[] = [];
    /** 需要注入的行配置 */
    const rows: NonNullable<TableConfig["rows"]> = {};
    /** 需要注入的单元格配置 */
    const cells: NonNullable<TableConfig["cells"]> = {};
    /** 需要注入的记录 */
    const injectRows: AnyObject[] = [];
    /** 每一行的所有列, 用于最后计算mergeY */
    const depthColumns: TableColumnLeafConfigFormatted[][] = [];

    const defHeight = conf.rowHeight! + 8;

    // 递归处理组合表头, cb用于底层向上层回传信息
    const recursionColumns = (
      list: TableColumnConfig[],
      depth: number,
      opt: {
        /** 子级的首个key确认后进行回调 */
        firstKeyCB?: (key: string) => void;
        /** 任何一个子项确认后都会调用, 用于父级统计子项总数 */
        countCB?: () => void;
        /** 父级配置 */
        parent?: TableColumnBranchConfig;
      }
    ) => {
      // 当前行
      let currentRow = injectRows[depth];
      let currentDepthColumns = depthColumns[depth];

      // 没有则创建
      if (!currentRow) {
        const key = this.getDefaultYKey(depth);
        currentRow = injectRows[depth] = {
          [conf.primaryKey]: key,
          [_TablePrivateProperty.fake]: true,
        };
        rows[key] = { fixed: TableRowFixed.top, height: defHeight };
        injectRows[depth] = currentRow;
      }

      if (!currentDepthColumns) {
        currentDepthColumns = depthColumns[depth] = [];
      }

      list.forEach((c, ind) => {
        let count = 0;
        let firstKey = "";

        // 确认子项
        if ("key" in c) {
          const formatColumn: TableColumnLeafConfigFormatted = {
            ...c,
            originalKey: c.key,
            key: stringifyNamePath(c.key),
          };

          if (opt.parent) {
            ctx.mergeHeaderRelationMap[formatColumn.key] = true;
          }

          // 若包含父级, 一律使用顶层fixed配置
          if (opt.parent && opt.parent?.fixed !== c.fixed) {
            formatColumn.fixed = opt.parent?.fixed;
          }

          columns.push(formatColumn);

          currentRow[formatColumn.key] = c.label;

          currentDepthColumns.push(formatColumn);

          opt.countCB?.();

          // 首项确认
          if (depth !== 0 && ind === 0) {
            opt.firstKeyCB?.(formatColumn.key);
          }
          return;
        }

        // 无效表头
        if (!c.children?.length) return;

        // 处理子级
        recursionColumns(c.children, depth + 1, {
          parent: opt.parent || c,
          firstKeyCB(key) {
            currentRow[key] = c.label; // 用于显示的文本设置到指定的字段

            firstKey = key;

            if (ind === 0) {
              opt.firstKeyCB?.(key);
            }
          },
          countCB() {
            count++;
            opt.countCB?.();
          },
        });

        cells[_getCellKey(currentRow[conf.primaryKey], firstKey)] = {
          mergeX: count,
        };
      });
    };

    recursionColumns(conf.columns, 0, {});

    const maxDepth = depthColumns.length;

    // 为所有非末尾层的列设置mergeY, 使其撑满总行头数
    depthColumns.slice(0, -1).forEach((colList, ind) => {
      colList.forEach((c) => {
        const key = _getCellKey(this.getDefaultYKey(ind), c.key);
        let cur = cells[key];
        if (!cur) {
          cur = {};
          cells[key] = cur;
        }
        cur.mergeY = maxDepth - ind;
      });
    });

    ctx.yHeaderKeys = injectRows.map((i) => i[conf.primaryKey]);

    ctx.yHeaderHeight = ctx.yHeaderKeys.reduce<number>((a, b) => {
      const conf = ctx.rows[b];
      return a + (conf?.height || defHeight);
    }, 0);

    ctx.data.unshift(...injectRows);
    ctx.columns = columns;
    ctx.hasMergeHeader = depthColumns.length > 1;

    Object.assign(ctx.rows, rows, conf.rows);
    Object.assign(ctx.cells, conf.cells, cells);
  }

  /** 处理行头 */
  handleHeaderX() {
    const key = this.getDefaultXKey();

    // 生成行头配置
    const headerColumn: TableColumnLeafConfigFormatted = {
      key,
      originalKey: key,
      fixed: TableColumnFixed.left,
      width: 40,
      label: "序号",
    };

    setNamePathValue(headerColumn, _TablePrivateProperty.fake, true);

    // 表头向下合并
    this.context.cells[_getCellKey(this.getDefaultYKey(0), key)] = {
      mergeY: this.context.yHeaderKeys.length,
    };

    this.context.xHeaderWidth = 50; // TODO: 持久化时, 需要从配置中读取
    this.context.xHeaderKey = key;
    this.context.columns.unshift(headerColumn);
  }

  /** 获取默认生成的key */
  getDefaultYKey(rowInd: number) {
    return `__TH${rowInd}`;
  }

  getDefaultXKey() {
    return "__RH";
  }
}
