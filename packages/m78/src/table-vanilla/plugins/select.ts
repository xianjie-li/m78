import { TablePlugin } from "../plugin.js";
import {
  AnyObject,
  BoundSize,
  createAutoScroll,
  getCmdKeyStatus,
  isBoolean,
  isEmpty,
  isFunction,
  isString,
  AutoScroll,
  isNumber,
  AutoScrollDisableConfig,
} from "@m78/utils";
import throttle from "lodash/throttle.js";
import {
  _getCellKey,
  _getCellKeysByStr,
  _getMaxPointByPoint,
  _getOffset,
} from "../common.js";
import {
  TableCell,
  TableCellWidthDom,
  TableInstance,
  TableItems,
  TableKey,
  TablePointInfo,
  TablePosition,
  TableReloadOptions,
  TableRow,
} from "../types.js";
import { addCls, removeCls } from "../../common/index.js";

// dnd改为新版autoscroll, 修正自动滚动后的位置, zoom处理
// 拖动距离超过一定值后才出发自动跳边

/** 选区类型 */
export enum TableRangeType {
  row,
  column,
  cell,
}

export interface TableRange extends BoundSize {
  id: string;
  type: TableRangeType;
}

interface SelectMap {
  [key: string]: 1;
}

/** 实现选区和选中功能 */
export class _TableSelectPlugin extends TablePlugin {
  /** 选中的行 */
  selectedRows: SelectMap = {};
  /** 选中的单元格 */
  selectedCells: SelectMap = {};

  /** 临时选中的行 */
  selectedTempRows: SelectMap = {};
  /** 临时选中的单元格 */
  selectedTempCells: SelectMap = {};

  /** 开始点 */
  startPoint: TablePointInfo | null = null;

  /** 当前触发的事件是否在开始时按下了shift */
  isShift = false;

  /** 记录每次事件中移动的总距离 */
  moveDistance = 0;

  /** 记录最后一次的非shift down点 */
  lastPoint: TablePosition[] | null = null;

  /** 处理自动滚动行为间的冲突, 用于记录 autoScrollConflictDisabledConfigGenerate 方法的状态 */
  conflictDisableConfig: AutoScrollDisableConfig | null;

  /** 边缘自动滚动控制器 */
  autoScroll: AutoScroll;

  /** 开始拖动之前的滚动位置, 用于自动滚动后修正框选区域 */
  autoScrollBeforePosition: TablePosition | null = null;

  /** 自动滚动距离边缘前的此位置开始触发 */
  static EDGE_SIZE = 32;

  init() {
    this.methodMapper(this.table, [
      "isSelectedRow",
      "isSelectedCell",
      "getSelectedRows",
      "getSelectedCells",
      "selectRows",
      "selectCells",
    ]);
  }

  mount() {
    this.context.viewEl.addEventListener("mousedown", this.selectStart);
    document.documentElement.addEventListener("mousemove", this.selectMove);
    document.documentElement.addEventListener("mouseup", this.selectEnd);
    this.table.event.click.on(this.clickHandle);
    this.table.event.zoom.on(this.updateAutoScrollBound);

    this.autoScroll = createAutoScroll({
      el: this.context.viewEl,
      boundElement: this.config.el,
      checkOverflowAttr: false,
      baseOffset: 10,
      adjust: this.getAutoScrollBound(),
    });
  }

  reload({ level }: TableReloadOptions = {}) {
    if (isNumber(level) && level > 1) {
      this.updateAutoScrollBound();
    }
  }

  beforeDestroy() {
    this.context.viewEl.removeEventListener("mousedown", this.selectStart);
    document.documentElement.removeEventListener("mousemove", this.selectMove);
    document.documentElement.removeEventListener("mouseup", this.selectEnd);
    this.table.event.click.off(this.clickHandle);
    this.table.event.zoom.off(this.updateAutoScrollBound);
    this.autoScroll.clear();
    this.autoScroll = null!;
  }

  cellRender(cell: TableCellWidthDom) {
    const selected =
      this.isSelectedCell(cell.key) ||
      this.isSelectedTempCell(cell.key) ||
      this.isSelectedRow(cell.row.key) ||
      this.isSelectedTempRow(cell.row.key);

    selected
      ? addCls(cell.dom, "__selected")
      : removeCls(cell.dom, "__selected");
  }

  /** 选取开始 */
  selectStart = (e: MouseEvent) => {
    if (
      this.config.rowSelectable === false &&
      this.config.cellSelectable === false
    ) {
      return;
    }

    if (e.type === "mousedown" && e.button !== 0) return;

    // 包含前置点时处理shift按下
    this.isShift = e.shiftKey && !!this.lastPoint;

    // 合并还是覆盖, 控制键按下时为覆盖
    const isMerge = getCmdKeyStatus(e);

    const startPoint = this.table.transformViewportPoint(
      _getOffset(e, this.context.viewEl)
    );

    let p1 = startPoint.xy;
    let p2 = startPoint.xy;

    // 若shift key生效,
    if (this.isShift) {
      [p1, p2] = _getMaxPointByPoint(p1, ...this.lastPoint!);
    }

    const valid = this.selectByPoint(p1, p2, (items) => {
      const first = items.cells[0];

      if (!first) return false;

      // 行头&列头格用于实现行全选行, 跳过框选
      if (first.row.isHeader && first.column.isHeader) return false;

      if (
        isFunction(this.config.cellSelectable) &&
        !this.config.cellSelectable(first)
      ) {
        return false;
      }

      // 未按下控制键则清空已选中项
      if (!isMerge) {
        this.clearSelected();
      }

      return true;
    });

    // 没有有效选中项时不进行后续操作
    if (valid) {
      this.startPoint = startPoint;

      this.autoScrollBeforePosition = [this.table.x(), this.table.y()];

      if (!this.isShift) {
        this.lastPoint = [p1, p2];
      }
    }
  };

  /** 选取已开始, 并开始移动 */
  selectMove = throttle((e: MouseEvent) => {
    if (!this.startPoint) return;

    const zoom = this.table.zoom();

    const offset = _getOffset(e, this.context.viewEl);
    const zoomOffset = [offset[0] / zoom, offset[1] / zoom];

    this.moveDistance += Math.abs(
      this.startPoint.originX -
        zoomOffset[0] +
        this.startPoint.originY -
        zoomOffset[1]
    );

    const isMoved = this.moveDistance > 8;

    this.autoScroll.trigger(
      e.clientX,
      e.clientY,
      this.autoScrollConflictDisabledConfigGenerate(offset)
    );

    if (this.autoScroll.scrolling) return;

    const sX = (this.table.x() - this.autoScrollBeforePosition![0]) / zoom;
    const sY = (this.table.y() - this.autoScrollBeforePosition![1]) / zoom;

    const patchOffset: TablePosition = [zoomOffset[0] + sX, zoomOffset[1] + sY];

    let [p1, p2] = this.transformSelectedPoint(this.startPoint, patchOffset);

    if (isMoved) {
      this.moveFixedEdgeHandle(p2);
    }

    // 若shift key生效,
    if (this.isShift) {
      [p1, p2] = _getMaxPointByPoint(p2, ...this.lastPoint!);
    }

    this.selectByPoint(p1, p2);

    if (!this.isShift) {
      this.lastPoint = [p1, p2];
    }
  }, 10); // 这里会出现潜在的bug, 从固定区域以极快速度拖动到触发滚动靠边行为时, 自动滚动可能因为节流被跳过, 但正常操作下几乎不可能出现, 出于性能考虑暂时不做处理

  /** 选取结束 */
  selectEnd = () => {
    if (!this.startPoint) return;

    this.autoScroll.clear();

    const isRowChange = !isEmpty(this.selectedTempRows);
    const isCellChange = !isEmpty(this.selectedTempCells);

    Object.assign(this.selectedRows, this.selectedTempRows);
    Object.assign(this.selectedCells, this.selectedTempCells);

    this.autoScrollBeforePosition = null;
    this.startPoint = null;
    this.isShift = false;
    this.conflictDisableConfig = null;
    this.moveDistance = 0;
    this.clearTempSelected();
    isRowChange && this.table.event.rowSelect.emit();
    isCellChange && this.table.event.cellSelect.emit();
    this.table.event.select.emit();
  };

  /** 点击处理 */
  clickHandle = (cell: TableCell) => {
    if (this.config.rowSelectable === false) return;

    // 点击行&列头, 切换全选
    if (cell.row.isHeader && cell.column.isHeader) {
      const keys = Object.keys(this.selectedRows);

      this.clearSelected();

      if (!keys.length) {
        this.context.allRowKeys.forEach((key) => {
          this.setSelected(key, this.selectedRows);
        });
      }

      this.table.render();

      this.table.event.rowSelect.emit();
      this.table.event.select.emit();
    }
  };

  isSelectedTempRow = (key: TableKey) => !!this.selectedTempRows[key];

  isSelectedTempCell = (key: TableKey) => !!this.selectedTempCells[key];

  isSelectedRow: TableInstance["isSelectedRow"] = (key) =>
    !!this.selectedRows[key];

  isSelectedCell: TableInstance["isSelectedCell"] = (key) =>
    !!this.selectedCells[key];

  getSelectedRows: TableInstance["getSelectedRows"] = () => {
    const ls: TableRow[] = [];

    Object.keys(this.selectedRows).forEach((key) => {
      const row = this.table.getRow(key);
      ls.push(row);
    });

    ls.sort((a, b) => a.index - b.index);

    return ls;
  };

  getSelectedCells: TableInstance["getSelectedCells"] = () => {
    const rows: { [key: string]: TableCell[] } = {};
    const uniqCache: any = {}; // 保证行和单元格的选中不重复

    // 此处可能有潜在的性能问题

    const keyHandle = (key: string) => {
      const [rowKey, columnKey] = _getCellKeysByStr(key);
      const cell = this.table.getCell(rowKey, columnKey);

      // 跳过行头
      if (cell.column.isHeader) return;

      // 跳过已经处理过的单元格
      if (uniqCache[cell.key]) return;

      let ls: TableCell[] = rows[rowKey];

      if (!ls) {
        ls = [];
        rows[rowKey] = ls;
      }

      uniqCache[cell.key] = 1;

      ls.push(cell);
    };

    Object.keys(this.selectedRows).forEach((key) => {
      this.context.allColumnKeys.forEach((columnKey) => {
        keyHandle(_getCellKey(key, columnKey));
      });
    });
    Object.keys(this.selectedCells).forEach(keyHandle);

    return Object.entries(rows)
      .map(([, ls]) => {
        // 列排序
        return ls.sort((a, b) => a.column.index - b.column.index);
      })
      .sort((a, b) => a[0].row.index - b[0].row.index);
  };

  selectRows: TableInstance["selectRows"] = (rows, merge) => {
    if (this.config.rowSelectable === false) return;

    if (!merge) {
      this.clearSelected();
    }
    rows.forEach((key) => {
      this.setSelected(key, this.selectedRows);
    });

    this.table.render();
    this.table.event.rowSelect.emit();
    this.table.event.select.emit();
  };

  selectCells: TableInstance["selectCells"] = (cells, merge) => {
    if (this.config.cellSelectable === false) return;

    if (!merge) {
      this.clearSelected();
    }
    cells.forEach((key) => {
      this.setSelected(key, this.selectedCells);
    });
    this.table.render();
    this.table.event.cellSelect.emit();
    this.table.event.select.emit();
  };

  /**
   * 根据传入的两个点更新临时选中状态
   * - 可传入interceptor来根据命中内容决定是否阻止后续操作
   * - 若没有选中项或interceptor()验证失败, 返回false
   * */
  selectByPoint = (
    p1: TablePosition,
    p2?: TablePosition,
    interceptor?: (items: TableItems) => boolean
  ): boolean => {
    p2 = p2 || p1;

    const items = this.table.getAreaBound(p1, p2);

    if (interceptor) {
      const res = interceptor(items);
      if (!res) return false;
    }

    this.clearTempSelected();

    // 是否有选中项
    let hasSelected = false;

    items.cells.forEach((i) => {
      const row = i.row;
      const column = i.column;

      if (row.isHeader && column.isHeader) return;

      if (row.isHeader && !column.isHeader) return;

      hasSelected = true;

      // 选中行头时, 将行设置为选中状态
      if (column.isHeader && !row.isHeader) {
        this.setSelected(row, this.selectedTempRows);
        return;
      }

      this.setSelected(i, this.selectedTempCells);
    });

    hasSelected && this.table.render();

    return hasSelected;
  };

  /**
   * 向selected map中设置行选中, item可以是cell/row的key或实例, 所有设置操作统一在此进行, 方便进行禁用等行为的拦截
   * - 返回false表示该次设置被拦截
   * */
  setSelected(item: any, map: AnyObject): boolean {
    const isKey = isString(item);
    const key = isKey ? item : item.key;

    const isRow = map === this.selectedRows || map === this.selectedTempRows;
    const isCell = map === this.selectedCells || map === this.selectedTempCells;

    const rowSelectable = this.config.rowSelectable;
    const cellSelectable = this.config.cellSelectable;

    if (isRow) {
      if (isBoolean(rowSelectable) && !rowSelectable) return false;
      if (isFunction(rowSelectable)) {
        const row = isKey ? this.table.getRow(key) : item;
        const pass = rowSelectable(row);
        if (!pass) return false;
      }
    }

    if (isCell) {
      if (isBoolean(cellSelectable) && !cellSelectable) return false;
      if (isFunction(cellSelectable)) {
        let cell = item;

        if (isKey) {
          const [rowKey, columnKey] = _getCellKeysByStr(key);
          cell = this.table.getCell(rowKey, columnKey);
        }

        const pass = cellSelectable(cell);
        if (!pass) return false;
      }
    }

    map[key] = 1;

    return true;
  }

  /**
   * 处理固定项移动到边缘的自动滚动和常规拖动自动滚动两个行为的冲突
   * - 如果从固定项开始拖动, 则先禁用该方向的常规自动滚动, 等到移动到非固定项时再启用
   * */
  autoScrollConflictDisabledConfigGenerate(pos: TablePosition) {
    const sp = this.startPoint;

    if (!sp) return;

    const curPoint = this.table.transformViewportPoint(
      pos,
      _TableSelectPlugin.EDGE_SIZE / this.table.zoom()
    );

    if (!this.conflictDisableConfig) {
      // 禁用对应方向的开始位置
      this.conflictDisableConfig = {
        left: sp.leftFixed,
        right: sp.rightFixed,
        bottom: sp.bottomFixed,
        top: sp.topFixed,
      };
    }

    if (!curPoint.leftFixed && this.conflictDisableConfig.left) {
      this.conflictDisableConfig.left = false;
    }

    if (!curPoint.rightFixed && this.conflictDisableConfig.right) {
      this.conflictDisableConfig.right = false;
    }

    if (!curPoint.bottomFixed && this.conflictDisableConfig.bottom) {
      this.conflictDisableConfig.bottom = false;
    }

    if (!curPoint.topFixed && this.conflictDisableConfig.top) {
      this.conflictDisableConfig.top = false;
    }

    return this.conflictDisableConfig;
  }

  /** 框选点在固定区域末尾时, 如果滚动边未贴合, 将其滚动到贴合位置, 一是解决瞬间选择大量数据的问题, 二是更符合直觉, 放置误选 */
  moveFixedEdgeHandle([x, y]: TablePosition) {
    if (!this.conflictDisableConfig) return;

    const edgeSize = _TableSelectPlugin.EDGE_SIZE / this.table.zoom();

    const ctx = this.context;

    // 根据this.conflictDisableConfig可以判断是否从对应固定方向开始, 对应方向是否已失效

    if (ctx.leftFixedWidth && this.conflictDisableConfig.left) {
      const lS = this.context.leftFixedWidth;
      const lE = lS + edgeSize;

      if (x > lS && x <= lE) {
        const x = this.table.x();
        if (x !== 0) {
          this.table.x(0);
          this.autoScrollBeforePosition![0] = 0; // 主动变更了位置, 所以需要对其修正
        }
      }
    }

    if (ctx.topFixedHeight && this.conflictDisableConfig.top) {
      const tS = this.context.topFixedHeight;
      const tE = tS + edgeSize;

      if (y > tS && y <= tE) {
        const y = this.table.y();
        if (y !== 0) {
          this.table.y(0);
          this.autoScrollBeforePosition![1] = 0;
        }
      }
    }

    if (ctx.rightFixedWidth && this.conflictDisableConfig.right) {
      const contW = this.table.contentWidth();
      const rE = contW - ctx.rightFixedWidth;
      const rS = rE - edgeSize;

      const max = this.table.maxX();

      if (x > rS && x <= rE) {
        const x = this.table.x();
        if (x < max) {
          this.table.x(max);
          this.autoScrollBeforePosition![0] = max;
        }
      }
    }

    if (ctx.bottomFixedHeight && this.conflictDisableConfig.bottom) {
      const contH = this.table.contentHeight();
      const bE = contH - ctx.bottomFixedHeight;
      const bS = bE - edgeSize;

      const max = this.table.maxY();

      if (y > bS && y <= bE) {
        const y = this.table.y();
        if (y < max) {
          this.table.y(max);
          this.autoScrollBeforePosition![1] = max;
        }
      }
    }
  }

  /** 自动触发滚动便捷的修正位置 */
  getAutoScrollBound() {
    const zoom = this.table.zoom();
    return {
      top: this.context.topFixedHeight * zoom,
      left: this.context.leftFixedWidth * zoom,
      right: this.context.rightFixedWidth * zoom,
      bottom: this.context.bottomFixedHeight * zoom,
    };
  }

  /** 更新自动滚动判定点 */
  updateAutoScrollBound = () => {
    this.autoScroll.updateConfig({
      adjust: this.getAutoScrollBound(),
    });
  };

  clearSelected() {
    this.selectedRows = {};
    this.selectedCells = {};
  }

  clearTempSelected() {
    this.selectedTempRows = {};
    this.selectedTempCells = {};
  }

  /**
   * 专门用于框选的选区点转换
   * - 从固定区域拖选到非固定区域, 点非固定区开贴近固定区的位置开始计算点
   * - 从非固定区域拖动到固定区域, 若存在滚动位置, 则依然计算常规位置, 否则计算固定区位置
   * */
  transformSelectedPoint(
    startInfo: TablePointInfo,
    nowPoint: TablePosition
  ): [TablePosition, TablePosition] {
    const xDiff = nowPoint[0] - startInfo.originX;
    const yDiff = nowPoint[1] - startInfo.originY;

    const now: TablePosition = [startInfo.x + xDiff, startInfo.y + yDiff];

    return [startInfo.xy, now];
  }
}
