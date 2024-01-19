import { TablePlugin } from "../plugin.js";
import { _getSizeString } from "../common.js";
import { _TableEventPlugin } from "./event.js";

export class _TableSetterPlugin
  extends TablePlugin
  implements TableSetter, _ContextSetter
{
  /** 用于滚动优化 */
  event: _TableEventPlugin;

  beforeInit() {
    this.methodMapper(this.table, [
      "setX",
      "setY",
      "setXY",
      "setWidth",
      "setHeight",
    ]);

    this.methodMapper(this.context, ["setCursor"]);
  }

  init() {
    this.event = this.getPlugin(_TableEventPlugin);
  }

  setHeight(height: number | string): void {
    this.config.el.style.height = _getSizeString(height);
    this.table.render();
  }

  setWidth(width: number | string): void {
    this.config.el.style.width = _getSizeString(width);
    this.table.render();
  }

  setX(x: number): void {
    const ctx = this.context;
    const viewEl = ctx.viewEl;

    const run = () => {
      viewEl.scrollLeft = x;
      this.table.renderSync();
    };

    // 阻断/不阻断内部onScroll事件
    if (!ctx.xyShouldNotify) {
      this.event.scrollAction(run);
    } else {
      run();
    }
  }

  setY(y: number): void {
    const ctx = this.context;
    const viewEl = ctx.viewEl;

    const run = () => {
      viewEl.scrollTop = y;
      this.table.renderSync();
    };

    // 阻断/不阻断内部onScroll事件
    if (!ctx.xyShouldNotify) {
      this.event.scrollAction(run);
    } else {
      run();
    }
  }

  setXY(x: number, y: number): void {
    this.table.takeover(() => {
      this.setX(x);
      this.setY(y);
    });
  }

  setCursor(cursor: string) {
    this.config.el.style.cursor = cursor;
  }
}

export interface TableSetter {
  /** 更新x */
  setX(x: number): void;

  /** 更新y */
  setY(y: number): void;

  /** 更新xy */
  setXY(x: number, y: number): void;

  /** 设置宽度 */
  setWidth(width: number | string): void;

  /** 设置高度 */
  setHeight(height: number | string): void;
}

export interface _ContextSetter {
  /** 设置表格显示的光标 */
  setCursor(cursor: string): void;
}
