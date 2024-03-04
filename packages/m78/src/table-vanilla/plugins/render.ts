import { TablePlugin } from "../plugin.js";
import {
  EmptyFunction,
  getNamePathValue,
  getStyle,
  isNumber,
  isString,
  isTruthyOrZero,
  rafCaller,
  RafFunction,
  replaceHtmlTags,
  setNamePathValue,
  Size,
} from "@m78/utils";
import { _getSizeString } from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import clsx from "clsx";
import { addCls, removeCls, removeNode } from "../../common/index.js";

import { TableCell, TableCellWithDom } from "../types/items.js";
import {
  TablePointInfo,
  TablePosition,
  TableRenderCtx,
} from "../types/base-type.js";
import { _TableEventPlugin } from "./event.js";
import clamp from "lodash/clamp.js";
import { _TableMetaDataPlugin } from "./meta-data.js";

/**
 * 渲染核心逻辑
 * */
export class _TableRenderPlugin extends TablePlugin implements TableRender {
  /** 优化render函数 */
  rafCaller: RafFunction;
  /** 清理raf */
  rafClear?: EmptyFunction;

  /** 用于滚动订阅优化 */
  event: _TableEventPlugin;

  getter: _TableGetterPlugin;

  beforeInit() {
    // 映射实现方法
    this.methodMapper(this.table, [
      "render",
      "renderSync",
      "transformContentPoint",
      "transformViewportPoint",
    ]);
  }

  init() {
    this.rafCaller = rafCaller();

    this.event = this.getPlugin(_TableEventPlugin);
    this.getter = this.getPlugin(_TableGetterPlugin);

    this.updateDom();
  }

  beforeDestroy() {
    if (this.rafClear) this.rafClear();
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
    this.context.getterCache.tick(() => {
      const getter = this.getPlugin(_TableGetterPlugin);

      const visibleItems = getter.getViewportItems();

      /* # # # # # # # beforeRender # # # # # # # */
      this.plugins.forEach((plugin) => {
        plugin.beforeRender?.();
      });

      this.table.event.beforeRender.emit();

      // 清理由可见转为不可见的项
      this.removeHideNodes(
        this.context.lastViewportItems?.cells,
        visibleItems.cells
      );

      this.context.lastMountRows = {};
      this.context.lastMountColumns = {};

      // 在render中会触发一些列hook和事件, 这里提前循环设置值, 防止在期间读取mount状态
      visibleItems.rows.forEach((row) => {
        this.context.lastMountRows![row.key] = true;
      });

      visibleItems.columns.forEach((column) => {
        this.context.lastMountColumns![column.key] = true;
      });

      // 内容渲染
      this.renderCell(visibleItems.cells);

      // 事件通知
      visibleItems.rows.forEach((row) => {
        this.table.event.rowRendering.emit(row);
      });

      visibleItems.columns.forEach((column) => {
        this.table.event.columnRendering.emit(column);
      });

      this.context.lastViewportItems = visibleItems;

      /* # # # # # # # rendering # # # # # # # */
      this.plugins.forEach((plugin) => {
        plugin.rendering?.();
      });

      this.table.event.rendering.emit();

      /* # # # # # # # rendered # # # # # # # */
      this.plugins.forEach((plugin) => {
        plugin.rendered?.();
      });

      this.table.event.rendered.emit();
    });
  }

  /** 绘制单元格 */
  renderCell(cells: TableCell[]) {
    const table = this.table;

    const x = table.getX();
    const y = table.getY();

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

        dom.style.transform = `translate(${cellX}px,${cellY}px)`;
      }

      const renderFlag = getNamePathValue(
        cell.state,
        _TableMetaDataPlugin.RENDERED_KEY
      );

      const renderCtx: TableRenderCtx = {
        isFirstRender: !renderFlag,
        disableLaterRender: false,
        disableDefaultRender: false,
      };

      const lastText = cell.text;

      cell.text = this.getter.getText(cell);

      this.cellRenderImpl(cell as TableCellWithDom, renderCtx);

      if (!renderFlag) {
        setNamePathValue(cell.state, _TableMetaDataPlugin.RENDERED_KEY, true);
      }

      const disableDefaultRender =
        renderCtx.disableDefaultRender || renderCtx.disableLaterRender;

      // 处理text, 因为.innerText读写都比较慢, 所以额外做一层判断
      if (!disableDefaultRender) {
        if (lastText !== cell.text) {
          const filter = replaceHtmlTags(cell.text);
          dom.innerHTML = `<span>${filter}</span>`;
        }
      }

      // 添加节点到画布
      if (!cell.isMount) {
        cell.isMount = true;
        this.context.stageEL.appendChild(dom);

        this.table.event.mountChange.emit(cell);
      }

      this.table.event.cellRendering.emit(cell);
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
      _TableMetaDataPlugin.RENDERED_KEY
    );

    // 同一次reload中只进行一直更新
    if (lastReloadKey && lastReloadKey === ctx.lastReloadKey) {
      return;
    }

    setNamePathValue(dom, _TableMetaDataPlugin.RENDERED_KEY, ctx.lastReloadKey);

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
        "__x-fixed": cell.column.isFixed,
        "__y-fixed": cell.row.isFixed,
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
      dom.style.transform = `translate(${column.x}px,${row.y}px)`;
    }
  }

  /** 根据配置更新各种容器尺寸相关的内容 */
  updateDom() {
    const config = this.config;
    const ctx = this.context;
    const cH = this.config.height;
    const cW = this.config.width;

    if (isTruthyOrZero(cH)) {
      this.table.setHeight(cH!);
    }

    if (isTruthyOrZero(cW)) {
      this.table.setWidth(cW!);
    }

    this.restoreWrapSize();

    // 同步内容实际尺寸, 如果内容被缩放, 调整为缩放后的尺寸
    ctx.viewContentEl.style.height = `${this.table.getContentHeight()}px`;
    ctx.viewContentEl.style.width = `${this.table.getContentWidth()}px`;

    this.updateWrapSize();

    config.el.tabIndex = 0;

    // 处理stripe
    ctx.getBaseConfig("stripe")
      ? addCls(config.el, "__stripe")
      : removeCls(config.el, "__stripe");

    // 处理border
    ctx.getBaseConfig("border")
      ? addCls(config.el, "__border")
      : removeCls(config.el, "__border");
  }

  /** 更新容器尺寸信息 */
  updateWrapSize() {
    const ctx = this.context;
    const config = this.config;

    const w = this.table.getWidth();
    const contW = this.table.getContentWidth();

    const h = this.table.getHeight();
    const contH = this.table.getContentHeight();

    // 处理autoSize
    if (config.autoSize) {
      // 如果存在边框, 内容实际能显示的区域会被压缩, 需要额外添加边框尺寸
      const size = this.getBorderSize();

      if (contW < w) {
        if (!ctx.restoreWidth) {
          ctx.restoreWidth = config.el.style.width;
        }
        config.el.style.width = `${contW + size.width}px`;
      }

      if (contH < h) {
        if (!ctx.restoreHeight) {
          ctx.restoreHeight = config.el.style.height;
        }
        config.el.style.height = `${contH + size.height}px`;
      }
    }

    // 非固定区域最小值
    const minViewSize = 200;

    // 防止容器小于固定项的尺寸
    const minWidth = Math.min(
      ctx.leftFixedWidth + ctx.rightFixedWidth + minViewSize,
      contW
    );
    const minHeight = Math.min(
      ctx.topFixedHeight + ctx.bottomFixedHeight + minViewSize,
      contH
    );

    config.el.style.minWidth = `${minWidth}px`;
    config.el.style.minHeight = `${minHeight}px`;
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
          item.isMount = false;

          this.table.event.mountChange.emit(item);

          removeNode(item.dom);
        }
      });
    }
  }

  transformViewportPoint(
    [x, y]: TablePosition,
    fixedOffset = 0
  ): TablePointInfo {
    const ctx = this.context;

    const lStart = 0;
    const lEnd = lStart + ctx.leftFixedWidth + fixedOffset;

    const tStart = 0;
    const tEnd = tStart + ctx.topFixedHeight + fixedOffset;

    const bEnd = this.table.getHeight();
    const bStart = bEnd - ctx.bottomFixedHeight - fixedOffset;

    const rEnd = this.table.getWidth();
    const rStart = rEnd - ctx.rightFixedWidth - fixedOffset;

    const isFixedLeft = x >= lStart && x <= lEnd;
    const isFixedTop = y >= tStart && y <= tEnd;
    const isFixedBottom = y >= bStart && y <= bEnd;
    const isFixedRight = x >= rStart && x <= rEnd;

    let realX = x + this.table.getX();
    let realY = y + this.table.getY();

    if (isFixedLeft) {
      realX = x;
    }

    if (isFixedRight) {
      const diffW = rEnd - x;
      realX = this.table.getContentWidth() - diffW;
    }

    if (isFixedTop) {
      realY = y;
    }

    if (isFixedBottom) {
      const diffH = bEnd - y;
      realY = this.table.getContentHeight() - diffH;
    }

    return {
      leftFixed: isFixedLeft,
      topFixed: isFixedTop,
      rightFixed: isFixedRight,
      bottomFixed: isFixedBottom,
      x: realX,
      y: realY,
      xy: [realX, realY],
      originY: y,
      originX: x,
    };
  }

  transformContentPoint(pos: TablePosition): TablePointInfo {
    const contW = this.table.getContentWidth();
    const contH = this.table.getContentHeight();

    // 基础位置, 限制在可用区域内
    const x = clamp(pos[0], 0, contW);
    const y = clamp(pos[1], 0, contH);

    const lStart = 0;
    const lEnd = this.context.leftFixedWidth;
    const tStart = 0;
    const tEnd = this.context.topFixedHeight;
    const rStart = contW - this.context.rightFixedWidth;
    const rEnd = contW;
    const bStart = contH - this.context.bottomFixedHeight;
    const bEnd = contH;

    const isFixedLeft = x >= lStart && x <= lEnd;
    const isFixedTop = y >= tStart && y <= tEnd;
    const isFixedRight = x >= rStart && x <= rEnd;
    const isFixedBottom = y >= bStart && y <= bEnd;

    let realX = x - this.table.getX();
    let realY = y - this.table.getY();

    if (isFixedLeft) {
      realX = x;
    }

    if (isFixedRight) {
      const diffW = rEnd - x;
      realX = this.table.getWidth() - diffW;
    }

    if (isFixedTop) {
      realY = y;
    }

    if (isFixedBottom) {
      const diffH = bEnd - y;
      realY = this.table.getHeight() - diffH;
    }

    return {
      leftFixed: isFixedLeft,
      topFixed: isFixedTop,
      rightFixed: isFixedRight,
      bottomFixed: isFixedBottom,
      x: realX,
      y: realY,
      xy: [realX, realY],
      originY: pos[1],
      originX: pos[0],
    };
  }

  // 获取config.el的边框尺寸
  private getBorderSize(): Size {
    const sty = getStyle(this.config.el);

    const t = isString(sty.borderTopWidth)
      ? Number(sty.borderTopWidth.replace("px", ""))
      : 0;

    const r = isString(sty.borderRightWidth)
      ? Number(sty.borderRightWidth.replace("px", ""))
      : 0;

    const b = isString(sty.borderBottomWidth)
      ? Number(sty.borderBottomWidth.replace("px", ""))
      : 0;

    const l = isString(sty.borderLeftWidth)
      ? Number(sty.borderLeftWidth.replace("px", ""))
      : 0;

    return {
      width: l + r,
      height: t + b,
    };
  }
}

export interface TableRender {
  /**
   * 重绘表格. 注: 表格会在需要时自动进行重绘, 大部分情况不需要手动调用
   *
   * 多次调用的render会合并为一次并在浏览器的下一个渲染帧执行, 如果需要同步执行, 请使用renderSync
   * */
  render(): void;

  /** render()的同步版本 */
  renderSync(): void;

  /**
   * 根据表格视区内的点获取基于内容尺寸的点, 传入点的区间为: [0, 表格容器尺寸].
   * - 可传入fixedOffset来对fixed项的判定区域增加或减少
   * */
  transformViewportPoint(
    [x, y]: TablePosition,
    fixedOffset?: number
  ): TablePointInfo;

  /**
   * 转换内容区域的点为表格视区内的点, 传入点的区间为: [0, 表格内容尺寸].
   * 包含了对缩放的处理
   * */
  transformContentPoint([x, y]: TablePosition): TablePointInfo;
}
