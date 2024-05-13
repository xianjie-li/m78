import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import {
  TableCell,
  TableCellWithDom,
  TableColumn,
  TableRow,
} from "../types/items.js";
import { _getCellKey, _getCellKeysByStr } from "../common.js";
import { addCls, removeCls } from "../../common/index.js";
import { SelectManager, setCacheValue } from "@m78/utils";
import { TableReloadLevel, TableReloadOptions } from "./life.js";

/** 在单元格/行/列上设置半透明遮挡物, 目前仅用于组件内部api设置临时禁用状态, 如拖动排序时, 为拖动列显示禁用样式 */
export class _TableDisablePlugin extends TablePlugin implements TableDisable {
  // 表格本身的禁用状态, 状态本身并无约束力, 可能某些api会需要读取其并禁用行为
  disabled = false;

  // 用于检测禁用状态的select状态, 可以在其他插件向其中推入新的实例, 来实现插件自行管理禁用状态, 避免被通用禁用状态干扰
  rowChecker: SelectManager<TableKey>[] = [new SelectManager()];
  // 同rowChecker, 但检测列
  columnChecker: SelectManager<TableKey>[] = [new SelectManager()];
  // 同rowChecker, 但检测单元格
  cellChecker: SelectManager<TableKey>[] = [new SelectManager()];

  /** 禁用行 */
  rows: SelectManager = this.rowChecker[0];
  /** 禁用单元格 */
  cells: SelectManager = this.cellChecker[0];
  /** 禁用列 */
  columns: SelectManager = this.columnChecker[0];

  cellRender(cell: TableCellWithDom) {
    const disabled = this.isDisabledCell(cell.key);

    disabled
      ? setCacheValue(cell.dom, "classNamePartialDisabled", disabled, () =>
          addCls(cell.dom, "__disabled")
        )
      : setCacheValue(cell.dom, "classNamePartialDisabled", disabled, () =>
          removeCls(cell.dom, "__disabled")
        );
  }

  private clear() {
    this.rows.unSelectAll();
    this.cells.unSelectAll();
    this.columns.unSelectAll();
  }

  reload(opt: TableReloadOptions) {
    if (opt.level === TableReloadLevel.full) {
      this.clear();
    }
  }

  beforeDestroy() {
    this.clear();
  }

  isDisabled: TableDisable["isDisabled"] = () => {
    return this.disabled;
  };

  isDisabledRow: TableDisable["isDisabledRow"] = (key) => {
    for (const checker of this.rowChecker) {
      if (checker.isSelected(key)) return true;
    }
    return false;
  };

  isDisabledColumn: TableDisable["isDisabledColumn"] = (key) => {
    for (const checker of this.columnChecker) {
      if (checker.isSelected(key)) return true;
    }
    return false;
  };

  isDisabledCell: TableDisable["isDisabledCell"] = (key) => {
    for (const checker of this.cellChecker) {
      if (checker.isSelected(key)) return true;
    }

    const cell = this.table.getCellByStrKey(key);

    return (
      this.isDisabledRow(cell.row.key) || this.isDisabledColumn(cell.column.key)
    );
  };

  getDisabledRows: TableDisable["getDisabledRows"] = () => {
    const ls: TableRow[] = [];

    this.rowChecker.forEach((c) => {
      c.getState().selected.forEach((key) => {
        const row = this.table.getRow(key);
        ls.push(row);
      });
    });

    return ls;
  };

  getDisabledColumns: TableDisable["getDisabledColumns"] = () => {
    const ls: TableColumn[] = [];

    this.columnChecker.forEach((c) => {
      c.getState().selected.forEach((key) => {
        const column = this.table.getColumn(key);
        ls.push(column);
      });
    });

    return ls;
  };

  getDisabledCells: TableDisable["getDisabledCells"] = () => {
    const uniqCache: any = {}; // 保证行和单元格的选中不重复
    const list: TableCell[] = [];

    // 此处可能有潜在的性能问题

    const keyHandle = (key: string) => {
      const [rowKey, columnKey] = _getCellKeysByStr(key);
      const cell = this.table.getCell(rowKey, columnKey);

      // 跳过已经处理过的单元格
      if (uniqCache[cell.key]) return;

      uniqCache[cell.key] = 1;

      list.push(cell);
    };

    this.rowChecker.forEach((c) => {
      c.getState().selected.forEach((key) => {
        this.context.allColumnKeys.forEach((columnKey) => {
          keyHandle(_getCellKey(key, columnKey));
        });
      });
    });

    this.columnChecker.forEach((c) => {
      c.getState().selected.forEach((key) => {
        this.context.allRowKeys.forEach((rowKey) => {
          keyHandle(_getCellKey(rowKey, key));
        });
      });
    });

    this.cellChecker.forEach((c) => {
      c.getState().selected.forEach((k) => keyHandle(k as string));
    });

    return list;
  };

  setRowDisable: TableDisable["setRowDisable"] = (
    rows,
    disable = true,
    merge = true
  ) => {
    if (!merge) {
      this.rows.unSelectAll();
    }

    disable ? this.rows.selectList(rows) : this.rows.unSelectList(rows);

    this.table.render();
  };

  setColumnDisable: TableDisable["setColumnDisable"] = (
    columns,
    disable = true,
    merge = true
  ) => {
    if (!merge) {
      this.columns.unSelectAll();
    }

    disable
      ? this.columns.selectList(columns)
      : this.columns.unSelectList(columns);

    this.table.render();
  };

  setCellDisable: TableDisable["setCellDisable"] = (
    cells,
    disable = true,
    merge = true
  ) => {
    if (!merge) {
      this.cells.unSelectAll();
    }

    disable ? this.cells.selectList(cells) : this.cells.unSelectList(cells);

    this.table.render();
  };

  disable: TableDisable["disable"] = (disable) => {
    this.disabled = disable;
    this.table.render();
  };

  clearDisable() {
    this.rows.unSelectAll();
    this.columns.unSelectAll();
    this.cells.unSelectAll();
    this.disabled = false;

    this.table.render();
  }
}

/** 禁用相关的api */
export interface TableDisable {
  /** 表格是否禁用 */
  isDisabled(): boolean;

  /** 指定行是否禁用 */
  isDisabledRow(key: TableKey): boolean;

  /** 指定列是否禁用 */
  isDisabledColumn(key: TableKey): boolean;

  /** 指定单元格是否禁用 */
  isDisabledCell(key: TableKey): boolean;

  /** 获取禁用的行 */
  getDisabledRows(): TableRow[];

  /** 获取禁用的列 */
  getDisabledColumns(): TableColumn[];

  /** 获取禁用的单元格 */
  getDisabledCells(): TableCell[];

  /** 设置表格禁用状态 */
  disable(disable: boolean): void;

  /**
   * 设置行禁用
   * @param keys - 行key
   * @param disable - true | 要设置的禁用状态
   * @param merge - true | 设置为false可保留之前的行禁用
   * */
  setRowDisable(keys: TableKey[], disable?: boolean, merge?: boolean): void;

  /**
   * 设置列禁用
   * @param keys - 列key
   * @param disable - true | 要设置的禁用状态
   * @param merge - true | 设置为false可保留之前的行禁用
   * */
  setColumnDisable(keys: TableKey[], disable?: boolean, merge?: boolean): void;

  /**
   * 设置列禁用
   * @param keys - 单元格key
   * @param disable - true | 要设置的禁用状态
   * @param merge - true | 设置为false可保留之前的行禁用
   * */
  setCellDisable(keys: TableKey[], disable?: boolean, merge?: boolean): void;

  /** 清理所有禁用状态 */
  clearDisable(): void;
}
