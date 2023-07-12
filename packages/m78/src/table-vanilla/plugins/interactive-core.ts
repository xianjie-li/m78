import { TablePlugin } from "../plugin.js";
import { TableCell } from "../types/items.js";
import { isFunction, isPromiseLike, isTruthyOrZero } from "@m78/utils";
import { removeNode } from "../../common/index.js";

// 表示一个交互项
interface TableInteractiveItem {
  // 单元格
  cell: TableCell;
  // 附加交互组件的节点
  node: HTMLElement;
  // 是否已挂载
  mounted?: boolean;
  // 是否已卸载
  unmounted?: boolean;

  // 清理该交互项
  done(isSubmit?: boolean): void;
}

// 表示交互完成后要执行的操作
export type TableInteractiveDone = (isSubmit: boolean) => void | Promise<void>;

/**
 * 表格的编辑/交互功能, 通常用于实现单元格编辑, 提供的功能仅能满足简单的编辑需求, 通常需要基于使用的框架如react加上本插件提供的核心功能
 * 来进行扩展实现, 添加诸如验证, 编辑反馈和更丰富的表单控件支持
 *
 * interactive 并非一定表示单元格编辑, 也可以纯展示的其他交互组件
 * */
export class _TableInteractiveCorePlugin extends TablePlugin {
  // 所有活动的交互项
  items: TableInteractiveItem[] = [];

  // 包裹所有创建节点的容器
  wrapNode: HTMLElement;

  // 实现双击
  doubleClickLastCell: TableCell | null = null;
  doubleClickTimer: any = null;

  // 最后触发交互关闭的时间, 用于防止关闭后马上出发Enter等操作
  lastDownTime = 0;

  mount() {
    this.initDom();
    this.table.event.click.on(this.onClick);
    window.addEventListener("keydown", this.onKeydown);
  }

  beforeDestroy() {
    this.table.event.click.off(this.onClick);
    window.removeEventListener("keydown", this.onKeydown);

    this.wrapNode.removeEventListener("click", this.onAttachClick);

    this.doubleClickTimer && clearTimeout(this.doubleClickTimer);

    removeNode(this.wrapNode);
  }

  rendering() {
    this.updateNode();
  }

  private onKeydown = (e: KeyboardEvent) => {
    if (!this.table.isActive()) return;

    if (this.items.length) {
      if (e.code === "Tab") {
        e.preventDefault();
        this.onTabDown();
        return;
      }

      if (e.code === "Escape") {
        e.preventDefault();
        this.onEscDown();
        return;
      }
    } else {
      if (e.code === "Enter") {
        this.onEnterDown(e);
        return;
      }

      const isRegularChar =
        /^\w$/.test(e.key) &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        !e.shiftKey;

      if (isRegularChar) {
        this.onRegularKeyDown(e);
      }
    }
  };

  // 初始化必须的node
  private initDom() {
    this.wrapNode = document.createElement("div");
    this.wrapNode.className = "m78-table_edit";

    this.wrapNode.addEventListener("click", this.onAttachClick);

    this.context.viewContentEl.appendChild(this.wrapNode);
  }

  private onAttachClick = (e: Event) => {
    e.stopPropagation();
  };

  private onClick = (cell: TableCell) => {
    if (this.doubleClickLastCell === cell) {
      this.doubleClickLastCell = null;
      this.doubleClickTimer && clearTimeout(this.doubleClickTimer);
      this.interactive(cell);
      return;
    }

    this.doubleClickLastCell = cell;
    this.doubleClickTimer = setTimeout(() => {
      this.doubleClickLastCell = null;
    }, 400);
  };

  // 检测单元格能否进行交互
  isInteractive(cell: TableCell) {
    if (cell.row.isHeader || cell.column.isHeader) return false;

    if (this.config.interactive === false) return false;

    if (!this.config.interactive) return false;

    if (isFunction(this.config.interactive) && !this.config.interactive(cell))
      return false;

    return isFunction(this.config.interactiveRender);
  }

  /** 使一个单元格进入交互状态, 可通过defaultValue设置交互后的起始默认值, 默认为当前单元格value */
  private interactive = (cell: TableCell, defaultValue?: any) => {
    if (!this.isInteractive(cell)) return;

    const attachNode = this.createAttachNode();

    // eslint-disable-next-line prefer-const
    let done: TableInteractiveDone;

    const itemDone = (isSubmit = true) => {
      this.lastDownTime = Date.now();

      if (item.unmounted) return;

      item.unmounted = true;

      const ret = done(isSubmit);

      const clear = () => {
        const ind = this.items.indexOf(item);
        if (ind !== -1) {
          this.items.splice(ind, 1);
        }

        removeNode(attachNode);
      };

      if (isPromiseLike(ret)) {
        ret.finally(clear);
      } else {
        clear();
      }
    };

    const item: TableInteractiveItem = {
      cell,
      node: attachNode,
      done: itemDone,
    };

    done = this.config.interactiveRender!({
      ...item,
      value: isTruthyOrZero(defaultValue)
        ? defaultValue
        : this.table.getValue(cell),
    });

    this.items.push(item);

    this.table.selectCells([cell.key]);

    this.table.locate(cell.key);

    this.updateNode();
  };

  // 更新当前节点位置/尺寸
  updateNode() {
    if (!this.items.length) return;

    this.items.forEach((item) => {
      // 只有固定项需要持续更新位置
      if (item.mounted && !item.cell.isFixed) return;

      const { cell, node } = item;

      let x = cell.column.x;
      let y = cell.row.y;

      if (cell.column.isFixed) {
        x = this.table.x() + cell.column.fixedOffset!;
      }

      if (cell.row.isFixed) {
        y = this.table.y() + cell.row.fixedOffset!;
      }

      node.style.width = `${cell.width}px`;
      node.style.height = `${cell.height}px`;
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;

      if (!cell.isFixed) {
        node.style.zIndex = "5"; // 高于其所在单元格对应层index.scss
      } else if (cell.isCrossFixed) {
        node.style.zIndex = "21";
      } else {
        node.style.zIndex = "11";
      }

      item.mounted = true;
    });
  }

  // 创建一个attachNode
  private createAttachNode() {
    const el = document.createElement("div");
    el.className = "m78-table_edit-attach";
    this.wrapNode.appendChild(el);
    return el;
  }

  private onTabDown() {
    const last = this.items[this.items.length - 1];

    if (!last) return;

    const next = this.table.getNearCell({
      cell: last.cell,
      filter: (cell) => {
        if (cell.column.isHeader || cell.row.isHeader) return false;
        return this.isInteractive(cell);
      },
    });

    if (next) {
      this.interactive(next);
    }
  }

  private onEnterDown(e: KeyboardEvent) {
    const cell = this.table.getSelectedCells();
    if (cell.length === 1 && !this.isJustDoneExecuted()) {
      e.preventDefault();
      this.interactive(cell[0]);
    }
  }

  private onRegularKeyDown(e: KeyboardEvent) {
    const cell = this.table.getSelectedCells();
    if (cell.length === 1 && !this.isJustDoneExecuted()) {
      e.preventDefault();
      this.interactive(cell[0], e.key);
    }
  }

  private onEscDown() {
    this.items.forEach((item) => {
      item.done(false);
    });
  }

  // 最近是否执行过done
  private isJustDoneExecuted() {
    return Date.now() - this.lastDownTime < 180;
  }
}

export interface EditableCoreConfig {
  /** 控制单元格是否可交互 */
  interactive?: boolean | ((cell: TableCell) => boolean);
  /**
   * 渲染交互组件, 交互组件挂载于attachNode上, 并且应在交互完成或关闭时调用done来结束交互状态
   *
   * 返回的TableInteractiveDone会在交互结束清理attachNode前执行, 可用于实际更新值或者执行清理操作, 如果清理需要异步完成, 或者
   * 包含关闭动画, 可以返回一个Promise, 内部将等待Promise完成后再清理attachNode
   *
   * arg.done和TableInteractiveDone.done都接收isSubmit参数, 用于识别是更新值还是取消
   * */
  interactiveRender?: (arg: {
    /** 触发交互的单元格 */
    cell: TableCell;
    /** 用于挂载交互组件 */
    node: HTMLElement;
    /** 表单控件应显示的默认值, 通常与单元格当前值一致, 若用户在选中单元格上直接键入, 则会替换为用户键入的第一个常规字符([A-Za-z0-9_]) */
    value: any;
    /** isSubmit = true | 手动结束交互, 应在交互控件中执行回车/点击关闭按钮等行为时手动调用来关闭交互状态,
     * isSubmit为true时表示应对单元格值进行更新, done应该在事件回调等位置调用, 不能在render流程中调用
     * */
    done: (isSubmit?: boolean) => void;
  }) => TableInteractiveDone;
}
