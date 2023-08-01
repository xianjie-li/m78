import { TablePlugin } from "../plugin.js";
import { TableCell, TableColumn, TableRow } from "../types/items.js";
import debounce from "lodash/debounce.js";
import { addCls, removeCls } from "../../common/index.js";
import { TouchEvent } from "react";
import { isFocus, isNumber, isString } from "@m78/utils";
import { TableKey } from "../types/base-type.js";

export class _TableIsPlugin extends TablePlugin implements TableIs {
  /** 内部isActive状态 */
  _isActive = false;

  beforeInit() {
    this.methodMapper(this.table, [
      "isRowVisible",
      "isColumnVisible",
      "isCellVisible",
      "isFocus",
      "isActive",
      "isRowExist",
      "isColumnExist",
      "isColumnExistByIndex",
      "isRowExistByIndex",
      "isRowLike",
      "isColumnLike",
      "isCellLike",
      "isTableKey",
    ]);
  }

  mounted() {
    this.activeEventBind();
  }

  beforeDestroy() {
    this.activeEventUnBind();
  }

  isColumnVisible(key: string, partial = true) {
    return this.visibleCommon(false, key, partial);
  }

  isRowVisible(key: string, partial = true) {
    return this.visibleCommon(true, key, partial);
  }

  isCellVisible(rowKey: string, columnKey: string, partial = true) {
    const cell = this.table.getCell(rowKey, columnKey);

    if (partial) {
      return cell.isMount;
    }

    return (
      this.isRowVisible(rowKey, partial) &&
      this.isColumnVisible(columnKey, partial)
    );
  }

  isFocus(checkChildren?: boolean) {
    return isFocus(this.config.el, checkChildren);
  }

  isActive() {
    return this._isActive;
  }

  isColumnExist(key: TableKey): boolean {
    return this.context.columnKeyIndexMap[key] !== undefined;
  }

  isRowExist(key: TableKey): boolean {
    return this.context.dataKeyIndexMap[key] !== undefined;
  }

  isColumnExistByIndex(ind: number): boolean {
    return this.context.columns[ind] !== undefined;
  }

  isRowExistByIndex(ind: number): boolean {
    return this.context.data[ind] !== undefined;
  }

  isRowLike(row: any): row is TableRow {
    return (
      row &&
      typeof row.key === "string" &&
      typeof row.height === "number" &&
      typeof row.y === "number"
    );
  }

  isColumnLike(column: any): column is TableColumn {
    return (
      column &&
      typeof column.key === "string" &&
      typeof column.height === "number" &&
      typeof column.x === "number"
    );
  }

  isCellLike(cell: any): cell is TableCell {
    return cell && typeof cell.key === "string" && !!cell.row && !!cell.column;
  }

  isTableKey(key: any): key is TableKey {
    return isString(key) || isNumber(key);
  }

  // isColumnVisible/isRowVisible通用逻辑
  private visibleCommon(isRow: boolean, key: string, partial: boolean) {
    const ctx = this.context;
    const current = isRow ? this.table.getRow(key) : this.table.getColumn(key);

    if (current.isFixed) return true;

    const rowCur = current as TableRow;
    const colCur = current as TableColumn;

    const size = isRow ? rowCur.height : colCur.width;

    const contStart = isRow ? rowCur.y : colCur.x;
    const contEnd = contStart + size;

    const pos = isRow ? this.table.getY() : this.table.getX();
    const tableSize = isRow ? this.table.getHeight() : this.table.getWidth();

    const startFixedSize = isRow ? ctx.topFixedHeight : ctx.leftFixedWidth;
    const endFixedSize = isRow ? ctx.bottomFixedHeight : ctx.rightFixedWidth;

    // 开始/结束边界
    const startLine = pos + startFixedSize;
    const endLine = pos + tableSize - endFixedSize;

    let isVisible = false;

    if (partial) {
      isVisible = contEnd >= startLine && contStart <= endLine;
    } else {
      isVisible = contStart >= startLine && contEnd <= endLine;
    }

    return isVisible;
  }

  // 尽可能满足所有符合active的情况
  private activeEventBind() {
    document.documentElement.addEventListener(
      "mousedown",
      this.onIsActiveCheck
    );
    document.documentElement.addEventListener(
      "touchstart",
      this.onIsActiveCheck as any
    );

    this.config.el.addEventListener("mouseenter", this.onIsActiveCheck);

    this.context.viewEl.addEventListener("scroll", this.onActive);

    this.config.el.addEventListener("focus", this.onActive);

    window.addEventListener("blur", this.onWindowBlur);
  }

  private activeEventUnBind() {
    document.documentElement.removeEventListener(
      "mousedown",
      this.onIsActiveCheck
    );
    document.documentElement.removeEventListener(
      "touchstart",
      this.onIsActiveCheck as any
    );

    this.config.el.removeEventListener("mouseenter", this.onIsActiveCheck);

    this.context.viewEl.removeEventListener("scroll", this.onActive);

    this.config.el.removeEventListener("focus", this.onActive);

    window.removeEventListener("blur", this.onWindowBlur);
  }

  // 开始滚动时更新isActive
  private onActive = debounce(
    () => {
      if (this._isActive) return;

      this._isActive = true;

      addCls(this.config.el, "__active");
    },
    200,
    {
      leading: true,
      trailing: false,
    }
  );

  // 点击/移入时更新isActive
  private onIsActiveCheck = debounce(
    (e: MouseEvent | TouchEvent) => {
      const mouseEvent = e as MouseEvent;
      const touchEvent = e as TouchEvent;

      const el = this.config.el;

      let active: boolean;

      if (e.type === "mouseenter") {
        active = true;
      } else {
        let x;
        let y;

        if (e.type === "mousedown") {
          x = mouseEvent.clientX;
          y = mouseEvent.clientY;
        } else {
          x = touchEvent.touches[0].clientX;
          y = touchEvent.touches[0].clientY;
        }

        const rect = el.getBoundingClientRect();

        active =
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom;
      }

      if (active === this._isActive) return;

      this._isActive = active;

      if (this._isActive) {
        addCls(el, "__active");
      } else {
        removeCls(el, "__active");
      }
    },
    200,
    { leading: true, trailing: true }
  );

  private onWindowBlur = () => {
    if (!this._isActive) return;

    this._isActive = false;

    removeCls(this.config.el, "__active");
  };
}

export interface TableIs {
  /** 指定列是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
  isColumnVisible(key: TableKey, partial?: boolean): boolean;

  /** 指定行是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
  isRowVisible(key: TableKey, partial?: boolean): boolean;

  /** 指定单元格是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
  isCellVisible(
    rowKey: TableKey,
    columnKey: TableKey,
    partial?: boolean
  ): boolean;

  /** 表格是否聚焦, checkChildren为true时会检测子级是否聚焦 */
  isFocus(checkChildren?: boolean): boolean;

  /** 表格是否处于活动状态, 即: 最近进行过点击, hover, 滚动等 */
  isActive(): boolean;

  /** 指定key的数据是否存在 */
  isRowExist(key: TableKey): boolean;

  /** 指定key的列是否存在 */
  isColumnExist(key: TableKey): boolean;

  /** 指定index的数据是否存在 */
  isColumnExistByIndex(ind: number): boolean;

  /** 指定index的列是否存在 */
  isRowExistByIndex(ind: number): boolean;

  /** 是否是类似row的结构. 注意, 此方法为粗检测, 结果并不可靠 */
  isRowLike(row: any): row is TableRow;

  /** 是否是类似column的结构. 注意, 此方法为粗检测, 结果并不可靠 */
  isColumnLike(column: any): column is TableColumn;

  /** 是否是类似cell的结构. 注意, 此方法为粗检测, 结果并不可靠 */
  isCellLike(cell: any): cell is TableCell;

  /** 是否是合格的tableKey */
  isTableKey(key: any): key is TableKey;
}
