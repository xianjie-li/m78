import { TablePlugin } from "../../plugin.js";
import {
  BoundSize,
  isArray,
  isNumber,
  isTruthyOrZero,
  TupleNumber,
} from "@m78/utils";
import {
  TableCell,
  TableColumn,
  TableItems,
  TableItemsFull,
  TableRow,
} from "../../types.js";
import clamp from "lodash/clamp.js";
import Konva from "konva";
import clsx from "clsx";
import { _removeNode } from "../../common.js";

// @ts-ignore
import Stats from "stats.js";

/**
 * 视口/尺寸/滚动相关的核心功能实现
 * */
export class TableViewportPlugin extends TablePlugin {
  stats = new Stats();

  init() {
    document.body.appendChild(this.stats.dom);

    this.config.el.className = "m78-table";

    const cH = this.config.height;
    const cW = this.config.width;

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
      "getBoundItems",
      "getViewportItems",
    ]);

    if (isTruthyOrZero(cH)) {
      this.height(cH!);
    }

    if (isTruthyOrZero(cW)) {
      this.width(cW!);
    }

    this.ensureCanvasElementExist();

    this.table.stage = new Konva.Stage({
      container: this.table.canvasElement,
      width: this.width(),
      height: this.height(),
    });

    this.table.layer = new Konva.Layer({
      x: 0,
      y: 0,
    });

    this.table.stage.add(this.table.layer);

    this.fitWrapSize();

    this.refreshDomElement();
  }

  initialized() {
    // 暴露scroll handle, 用于外部滚动同步
    this.context.domEl.addEventListener("scroll", this.onScroll);
  }

  beforeDestroy() {
    this.context.domEl.removeEventListener("scroll", this.onScroll);

    this.context.domEl.scrollLeft = 0;
    this.context.domEl.scrollTop = 0;

    this.restoreWrapSize();
    this.table.stage.destroy();

    delete this.context.lastViewportItems;

    _removeNode(this.table.canvasElement);

    // @ts-ignore 如果是内部创建的dom容器, 将其移除
    if (this.context.domEl.__m78TableDefaultScroller) {
      _removeNode(this.context.domEl);
    }

    // @ts-ignore
    delete this.table.canvasElement;
    // @ts-ignore
    delete this.context.domEl;
    // @ts-ignore
    delete this.context.domContentEl;
  }

  /* # # # # # # # 实现 # # # # # # # */

  width(width?: number | string) {
    if (width === undefined) return this.config.el.offsetWidth;
    this.config.el.style.width = this.getSizeString(width);

    this.table.stage.width(this.width()!);
    this.render();
  }

  height(height?: number | string) {
    if (height === undefined) return this.config.el.offsetHeight;
    this.config.el.style.height = this.getSizeString(height);

    this.table.stage.height(this.height()!);
    this.render();
  }

  contentWidth() {
    const last = this.context.lastNoFixedColumn;
    const fixedStartWidth = this.context.leftFixedWidth;
    const fixedEndWidth = this.context.rightFixedWidth;

    if (!last) return fixedStartWidth + fixedEndWidth;

    if (this.config.autoSize) {
      return last.x + last.width + fixedEndWidth;
    } else {
      // 无自动尺寸时, 内容尺寸不小于容器尺寸, 否则xy()等计算会出现问题
      return Math.max(last.x + last.width + fixedEndWidth, this.table.width());
    }
  }

  contentHeight() {
    const last = this.context.lastNoFixedRow;
    const fixedStartHeight = this.context.topFixedHeight;
    const fixedEndHeight = this.context.bottomFixedHeight;

    if (!last) return fixedEndHeight + fixedStartHeight;

    if (this.config.autoSize) {
      return last.y + last.height + fixedEndHeight;
    } else {
      return Math.max(
        last.y + last.height + fixedEndHeight,
        this.table.height()
      );
    }
  }

  x(x?: number) {
    if (x === undefined) return this.table.layer.x();
    this.table.layer.x(
      clamp(x, -(this.table.contentWidth() - this.table.width()), 0)
    );
    this.render();
  }

  y(y?: number) {
    if (y === undefined) return this.table.layer.y();
    this.table.layer.y(
      clamp(y, -(this.table.contentHeight() - this.table.height()), 0)
    );
    this.render();
  }

  xy(x?: number, y?: number) {
    const layer = this.table.layer;

    if (x === undefined || y === undefined) {
      return [layer.x(), layer.y()];
    }

    layer.position({
      x: clamp(x, -(this.table.contentWidth() - this.table.width()), 0),
      y: clamp(y, -(this.table.contentHeight() - this.table.height()), 0),
    });

    this.render();
  }

  render() {
    this.stats.begin();

    const visibleItems = this.getViewportItems();

    this.fitWrapSize();

    const width = this.width();
    const height = this.height();

    // 同步舞台尺寸
    if (
      this.table.stage.width() !== width ||
      this.table.stage.height() !== height
    ) {
      this.table.stage.setAttrs({
        width,
        height,
      });
    }

    // 同步dom内容区尺寸
    this.refreshDomElement();

    // 清理由可见转为不可见的项
    this.removeHideNodes(this.context.lastViewportItems, visibleItems);

    // 内容渲染
    this.renderCell(visibleItems.cells);

    /* # # # # # # # mount # # # # # # # */
    this.plugins.forEach((plugin) => {
      plugin.rendered?.();
    });

    this.context.lastViewportItems = visibleItems;

    this.stats.end();
  }

  /** 获取实际选区(处理fixed项) */
  getRealSelectBound(bound: BoundSize): BoundSize {
    return {} as any;
  }

  getBoundItems(
    target: BoundSize | TupleNumber,
    skipFixed = false
  ): TableItemsFull {
    const table = this.table;

    let x = 0;
    let y = 0;

    let width = 0;
    let height = 0;

    let isSingle = false;

    if (isArray(target)) {
      x = target[0];
      y = target[1];
      isSingle = true;
    } else {
      x = target.left;
      y = target.top;
      width = target.width;
      height = target.height;
    }

    let startRowIndex = 0;
    let endRowIndex = 0;
    let startColumnIndex = 0;
    let endColumnIndex = 0;

    // 最小可见行
    const startRow: TableRow = this.binarySearch2(
      table.rows,
      (item: TableRow, index) => {
        const offset = item.y;
        const size = item.height;

        const rangStart = y - size;

        // 视口边缘 - 尺寸 到 视口边缘的范围内视为第一项
        if (offset >= rangStart && offset <= y) {
          startRowIndex = index;
          endRowIndex = index;
          return 0;
        }

        if (offset > y) return 1;
        if (offset < y) return -1;
        return null;
      }
    );

    // 最小可见列
    const startColumn = this.binarySearch2(
      table.columns,
      (item: TableColumn, index) => {
        const offset = item.x;
        const size = item.width;

        const rangStart = x - size;

        // 等于或在最小可见范围(视口上方 + 尺寸 + 1)内
        if (offset >= rangStart && offset <= x) {
          startColumnIndex = index;
          endColumnIndex = index;
          return 0;
        }

        if (offset > x) return 1;
        if (offset < x) return -1;
        return null;
      }
    );

    const rowList: TableRow[] = [];
    const columnsList: TableColumn[] = [];
    const cellList: TableCell[] = [];

    if (!startRow || !startColumn) {
      return {
        rows: rowList,
        columns: columnsList,
        cells: cellList,
      };
    }

    if (startRow) {
      for (let i = startRowIndex; i < table.rows.length; i++) {
        const row = table.rows[i];

        if (skipFixed && isNumber(row.fixedY)) continue;

        if (row.y > y + height) break;

        rowList.push(row);
        endRowIndex = i;
      }
    }

    if (startColumn) {
      for (let i = startColumnIndex; i < table.columns.length; i++) {
        const column = table.columns[i];

        if (skipFixed && isNumber(column.fixedX)) continue;

        if (column.x > x + width) break;

        columnsList.push(column);
        endColumnIndex = i;
      }
    }

    // 截取可见区域cell
    rowList.forEach((row) => {
      const slice = row.cells.slice(startColumnIndex, endColumnIndex + 1); // 右闭合所以+1

      slice.forEach((cell) => {
        // 固定项单独处理
        if (isNumber(row.fixedY) || isNumber(cell.column.fixedX)) return;
        cellList.push(cell);
      });
    });

    return {
      rows: isSingle ? rowList.slice(0, 1) : rowList,
      columns: isSingle ? columnsList.slice(0, 1) : columnsList,
      cells: isSingle ? cellList.slice(0, 1) : cellList,
      startRowIndex,
      endRowIndex,
      startColumnIndex,
      endColumnIndex,
    };
  }

  getViewportItems(): TableItems {
    const table = this.table;
    const ctx = this.context;

    // 截取非fixed区域内容

    const x = Math.min(
      Math.abs(table.x()) + ctx.leftFixedWidth,
      this.contentWidth()
    );
    const y = Math.min(
      Math.abs(table.y()) + ctx.topFixedHeight,
      this.contentHeight()
    );

    const width = Math.max(
      table.width() - ctx.rightFixedWidth - ctx.leftFixedWidth,
      0
    );
    const height = Math.max(
      table.height() - ctx.bottomFixedHeight - ctx.topFixedHeight,
      0
    );

    const items = this.getBoundItems({ left: x, top: y, width, height }, true);

    const {
      startRowIndex,
      endRowIndex,
      startColumnIndex,
      endColumnIndex,
      cells,
      rows,
      columns,
    } = items;

    if (!isNumber(startRowIndex) || !isNumber(endRowIndex)) {
      return items;
    }

    const lf = this.table.leftFixed;
    const rf = this.table.rightFixed;

    // 截取固定列中可见单元格
    [...lf, ...rf].forEach((column) => {
      const slice = column.cells.slice(startRowIndex, endRowIndex + 1);

      slice.forEach((cell) => {
        cells.push(cell);
      });
    });

    columns.unshift(...lf);
    columns.push(...rf);

    const tf = this.table.topFixed;
    const bf = this.table.bottomFixed;

    // 截取固定行中可用单元格
    [...tf, ...bf].forEach((row) => {
      let startColumnInd = startColumnIndex!;
      let endColumnInd = endColumnIndex! + 1;

      // 裁去固定列索引
      if (startColumnInd < lf.length) {
        startColumnInd = lf.length;
      }

      if (endColumnInd > row.cells.length - rf.length) {
        endColumnInd = row.cells.length - rf.length;
      }

      const slice = row.cells.slice(startColumnInd, endColumnInd);

      // 固定列单独处理
      const startSlice = row.cells.slice(0, lf.length);
      const endSlice = row.cells.slice(-rf.length);

      [...startSlice, ...slice, ...endSlice].forEach((cell) => {
        cells.push(cell);
      });
    });

    return {
      rows,
      columns,
      cells,
    };
  }

  /* # # # # # # # 内部方法 # # # # # # # */

  /** 绘制单元格 */
  renderCell(cells: TableCell[]) {
    const table = this.table;
    const config = this.config;

    const toTopShape: Konva.Shape[] = [];
    const toTopShape2: Konva.Shape[] = [];

    const x = table.x();
    const y = table.y();

    cells.forEach((cell) => {
      const fixedY = cell.row.fixedY;
      const isFixedY = isNumber(fixedY);

      const column = cell.column;

      const fixedX = column.fixedX;
      const isFixedX = isNumber(fixedX);

      const attr: Konva.RectConfig = {
        x: isFixedX ? fixedX - x : column.x,
        y: isFixedY ? fixedY - y : cell.row.y,
        width: cell.column.width,
        height: cell.row.height,
        text: cell.text,
        listening: false,
        align: "center",
        verticalAlign: "middle",
        perfectDrawEnabled: false,
      };

      if (cell.shapes.text) {
        const textShape = cell.shapes.text as Konva.Text;
        textShape.setAttrs(attr);
      } else {
        cell.shapes.text = new Konva.Text(attr);
        table.layer.add(cell.shapes.text);
      }

      // 边框
      attr.stroke = config.borderColor;
      attr.strokeWidth = config.borderWidth;
      attr.fill = config.backgroundColor;

      if (cell.shapes.rect) {
        const shape = cell.shapes.rect as Konva.Rect;
        shape.setAttrs({ ...attr });
      } else {
        cell.shapes.rect = new Konva.Rect({ ...attr });
        table.layer.add(cell.shapes.rect);
      }

      if (!isFixedY && !isFixedX) {
        cell.shapes.text.moveToBottom();
        cell.shapes.rect.moveToBottom();
      }

      if (isFixedY) {
        toTopShape.push(cell.shapes.rect);
        toTopShape.push(cell.shapes.text);
      }

      if (isFixedX) {
        toTopShape2.push(cell.shapes.rect);
        toTopShape2.push(cell.shapes.text);
      }
    });

    toTopShape.forEach((shape) => {
      shape.moveToTop();
    });

    toTopShape2.forEach((shape) => {
      shape.moveToTop();
    });
  }

  /** 获取1和2的差异, 并从视口清除2中已不存在的项 */
  removeHideNodes(items1?: TableItems, items2?: TableItems) {
    // 销毁由可见变为不可见的节点
    if (items1 && items2) {
      const diff = this.getTableItemsDiff(items1, items2);

      diff.cells.forEach((cell) => {
        cell.shapes.text?.destroy();
        cell.shapes.rect?.destroy();
        delete cell.shapes.text;
        delete cell.shapes.rect;
      });
    }
  }

  /** 获取两组TableItems的差异, 返回1中存在, 2中不存在的项 */
  getTableItemsDiff(items1: TableItems, items2: TableItems): TableItems {
    const rows = items1.rows.filter((item) => !items2.rows.includes(item));
    const columns = items1.columns.filter(
      (item) => !items2.columns.includes(item)
    );
    const cells = items1.cells.filter((item) => !items2.cells.includes(item));

    return {
      rows,
      columns,
      cells,
    };
  }

  /** 滚动 */
  onScroll = (e: Event) => {
    e.preventDefault();

    const el = e.target as HTMLDivElement;

    let xRatio = el.scrollLeft / (el.scrollWidth - el.offsetWidth);
    const maxX = this.table.contentWidth() - this.table.width();

    let yRatio = el.scrollTop / (el.scrollHeight - el.offsetHeight);
    const maxY = this.table.contentHeight() - this.table.height();

    // scrollTop scrollHeight offsetHeight均为0时, 会出现 0 / 0 产生NaN的情况
    if (isNaN(xRatio)) xRatio = 0;
    if (isNaN(yRatio)) yRatio = 0;

    this.table.xy(-xRatio * maxX, -yRatio * maxY);
  };

  /** 处理和更新context.domElement/domContentElement */
  refreshDomElement() {
    if (!this.context.domEl || !this.context.domContentEl) {
      if (this.config.domEl && this.config.domContentEl) {
        // 传入配置时使用传入值
        this.context.domEl = this.config.domEl;
        this.context.domContentEl = this.config.domContentEl;
      } else {
        // 没有传入相关配置, 自动创建并渲染
        const el = document.createElement("div");

        // @ts-ignore
        el.__m78TableDefaultScroller = true;

        // 预设配置时, 为其添加滚动样式和尺寸控制
        this.context.domEl = el;

        const contEl = document.createElement("div");
        this.context.domContentEl = contEl;

        this.context.domEl.className = clsx(
          "m78-table_default-scroll m78-table_expand-size",
          this.context.domEl.className
        );

        el.appendChild(contEl);
        this.config.el.appendChild(el);
      }

      const domEl = this.context.domEl;
      const domContentEl = this.context.domContentEl;

      if (!domEl.className.includes("m78-table_dom")) {
        domEl.className = clsx("m78-table_dom", domEl.className);
      }

      if (!domContentEl.className.includes("m78-table_dom-content")) {
        domContentEl.className = clsx(
          "m78-table_dom-content",
          domContentEl.className
        );
      }
    }

    // 更新为内容实际尺寸
    this.context.domContentEl.style.height = `${this.table.contentHeight()}px`;
    this.context.domContentEl.style.width = `${this.table.contentWidth()}px`;
  }

  /** 确保this.table.canvasElement存在 */
  ensureCanvasElementExist() {
    if (!this.table.canvasElement) {
      this.table.canvasElement = document.createElement("div");
      this.table.canvasElement.className =
        "m78-table_canvas m78-table_expand-size";
      this.config.el.appendChild(this.table.canvasElement);
    }
  }

  binarySearch2(
    list: any[],
    comparator: (item: any, index: number) => -1 | 0 | 1 | null
  ) {
    let left = 0;
    let right = list.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      let compareResult = comparator(list[mid], mid);

      if (compareResult === 0) {
        return list[mid];
      } else if (compareResult === 1) {
        right = mid - 1;
      } else if (compareResult === -1) {
        left = mid + 1;
      }

      let midClone = mid;

      // 向右查找有效项
      while (compareResult === null && midClone < right) {
        midClone++;
        compareResult = comparator(list[midClone], midClone);

        if (compareResult === 0) {
          return list[midClone];
        } else if (compareResult === 1) {
          right = midClone - 1;
        } else if (compareResult === -1) {
          left = midClone + 1;
        }
      }

      // 向左查找有效项
      midClone = mid;

      while (compareResult === null && midClone > left) {
        midClone--;
        compareResult = comparator(list[midClone], midClone);

        if (compareResult === 0) {
          return list[midClone];
        } else if (compareResult === 1) {
          right = midClone - 1;
        } else if (compareResult === -1) {
          left = midClone + 1;
        }
      }

      if (compareResult === null) {
        return;
      }
    }

    return null;
  }

  /** 根据尺寸值返回尺寸字符, 字符串时原样返回, 数值时返回 `${size}px` */
  getSizeString(size: number | string) {
    return isNumber(size) ? `${size}px` : size;
  }

  /**
   * 如果内容尺寸小于容器尺寸, 则将容器尺寸缩小进行适应
   * */
  fitWrapSize() {
    const w = this.table.width();
    const cw = this.table.contentWidth();

    const h = this.table.height();
    const ch = this.table.contentHeight();

    const config = this.config;
    const context = this.context;

    if (config.autoSize) {
      if (cw < w) {
        context.restoreWidth = config.el.style.width;
        config.el.style.width = `${cw}px`;
      }

      if (ch < h) {
        context.restoreHeight = config.el.style.height;
        config.el.style.height = `${ch}px`;
      }
    }

    this.table.stage.width(this.width()!);
    this.table.stage.height(this.height()!);
  }

  /** 若包含restoreWidth/restoreHeight, 则在恢复时将容器尺寸视情况恢复 */
  restoreWrapSize() {
    const config = this.config;
    const context = this.context;

    if (context.restoreWidth) {
      // 恢复尺寸
      config.el.style.width =
        config.width !== undefined
          ? this.getSizeString(config.width)
          : context.restoreWidth;
      context.restoreWidth = undefined;
    }

    if (context.restoreHeight) {
      // 恢复尺寸
      config.el.style.height =
        config.height !== undefined
          ? this.getSizeString(config.height)
          : context.restoreHeight;
      context.restoreHeight = undefined;
    }
  }
}
