import { TablePlugin } from "../plugin.js";
import {
  EmptyFunction,
  getNamePathValue,
  isFocus,
  isNumber,
  isTruthyOrZero,
  rafCaller,
  RafFunction,
  replaceHtmlTags,
  setNamePathValue,
} from "@m78/utils";
import { _getSizeString } from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import clsx from "clsx";
import { addCls, removeCls, removeNode } from "../../common/index.js";

import {
  TableCell,
  TableCellWithDom,
  TableColumn,
  TableRow,
} from "../types/items.js";
import { _TablePrivateProperty, TableRenderCtx } from "../types/base-type.js";
import { _TableEventPlugin } from "./event.js";
import { TouchEvent } from "react";
import debounce from "lodash/debounce.js";

/**
 * 视口/尺寸/滚动相关的核心功能实现
 * */
export class _TableViewportPlugin extends TablePlugin {
  /** 优化render函数 */
  rafCaller: RafFunction;
  /** 清理raf */
  rafClear?: EmptyFunction;

  /** 用于滚动订阅优化 */
  event: _TableEventPlugin;

  getter: _TableGetterPlugin;

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
      "maxX",
      "maxY",
      "render",
      "renderSync",
      "isRowVisible",
      "isColumnVisible",
      "isCellVisible",
      "isFocus",
      "isActive",
    ]);

    this.rafCaller = rafCaller();

    this.event = this.getPlugin(_TableEventPlugin);
    this.getter = this.getPlugin(_TableGetterPlugin);

    this.updateDom();
  }

  mount() {
    this.isActiveEventBind();
  }

  beforeDestroy() {
    if (this.rafClear) this.rafClear();
    this.isActiveEventUnBind();
  }

  /** 合并实现plugin.cellRender和config.render */
  cellRenderImpl(cell: TableCellWithDom, ctx: TableRenderCtx): void {
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
    if (width === undefined) return el.clientWidth;
    el.style.width = _getSizeString(width);
    this.render();
  }

  height(height?: number | string) {
    const el = this.config.el;
    if (height === undefined) return el.clientHeight;
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

    const run = () => {
      viewEl.scrollLeft = x;
      this.render();
    };

    // 阻断/不阻断内部onScroll事件
    if (!ctx.xyShouldNotify) {
      this.event.scrollAction(run);
    } else {
      run();
    }
  }

  y(y?: number) {
    const ctx = this.context;
    const viewEl = ctx.viewEl;
    if (y === undefined) return viewEl.scrollTop;

    const run = () => {
      viewEl.scrollTop = y;
      this.render();
    };

    // 阻断/不阻断内部onScroll事件
    if (!ctx.xyShouldNotify) {
      this.event.scrollAction(run);
    } else {
      run();
    }
  }

  xy(x?: number, y?: number) {
    const ctx = this.context;
    const viewEl = ctx.viewEl;

    if (x === undefined || y === undefined) {
      return [viewEl.scrollLeft, viewEl.scrollTop];
    }

    this.table.takeover(() => {
      this.x(x);
      this.y(y);
    });
  }

  maxX(): number {
    return this.context.viewEl.scrollWidth - this.context.viewEl.clientWidth;
  }

  maxY(): number {
    return this.context.viewEl.scrollHeight - this.context.viewEl.clientHeight;
  }

  render() {
    if (this.context.takeKey) return;
    this.rafClear = this.rafCaller(() => this.renderMain());
  }

  /** render的同步版本 */
  renderSync() {
    if (this.context.takeKey) {
      this.context.takeSyncRender = true;
      return;
    }
    this.renderMain();
  }

  /** render核心逻辑 */
  renderMain() {
    const getter = this.getPlugin(_TableGetterPlugin);

    const visibleItems = getter.getViewportItems();

    // 清理由可见转为不可见的项
    this.removeHideNodes(
      this.context.lastViewportItems?.cells,
      visibleItems.cells
    );

    // 内容渲染
    this.renderCell(visibleItems.cells);

    this.context.lastViewportItems = visibleItems;

    /* # # # # # # # rendering # # # # # # # */
    this.plugins.forEach((plugin) => {
      plugin.rendering?.();
    });

    /* # # # # # # # rendered # # # # # # # */
    this.plugins.forEach((plugin) => {
      plugin.rendered?.();
    });
  }

  /** 绘制单元格 */
  renderCell(cells: TableCell[]) {
    const table = this.table;

    const x = table.x();
    const y = table.y();

    cells.forEach((cell) => {
      const row = cell.row;
      const column = cell.column;

      // 确保dom存在
      this.initCellDom(cell);

      const dom = cell.dom!;

      // 固定项需要持续更新位置
      if (cell.isFixed) {
        const cellX = column.isFixed ? column.fixedOffset! + x : column.x;
        const cellY = row.isFixed ? row.fixedOffset! + y : row.y;

        dom.style.top = `${cellY}px`;
        dom.style.left = `${cellX}px`;
      }

      const renderFlag = getNamePathValue(
        cell.state,
        _TablePrivateProperty.renderFlag
      );

      const renderCtx: TableRenderCtx = {
        isFirstRender: !renderFlag,
        disableLaterRender: false,
        disableDefaultRender: false,
      };

      this.cellRenderImpl(cell as TableCellWithDom, renderCtx);

      if (!renderFlag) {
        setNamePathValue(cell.state, _TablePrivateProperty.renderFlag, true);
      }

      const disableDefaultRender =
        renderCtx.disableDefaultRender || renderCtx.disableLaterRender;

      // 处理text, 因为.innerText读写都比较慢, 所以额外做一层判断
      if (!disableDefaultRender) {
        const lastText = cell.text;

        cell.text = this.getter.getText(cell);

        if (lastText !== cell.text) {
          const filter = replaceHtmlTags(cell.text);
          dom.innerHTML = `<span>${filter}</span>`;
        }
      }

      // 添加节点到画布
      if (!cell.isMount) {
        cell.isMount = true;
        this.context.stageEL.appendChild(dom);
      }
    });
  }

  /** 若不存在则初始化cell.dom, 每次reload后会在已有dom上更新 */
  initCellDom(cell: TableCell) {
    const ctx = this.context;

    if (!cell.dom) {
      cell.dom = document.createElement("div");
    }

    const dom = cell.dom;

    const lastReloadKey = getNamePathValue(
      dom,
      _TablePrivateProperty.reloadKey
    );

    // 同一次reload中只进行一直更新
    if (lastReloadKey && lastReloadKey === ctx.lastReloadKey) {
      return;
    }

    setNamePathValue(dom, _TablePrivateProperty.reloadKey, ctx.lastReloadKey);

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
        "__rf-first":
          ctx.rightFixedList[0] === column.key ||
          ctx.rightFixedListAll[0] === column.key,
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

    this.restoreWrapSize();

    // 同步内容实际尺寸, 如果内容被缩放, 调整为缩放后的尺寸
    ctx.viewContentEl.style.height = `${this.table.contentHeight()}px`;
    ctx.viewContentEl.style.width = `${this.table.contentWidth()}px`;

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

    const baseSize = 200;

    // 防止容器小于固定项的尺寸
    const minWidth = Math.min(
      ctx.leftFixedWidth + ctx.rightFixedWidth + baseSize,
      contW
    );
    const minHeight = Math.min(
      ctx.topFixedHeight + ctx.bottomFixedHeight + baseSize,
      contH
    );

    config.el.style.minWidth = `${minWidth}px`;
    config.el.style.minHeight = `${minHeight}px`;

    config.el.tabIndex = 0;

    // 处理stripe
    config.stripe
      ? addCls(config.el, "__stripe")
      : removeCls(config.el, "__stripe");
  }

  /** 若包含restoreWidth/restoreHeight, 则在恢复时将容器尺寸视情况恢复 */
  restoreWrapSize() {
    const config = this.config;
    const context = this.context;

    if (context.restoreWidth) {
      // 恢复尺寸
      config.el.style.width =
        config.width !== undefined
          ? _getSizeString(config.width)
          : context.restoreWidth;
      context.restoreWidth = undefined;
    }

    if (context.restoreHeight) {
      // 恢复尺寸
      config.el.style.height =
        config.height !== undefined
          ? _getSizeString(config.height)
          : context.restoreHeight;
      context.restoreHeight = undefined;
    }
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
          removeNode(item.dom);
          item.isMount = false;
        }
      });
    }
  }

  isColumnVisible: TableViewPort["isColumnVisible"] = (key, partial = true) => {
    return this.visibleCommon(false, key, partial);
  };

  isRowVisible: TableViewPort["isRowVisible"] = (key, partial = true) => {
    return this.visibleCommon(true, key, partial);
  };

  isCellVisible: TableViewPort["isCellVisible"] = (
    rowKey,
    columnKey,
    partial = true
  ) => {
    const cell = this.table.getCell(rowKey, columnKey);

    if (partial) {
      return cell.isMount;
    }

    return (
      this.isRowVisible(rowKey, partial) &&
      this.isColumnVisible(columnKey, partial)
    );
  };

  isFocus: TableViewPort["isFocus"] = (checkChildren) => {
    return isFocus(this.config.el, checkChildren);
  };

  /** isColumnVisible/isRowVisible通用逻辑 */
  private visibleCommon(isRow: boolean, key: string, partial: boolean) {
    const ctx = this.context;
    const current = isRow ? this.table.getRow(key) : this.table.getColumn(key);

    if (current.isFixed) return true;

    const rowCur = current as TableRow;
    const colCur = current as TableColumn;

    const size = isRow ? rowCur.height : colCur.width;

    const contStart = isRow ? rowCur.y : colCur.x;
    const contEnd = contStart + size;

    const pos = isRow ? this.table.y() : this.table.x();
    const tableSize = isRow ? this.table.height() : this.table.width();

    const startFixedSize = isRow ? ctx.topFixedHeight : ctx.leftFixedWidth;
    const endFixedSize = isRow ? ctx.bottomFixedHeight : ctx.rightFixedWidth;

    // 开始/结束边界
    const startLine = pos + startFixedSize;
    const endLine = pos + tableSize - endFixedSize;

    let isVisible = false;

    if (partial) {
      isVisible = contEnd >= startLine && contStart <= endLine;
    } else {
      isVisible = contStart >= startLine && contEnd <= endLine;
    }

    return isVisible;
  }

  _isActive = false;

  // 尽可能满足所有符合active的情况
  private isActiveEventBind() {
    document.documentElement.addEventListener(
      "mousedown",
      this.onIsActiveCheck
    );
    document.documentElement.addEventListener(
      "touchstart",
      this.onIsActiveCheck as any
    );

    this.config.el.addEventListener("mouseenter", this.onIsActiveCheck);

    this.context.viewEl.addEventListener("scroll", this.onActive);

    this.config.el.addEventListener("focus", this.onActive);

    window.addEventListener("blur", this.onWindowBlur);
  }

  private isActiveEventUnBind() {
    document.documentElement.removeEventListener(
      "mousedown",
      this.onIsActiveCheck
    );
    document.documentElement.removeEventListener(
      "touchstart",
      this.onIsActiveCheck as any
    );

    this.config.el.removeEventListener("mouseenter", this.onIsActiveCheck);

    this.context.viewEl.removeEventListener("scroll", this.onActive);

    this.config.el.removeEventListener("focus", this.onActive);

    window.removeEventListener("blur", this.onWindowBlur);
  }

  // 开始滚动时更新isActive
  private onActive = debounce(
    () => {
      if (this._isActive) return;

      this._isActive = true;

      addCls(this.config.el, "__active");
    },
    200,
    {
      leading: true,
      trailing: false,
    }
  );

  // 点击/移入时更新isActive
  private onIsActiveCheck = debounce(
    (e: MouseEvent | TouchEvent) => {
      const mouseEvent = e as MouseEvent;
      const touchEvent = e as TouchEvent;

      const el = this.config.el;

      let active: boolean;

      if (e.type === "mouseenter") {
        active = true;
      } else {
        let x;
        let y;

        if (e.type === "mousedown") {
          x = mouseEvent.clientX;
          y = mouseEvent.clientY;
        } else {
          x = touchEvent.touches[0].clientX;
          y = touchEvent.touches[0].clientY;
        }

        const rect = el.getBoundingClientRect();

        active =
          x >= rect.left &&
          x <= rect.right &&
          y >= rect.top &&
          y <= rect.bottom;
      }

      if (active === this._isActive) return;

      this._isActive = active;

      if (this._isActive) {
        addCls(el, "__active");
      } else {
        removeCls(el, "__active");
      }
    },
    200,
    { leading: true, trailing: true }
  );

  private onWindowBlur = () => {
    if (!this._isActive) return;

    this._isActive = false;

    removeCls(this.config.el, "__active");
  };

  isActive: TableViewPort["isActive"] = () => this._isActive;
}

export interface TableViewPort {
  /** 获取x */
  x(): number;

  /** 更新x */
  x(x: number): void;

  /** 获取y */
  y(): number;

  /** 更新y */
  y(y: number): void;

  /** 获取y */
  xy(): [number, number];

  /** 更新y */
  xy(x: number, y: number): void;

  /** 获取x最大值 */
  maxX(): number;

  /** 过去y最大值 */
  maxY(): number;

  /** 获取宽度 */
  width(): number;

  /** 设置宽度 */
  width(width: number | string): void;

  /** 获取高度 */
  height(): number;

  /** 设置高度 */
  height(height: number | string): void;

  /** 内容区域宽度 */
  contentWidth(): number;

  /** 内容区域高度 */
  contentHeight(): number;

  /**
   * 重绘表格. 注: 表格会在需要时自动进行重绘, 大部分情况不需要手动调用
   *
   * 多次调用的render会合并为一次并在浏览器的下一个渲染帧执行, 如果需要同步执行, 请使用renderSync
   * */
  render(): void;

  /** render()的同步版本 */
  renderSync(): void;

  /** 指定列是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
  isColumnVisible(key: string, partial?: boolean): boolean;

  /** 指定行是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
  isRowVisible(key: string, partial?: boolean): boolean;

  /** 指定单元格是否可见, partial为true时, 元素部分可见也视为可见, 默认为true */
  isCellVisible(rowKey: string, columnKey: string, partial?: boolean): boolean;

  /** 表格是否聚焦, checkChildren为true时会检测子级是否聚焦 */
  isFocus(checkChildren?: boolean): boolean;

  /** 表格是否处于活动状态, 即: 最近进行过点击, hover, 滚动等 */
  isActive(): boolean;
}
