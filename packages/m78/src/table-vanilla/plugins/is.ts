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
  /** 可由用户控制的active状态, 和_isActive一起构成active状态  */
  _isControllableActive = true;

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
      "isRowMount",
      "isColumnMount",
    ]);
  }

  mounted() {
    this.activeEventBind();
  }

  beforeDestroy() {
    this.activeEventUnBind();
  }

  isColumnVisible(key: TableKey, partial = true) {
    return this.visibleCommon(false, key, partial);
  }

  isRowVisible(key: TableKey, partial = true) {
    return this.visibleCommon(true, key, partial);
  }

  isCellVisible(rowKey: TableKey, columnKey: TableKey, partial = true) {
    const cell = this.table.getCell(rowKey, columnKey);

    if (partial) {
      return cell.isMount;
    }

    return (
      this.isRowVisible(rowKey, partial) &&
      this.isColumnVisible(columnKey, partial)
    );
  }

  isRowMount(key: TableKey) {
    return !!this.context.lastMountRows[key];
  }

  isColumnMount(key: TableKey) {
    return !!this.context.lastMountColumns[key];
  }

  isFocus(checkChildren?: boolean) {
    return isFocus(this.config.el, checkChildren);
  }

  isActive(is?: boolean) {
    if (is !== undefined) {
      this._isControllableActive = is;
    }

    return this._isActive && this._isControllableActive;
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
  private visibleCommon(isRow: boolean, key: TableKey, partial: boolean) {
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

    this.config.el.addEventListener("focus", this.onActive);

    if (this.config.extraActiveCheckEl) {
      this.config.extraActiveCheckEl.addEventListener(
        "mouseenter",
        this.onIsActiveCheck
      );

      this.config.extraActiveCheckEl.addEventListener("focus", this.onActive);
    }

    this.context.viewEl.addEventListener("scroll", this.onActive);

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

    this.config.el.removeEventListener("focus", this.onActive);

    if (this.config.extraActiveCheckEl) {
      this.config.extraActiveCheckEl.removeEventListener(
        "mouseenter",
        this.onIsActiveCheck
      );

      this.config.extraActiveCheckEl.removeEventListener(
        "focus",
        this.onActive
      );
    }

    this.context.viewEl.removeEventListener("scroll", this.onActive);

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

        let rect = el.getBoundingClientRect();

        if (this.config.extraActiveCheckEl) {
          const _rect = this.config.extraActiveCheckEl.getBoundingClientRect();

          rect = {
            ...rect,
            left: Math.min(rect.left, _rect.left),
            top: Math.min(rect.top, _rect.top),
            right: Math.max(rect.right, _rect.right),
            bottom: Math.max(rect.bottom, _rect.bottom),
          };
        }

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

  /** 指定列是否挂载, 与 isColumnVisible(key, true) 非常相似, 但是前者是通过当前位置计算对比, isColumnMount是读取缓存结果, 效率更高 */
  isColumnMount(key: TableKey): boolean;

  /** 指定行是否挂载, 与 isRowVisible(key, true) 非常相似, 但是前者是通过当前位置计算对比, isColumnMount是读取缓存结果, 效率更高 */
  isRowMount(key: TableKey): boolean;

  /** 表格是否聚焦, checkChildren为true时会检测子级是否聚焦 */
  isFocus(checkChildren?: boolean): boolean;

  /**
   * 表格是否处于活动状态, 即: 最近进行过点击, hover, 滚动等, 在某些弹出层打开时
   * - 在某些场景下, 比如开启了自定义弹出层, 可以手动设置false来禁用表格的一些快捷键操作, 但务必在其关闭后重新设为true
   * */
  isActive(is?: boolean): boolean;

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

export interface TableIsConfig {
  /** 额外的用于判断table active状态的组件, 用于自定义了外层包裹容器这类的场景 */
  extraActiveCheckEl?: HTMLElement;
}
