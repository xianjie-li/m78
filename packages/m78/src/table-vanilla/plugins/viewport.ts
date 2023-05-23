import { TablePlugin } from "../plugin.js";
import { isFunction, isNumber, isTruthyOrZero } from "@m78/utils";
import {
  TableCell,
  TableCellWidthDom,
  TableColumnFixed,
  TableRenderCtx,
  TableRowFixed,
} from "../types.js";
import { _getSizeString, _removeNode } from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import clsx from "clsx";

/**
 * 视口/尺寸/滚动相关的核心功能实现
 * */
export class _TableViewportPlugin extends TablePlugin {
  init() {
    // 映射实现方法
    this.methodMapper(this.table, [
      "width",
      "height",
      "contentWidth",
      "contentHeight",
      "x",
      "y",
      "xy",
      "render",
    ]);

    this.updateDom();
  }

  /** 合并实现plugin.cellRender和config.render */
  cellRenderImpl(cell: TableCellWidthDom, ctx: TableRenderCtx): void {
    if (this.config.render) {
      this.config.render(cell, ctx);
      if (ctx.disableLaterRender) return;
    }

    for (const p of this.plugins) {
      if (p.cellRender) {
        p.cellRender(cell, ctx);
        if (ctx.disableLaterRender) return;
      }
    }
  }

  width(width?: number | string) {
    const el = this.config.el;
    if (width === undefined) return el.offsetWidth;
    el.style.width = _getSizeString(width);
    this.render();
  }

  height(height?: number | string) {
    const el = this.config.el;
    if (height === undefined) return el.offsetHeight;
    el.style.height = _getSizeString(height);
    this.render();
  }

  contentWidth() {
    if (this.config.autoSize) {
      return this.context.contentWidth;
    } else {
      // 无自动尺寸时, 内容尺寸不小于容器尺寸, 否则xy()等计算会出现问题
      return Math.max(this.context.contentWidth, this.table.width());
    }
  }

  contentHeight() {
    if (this.config.autoSize) {
      return this.context.contentHeight;
    } else {
      // 见contentWidth()
      return Math.max(this.context.contentHeight, this.table.height());
    }
  }

  x(x?: number) {
    const ctx = this.context;
    const viewEl = ctx.viewEl;
    if (x === undefined) return viewEl.scrollLeft;

    viewEl.scrollLeft = x;

    this.render();
  }

  y(y?: number) {
    const ctx = this.context;
    const viewEl = ctx.viewEl;
    if (y === undefined) return viewEl.scrollTop;

    viewEl.scrollTop = y;

    this.render();
  }

  xy(x?: number, y?: number) {
    const ctx = this.context;
    const viewEl = ctx.viewEl;

    if (x === undefined || y === undefined) {
      return [viewEl.scrollLeft, viewEl.scrollTop];
    }

    const trigger = this.table.takeover();
    this.x(x);
    this.y(y);
    trigger();
  }

  render() {
    if (this.context.takeKey) return;

    const getter = this.getPlugin(_TableGetterPlugin);

    const visibleItems = getter.getViewportItems();

    // 清理由可见转为不可见的项
    this.removeHideNodes(
      this.context.lastViewportItems?.cells,
      visibleItems.cells
    );

    // 内容渲染
    this.renderCell(visibleItems.cells);

    /* # # # # # # # mount # # # # # # # */
    this.plugins.forEach((plugin) => {
      plugin.rendered?.();
    });

    this.context.lastViewportItems = visibleItems;

    // this.stats.end();
  }

  /** 绘制单元格 */
  renderCell(cells: TableCell[]) {
    const table = this.table;

    // ZOOM: #3
    const x = table.x() / this.table.zoom();
    const y = table.y() / this.table.zoom();

    const zoom = this.table.zoom();

    // 缩放前后的差异尺寸
    let diffX = 0;
    let diffY = 0;

    // ZOOM: #4
    // 缩放时, 需要对右/下 的固定项调整差异位置
    if (zoom !== 1) {
      diffX = this.getZoomWidth() - this.table.width();
      diffY = this.getZoomHeight() - this.table.height();
    }

    cells.forEach((cell) => {
      const row = cell.row;
      const column = cell.column;

      const lastText = cell.text;
      const _text = row.data[column.key];
      cell.text = isTruthyOrZero(_text) ? String(_text!) : "";

      if (!cell.dom) {
        this.initCellDom(cell);
      }

      const dom = cell.dom!;

      // 固定项需要持续更新位置
      if (cell.isFixed) {
        const isFixedRight = column.config.fixed == TableColumnFixed.right;
        const isFixedBottom = row.config.fixed == TableRowFixed.bottom;

        let cellX = column.isFixed ? column.fixedOffset! + x : column.x;
        let cellY = row.isFixed ? row.fixedOffset! + y : row.y;

        // ZOOM: #5
        // 缩放处理
        if (zoom !== 1) {
          if (isFixedRight) {
            cellX = column.fixedOffset! + diffX + x;
          }
          if (isFixedBottom) {
            cellY = row.fixedOffset! + diffY + y;
          }
        }

        dom.style.top = `${cellY}px`;
        dom.style.left = `${cellX}px`;
      }

      const renderCtx: TableRenderCtx = {
        isFirstRender: !cell.state.__m78_table_rendered,
        disableLaterRender: false,
        disableDefaultRender: false,
      };

      this.cellRenderImpl(cell as TableCellWidthDom, renderCtx);

      if (!cell.state.__m78_table_rendered) {
        cell.state.__m78_table_rendered = true;
      }

      const disableDefaultRender =
        renderCtx.disableDefaultRender || renderCtx.disableLaterRender;

      // 处理text, 因为.innerText读写都比较慢, 所以额外做一层判断
      if (!disableDefaultRender && lastText !== cell.text) {
        dom.innerText = cell.text;
      }

      // 添加节点
      if (!cell.isMount) {
        cell.isMount = true;
        this.context.stageEL.appendChild(dom);
      }
    });
  }

  /** 初始化cell.dom */
  initCellDom(cell: TableCell) {
    const ctx = this.context;
    const column = cell.column;
    const row = cell.row;
    const mergeMapMain = ctx.mergeMapMain;

    let width = cell.column.width;
    let height = cell.row.height;

    const mergeSize = mergeMapMain[cell.key];

    // 合并处理
    if (mergeSize) {
      if (isNumber(mergeSize.width)) width = mergeSize.width!;
      if (isNumber(mergeSize.height)) height = mergeSize.height!;
    }

    const dom = document.createElement("div");

    const lastLeftFixed = ctx.leftFixedList[ctx.leftFixedList.length - 1];
    const lastTopFixed = ctx.topFixedList[ctx.topFixedList.length - 1];

    let isLeftLast = lastLeftFixed === column.key;
    let isTopLast = lastTopFixed === row.key;

    const leftFixedInd = ctx.leftFixedList.indexOf(column.key);
    const topFixedInd = ctx.topFixedList.indexOf(row.key);

    // 合并的项是左/上的末尾项时, 需要将其视为末尾项
    if (leftFixedInd !== -1 && cell.config.mergeX) {
      if (leftFixedInd + mergeSize.xLength === ctx.leftFixedList.length) {
        isLeftLast = true;
      }
    }

    if (topFixedInd !== -1 && cell.config.mergeY) {
      if (topFixedInd + mergeSize.yLength === ctx.topFixedList.length) {
        isTopLast = true;
      }
    }

    const styleObj: any = {
      "__even-x": column.isEven,
      "__even-y": row.isEven,
      "__last-x": cell.isLastX,
      "__last-y": cell.isLastY,
      "__head-y": row.isHeader,
      "__head-x": column.isHeader,
    };

    if (cell.isFixed) {
      Object.assign(styleObj, {
        // 固定项标识
        __fixed: true,
        "__cross-fixed": cell.isCrossFixed,
        // 边缘项标识, 通常用于去掉末尾边框
        "__rf-first": ctx.rightFixedList[0] === column.key,
        "__bf-first": ctx.bottomFixeList[0] === row.key,
        "__lf-last": isLeftLast,
        "__tf-last": isTopLast,
      });
    }

    dom.className = clsx("m78-table_cell", styleObj);

    dom.style.width = `${width}px`;
    dom.style.height = `${height}px`;

    if (!cell.isFixed) {
      dom.style.left = `${column.x}px`;
      dom.style.top = `${row.y}px`;
    }

    cell.dom = dom;
  }

  /** 根据配置更新各种容器尺寸相关的内容 */
  updateDom() {
    const config = this.config;
    const ctx = this.context;
    const cH = this.config.height;
    const cW = this.config.width;

    if (isTruthyOrZero(cH)) {
      this.height(cH!);
    }

    if (isTruthyOrZero(cW)) {
      this.width(cW!);
    }

    // ZOOM: #1
    const zoom = this.context.zoom;

    // 同步内容实际尺寸, 如果内容被缩放, 调整为缩放后的尺寸
    ctx.viewContentEl.style.height = `${this.table.contentHeight() * zoom}px`;
    ctx.viewContentEl.style.width = `${this.table.contentWidth() * zoom}px`;

    // 处理autoSize
    const w = this.table.width();
    const contW = this.table.contentWidth();

    const h = this.table.height();
    const contH = this.table.contentHeight();

    if (config.autoSize) {
      if (contW < w) {
        ctx.restoreWidth = config.el.style.width;
        config.el.style.width = `${contW}px`;
      }

      if (contH < h) {
        ctx.restoreHeight = config.el.style.height;
        config.el.style.height = `${contH}px`;
      }
    }

    // 处理stripe
    config.el.className = clsx(
      config.el.className,
      config.stripe && "__stripe"
    );
  }

  /** 获取缩放后的容器尺寸, 最大尺寸不超过contentWidth */
  getZoomWidth() {
    const table = this.table;
    return Math.min(table.width() / table.zoom(), table.contentWidth());
  }

  /** 获取缩放后的容器尺寸, 最大尺寸不超过contentHeight */
  getZoomHeight() {
    const table = this.table;
    return Math.min(table.height() / table.zoom(), table.contentHeight());
  }

  /** 获取1和2的差异, 并从视口清除2中已不存在的项 */
  removeHideNodes(items1?: TableCell[], items2?: TableCell[]) {
    const existMap: any = {};

    // 销毁由可见变为不可见的节点
    if (items1 && items2) {
      items2.forEach((item) => {
        existMap[item.key] = true;
      });

      items1.forEach((item) => {
        if (!existMap[item.key]) {
          _removeNode(item.dom);
          item.isMount = false;
        }
      });
    }
  }
}
