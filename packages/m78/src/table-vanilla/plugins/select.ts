import { TablePlugin } from "../plugin.js";
import {
  AnyObject,
  BoundSize,
  isBoolean,
  isEmpty,
  isFunction,
  isString,
} from "@m78/utils";
import throttle from "lodash/throttle.js";
import { _getCellKey, _getCellKeysByStr, _getOffset } from "../common.js";
import {
  TableCell,
  TableCellWidthDom,
  TableInstance,
  TableItems,
  TableKey,
  TablePointInfo,
  TableRow,
} from "../types.js";
import { addCls, removeCls } from "../../common/index.js";

/** 选区类型 */
export enum TableRangeType {
  row,
  column,
  cell,
}

export interface TableRange extends BoundSize {
  id: string;
  type: TableRangeType;
}

interface SelectMap {
  [key: string]: 1;
}

/** 实现选区和选中功能 */
export class _TableSelectPlugin extends TablePlugin {
  init() {
    this.methodMapper(this.table, [
      "isSelectedRow",
      "isSelectedCell",
      "getSelectedRows",
      "getSelectedCells",
      "selectRows",
      "selectCells",
    ]);
  }

  mount() {
    this.context.viewEl.addEventListener("mousedown", this.selectStart);
    document.documentElement.addEventListener("mousemove", this.selectMove);
    document.documentElement.addEventListener("mouseup", this.selectEnd);
    this.table.event.click.on(this.clickHandle);
  }

  beforeDestroy() {
    this.context.viewEl.removeEventListener("mousedown", this.selectStart);
    document.documentElement.removeEventListener("mousemove", this.selectMove);
    document.documentElement.removeEventListener("mouseup", this.selectEnd);
    this.table.event.click.off(this.clickHandle);
  }

  cellRender(cell: TableCellWidthDom) {
    const selected =
      this.isSelectedCell(cell.key) ||
      this.isSelectedTempCell(cell.key) ||
      this.isSelectedRow(cell.row.key) ||
      this.isSelectedTempRow(cell.row.key);

    selected
      ? addCls(cell.dom, "__selected")
      : removeCls(cell.dom, "__selected");
  }

  selectedRows: SelectMap = {};
  selectedCells: SelectMap = {};

  selectedTempRows: SelectMap = {};
  selectedTempCells: SelectMap = {};

  /** 开始点 */
  startPoint: TablePointInfo | null = null;

  selectStart = (e: MouseEvent) => {
    if (
      this.config.rowSelectable === false &&
      this.config.cellSelectable === false
    ) {
      return;
    }

    // 合并还是覆盖
    const isMerge = e.metaKey || e.ctrlKey;

    const startPoint = this.table.transformViewportPoint(
      _getOffset(e, this.context.viewEl)
    );

    const valid = this.selectByPoint(startPoint, undefined, (items) => {
      const first = items.cells[0];

      if (!first) return false;

      // 行头&列头格用于实现行全选行, 跳过框选
      if (first.row.isHeader && first.column.isHeader) return false;

      if (
        isFunction(this.config.cellSelectable) &&
        !this.config.cellSelectable(first)
      ) {
        return false;
      }

      // 未按下控制键则清空已选中项
      if (!isMerge) {
        this.clearSelected();
      }

      return true;
    });

    // 没有有效选中项时不进行后续操作
    if (valid) {
      this.startPoint = startPoint;
    }
  };

  selectMove = throttle((e: MouseEvent) => {
    if (!this.startPoint) return;

    const p1 = this.startPoint;
    const p2 = this.table.transformViewportPoint(
      _getOffset(e, this.context.viewEl)
    );

    this.selectByPoint(p1, p2);
  }, 30);

  selectEnd = () => {
    if (!this.startPoint) return;

    const isRowChange = !isEmpty(this.selectedTempRows);
    const isCellChange = !isEmpty(this.selectedTempCells);

    console.log(this.selectedTempCells);
    console.log(isRowChange, isCellChange);

    Object.assign(this.selectedRows, this.selectedTempRows);
    Object.assign(this.selectedCells, this.selectedTempCells);

    this.startPoint = null;
    this.clearTempSelected();
    isRowChange && this.table.event.rowSelect.emit();
    isCellChange && this.table.event.cellSelect.emit();
    this.table.event.select.emit();
  };

  /** 点击处理 */
  clickHandle = (cell: TableCell) => {
    if (this.config.rowSelectable === false) return;

    // 点击行&列头, 切换全选
    if (cell.row.isHeader && cell.column.isHeader) {
      const keys = Object.keys(this.selectedRows);

      this.clearSelected();

      if (!keys.length) {
        this.context.allRowKeys.forEach((key) => {
          this.setSelected(key, this.selectedRows);
        });
      }

      this.table.render();

      this.table.event.rowSelect.emit();
      this.table.event.select.emit();
    }
  };

  isSelectedTempRow = (key: TableKey) => !!this.selectedTempRows[key];

  isSelectedTempCell = (key: TableKey) => !!this.selectedTempCells[key];

  isSelectedRow: TableInstance["isSelectedRow"] = (key) =>
    !!this.selectedRows[key];

  isSelectedCell: TableInstance["isSelectedCell"] = (key) =>
    !!this.selectedCells[key];

  getSelectedRows: TableInstance["getSelectedRows"] = () => {
    const ls: TableRow[] = [];

    Object.keys(this.selectedRows).forEach((key) => {
      const row = this.table.getRow(key);
      ls.push(row);
    });

    ls.sort((a, b) => a.index - b.index);

    return ls;
  };

  getSelectedCells: TableInstance["getSelectedCells"] = () => {
    const rows: { [key: string]: TableCell[] } = {};
    const uniqCache: any = {}; // 保证行和单元格的选中不重复

    // 此处可能有潜在的性能问题

    const keyHandle = (key: string) => {
      const [rowKey, columnKey] = _getCellKeysByStr(key);
      const cell = this.table.getCell(rowKey, columnKey);

      // 跳过行头
      if (cell.column.isHeader) return;

      // 跳过已经处理过的单元格
      if (uniqCache[cell.key]) return;

      let ls: TableCell[] = rows[rowKey];

      if (!ls) {
        ls = [];
        rows[rowKey] = ls;
      }

      uniqCache[cell.key] = 1;

      ls.push(cell);
    };

    Object.keys(this.selectedRows).forEach((key) => {
      this.context.allColumnKeys.forEach((columnKey) => {
        keyHandle(_getCellKey(key, columnKey));
      });
    });
    Object.keys(this.selectedCells).forEach(keyHandle);

    return Object.entries(rows)
      .map(([, ls]) => {
        // 列排序
        return ls.sort((a, b) => a.column.index - b.column.index);
      })
      .sort((a, b) => a[0].row.index - b[0].row.index);
  };

  selectRows: TableInstance["selectRows"] = (rows, merge) => {
    if (this.config.rowSelectable === false) return;

    if (!merge) {
      this.clearSelected();
    }
    rows.forEach((key) => {
      this.setSelected(key, this.selectedRows);
    });

    this.table.render();
    this.table.event.rowSelect.emit();
    this.table.event.select.emit();
  };

  selectCells: TableInstance["selectCells"] = (cells, merge) => {
    if (this.config.cellSelectable === false) return;

    if (!merge) {
      this.clearSelected();
    }
    cells.forEach((key) => {
      this.setSelected(key, this.selectedCells);
    });
    this.table.render();
    this.table.event.cellSelect.emit();
    this.table.event.select.emit();
  };

  /**
   * 根据传入的两个点更新临时选中状态
   * - 可传入interceptor来根据命中内容决定是否阻止后续操作
   * - 若没有选中项或interceptor()验证失败, 返回false
   * */
  selectByPoint = (
    p1: TablePointInfo,
    p2?: TablePointInfo,
    interceptor?: (items: TableItems) => boolean
  ): boolean => {
    p2 = p2 || p1;

    const items = this.table.getAreaBound(p1.xy, p2.xy);

    if (interceptor) {
      const res = interceptor(items);
      if (!res) return false;
    }

    this.clearTempSelected();

    // 是否有选中项
    let hasSelected = false;

    items.cells.forEach((i) => {
      const row = i.row;
      const column = i.column;

      if (row.isHeader && column.isHeader) return;

      if (row.isHeader && !column.isHeader) return;

      hasSelected = true;

      // 选中行头时, 将行设置为选中状态
      if (column.isHeader && !row.isHeader) {
        this.setSelected(row, this.selectedTempRows);
        return;
      }

      this.setSelected(i, this.selectedTempCells);
    });

    hasSelected && this.table.render();

    return hasSelected;
  };

  /**
   * 向selected map中设置行选中, item可以是cell/row的key或实例, 所有设置操作统一在此进行, 方便进行禁用等行为的拦截
   * - 返回false表示该次设置被拦截
   * */
  setSelected(item: any, map: AnyObject): boolean {
    const isKey = isString(item);
    const key = isKey ? item : item.key;

    const isRow = map === this.selectedRows || map === this.selectedTempRows;
    const isCell = map === this.selectedCells || map === this.selectedTempCells;

    const rowSelectable = this.config.rowSelectable;
    const cellSelectable = this.config.cellSelectable;

    if (isRow) {
      if (isBoolean(rowSelectable) && !rowSelectable) return false;
      if (isFunction(rowSelectable)) {
        const row = isKey ? this.table.getRow(key) : item;
        const pass = rowSelectable(row);
        if (!pass) return false;
      }
    }

    if (isCell) {
      if (isBoolean(cellSelectable) && !cellSelectable) return false;
      if (isFunction(cellSelectable)) {
        let cell = item;

        if (isKey) {
          const [rowKey, columnKey] = _getCellKeysByStr(key);
          cell = this.table.getCell(rowKey, columnKey);
        }

        const pass = cellSelectable(cell);
        if (!pass) return false;
      }
    }

    map[key] = 1;

    return true;
  }

  clearSelected() {
    this.selectedRows = {};
    this.selectedCells = {};
  }

  clearTempSelected() {
    this.selectedTempRows = {};
    this.selectedTempCells = {};
  }
}
