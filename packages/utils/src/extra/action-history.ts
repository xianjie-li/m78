/** implement action history */
export class ActionHistory {
  /** 最大记录长度 */
  maxLength = 500;

  /** 操作历史 */
  private history: ActionHistoryItem[] = [];
  /** 当前所在记录游标 */
  private cursor = -1;

  /** 执行一项操作并推入历史, 若后方有其他操作历史, 将全部移除 */
  redo(action: ActionHistoryItem): void;
  /** 重做一项操作 */
  redo(): void;
  redo(arg?: ActionHistoryItem) {
    if (!arg) {
      const next = this.cursor + 1;
      const cur = this.history[next];

      if (!cur) return;

      cur.redo();
      this.cursor++;

      return;
    }

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
  }

  /** 撤销一项操作 */
  undo() {
    if (this.cursor === -1) return;

    const prev = this.cursor;
    const cur = this.history[prev];

    if (!cur) return;

    cur.undo();
    this.cursor--;
  }

  reset() {
    this.history = [];
    this.cursor = -1;
  }
}

export interface ActionHistoryItem {
  /** 执行操作 */
  redo(): void;
  /** 重做 */
  undo(): void;
}
