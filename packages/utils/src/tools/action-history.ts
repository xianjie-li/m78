import { dumpFn } from "../function.js";
import { EmptyFunction } from "../types.js";

const ACTION_IN_ACTION_WARNING =
  "Can't call redo() when redo() or undo() is running";

/** implement action history */
export class ActionHistory {
  /** 最大记录长度 */
  maxLength = 500;

  /** 操作历史 */
  private history: ActionHistoryItem[] = [];
  /** 当前所在记录游标, -1表示初始状态 */
  private cursor = -1;
  /** 正在执行redo(action)操作 */
  private isDoing = false;
  /** 正在执行undo()操作 */
  private isUndoing = false;
  /** 为true期间不计入历史记录 */
  private ignoreCB: ((act: ActionHistoryItem) => void)[] = [];

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
        throw Error(ACTION_IN_ACTION_WARNING);
      }

      // batch进行中不允许执行普通的redo
      if (this.ignoreCB.length) {
        throw Error(
          "Can't call redo() inside batch() or ignore() without argument"
        );
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

    if (this.#ignoreEmit(arg)) {
      arg.redo();
      return;
    }

    if (this.isDoing || this.isUndoing) {
      throw Error(ACTION_IN_ACTION_WARNING);
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
      throw Error("Can't call undo() when redo() or undo() is running");
    }

    if (this.ignoreCB.length) {
      throw Error("Can't call undo() inside batch() or ignore()");
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
   * 批量执行, 在action内执行的所有redo(action)操作都会被合并为单个, batch内不可再调用其他batch
   *
   * @param action - 在action内执行的redo会被合并
   * @param title - 操作名
   * */
  batch(action: EmptyFunction, title?: string): ActionHistoryItem {
    if (this.ignoreCB.length) {
      throw Error("Can't call batch() inside another batch() or ignore()");
    }

    const allAct: ActionHistoryItem[] = [];

    const actionObj = {
      title,
      redo: () => {
        allAct.length = 0; // 防止撤销重做时取到脏数据

        // 允许嵌套执行, 嵌套的redo直接执行, 不进行记录
        this.ignore(action, (act) => {
          allAct.push(act);
        });
      },
      undo: () => {
        // 需要以相反顺序执行undo
        allAct
          .slice()
          .reverse()
          .forEach((item) => item.undo());
      },
    };

    this.redo(actionObj);

    return actionObj;
  }

  /**
   * 使action期间的所有redo(action)操作不计入历史, 需要自行保证这些被忽略的操作不会影响历史还原或重做
   *
   * 被忽略的action会通过 cb 回调
   * */
  ignore(action: EmptyFunction, cb?: (act: ActionHistoryItem) => void) {
    const curCB = cb || dumpFn;

    this.ignoreCB.push(curCB);

    action();

    this.ignoreCB.splice(this.ignoreCB.indexOf(curCB), 1);
  }

  // 执行当前所有ignoreCB并传入cb
  #ignoreEmit(act: ActionHistoryItem) {
    if (!this.ignoreCB.length) return false;
    this.ignoreCB
      .slice()
      .reverse()
      .forEach((f) => f(act));

    return true;
  }

  /** 重置历史 */
  reset() {
    this.history = [];
    this.cursor = -1;
  }

  /** 获取下一条记录 */
  getNext(): ActionHistoryItem | null {
    return this.history[this.cursor + 1] || null;
  }

  /** 获取前一条记录 */
  getPrev(): ActionHistoryItem | null {
    // 游标为0时, 前一项为还原初始状态, 生产一个假的操作项
    if (this.cursor === 0)
      return {
        redo: () => {},
        undo: () => {},
      };
    return this.history[this.cursor - 1] || null;
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
