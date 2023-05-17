import {
  TableCellWidthDom,
  TableColumnBranchConfig,
  TableColumnConfig,
  TableColumnFixed,
  TableColumnLeafConfig,
  TableConfig,
  TableRowFixed,
} from "../types.js";
import { AnyObject } from "@m78/utils";
import { _getCellKey, RowPrivateProperty } from "../common.js";
import { TablePlugin } from "../plugin.js";

export class _TableHeaderPlugin extends TablePlugin {
  /** 渲染行头内容 */
  cellRender(cell: TableCellWidthDom, isFirstRender: boolean): boolean | void {
    if (!isFirstRender || cell.row.isHeader) return;
    cell.dom.innerText = String(
      cell.row.index - this.context.yHeaderKeyList.length + 1
    );
  }

  /** 处理行头/表头 */
  process() {
    this.processHeaderY();
    this.processHeaderX();
  }

  /** 处理表头 */
  processHeaderY() {
    const ctx = this.context;
    const conf = this.config;
    /** 将columns扁平化 */
    const columns: TableColumnLeafConfig[] = [];
    /** 需要注入的行配置 */
    const rows: NonNullable<TableConfig["rows"]> = {};
    /** 需要注入的单元格配置 */
    const cells: NonNullable<TableConfig["cells"]> = {};
    /** 需要注入的记录 */
    const injectRows: AnyObject[] = [];
    /** 每一行的所有列, 用于最后计算mergeY */
    const depthColumns: TableColumnLeafConfig[][] = [];

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
          [RowPrivateProperty.fakeData]: true, // 表明是由table注入的数据
        };
        rows[key] = { fixed: TableRowFixed.top, height: conf.rowHeight! + 8 };
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
          // 若包含父级, 一律使用顶层fixed配置
          columns.push(
            opt.parent
              ? {
                  ...c,
                  fixed: opt.parent?.fixed,
                }
              : c
          );
          currentRow[c.key] = c.label;

          currentDepthColumns.push(c);

          opt.countCB?.();

          // 首项确认
          if (depth !== 0 && ind === 0) {
            opt.firstKeyCB?.(c.key);
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

    ctx.yHeaderKeyList = injectRows.map((i) => i[conf.primaryKey]);

    ctx.data.unshift(...injectRows);
    ctx.columns = columns;
    Object.assign(ctx.rows, rows, conf.rows);
    Object.assign(ctx.cells, conf.cells, cells);
  }

  /** 处理行头 */
  processHeaderX() {
    const key = this.getDefaultXKey();

    // 生成行头配置
    const headerColumn: TableColumnLeafConfig = {
      key,
      fixed: TableColumnFixed.left,
      width: 50,
      label: "序号",
    };

    // // 表头向下合并
    this.context.cells[_getCellKey(this.getDefaultYKey(0), key)] = {
      mergeY: this.context.yHeaderKeyList.length,
    };

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
