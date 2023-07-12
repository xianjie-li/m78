import { TablePlugin } from "../plugin.js";
import { TableCell, TableColumn, TableRow } from "../types/items.js";
import {
  AnyFunction,
  EmptyFunction,
  getCmdKeyStatus,
  isString,
} from "@m78/utils";
import { _prefix } from "../common.js";
import { _TableInteractiveCorePlugin } from "./interactive-core.js";
import { Position } from "../../common/index.js";

const clipboardDataWarning = `[${_prefix}] can't get clipboardData, bowser not support.`;

/** 单个值粘贴时, 最大的可粘贴单元格数 */
const maxSinglePaste = 50;

/** 键盘交互操作, 比如单元格复制/粘贴/delete等 */
export class _TableKeyboardInteractionPlugin extends TablePlugin {
  interactiveCore: _TableInteractiveCorePlugin;

  init() {
    this.interactiveCore = this.getPlugin(_TableInteractiveCorePlugin);
  }

  mount() {
    window.addEventListener("paste", this.onPaste);
    window.addEventListener("copy", this.onCopy);
    window.addEventListener("keydown", this.onKeydown);
  }

  beforeDestroy() {
    window.removeEventListener("paste", this.onPaste);
    window.removeEventListener("copy", this.onCopy);
    window.removeEventListener("keydown", this.onKeydown);
  }

  /** 事件派发 */
  private onKeydown = (e: KeyboardEvent) => {
    // 非表格焦点, 跳过
    if (!this.table.isActive()) return;

    // 有正在进行编辑等操作的单元格, 跳过
    if (this.interactiveCore.items.length) return;

    // 快捷键到方法的映射, 系统相关的三个按键顺序应为 sysCmd/alt/shift , 其中, sysCmd在mac下为command, windows下为ctrl
    // 目前仅支持单个常规键
    const methodMapper: { [key: string]: AnyFunction } = {
      Backspace: this.onDelete,
      "sysCmd+KeyZ": this.onUndo,
      "sysCmd+shift+KeyZ": this.onRedo,
      ArrowUp: this.onMove,
      ArrowDown: this.onMove,
      ArrowLeft: this.onMove,
      ArrowRight: this.onMove,
      Tab: this.onMove,
    };

    let key = "";

    if (getCmdKeyStatus(e)) {
      key += "sysCmd+";
    }

    if (e.altKey) {
      key += "alt+";
    }

    if (e.shiftKey) {
      key += "shift+";
    }

    key += e.code;

    const method = methodMapper[key];

    if (method) method(e);
  };

  /** 粘贴 */
  private onPaste = (e: Event) => {
    if (!this.table.isActive()) return;

    // 有正在进行编辑等操作的单元格, 跳过
    if (this.interactiveCore.items.length) return;

    const data: DataTransfer | null = (e as ClipboardEvent).clipboardData;

    if (!data) {
      console.warn(clipboardDataWarning);
      return;
    }

    const str = data.getData("text/plain");
    if (!isString(str)) return;

    const strCell = this.parse(str);

    if (!strCell.length) return;

    const selected = this.table.getSortedSelectedCells();
    if (!selected.length) return;

    e.preventDefault();

    // case1: 只有单个粘贴值, 若是, 并且选中单元格数量小于一定值, 则设置到所有选中的单元格
    const isSingleValue = strCell.length === 1 && strCell[0].length === 1;

    if (isSingleValue) {
      const allCell = selected.reduce((a, b) => a.concat(b), []);

      if (allCell.length > maxSinglePaste) {
        this.table.event.error.emit(
          this.context.texts.pasteSingleValueLimit.replace(
            "{num}",
            String(maxSinglePaste)
          )
        );
        return;
      }

      const singleValue = strCell[0][0];

      this.table.history.batch(() => {
        allCell.forEach((cell) => {
          this.table.setValue(cell, singleValue);
        });
      });

      return;
    }

    // case2: 非isSingleValue时, 检测行列数是否一致并进行设值
    const errorStr = this.checkAlign(strCell, selected);

    if (errorStr) {
      this.table.event.error.emit(errorStr);
      return;
    }

    const actions: EmptyFunction[] = [];

    for (let i = 0; i < strCell.length; i++) {
      const curList = strCell[i];

      for (let j = 0; j < curList.length; j++) {
        const curCellStr = curList[j];
        const cell = selected[i][j];

        // 若任意一个cell未获取到则中断
        if (!cell) return;

        actions.push(() => {
          this.table.setValue(cell, curCellStr);
        });
      }
    }

    if (!actions.length) return;

    this.table.history.batch(() => {
      actions.forEach((action) => action());
    });
  };

  /** 复制 */
  private onCopy = (e: Event) => {
    if (!this.table.isActive()) return;

    // 有正在进行编辑等操作的单元格, 跳过
    if (this.interactiveCore.items.length) return;

    const selected = this.table.getSortedSelectedCells();

    if (!selected.length) return;

    const data: DataTransfer | null = (e as ClipboardEvent).clipboardData;

    if (!data) {
      console.warn(clipboardDataWarning);
      return;
    }

    e.preventDefault();

    let str = "";

    for (let i = 0; i < selected.length; i++) {
      const curList = selected[i];

      for (let j = 0; j < curList.length; j++) {
        const cell = curList[j];

        const value = this.table.getValue(cell);

        if (j === curList.length - 1) {
          str += value;
        } else {
          str += `${value}\t`;
        }
      }

      if (i !== selected.length - 1) {
        str += "\r\n";
      }
    }

    data.clearData();
    data.setData("text/plain", str);
  };

  /** 删除 */
  private onDelete = (e: KeyboardEvent) => {
    const selected = this.table.getSelectedCells();

    if (!selected.length) return;

    e.preventDefault();

    this.table.history.batch(() => {
      selected.forEach((cell) => {
        this.table.setValue(cell, "");
      });
    });
  };

  /** 撤销 */
  private onUndo = (e: KeyboardEvent) => {
    e.preventDefault();
    this.table.history.undo();
  };

  /** 重做 */
  private onRedo = (e: KeyboardEvent) => {
    e.preventDefault();
    this.table.history.redo();
  };

  /** 各方向移动 */
  private onMove = (e: KeyboardEvent) => {
    let position: Position | undefined;

    if (e.code === "ArrowUp") position = Position.top;
    if (e.code === "ArrowDown") position = Position.bottom;
    if (e.code === "ArrowLeft") position = Position.left;
    if (e.code === "ArrowRight" || e.code === "Tab") position = Position.right;

    if (!position) return;

    const selected = this.table.getSelectedCells();

    // 无选中单元格时, 移动到第一个单元格
    if (selected.length === 0) {
      const firstCell = this.getFirstCell();

      if (!firstCell) return;

      e.preventDefault();

      this.table.locate(firstCell.key);

      this.table.selectCells(firstCell.key);

      return;
    }

    if (selected.length !== 1) return;

    e.preventDefault();

    const next = this.table.getNearCell({
      cell: selected[0],
      position,
      filter: (cell) => {
        const isSelectable = this.table.isCellSelectable(cell);

        const disable =
          cell.column.isHeader || cell.row.isHeader || !isSelectable;

        return !disable;
      },
    });

    if (!next) return;

    this.table.locate(next.key);

    this.table.selectCells(next.key);
  };

  /** 将指定字符串根据\t和\n解析为一个二维数组 */
  parse(str: string) {
    const list: string[][] = [];

    const rows = str.split(/\n|\r\n/);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      const cells = row.split("\t");

      if (cells.length) {
        list.push(cells);
      }
    }

    return list;
  }

  /** 检测传入的str cell 和 cell 的二维数组是否行列数完全一致, 如果不一致, 返回错误文本 */
  checkAlign(strCell: string[][], cells: TableCell[][]) {
    if (strCell.length !== cells.length) {
      return `${this.context.texts.pasteUnalignedRow} [${strCell.length} -> ${cells.length}]`;
    }

    for (let i = 0; i < strCell.length; i++) {
      const row = strCell[i];
      const cellsRow = cells[i];

      if (row.length !== cellsRow.length) {
        return `${this.context.texts.pasteUnalignedColumn} [${row.length} -> ${cellsRow.length}]`;
      }
    }

    return "";
  }

  /** 获取首个常规单元格 */
  getFirstCell() {
    let firstRow: TableRow | undefined;
    let firstRowIndex = 0;

    do {
      try {
        const key = this.table.getKeyByRowIndex(firstRowIndex);

        firstRow = this.table.getRow(key);

        firstRowIndex++;
      } catch (e) {
        // 忽略越界错误
      }
    } while (firstRow && firstRow.isHeader);

    let firstColumn: TableColumn | undefined;
    let firstColumnIndex = 0;

    do {
      try {
        const key = this.table.getKeyByColumnIndex(firstColumnIndex);

        firstColumn = this.table.getColumn(key);

        firstColumnIndex++;
      } catch (e) {
        // 忽略越界错误
      }
    } while (firstColumn && firstColumn.isHeader);

    if (!firstRow || !firstColumn) return;

    return this.table.getCell(firstRow.key, firstColumn.key);
  }
}
