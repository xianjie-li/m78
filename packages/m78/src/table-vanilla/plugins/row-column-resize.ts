import { TablePlugin } from "../plugin.js";
import debounce from "lodash/debounce.js";
import clamp from "lodash/clamp.js";
import { rafCaller, RafFunction } from "@m78/animate-tools";

import { TableColumn, TableItems, TableRow } from "../types/items.js";
import { _TableMutationPlugin } from "./mutation.js";

import { TableColumnFixed, TableRowFixed } from "../types/base-type.js";
import { removeNode } from "../../common/index.js";
import {
  TriggerEvent,
  TriggerType,
  type TriggerOption,
  trigger,
} from "@m78/trigger";
import { createTempID, type BoundSize } from "@m78/utils";
import { _TableDragSortPlugin } from "./drag-sort.js";

/** 列/行重置大小 */
export class _TableRowColumnResize extends TablePlugin {
  /** 提示线 */
  xLine: HTMLDivElement;
  yLine: HTMLDivElement;
  /** 显示重置后大小 */
  sizeBlock: HTMLDivElement;
  wrap: HTMLDivElement;

  /** 标识resize把手的key */
  static VIRTUAL_COLUMN_HANDLE_KEY = "__m78-table-virtual-column-handle__";
  static VIRTUAL_ROW_HANDLE_KEY = "__m78-table-virtual-row-handle__";

  /** 最小/大列尺寸 */
  static MIN_COLUMN_WIDTH = 40;
  static MAX_COLUMN_WIDTH = 500;

  /** 最小/大行尺寸 */
  static MIN_ROW_HEIGHT = 20;
  static MAX_ROW_HEIGHT = 300;

  static HANDLE_SIZE = 6;

  /** 额外对外暴露一个用于集中控制trigger开关的属性 */
  triggerEnable = true;

  // 用于快速批量向target添加或移除事件的key
  targetUniqueKey = createTempID();

  rafCaller: RafFunction;
  rafClearFn: () => void;

  /** 拖动中 */
  dragging = false;
  /** 是否触发了hover */
  activating = false;
  /** 轴偏移 */
  dragOffsetX = 0;
  dragOffsetY = 0;

  dragSort: _TableDragSortPlugin;

  initialized() {
    this.dragSort = this.getPlugin(_TableDragSortPlugin);

    // 创建line节点
    this.xLine = document.createElement("div");
    this.yLine = document.createElement("div");
    this.sizeBlock = document.createElement("div");
    this.wrap = document.createElement("div");

    this.xLine.className = "m78-table_tip-line-x";
    this.yLine.className = "m78-table_tip-line-y";
    this.sizeBlock.className = "m78-table_drag-area-x";
    this.wrap.className = "m78-table_rc-resize";

    this.wrap.appendChild(this.xLine);
    this.wrap.appendChild(this.yLine);
    this.wrap.appendChild(this.sizeBlock);
    this.config.el.appendChild(this.wrap);

    // 创建raf用于优化动画
    this.rafCaller = rafCaller();

    // TODO: tag2
    // 为virtualBound添加特定节点的过滤
    // const vbPreCheck: TriggerConfig["preCheck"] = (type) => {
    //   if (type !== TriggerType.active && type !== TriggerType.drag)
    //     return false;
    //   // return !_triggerFilterList(
    //   //   e.target as HTMLElement,
    //   //   _tableTriggerFilters,
    //   //   this.config.el
    //   // );
    //   return true;
    // };

    // TODO: tag1
    // this.trigger = createTrigger({
    //   container: this.config.el,
    //   type: [TriggerType.drag, TriggerType.active, TriggerType.move],
    //   preCheck: vbPreCheck,
    // });
    // this.trigger.event.on(this.triggerDispatch);

    this.context.viewEl.addEventListener("scroll", this.scrollHandle);

    // 选取过程中禁用
    this.table.event.selectStart.on(() => {
      this.triggerEnable = false;
    });

    this.table.event.select.on(() => {
      this.triggerEnable = true;
    });
  }

  // 获取事件选项
  private getEventOption(
    target: BoundSize,
    level: number,
    cursor: string,
    data: any
  ): TriggerOption {
    return {
      enable: () => {
        if (!this.table.isActive() || !this.triggerEnable) return false;
        // if (!data.typeMap.get(TriggerType.active) && !data.typeMap.get(TriggerType.drag)) return false;
        // return !_triggerFilterList(
        //   e.target as HTMLElement,
        //   _tableTriggerFilters,
        //   this.config.el
        // );
        return true;
      },
      type: [TriggerType.drag, TriggerType.active],
      handler: this.triggerDispatch,
      target,
      level,
      cursor: {
        active: cursor,
        dragActive: cursor,
      },
      data,
    };
  }

  rendered() {
    this.renderedDebounce();
  }

  beforeDestroy() {
    if (this.rafClearFn) this.rafClearFn();

    // TODO: tag3
    // this.trigger.destroy();
    // this.trigger = null!;
    trigger.off(this.targetUniqueKey);

    this.context.viewEl.removeEventListener("scroll", this.scrollHandle);

    this.table.event.selectStart.empty();
    this.table.event.select.empty();

    removeNode(this.wrap);
  }

  /** 每次render后根据ctx.lastViewportItems更新虚拟拖拽节点 */
  renderedDebounce = debounce(
    () => {
      const last = this.context.lastViewportItems;

      trigger.off(this.targetUniqueKey);

      if (!last) return;

      const wrapBound = this.config.el.getBoundingClientRect();

      const columnBounds = this.createBound(wrapBound, last, false);
      const rowBounds = this.createBound(wrapBound, last, true);

      // TODO: tag6
      // this.trigger.clear();
      // this.trigger.add(columnBounds.concat(rowBounds));

      trigger.on(columnBounds.concat(rowBounds), this.targetUniqueKey);
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
    const pos = isRow ? this.table.getY() : this.table.getX();

    const startFixedSize = isRow ? ctx.topFixedHeight : ctx.leftFixedWidth;
    const endFixedSize = isRow ? ctx.bottomFixedHeight : ctx.rightFixedWidth;

    const tableSize = isRow ? this.table.getHeight() : this.table.getWidth();

    // 开始/结束边界
    const startLine = pos + startFixedSize;
    const endLine = pos + tableSize - endFixedSize;

    const maxPos = isRow ? this.table.getMaxY() : this.table.getMaxX();

    // 滚动到底
    const touchEnd = Math.ceil(pos) >= maxPos;

    const bounds: TriggerOption[] = [];

    // 虚拟节点大小
    const bSize = _TableRowColumnResize.HANDLE_SIZE;

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

      const opt = this.getEventOption(
        {
          left,
          top,
          height: isRow ? bSize : ctx.yHeaderHeight,
          width: isRow ? ctx.xHeaderWidth : bSize,
        },
        i.isFixed ? 1 : 0,
        isRow ? "row-resize" : "col-resize",
        {
          type: isRow
            ? _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY
            : _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY,

          [isRow ? "row" : "column"]: i,
          [isRow ? "y" : "x"]: _pos - 2,
          startPos: isEndFixed ? _pos : _pos - size,
          endPos: isEndFixed ? _pos + size : _pos,
          // 计算方向相反
          reverse: isEndFixed,
        }
      );

      // TODO: tag4
      // const b: TriggerTargetMeta = {
      //   target: {
      //     left,
      //     top,
      //     height: isRow ? bSize : ctx.yHeaderHeight,
      //     width: isRow ? ctx.xHeaderWidth : bSize,
      //   },
      //   zIndex: i.isFixed ? 1 : 0,
      //   cursor: isRow ? "row-resize" : "col-resize",
      //   data: {
      //     type: isRow
      //       ? _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY
      //       : _TableRowColumnResize.VIRTUAL_COLUMN_HANDLE_KEY,

      //     [isRow ? "row" : "column"]: i,
      //     [isRow ? "y" : "x"]: _pos - 2,
      //     startPos: isEndFixed ? _pos : _pos - size,
      //     endPos: isEndFixed ? _pos + size : _pos,
      //     // 计算方向相反
      //     reverse: isEndFixed,
      //   },
      // };

      bounds.push(opt);
    });

    return bounds;
  }

  triggerDispatch = (e: TriggerEvent) => {
    // console.log(e, e.type);
    if (e.type === TriggerType.active) {
      this.hoverHandle(e);
    }

    if (e.type === TriggerType.drag) {
      this.dragHandle(e);
    }
  };

  hoverHandle = (e: TriggerEvent) => {
    const { active, data } = e;
    const isRow = data.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;

    this.activating = active;

    if (active) {
      isRow ? this.updateYTipLine(data.y, e) : this.updateXTipLine(data.x, e);
    } else if (!this.dragging) {
      isRow ? this.hideYTipLine() : this.hideXTipLine();
    }
  };

  dragHandle = (e: TriggerEvent) => {
    const { first, last, deltaX, deltaY, data } = e;
    const isRow = data.type === _TableRowColumnResize.VIRTUAL_ROW_HANDLE_KEY;

    if (first) {
      this.dragging = true;
    }

    const prevOffset = isRow ? this.dragOffsetY : this.dragOffsetX;

    if (!last) {
      const size = isRow ? data.row.height : data.column.width;

      const min = isRow
        ? size - _TableRowColumnResize.MIN_ROW_HEIGHT
        : size - _TableRowColumnResize.MIN_COLUMN_WIDTH;
      const max = isRow
        ? _TableRowColumnResize.MAX_ROW_HEIGHT - size
        : _TableRowColumnResize.MAX_COLUMN_WIDTH - size;

      const movePos = isRow ? deltaY : deltaX;

      const curOffset = data.reverse
        ? clamp(prevOffset + movePos, -max, min)
        : clamp(prevOffset + movePos, -min, max);

      if (isRow) {
        this.dragOffsetY = curOffset;
        this.updateYTipLine(data.y + this.dragOffsetY, e);
      } else {
        this.dragOffsetX = curOffset;
        this.updateXTipLine(data.x + this.dragOffsetX, e);
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
  updateXTipLine(x: number, event: TriggerEvent) {
    this.rafClearFn = this.rafCaller(() => {
      this.sizeBlock.style.visibility = "visible";
      this.xLine.style.visibility = "visible";

      let left: number;
      let width: number;

      if (event.data.reverse) {
        left = x;
        width = event.data.endPos - x;
      } else {
        left = event.data.startPos;
        width = x - event.data.startPos;
      }

      this.sizeBlock.style.width = `${width}px`;
      this.sizeBlock.style.transform = `translate(${left}px,0)`;
      this.sizeBlock.style.height = `${this.table.getHeight()}px`;

      this.xLine.style.transform = `translateX(${x}px)`;
    });
  }

  /** 显示并更新yLine位置 */
  updateYTipLine(y: number, event: TriggerEvent) {
    this.rafClearFn = this.rafCaller(() => {
      this.sizeBlock.style.visibility = "visible";
      this.yLine.style.visibility = "visible";

      let top: number;
      let height: number;

      if (event.data.reverse) {
        top = y;
        height = event.data.endPos - y;
      } else {
        top = event.data.startPos;
        height = y - event.data.startPos;
      }
      this.sizeBlock.style.transform = `translate(0,${top}px)`;
      this.sizeBlock.style.height = `${height}px`;
      this.sizeBlock.style.width = `${this.table.getWidth()}px`;

      this.yLine.style.transform = `translateY(${y}px)`;
    });
  }

  /** 隐藏xLine */
  hideXTipLine() {
    if (this.xLine.style.visibility === "hidden") return;
    // this.trigger.cursor = "";
    this.xLine.style.visibility = "hidden";
    this.sizeBlock.style.visibility = "hidden";
  }

  /** 隐藏yLine */
  hideYTipLine() {
    if (this.yLine.style.visibility === "hidden") return;
    // this.trigger.cursor = "";
    this.yLine.style.visibility = "hidden";
    this.sizeBlock.style.visibility = "hidden";
  }
}
