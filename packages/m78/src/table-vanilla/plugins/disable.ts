import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { TableCell, TableCellWithDom, TableRow } from "../types/items.js";
import { _getCellKey, _getCellKeysByStr } from "../common.js";
import { addCls, removeCls } from "../../common/index.js";

/** 在单元格/行/列上设置半透明遮挡物进行禁用 */
export class _TableDisablePlugin extends TablePlugin implements TableDisable {
  disabled = false;

  /** 禁用行 */
  rows: DisabledMap = {};
  /** 禁用单元格 */
  cells: DisabledMap = {};
  /** 禁用列 */
  columns: DisabledMap = {};

  beforeInit() {
    this.methodMapper(this.table, [
      "disable",
      "isDisabled",
      "isDisabledRow",
      "isDisabledColumn",
      "isDisabledCell",
      "getDisabledRows",
      "getDisabledColumns",
      "getDisabledCells",
      "setRowDisable",
      "setColumnDisable",
      "setCellDisable",
      "clearDisable",
    ]);
  }

  cellRender(cell: TableCellWithDom) {
    const disabled = this.isDisabledCell(cell.key);

    disabled
      ? addCls(cell.dom, "__disabled")
      : removeCls(cell.dom, "__disabled");
  }

  isDisabled: TableDisable["isDisabled"] = () => {
    return this.disabled;
  };

  isDisabledRow: TableDisable["isDisabledRow"] = (key) => !!this.rows[key];

  isDisabledColumn: TableDisable["isDisabledColumn"] = (key) =>
    !!this.columns[key];

  isDisabledCell: TableDisable["isDisabledCell"] = (key) => {
    if (this.cells[key]) return true;

    const cell = this.table.getCellByStrKey(key);

    return (
      this.isDisabledRow(cell.row.key) || this.isDisabledColumn(cell.column.key)
    );
  };

  getDisabledRows: TableDisable["getDisabledRows"] = () => {
    const ls: TableRow[] = [];

    Object.keys(this.rows).forEach((key) => {
      const row = this.table.getRow(key);
      ls.push(row);
    });

    return ls;
  };

  getDisabledColumns: TableDisable["getDisabledColumns"] = () => {
    const ls: TableRow[] = [];

    Object.keys(this.columns).forEach((key) => {
      const row = this.table.getRow(key);
      ls.push(row);
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

    Object.keys(this.rows).forEach((key) => {
      this.context.allColumnKeys.forEach((columnKey) => {
        keyHandle(_getCellKey(key, columnKey));
      });
    });

    Object.keys(this.columns).forEach((key) => {
      this.context.allRowKeys.forEach((rowKey) => {
        keyHandle(_getCellKey(rowKey, key));
      });
    });

    Object.keys(this.cells).forEach(keyHandle);

    return list;
  };

  setRowDisable: TableDisable["setRowDisable"] = (
    rows,
    disable = true,
    merge = true
  ) => {
    if (!merge) {
      this.rows = {};
    }

    rows.forEach((key) => {
      this.rows[key] = disable ? 1 : 0;
    });

    this.table.render();
  };

  setColumnDisable: TableDisable["setColumnDisable"] = (
    columns,
    disable = true,
    merge = true
  ) => {
    if (!merge) {
      this.columns = {};
    }

    columns.forEach((key) => {
      this.columns[key] = disable ? 1 : 0;
    });

    this.table.render();
  };

  setCellDisable: TableDisable["setCellDisable"] = (
    cells,
    disable = true,
    merge = true
  ) => {
    if (!merge) {
      this.cells = {};
    }

    cells.forEach((key) => {
      this.cells[key] = disable ? 1 : 0;
    });

    this.table.render();
  };

  disable: TableDisable["disable"] = (disable) => {
    this.disabled = disable;
    this.table.render();
  };

  clearDisable() {
    this.rows = {};
    this.columns = {};
    this.cells = {};
    this.disabled = false;

    this.table.render();
  }
}

interface DisabledMap {
  [key: string]: 1 | 0;
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
  getDisabledColumns(): TableRow[];

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
