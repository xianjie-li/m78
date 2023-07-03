import { TablePlugin } from "../plugin.js";
import debounce from "lodash/debounce.js";
import clamp from "lodash/clamp.js";
import { rafCaller, RafFunction } from "@m78/utils";
import {
  VirtualBound,
  VirtualBoundDragListener,
  VirtualBoundHoverListener,
  VirtualBoundItem,
} from "../virtual-bound.js";

import { TableColumn, TableItems, TableRow } from "../types/items.js";
import { _TableMutationPlugin } from "./mutation.js";

import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { removeNode } from "../../common/index.js";
import { _tableTriggerFilters, _triggerFilterList } from "../common.js";

/** 列重置大小 */
export class _TableRowColumnResize extends TablePlugin {
  /** 提示线 */
  xLine: HTMLDivElement;
  yLine: HTMLDivElement;

  /** 标识resize把手的key */
  static VIRTUAL_COLUMN_HANDLE_KEY = "__m78-table-virtual-column-handle__";
  static VIRTUAL_ROW_HANDLE_KEY = "__m78-table-virtual-row-handle__";

  /** 最小/大列尺寸 */
  static MIN_COLUMN_WIDTH = 40;
  static MAX_COLUMN_WIDTH = 500;

  /** 最小/大行尺寸 */
  static MIN_ROW_HEIGHT = 20;
  static MAX_ROW_HEIGHT = 300;

  /** 虚拟节点 */
  virtualBound: VirtualBound;

  rafCaller: RafFunction;
  rafClearFn: () => void;

  /** 拖动中 */
  dragging = false;
  /** 是否触发了hover */
  hovering = false;
  /** 轴偏移 */
  dragOffsetX = 0;
  dragOffsetY = 0;

  initialized() {
    // 创建line节点
    this.xLine = document.createElement("div");
    this.yLine = document.createElement("div");

    this.xLine.className = "m78-table_tip-line-x";
    this.yLine.className = "m78-table_tip-line-y";

    this.config.el.appendChild(this.xLine);
    this.config.el.appendChild(this.yLine);

    // 创建raf用于优化动画
    this.rafCaller = rafCaller();

    // 为virtualBound添加特定节点的过滤
    const vbPreCheck = (e: any) => {
      return _triggerFilterList(
        e.target as HTMLElement,
        _tableTriggerFilters,
        this.config.el
      );
    };

    // 虚拟节点&事件绑定
    this.virtualBound = new VirtualBound({
      el: this.config.el,
      hoverPreCheck: vbPreCheck,
      dragPreCheck: vbPreCheck,
    });

    this.virtualBound.hover.on(this.hoverHandle);
    this.virtualBound.drag.on(this.dragHandle);

    this.context.viewEl.addEventListener("scroll", this.scrollHandle);

    // 选取过程中禁用
    this.table.event.selectStart.on(() => {
      this.virtualBound.enable = false;
    });

    this.table.event.select.on(() => {
      this.virtualBound.enable = true;
    });
  }

  rendered() {
    this.virtualBound.bounds = [];
    this.renderedDebounce();
  }

  beforeDestroy() {
    if (this.rafClearFn) this.rafClearFn();

    this.virtualBound.hover.empty();
    this.virtualBound.click.empty();
    this.virtualBound.drag.empty();

    this.virtualBound.destroy();
    this.virtualBound = null!;

    this.context.viewEl.removeEventListener("scroll", this.scrollHandle);

    this.table.event.selectStart.empty();
    this.table.event.select.empty();

    removeNode(this.xLine);
    removeNode(this.yLine);
  }

  /** 每次render后根据ctx.lastViewportItems更新虚拟拖拽节点 */
  renderedDebounce = debounce(
    () => {
      const last = this.context.lastViewportItems;

      if (!last) return;

      const wrapBound = this.config.el.getBoundingClientRect();

      const cBounds = this.createBound(wrapBound, last, false);
      const rBounds = this.createBound(wrapBound, last, true);

      this.virtualBound.bounds = cBounds.concat(rBounds);
    },
    100,
    {
      leading: false,
      trailing: true,
    }
  );

  /** 生成虚拟节点 */
  createBound(wrapBound: DOMRect, last: TableItems, isRow: boolean) {
    const ctx = this.context;
    const pos = isRow ? this.table.y() : this.table.x();

    const startFixedSize = isRow ? ctx.topFixedHeight : ctx.leftFixedWidth;
    const endFixedSize = isRow ? ctx.bottomFixedHeight : ctx.rightFixedWidth;

    const tableSize = isRow ? this.table.height() : this.table.width();

    // 开始/结束边界
    const startLine = pos + startFixedSize;
    const endLine = pos + tableSize - endFixedSize;

    const maxPos = isRow ? this.table.maxY() : this.table.maxX();

    // 滚动到底
    const touchEnd = Math.ceil(pos) >= maxPos;

    const bounds: VirtualBoundItem[] = [];

    // 虚拟节点大小
    const bSize = isRow ? 8 : 10;

    const list = isRow ? last.rows : last.columns;

    list.forEach((i) => {
      const rowI = i as TableRow;
      const colI = i as TableColumn;

      const size = isRow ? rowI.height : colI.width;

      const end = isRow ? rowI.y + size : colI.x + size;

      if (!i.isFixed && (end < startLine || end > endLine)) return;

      let _pos = i.isFixed ? i.fixedOffset! + size : end - pos;

      const isEndFixed =
        colI.config.fixed === TableColumnFixed.right ||
        rowI.config.fixed === TableRowFixed.bottom;

      const isEndFixedFirst =
        ctx.rightFixedList[0] === colI.key ||
        ctx.bottomFixeList[0] === rowI.key;

      // 滚动到底时, 需要展示末尾项的拖拽, 由于相互覆盖, 需要隐藏固定项首项
      if (touchEnd && isEndFixedFirst) return;

      if (isEndFixed) {
        _pos -= size;
      }

      const left = isRow ? wrapBound.left : wrapBound.left + _pos - bSize / 2;
      const top = isRow ? wrapBound.top + _pos - bSize / 2 : wrapBound.top;

      const b: VirtualBoundItem = {
        left,
        top,
        height: isRow ? bSize : ctx.yHeaderHeight,
        width: isRow ? ctx.xHeaderWidth : bSize,
        zIndex: i.isFixed ? 1 : 0,
        type: isRow
          ? _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY
          : _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY,
        cursor: "pointer",
        hoverCursor: isRow ? "row-resize" : "col-resize",
        data: {
          [isRow ? "row" : "column"]: i,
          [isRow ? "y" : "x"]: _pos - 2,
          // 计算方向相反
          reverse: isEndFixed,
        },
      };

      bounds.push(b);
    });

    return bounds;
  }

  hoverHandle: VirtualBoundHoverListener = ({ bound, hover }) => {
    const isRow = bound.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;

    this.hovering = hover;

    if (hover) {
      isRow
        ? this.updateYTipLine(bound.data.y)
        : this.updateXTipLine(bound.data.x);
    } else if (!this.dragging) {
      isRow ? this.hideYTipLine() : this.hideXTipLine();
    }
  };

  dragHandle: VirtualBoundDragListener = ({ bound, first, last, delta }) => {
    const isRow = bound.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;

    if (first) {
      this.dragging = true;
    }

    const data = bound.data;

    const prevOffset = isRow ? this.dragOffsetY : this.dragOffsetX;

    if (!last) {
      const size = isRow ? data.row.height : data.column.width;

      const min = isRow
        ? size - _TableRowColumnResize.MIN_ROW_HEIGHT
        : size - _TableRowColumnResize.MIN_COLUMN_WIDTH;
      const max = isRow
        ? _TableRowColumnResize.MAX_ROW_HEIGHT - size
        : _TableRowColumnResize.MAX_COLUMN_WIDTH - size;

      const movePos = isRow ? delta[1] : delta[0];

      const curOffset = data.reverse
        ? clamp(prevOffset + movePos, -max, min)
        : clamp(prevOffset + movePos, -min, max);

      if (isRow) {
        this.dragOffsetY = curOffset;
        this.updateYTipLine(data.y + this.dragOffsetY);
      } else {
        this.dragOffsetX = curOffset;
        this.updateXTipLine(data.x + this.dragOffsetX);
      }
    }

    if (last) {
      const offset = data.reverse ? -prevOffset : prevOffset;

      isRow
        ? this.updateRowSize(data.row, offset)
        : this.updateColumnSize(data.column, offset);
      this.dragging = false;
      isRow ? this.hideYTipLine() : this.hideXTipLine();

      this.dragOffsetX = 0;
      this.dragOffsetY = 0;
    }
  };

  scrollHandle = () => {
    this.hideXTipLine();
    this.hideYTipLine();
  };

  /** 更新column配置 */
  updateColumnSize(column: TableColumn, diff: number) {
    if (Math.abs(diff) > 4) {
      const width = Math.round(column.width + diff);
      this.getPlugin(_TableMutationPlugin).setPersistenceConfig(
        ["columns", column.key, "width"],
        width,
        "resize column"
      );
    }
  }

  /** 更新row配置 */
  updateRowSize(row: TableRow, diff: number) {
    if (Math.abs(diff) > 4) {
      const height = Math.round(row.height + diff);
      this.getPlugin(_TableMutationPlugin).setPersistenceConfig(
        ["rows", row.key, "height"],
        height,
        "resize row"
      );
    }
  }

  /** 显示并更新xLine位置 */
  updateXTipLine(x: number) {
    this.rafClearFn = this.rafCaller(() => {
      this.xLine.style.display = "block";
      this.xLine.style.left = `${x}px`;
    });
  }

  /** 显示并更新yLine位置 */
  updateYTipLine(y: number) {
    this.rafClearFn = this.rafCaller(() => {
      this.yLine.style.display = "block";
      this.yLine.style.top = `${y}px`;
    });
  }

  /** 隐藏xLine */
  hideXTipLine() {
    if (this.xLine.style.display === "none") return;
    this.virtualBound.cursor = null;
    this.xLine.style.display = "none";
  }

  /** 隐藏yLine */
  hideYTipLine() {
    if (this.yLine.style.display === "none") return;
    this.virtualBound.cursor = null;
    this.yLine.style.display = "none";
  }
}
