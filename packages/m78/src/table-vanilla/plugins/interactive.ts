import { TablePlugin } from "../plugin.js";
import { TableCell, TableCellWithDom } from "../types/items.js";
import {
  createKeyboardHelpersBatch,
  isFunction,
  isPromiseLike,
  isTruthyOrZero,
  KeyboardHelperOption,
  KeyboardMultipleHelper,
  setCacheValue,
  setNamePathValue,
} from "@m78/utils";
import { removeNode } from "../../common/index.js";
import { _TableFormPlugin } from "./form/form.js";
import { _TableDisablePlugin } from "./disable.js";

/**
 * 提供单元格双击交互功能, 用于实现交互期间展示表单控件或其他交互组件, 是在form的上做的一层抽象, 并非一定用于form
 * */
export class _TableInteractivePlugin extends TablePlugin {
  // 所有活动的交互项
  items: TableInteractiveItem[] = [];

  // 包裹所有创建节点的容器
  wrapNode: HTMLElement;

  // 实现双击
  doubleClickLastCell: TableCell | null = null;
  doubleClickTimer: any = null;

  // 最后触发交互关闭的时间, 用于防止关闭后马上出发Enter等操作
  lastDownTime = 0;

  multipleHelper: KeyboardMultipleHelper;

  form: InstanceType<typeof _TableFormPlugin>;

  disable: _TableDisablePlugin;

  init() {
    this.form = this.getPlugin(_TableFormPlugin);

    this.disable = this.getPlugin(_TableDisablePlugin);

    this.initDom();
  }

  mounted() {
    this.table.event.click.on(this.onClick);
    this.multipleHelper = createKeyboardHelpersBatch(this.getKeydownOptions());
  }

  beforeDestroy() {
    this.table.event.click.off(this.onClick);

    this.multipleHelper.destroy();

    setNamePathValue(this, "multipleHelper", null);

    this.wrapNode.removeEventListener("click", this.onAttachClick);

    this.doubleClickTimer && clearTimeout(this.doubleClickTimer);

    removeNode(this.wrapNode);
  }

  rendering() {
    this.updateNode();
  }

  rendered() {
    this.hideInvisibleInteractive();
  }

  // 事件绑定配置
  private getKeydownOptions(): KeyboardHelperOption[] {
    const hasItemChecker = () => this.table.isActive() && !!this.items.length;
    const hasNotItemChecker = () => this.table.isActive() && !this.items.length;

    return [
      {
        code: "Tab",
        handle: this.onTabDown,
        enable: hasItemChecker,
      },
      {
        code: "Escape",
        handle: this.onEscDown,
        enable: hasItemChecker,
      },
      {
        code: ["Enter"],
        handle: this.onEnterDown,
        enable: hasNotItemChecker,
      },
      // 常规件输入时, 也能进入交互状态
      {
        handle: this.onEnterDown,
        enable: (e) => {
          if (!hasNotItemChecker()) return false;

          return (
            /^\w$/.test(e.key) &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey &&
            !e.shiftKey
          );
        },
      },
    ];
  }

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

    this.closeAll();

    this.doubleClickTimer && clearTimeout(this.doubleClickTimer);

    this.doubleClickLastCell = cell;
    this.doubleClickTimer = setTimeout(() => {
      this.doubleClickLastCell = null;
    }, 800);
  };

  // 检测单元格能否进行交互
  isInteractive(cell: TableCell) {
    if (cell.row.isHeader || cell.column.isHeader) return false;

    if (!this.config.interactive) return false;

    if (isFunction(this.config.interactive) && !this.config.interactive(cell))
      return false;

    // 禁用项阻止交互
    if (this.disable && this.disable.isDisabledCell(cell.key)) return false;

    return isFunction(this.config.interactiveRender);
  }

  /** 使一个单元格进入交互状态, 可通过defaultValue设置交互后的起始默认值, 默认为当前单元格value */
  private interactive = (cell: TableCell, defaultValue?: any) => {
    if (!this.isInteractive(cell)) return;
    if (!this.form.validCheck(cell)) return;

    const attachNode = this.createAttachNode();

    // eslint-disable-next-line prefer-const
    let done: TableInteractiveDone;

    const itemDone = (isConfirm = true) => {
      this.lastDownTime = Date.now();

      if (item.unmounted) return;

      item.unmounted = true;

      const ret = done(isConfirm);

      const clear = () => {
        const ind = this.items.indexOf(item);
        if (ind !== -1) {
          this.items.splice(ind, 1);
        }

        this.table.event.interactiveChange.emit(cell, false, isConfirm);

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

    this.closeAll();

    done = this.config.interactiveRender!({
      ...(item as any),
      value: isTruthyOrZero(defaultValue)
        ? defaultValue
        : this.table.getValue(cell),
    });

    this.items.push(item);

    this.table.selectCells([cell.key]);

    this.table.locate(cell.key);

    this.updateNode();

    this.table.event.interactiveChange.emit(cell, true, false);
  };

  // 更新当前节点位置/尺寸
  private updateNode() {
    if (!this.items.length) return;

    this.items.forEach((item) => {
      // 只有固定项需要持续更新位置
      if (item.mounted && !item.cell.isFixed) return;

      const { cell, node } = item;

      const attachPos = this.table.getAttachPosition(cell);

      setCacheValue(node.style, "width", `${attachPos.width - 1}px`);
      setCacheValue(node.style, "height", `${attachPos.height - 1}px`);
      setCacheValue(
        node.style,
        "transform",
        `translate(${attachPos.left}px,${attachPos.top}px)`
      );
      setCacheValue(node.style, "zIndex", String(Number(attachPos.zIndex) + 2)); // 高于错误反馈等提示节点

      item.mounted = true;
    });
  }

  // 隐藏不可见的正在交互单元格, 并触发其提交
  private hideInvisibleInteractive() {
    if (!this.items.length) return;

    this.items.forEach((i) => {
      if (!i.cell.isMount) {
        i.done(true);
      }
    });
  }

  private closeAll() {
    // 关闭现有交互项
    this.items.forEach((i) => {
      if (i.unmounted) return;
      i.done();
    });
  }

  // 创建一个attachNode
  private createAttachNode() {
    const el = document.createElement("div");
    el.className = "m78-table_edit-attach";
    this.wrapNode.appendChild(el);
    return el;
  }

  private onTabDown = () => {
    const last = this.items[this.items.length - 1];

    if (!last) return;

    const next = this.table.getNearCell({
      cell: last.cell,
      filter: (cell) => {
        if (cell.column.isHeader || cell.row.isHeader) return false;
        if (!this.isInteractive(cell)) return false;
        if (!this.form.validCheck(cell)) return false;
        // ignore idea tips.
        return true;
      },
    });

    if (next) {
      this.interactive(next);
    }
  };

  private onEnterDown = () => {
    const cell = this.table.getSelectedCells();
    if (cell.length === 1 && !this.isJustDoneExecuted()) {
      this.interactive(cell[0]);
      return;
    }

    return false;
  };

  private onEscDown = () => {
    this.items.forEach((item) => {
      item.done(false);
    });
  };

  // 最近是否执行过done
  private isJustDoneExecuted() {
    return Date.now() - this.lastDownTime < 180;
  }
}

/** 表示交互完成后要执行的操作 */
export type TableInteractiveDone = (isConfirm: boolean) => void | Promise<void>;

/** 交互组件渲染参数 */
export interface TableInteractiveRenderArg {
  /** 触发交互的单元格 */
  cell: TableCellWithDom;
  /** 用于挂载交互组件的dom节点 */
  node: HTMLElement;
  /** 表单控件应显示的默认值 */
  value: any;
  /** isConfirm = true | 手动结束交互, 比如在用户按下enter时
   * isConfirm为true时表示该操作被确认, done应该在事件回调等位置调用, 不能在render流程中调用
   * */
  done: (isConfirm?: boolean) => void;
}

/** 交互配置 */
export interface TableInteractiveConfig {
  /** 控制单元格是否可交互 */
  interactive?: boolean | ((cell: TableCell) => boolean);
  /**
   * 渲染交互组件, 交互组件挂载于attachNode上, 并且应在交互完成或关闭时调用arg.done()来结束交互状态
   *
   * 返回的TableInteractiveDone会在交互结束清理attachNode前执行, 可用于实际更新值或者执行清理操作, 如果清理需要异步完成, 或者
   * 包含关闭动画, 可以返回一个Promise, 内部将等待Promise完成后再清理attachNode
   *
   * arg.done()和TableInteractiveDone()都接收isConfirm参数, 用于识别是确认操作还是取消操作
   * */
  interactiveRender?: (arg: TableInteractiveRenderArg) => TableInteractiveDone;
}

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
  done(isConfirm?: boolean): void;
}
