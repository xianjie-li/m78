import { TablePlugin } from "../plugin.js";
import { TableCell, TableColumn, TableRow } from "../types/items.js";
import {
  createKeyboardHelpersBatch,
  EmptyFunction,
  isString,
  KeyboardHelperEvent,
  KeyboardHelperModifier,
  KeyboardHelperOption,
  KeyboardMultipleHelper,
} from "@m78/utils";
import { _TableInteractiveCorePlugin } from "./interactive-core.js";
import { Position } from "../../common/index.js";

/** 单个值粘贴时, 最大的可粘贴单元格数 */
const maxSinglePaste = 50;

/** 键盘交互操作, 比如单元格复制/粘贴/delete等 */
export class _TableKeyboardInteractionPlugin extends TablePlugin {
  interactiveCore: _TableInteractiveCorePlugin;

  multipleHelper: KeyboardMultipleHelper;

  beforeInit() {
    this.methodMapper(this.table, ["copy", "paste"]);
  }

  init() {
    this.interactiveCore = this.getPlugin(_TableInteractiveCorePlugin);
  }

  mounted() {
    window.addEventListener("paste", this.onPaste);
    window.addEventListener("copy", this.onCopy);
    this.multipleHelper = createKeyboardHelpersBatch(this.getKeydownOptions());
  }

  beforeDestroy() {
    window.removeEventListener("paste", this.onPaste);
    window.removeEventListener("copy", this.onCopy);

    this.multipleHelper.destroy();
  }

  paste() {
    this.pasteImpl();
  }

  copy() {
    this.copyImpl();
  }

  // 粘贴的核心实现, 传入ClipboardEvent时, 使用事件对象操作剪切板, 否则使用 Clipboard API
  private async pasteImpl(e?: ClipboardEvent) {
    // 有正在进行编辑等操作的单元格, 跳过
    if (this.interactiveCore.items.length) return;

    let str = "";

    if (e) {
      const data: DataTransfer | null = (e as ClipboardEvent).clipboardData;

      if (!data) {
        this.table.event.error.emit(this.context.texts.clipboardWarning);
        return;
      }

      str = data.getData("text/plain");
    } else {
      try {
        str = await navigator.clipboard.readText();
      } catch (e) {
        this.table.event.error.emit(this.context.texts.clipboardWarning);
        return;
      }
    }

    if (!isString(str)) return;

    const strCell = this.parse(str);

    if (!strCell.length) return;

    const selected = this.table.getSortedSelectedCells();
    if (!selected.length) return;

    // 事件对象时, 阻止默认行为
    if (e) {
      e.preventDefault();
    }

    const actions: EmptyFunction[] = [];

    // case1: 只有单个粘贴值, 若是, 并且选中单元格数量小于一定值, 则设置到所有选中的单元格
    const isSingleValue = strCell.length === 1 && strCell[0].length === 1;

    if (isSingleValue) {
      const allCell = selected.reduce((a, b) => a.concat(b), []);

      if (allCell.length > maxSinglePaste) {
        this.table.event.error.emit(
          this.context.texts["paste single value limit"].replace(
            "{num}",
            String(maxSinglePaste)
          )
        );
        return;
      }

      const singleValue = strCell[0][0];

      for (let i = 0; i < allCell.length; i++) {
        const cell = allCell[i];

        if (!this.interactiveCore.isInteractive(cell)) {
          this.table.event.error.emit(this.context.texts.paste);
          return;
        }

        actions.push(() => {
          this.table.setValue(cell, singleValue);
        });
      }

      this.table.history.batch(() => {
        actions.forEach((action) => action());
      });

      return;
    }

    // case2: 非isSingleValue时, 检测行列数是否一致并进行设值
    const errorStr = this.checkAlign(strCell, selected);

    if (errorStr) {
      this.table.event.error.emit(errorStr);
      return;
    }

    for (let i = 0; i < strCell.length; i++) {
      const curList = strCell[i];

      for (let j = 0; j < curList.length; j++) {
        const curCellStr = curList[j];
        const cell = selected[i][j];

        // 若任意一个cell未获取到则中断
        if (!cell) return;

        if (!this.interactiveCore.isInteractive(cell)) {
          this.table.event.error.emit(this.context.texts.paste);
          return;
        }

        actions.push(() => {
          this.table.setValue(cell, curCellStr);
        });
      }
    }

    if (!actions.length) return;

    this.table.history.batch(() => {
      actions.forEach((action) => action());
    });
  }

  // 复制的核心实现, 传入ClipboardEvent时, 使用事件对象操作剪切板, 否则使用 Clipboard API
  private async copyImpl(e?: ClipboardEvent) {
    // 有正在进行编辑等操作的单元格, 跳过
    if (this.interactiveCore.items.length) return;

    const selected = this.table.getSortedSelectedCells();

    if (!selected.length) return;

    if (e) {
      const data: DataTransfer | null = (e as ClipboardEvent).clipboardData;

      if (!data) {
        this.table.event.error.emit(this.context.texts.clipboardWarning);
        return;
      }

      e.preventDefault();
    }

    let str = "";

    for (let i = 0; i < selected.length; i++) {
      const curList = selected[i];

      for (let j = 0; j < curList.length; j++) {
        const cell = curList[j];

        const value = this.table.getValue(cell) || "";

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

    if (e) {
      e.clipboardData!.clearData();
      e.clipboardData!.setData("text/plain", str);
    } else {
      try {
        await navigator.clipboard.writeText(str);
      } catch (e) {
        this.table.event.error.emit(this.context.texts.clipboardWarning);
        return;
      }
    }
  }

  // 事件绑定配置
  private getKeydownOptions(): KeyboardHelperOption[] {
    const checker = () => {
      // 非表格焦点 或 有正在进行编辑等操作的单元格, 跳过
      return this.table.isActive() && !this.interactiveCore.items.length;
    };

    return [
      {
        code: "Backspace",
        handle: this.onDelete,
        enable: checker,
      },
      {
        code: "KeyZ",
        modifier: [KeyboardHelperModifier.sysCmd],
        handle: this.onUndo,
        enable: checker,
      },
      {
        code: "KeyZ",
        modifier: [KeyboardHelperModifier.sysCmd, KeyboardHelperModifier.shift],
        handle: this.onRedo,
        enable: checker,
      },
      {
        code: ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Tab"],
        handle: this.onMove,
        enable: checker,
      },
    ];
  }

  /** 粘贴 */
  private onPaste = (e: Event) => {
    if (!this.table.isActive()) return;

    this.pasteImpl(e as ClipboardEvent);
  };

  /** 复制 */
  private onCopy = (e: Event) => {
    if (!this.table.isActive()) return;

    this.copyImpl(e as ClipboardEvent);
  };

  /** 删除 */
  private onDelete = () => {
    const selected = this.table.getSelectedCells();

    if (!selected.length) return false;

    this.table.history.batch(() => {
      selected.forEach((cell) => {
        this.table.setValue(cell, "");
      });
    });
  };

  /** 撤销 */
  private onUndo = () => {
    this.table.history.undo();
  };

  /** 重做 */
  private onRedo = () => {
    this.table.history.redo();
  };

  /** 各方向移动 */
  private onMove = (e: KeyboardHelperEvent) => {
    let position: Position | undefined;

    if (e.code === "ArrowUp") position = Position.top;
    if (e.code === "ArrowDown") position = Position.bottom;
    if (e.code === "ArrowLeft") position = Position.left;
    if (e.code === "ArrowRight" || e.code === "Tab") position = Position.right;

    if (!position) return false;

    const selected = this.table.getSelectedCells();

    // 无选中单元格时, 移动到第一个单元格
    if (selected.length === 0) {
      const firstCell = this.getFirstCell();

      if (!firstCell) return;

      this.table.locate(firstCell.key);

      this.table.selectCells(firstCell.key);

      return;
    }

    if (selected.length !== 1) return;

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
      return `${this.context.texts["paste unaligned row"]} [${strCell.length} -> ${cells.length}]`;
    }

    for (let i = 0; i < strCell.length; i++) {
      const row = strCell[i];
      const cellsRow = cells[i];

      if (row.length !== cellsRow.length) {
        return `${this.context.texts["paste unaligned column"]} [${row.length} -> ${cellsRow.length}]`;
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

export interface TableKeyboardInteraction {
  /** 复制当前选中单元格到粘贴板 */
  copy: EmptyFunction;
  /** 粘贴当前粘贴板内容到选中单元格 */
  paste: EmptyFunction;
}
