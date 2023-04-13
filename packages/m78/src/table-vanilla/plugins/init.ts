import { TableInitInterceptor, TablePlugin } from "../plugin.js";
import {
  TableCell,
  TableColumn,
  TableColumnConfig,
  TableColumnFixed,
  TableRow,
  TableRowConfig,
  TableRowFixed,
} from "../types.js";
import { isFunction, isNumber, omit } from "@m78/utils";

/**
 * 进行配置整理/实例对象创建等操作
 * */
export class TableInitPlugin extends TablePlugin {
  state = {
    /** 插件名称, 用去区分执行插件是否是本插件 */
    PLUGIN_NAME: "init",
  };

  /** 除此列表外的TableColumnConfig配置都会透传到column实例 */
  static IGNORE_COLUMN_CONFIG_KEYS: (keyof TableColumnConfig)[] = ["fixed"];

  /** 除此列表外的TableRowConfig配置都会透传到row实例 */
  static IGNORE_ROW_CONFIG_KEYS: (keyof TableRowConfig)[] = ["fixed"];

  interceptors: TableInitInterceptor[] = [];

  init() {
    this.resetState();

    // 配置预处理
    this.configProcess();

    // 创建row/column/cell
    this.createColumn();
    this.createRow();

    // 执行其他插件的init, 并收集拦截器
    this.interceptors = this.plugins
      .map((i) => {
        i.state.initCalled = true;

        // 不执行当前插件
        if (i.state.PLUGIN_NAME === this.state.PLUGIN_NAME) return;
        if (i.init) {
          return i.init();
        }
      })
      .filter((i) => !!i!) as TableInitInterceptor[];

    // 处理fixed配置
    this.fixedDataProcess();
  }

  beforeDestroy() {
    this.resetState();
  }

  createRow() {
    const { data } = this.config;
    const table = this.table;

    let lastY = this.context.topFixedHeight;

    const rowHeight = this.config.rowHeight!;
    const isFuncRowHeight = isFunction(rowHeight);

    const rowsConfig = this.config.rows!;
    const isFuncRowConfig = isFunction(rowsConfig);

    const def: TableColumnConfig = {};

    data.forEach((i, index) => {
      const height = isFuncRowHeight ? rowHeight(i) : rowHeight;

      // 当前行配置
      const config = isFuncRowConfig
        ? rowsConfig(i, index) || def
        : rowsConfig[index] || def;

      const row: TableRow = {
        height,
        ...omit(config, TableInitPlugin.IGNORE_ROW_CONFIG_KEYS),
        index,
        y: lastY,
        cells: [],
        rowConfig: config,
        data: i,
      };

      if (config.fixed == TableRowFixed.top) {
        table.topFixed.push(row);
      } else if (config.fixed == TableRowFixed.bottom) {
        table.bottomFixed.push(row);
      } else {
        this.context.lastNoFixedRow = row;
        lastY = lastY + row.height;
        table.rows.push(row);

        table.columns.forEach((column) => {
          this.createCell(row, column, i);
        });
      }

      this.interceptors.forEach((interceptor) => {
        if (interceptor.row) {
          interceptor.row(row);
        }
      });
    });

    table.rows.unshift(...table.topFixed);
    table.rows.push(...table.bottomFixed);

    [...table.topFixed].reverse().forEach((row) => {
      table.columns.forEach((column) => {
        this.createCell(row, column, row.data, true);
      });
    });

    [...table.bottomFixed].forEach((row) => {
      table.columns.forEach((column) => {
        this.createCell(row, column, row.data);
      });
    });

    return lastY;
  }

  createColumn() {
    const table = this.table;
    const { columns } = this.config;

    let lastX = this.context.leftFixedWidth;

    const columnWidth = this.config.columnWidth!;
    const isFuncColumnWidth = isFunction(columnWidth);

    /** 列创建 */
    columns.forEach((columnConf, jIndex) => {
      const width = isFuncColumnWidth ? columnWidth(jIndex) : columnWidth;

      const column: TableColumn = {
        width,
        ...omit(columnConf, TableInitPlugin.IGNORE_COLUMN_CONFIG_KEYS),
        index: jIndex,
        x: lastX,
        cells: [],
        columnConfig: columnConf,
      };

      if (columnConf.fixed == TableColumnFixed.left) {
        table.leftFixed.push(column);
      } else if (columnConf.fixed == TableColumnFixed.right) {
        table.rightFixed.push(column);
      } else {
        this.context.lastNoFixedColumn = column;
        lastX = lastX + column.width;
        table.columns.push(column);
      }

      this.interceptors.forEach((interceptor) => {
        if (interceptor.column) {
          interceptor.column(column);
        }
      });
    });

    table.columns.unshift(...table.leftFixed);
    table.columns.push(...table.rightFixed);

    return lastX;
  }

  createCell(
    row: TableRow,
    column: TableColumn,
    data: any,
    isColUnshift = false
  ) {
    const cell: TableCell = {
      row,
      column,
      text: column.textGetter ? column.textGetter(data) : "",
      shapes: {},
    };

    this.interceptors.forEach((interceptor) => {
      if (interceptor.cell) {
        interceptor.cell(cell);
      }
    });

    if (isColUnshift) {
      column.cells.unshift(cell);
    } else {
      column.cells.push(cell);
    }
    row.cells.push(cell);
    this.table.cells.push(cell);
  }

  /** 对配置进行预处理, 比如动态rows, topFixed等尺寸预计算 */
  configProcess() {
    // 固定项占用获取
    let topFixed = 0;
    let bottomFixed = 0;
    let leftFixed = 0;
    let rightFixed = 0;

    // 动态row处理, 因为需要提前知道哪些行是固定的
    const rows = this.config.rows!;
    const columns = this.config.columns!;

    const rowHeight = this.config.rowHeight!;
    const isFuncRowHeight = isFunction(rowHeight);
    const columnWidth = this.config.columnWidth!;
    const isFuncColumnWidth = isFunction(columnWidth);

    // 根据配置和 数据/索引 调整topFixed等值
    const configHandle = (
      conf?: TableRowConfig | TableColumnConfig,
      i?: any
    ) => {
      if (!conf || !conf.fixed) return;

      if (
        conf.fixed === TableRowFixed.top ||
        conf.fixed === TableRowFixed.bottom
      ) {
        let h: number;

        if (isNumber(conf.height)) {
          h = conf.height;
        } else {
          h = isFuncRowHeight ? rowHeight(i) : rowHeight;
        }

        if (conf.fixed == TableRowFixed.top) {
          topFixed += h;
        } else {
          bottomFixed += h;
        }
      }

      if (
        conf.fixed === TableColumnFixed.left ||
        conf.fixed === TableColumnFixed.right
      ) {
        let w: number;

        if (isNumber(conf.width)) {
          w = conf.width;
        } else {
          w = isFuncColumnWidth ? columnWidth(i) : columnWidth;
        }

        if (conf.fixed === TableColumnFixed.left) {
          leftFixed += w;
        } else {
          rightFixed += w;
        }
      }
    };

    // 处理动态配置
    if (!isFunction(rows)) {
      Object.keys(rows).forEach((i) => {
        const cur = rows[i];
        configHandle(cur, i);
      });
    } else {
      this.config.data.forEach((i, index) => {
        const conf = rows(i, index);
        if (!conf) return;
        configHandle(conf, i);
      });
    }

    columns.forEach((i, index) => {
      configHandle(i, index);
    });

    this.context.topFixedHeight = topFixed;
    this.context.bottomFixedHeight = bottomFixed;
    this.context.leftFixedWidth = leftFixed;
    this.context.rightFixedWidth = rightFixed;
  }

  /** 初始化fixed相关配置的状态 */
  fixedDataProcess() {
    const table = this.table;
    const ctx = this.context;

    let lastFixedY = 0;

    // fixed相关数值计算和写入
    table.topFixed.forEach((row) => {
      row.fixedY = lastFixedY;
      row.y = lastFixedY;
      lastFixedY += row.height;
    });

    let maxHeightY = 0;
    const bottomBaseY = table.height() - ctx.bottomFixedHeight;
    let lastBottomFixedY = bottomBaseY;

    if (ctx.lastNoFixedRow) {
      maxHeightY = ctx.lastNoFixedRow.height + ctx.lastNoFixedRow.y;
    }

    table.bottomFixed.forEach((row) => {
      row.fixedY = lastBottomFixedY;
      row.y = lastBottomFixedY + maxHeightY - bottomBaseY;
      lastBottomFixedY = lastBottomFixedY + row.height;
    });

    let lastFixedX = 0;

    table.leftFixed.forEach((column) => {
      column.fixedX = lastFixedX;
      column.x = lastFixedX;
      lastFixedX += column.width;
    });

    let maxWidthX = 0;
    const rightBaseX = table.width() - ctx.rightFixedWidth;
    let lastRightFixedX = rightBaseX;

    if (ctx.lastNoFixedColumn) {
      maxWidthX = ctx.lastNoFixedColumn.width + ctx.lastNoFixedColumn.x;
    }

    table.rightFixed.forEach((column) => {
      column.fixedX = lastRightFixedX;
      column.x = lastRightFixedX + maxWidthX - rightBaseX;
      lastRightFixedX = lastRightFixedX + column.width;
    });
  }

  resetState() {
    this.table.rows = [];
    this.table.columns = [];
    this.table.cells = [];
    this.table.leftFixed = [];
    this.table.topFixed = [];
    this.table.rightFixed = [];
    this.table.bottomFixed = [];
    this.context.topFixedHeight = 0;
    this.context.bottomFixedHeight = 0;
    this.context.leftFixedWidth = 0;
    this.context.rightFixedWidth = 0;
  }
}
