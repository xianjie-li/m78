import { TablePlugin } from "../plugin.js";
import { TableColumnFixed, TableKey } from "../types/base-type.js";
import { TableReloadLevel } from "./life.js";
import { TableColumnLeafConfigFormatted } from "../types/items.js";
import { removeNode } from "../../common/index.js";
import { _TableGetterPlugin } from "./getter.js";
import { _syncListNode } from "../common.js";

/** 表格列隐藏 */
export class _TableHidePlugin extends TablePlugin {
  /** 前一次处理中设置的隐藏标记的列, 需要在新的设置中先还原 */
  prevHideColumns: TableColumnLeafConfigFormatted[] = [];

  /** 放置所有expandNodes的容器 */
  wrapNodes: HTMLDivElement;

  /** 展开隐藏列的节点 */
  expandNodes: HTMLDivElement[] = [];

  getter: _TableGetterPlugin;

  initialized() {
    this.getter = this.getPlugin(_TableGetterPlugin);

    this.wrapNodes = document.createElement("div");
    this.wrapNodes.className = "m78-table_hide-wrap";
    this.context.viewContentEl.appendChild(this.wrapNodes);

    this.config.el.addEventListener("click", this.handleClick);
  }

  beforeDestroy() {
    removeNode(this.wrapNodes);
    this.config.el.removeEventListener("click", this.handleClick);
  }

  rendering() {
    this.renderNodes();
  }

  loadStage(level: TableReloadLevel, isBefore: boolean) {
    if (level === TableReloadLevel.index && isBefore) {
      this.handle();
    }
  }

  // 隐藏处理, 为隐藏列设置ignore标记
  handle() {
    const ctx = this.context;

    const hideColumns = this.context.persistenceConfig.hideColumns || [];

    this.prevHideColumns.forEach((cur) => {
      const meta = ctx.getColumnMeta(cur.key);

      meta.ignore = false;
      meta.hide = false;
    });

    this.prevHideColumns = [];

    hideColumns.forEach((key) => {
      const list = ctx.columns.filter((col) => col.key === key);

      if (!list.length) return;

      const cur: TableColumnLeafConfigFormatted | undefined = list[0];

      if (!cur) return;

      const meta = ctx.getColumnMeta(cur.key);

      meta.ignore = true;
      meta.hide = true;

      this.prevHideColumns.push(cur);
    });
  }

  /** 是否为隐藏列 */
  isHideColumn(key: TableKey) {
    const hideColumns = this.context.persistenceConfig.hideColumns || [];

    return hideColumns.indexOf(key) !== -1;
  }

  /** 渲染标记 */
  renderNodes() {
    const hideColumns = this.context.persistenceConfig.hideColumns || [];

    _syncListNode({
      wrapNode: this.wrapNodes,
      list: hideColumns,
      nodeList: this.expandNodes,
      createAction: (node) => {
        node.className = "m78-table_hide-expand __default";
        node.innerHTML = "⬌";
      },
    });

    if (!hideColumns.length) return;

    const lastRowKey =
      this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];

    if (!lastRowKey) return;

    const lastRow = this.getter.getRow(lastRowKey);

    if (!lastRow) return;

    hideColumns.forEach((key, index) => {
      const column = this.getter.getColumn(key);

      const curNode = this.expandNodes[index];

      const width = curNode.offsetWidth;

      curNode.dataset.key = String(key);

      const attachPos = this.table.getColumnAttachPosition(column);

      let left = attachPos.left - width / 2 - 1; // width / 2: 居中  1: 为边框的修正位置

      // 右固定项需要右移
      if (column.config.fixed === TableColumnFixed.right) {
        left += 2;
      }

      curNode.title = `show hide column ${column.config.label || column.key}`;
      curNode.style.zIndex = column.isFixed ? attachPos.zIndex : "11";
      curNode.style.transform = `translate(${left}px,${
        lastRow.y + this.table.getY() + 2
      }px)`; // 2: 上边距
    });
  }

  handleClick = (e: MouseEvent) => {
    if (!this.expandNodes.length) return;

    const target = e.target as HTMLDivElement;

    if (!this.expandNodes.includes(target)) return;

    const key = target.dataset.key;

    if (!key) return;

    this.showColumn(key);
  };

  showColumn(key: TableKey) {
    const hideColumns = this.context.persistenceConfig.hideColumns || [];

    const newList = hideColumns.filter((k) => k !== key);

    this.table.setPersistenceConfig("hideColumns", newList, "show column");
  }
}
