import { TablePlugin } from "../plugin.js";
import {
  deleteNamePathValue,
  getNamePathValue,
  setNamePathValue,
} from "@m78/utils";
import {
  _TablePrivateProperty,
  TableColumnFixed,
  TableKey,
} from "../types/base-type.js";
import { TableReloadLevel } from "./life.js";
import { TableColumnLeafConfig } from "../types/items.js";
import { removeNode } from "../../common/index.js";
import { _TableGetterPlugin } from "./getter.js";

// vb改为统一实例, 在context存储

/** 表格列隐藏 */
export class _TableHidePlugin extends TablePlugin {
  /** 前一次处理中设置的隐藏标记的列, 需要在新的设置中先还原 */
  prevHideColumns: TableColumnLeafConfig[] = [];

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
      deleteNamePathValue(cur, _TablePrivateProperty.ignore);
      deleteNamePathValue(cur, _TablePrivateProperty.hide);
    });

    this.prevHideColumns = [];

    hideColumns.forEach((key) => {
      const list = ctx.columns.filter((col) => col.key === key);

      if (!list.length) return;

      let cur: TableColumnLeafConfig | undefined = list[0];

      // 包含多项说明是固定项, 仅需要对虚拟项进行操作
      if (list.length > 1) {
        cur = list.find((i) => getNamePathValue(i, _TablePrivateProperty.fake));
      }

      if (!cur) return;

      setNamePathValue(cur, _TablePrivateProperty.ignore, true);
      setNamePathValue(cur, _TablePrivateProperty.hide, true);

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

    if (hideColumns.length > this.expandNodes.length) {
      // 节点不够则创建
      const diff = hideColumns.length - this.expandNodes.length;

      for (let i = 0; i < diff; i++) {
        const node = document.createElement("div");
        node.className = "m78-table_hide-expand __default";
        node.innerHTML = "⬌";
        this.wrapNodes.appendChild(node);
        this.expandNodes.push(node);
      }
    } else {
      // 移除多余节点
      const redundant = this.expandNodes.slice(hideColumns.length);
      redundant.forEach((node) => removeNode(node));
      this.expandNodes = this.expandNodes.slice(0, hideColumns.length);
    }

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

      const x = column.isFixed ? column.fixedOffset || 0 : column.x;

      let left = x - width / 2 - 1; // width / 2: 居中  1: 为边框的修正位置

      // 固定项需要时刻显示
      if (column.isFixed) {
        left += this.table.x();

        // 右固定项需要右移
        if (column.config.fixed === TableColumnFixed.right) {
          left += 2;
        }
      }

      curNode.title = `show hide column ${column.config.label || column.key}`;
      curNode.style.zIndex = column.isFixed ? "30" : "10";
      curNode.style.top = `${lastRow.y + this.table.y() + 2}px`; // 2: 上边距
      curNode.style.left = `${left}px`;
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
