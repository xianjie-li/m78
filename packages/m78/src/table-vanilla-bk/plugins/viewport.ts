import { TablePlugin } from "../plugin.js";
import { isFunction, isTruthyOrZero } from "@m78/utils";
import { TableCell, TableColumnFixed, TableRowFixed } from "../types.js";
import { _getSizeString, _removeNode } from "../common.js";

// @ts-ignore
import Stats from "stats.js";
import { WheelEvent } from "react";
import { _TableGetter } from "./getter.js";

/**
 * 视口/尺寸/滚动相关的核心功能实现
 * */
export class _TableViewportPlugin extends TablePlugin {
  stats = new Stats();

  init() {
    document.body.appendChild(this.stats.dom);

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

    this.updateSize();
  }

  initialized() {
    this.context.viewEl.addEventListener("wheel", this.onWheel as any);
    this.context.viewEl.addEventListener("scroll", this.onScroll);
  }

  /** 解除所有事件/引用类型占用 */
  beforeDestroy() {
    const ctx = this.context;
    ctx.viewEl.removeEventListener("wheel", this.onWheel as any);
    ctx.viewEl.removeEventListener("scroll", this.onScroll);
  }

  /* # # # # # # # 实现 # # # # # # # */

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

    if (!ctx.skipRender) this.render();
  }

  y(y?: number) {
    const ctx = this.context;
    const viewEl = ctx.viewEl;
    if (y === undefined) return viewEl.scrollTop;

    viewEl.scrollTop = y;

    if (!ctx.skipRender) this.render();
  }

  xy(x?: number, y?: number) {
    const ctx = this.context;
    const viewEl = ctx.viewEl;

    if (x === undefined || y === undefined) {
      return [viewEl.scrollLeft, viewEl.scrollTop];
    }

    ctx.skipRender = true;
    this.x(x);
    this.y(y);
    ctx.skipRender = false;

    this.render();
  }

  render() {
    this.stats.begin();

    const getter = this.getPlugin(_TableGetter)!;

    const visibleItems = getter.getViewportItems();

    // 清理由可见转为不可见的项
    this.removeHideNodes(
      this.context.lastViewportItems?.cells,
      visibleItems.cells
    );

    // console.log(visibleItems);

    // 内容渲染
    this.renderCell(visibleItems.cells);

    /* # # # # # # # mount # # # # # # # */
    this.plugins.forEach((plugin) => {
      plugin.rendered?.();
    });

    this.context.lastViewportItems = visibleItems;

    this.stats.end();
  }

  /** 绘制单元格 */
  renderCell(cells: TableCell[]) {
    const table = this.table;

    const render = this.config.render;
    const hasRender = isFunction(render);

    // ZOOM: #3
    const x = table.x() / this.table.zoom();
    const y = table.y() / this.table.zoom();

    const zoom = this.table.zoom();

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
      const dom = cell.dom;

      const isFixedRight = column.config.fixed == TableColumnFixed.right;
      const isFixedBottom = row.config.fixed == TableRowFixed.bottom;

      let cellX = column.isFixed ? column.fixedOffset! + x : column.x;
      let cellY = row.isFixed ? row.fixedOffset! + y : row.y;

      // ZOOM: #4
      // 缩放处理
      if (zoom !== 1) {
        if (isFixedRight) {
          cellX = column.fixedOffset! + diffX + x;
        }
        if (isFixedBottom) {
          cellY = row.fixedOffset! + diffY + y;
        }
      }

      const lastText = cell.text;
      const _text = row.data[column.config.key];
      cell.text = isTruthyOrZero(_text) ? String(_text!) : "";

      // 固定项
      if (cell.isFixed) {
        dom.style.top = `${cellY}px`;
        dom.style.left = `${cellX}px`;
      }

      // 初始化设置
      if (!cell.isMount) {
        cell.dom.style.left = `${cellX}px`;
        cell.dom.style.top = `${cellY}px`;
      }

      // 是否阻止默认的text渲染
      let blockTextRender = false;

      if (hasRender) {
        const rRes = render(cell);
        if (rRes) blockTextRender = true;
      }

      // 处理text, 因为.innerText读写都比较慢, 所以额外做一层判断
      if (!blockTextRender && lastText !== cell.text) {
        dom.innerText = cell.text;
      }

      // 添加节点
      if (!cell.isMount) {
        cell.isMount = true;
        this.context.stageEL.appendChild(dom);
      }
    });
  }

  /** 滚动 */
  onWheel = (e: WheelEvent) => {
    if (e) {
      e.preventDefault();
    }

    this.table.xy(this.table.x() + e.deltaX, this.table.y() + e.deltaY);
  };

  /** 操作滚动条时同步滚动位置 */
  onScroll = () => {
    const el = this.context.viewEl;
    this.table.xy(el.scrollLeft, el.scrollTop);
  };

  /** 根据配置更新各种容器尺寸相关的内容 */
  updateSize() {
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
