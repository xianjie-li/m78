import { EmptyFunction } from "../types.js";

const ACTION_IN_ACTION_WARNING =
  "can't call redo() when redo() or undo() is running";

/** implement action history */
export class ActionHistory {
  /** 最大记录长度 */
  maxLength = 500;

  /** 操作历史 */
  private history: ActionHistoryItem[] = [];
  /** 当前所在记录游标 */
  private cursor = -1;
  /** 正在执行redo(action)操作 */
  private isDoing = false;
  /** 正在执行undo()操作 */
  private isUndoing = false;
  /** batch操作期间缓冲的所有action */
  private batchActionList: ActionHistoryItem[] | undefined;
  /** 为true期间不计入历史记录 */
  private ignoreFlag = false;

  /**
   * 执行一项操作并推入历史, 若后方有其他操作历史, 将全部移除.
   *
   * 在redo(action)执行期间内执行的redo(action)会被当前action合并为单个
   * */
  redo(action: ActionHistoryItem): void;
  /** 重做一项操作 */
  redo(): void;
  redo(arg?: ActionHistoryItem) {
    if (!arg) {
      if (this.isDoing || this.isUndoing) {
        console.warn(ACTION_IN_ACTION_WARNING);
        return;
      }

      if (this.batchActionList) {
        console.warn(
          "can't call redo() without argument when batch() is running"
        );
        return;
      }

      const next = this.cursor + 1;
      const cur = this.history[next];

      if (!cur) return;

      this.isDoing = true;
      cur.redo();
      this.isDoing = false;

      this.cursor++;

      return;
    }

    if (this.ignoreFlag) return;

    if (this.isDoing || this.isUndoing) {
      console.warn(ACTION_IN_ACTION_WARNING);
      return;
    }

    if (this.batchActionList) {
      this.batchActionList.push(arg);
      return;
    }

    this.isDoing = true;

    // 长度超出时, 先移除最前面的记录
    if (this.history.length >= this.maxLength) {
      this.history.shift();
      this.cursor--;
    }

    // 游标不在末尾则直接以当前位置截断
    if (this.cursor !== this.history.length - 1) {
      this.history = this.history.slice(0, this.cursor + 1);
    }

    arg.redo();
    this.history.push(arg);

    this.cursor++;

    this.isDoing = false;
  }

  /**
   * 撤销一项操作
   *
   * 在undo()执行期间内执行的redo(action)会被合并undo操作并且不计入历史
   * */
  undo() {
    if (this.isDoing || this.isUndoing) {
      console.warn("can't call undo() when redo() or undo() is running");
      return;
    }

    if (this.batchActionList) {
      console.warn("can't call undo() when batch() is running");
      return;
    }

    if (this.cursor === -1) return;

    const prev = this.cursor;
    const cur = this.history[prev];

    if (!cur) return;

    this.isUndoing = true;

    cur.undo();
    this.cursor--;

    this.isUndoing = false;
  }

  /**
   * 批量执行, 在action内执行的所有redo(action)操作都会被合并为单个
   * */
  batch(action: EmptyFunction) {
    if (this.batchActionList) return;

    this.batchActionList = [];

    action();

    const list = this.batchActionList.slice();

    this.batchActionList = undefined;

    this.redo({
      redo: () => {
        list.forEach((item) => item.redo());
      },
      undo: () => {
        // 需要以相反顺序执行undo
        list
          .slice()
          .reverse()
          .forEach((item) => item.undo());
      },
    });
  }

  /**
   * 忽略action内执行的所有redo(action)操作, 使它们不计入history
   * */
  ignore(action: EmptyFunction) {
    this.ignoreFlag = true;

    action();

    this.ignoreFlag = false;
  }

  /** 重置历史 */
  reset() {
    this.history = [];
    this.cursor = -1;
  }
}

export interface ActionHistoryItem {
  /** 操作名, 可用于提供更友好的提示, 比如撤销编辑, 重做编辑等 */
  title?: string;

  /** 执行操作 */
  redo(): void;

  /** 重做 */
  undo(): void;
}
