import { TablePlugin } from "../plugin.js";
import { BoundSize, isArray, isNumber, TupleNumber } from "@m78/utils";
import {
  TableCell,
  TableColumn,
  TableColumnConfig,
  TableGetter,
  TableItems,
  TableItemsFull,
  TableRow,
} from "../types.js";
import { _TableViewportPlugin } from "./viewport.js";
import { _addCls } from "../common.js";

export class _TableGetter extends TablePlugin implements TableGetter {
  init() {
    // 映射实现方法
    this.methodMapper(this.table, [
      "getBoundItems",
      "getViewportItems",
      "getRow",
      "getColumn",
      "getCell",
    ]);
  }

  /** 获取实际选区(处理fixed项) */
  getRealSelectBound(bound: BoundSize): BoundSize {
    return {} as any;
  }

  /** 内部使用的getBoundItems, 包含了几个额外返回 */
  getBoundItemsInner(
    target: BoundSize | TupleNumber,
    skipFixed = false
  ): TableItemsFull {
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

    let startRow: TableRow | undefined;
    let startColumn: TableColumn | undefined;

    const dataFixedSortList = this.context.dataFixedSortList;
    const columnsFixedSortList = this.context.columnsFixedSortList;

    // 最小可见行
    this.binarySearch(this.config.data, (_: any, index) => {
      const row = this.getRow(index);

      if (row.isFixed) return null;

      const offset = row.y;
      const size = row.height;

      const rangStart = y - size;

      // 视口边缘 - 尺寸 到 视口边缘的范围内视为第一项
      if (offset >= rangStart && offset <= y) {
        startRowIndex = index;
        endRowIndex = index;
        startRow = row;
        return 0;
      }

      if (offset > y) return 1;
      if (offset < y) return -1;
      return null;
    });

    // 最小可见列
    this.binarySearch(this.config.columns, (_: any, index) => {
      const column = this.getColumn(index);

      if (column.isFixed) return null;

      const offset = column.x;
      const size = column.width;

      const rangStart = x - size;

      // 等于或在最小可见范围(视口上方 + 尺寸)内
      if (offset >= rangStart && offset <= x) {
        startColumnIndex = index;
        endColumnIndex = index;
        startColumn = column;
        return 0;
      }

      if (offset > x) return 1;
      if (offset < x) return -1;
      return null;
    });

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

    const data = this.config.data;
    const columns = this.config.columns;

    // 开始项是fixed项: 遍历左侧fixed列表, fixed每次遍历检测下一项, 如果为普通项
    //

    if (startRow) {
      for (let i = startRowIndex; i < data.length; i++) {
        const row = this.getRow(i);

        if (skipFixed && row.isFixed) continue;

        if (row.y > y + height) break;

        rowList.push(row);
        endRowIndex = i;
      }
    }

    if (startColumn) {
      for (let i = startColumnIndex; i < columns.length; i++) {
        const column = this.getColumn(i);

        if (skipFixed && column.isFixed) continue;

        if (column.x > x + width) break;

        columnsList.push(column);
        endColumnIndex = i;
      }
    }

    const push = this.cellMergeHelper(cellList);

    // 截取可见区域cell
    rowList.forEach((row) => {
      const slice: TableCell[] = [];

      for (let i = startColumnIndex; i <= endColumnIndex; i++) {
        slice.push(this.getCell(row.index, i));
      }

      slice.forEach((cell) => {
        // 固定项单独处理
        if (cell.row.isFixed || cell.column.isFixed) return;

        if (push(cell)) return;

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

  getBoundItems(target: BoundSize | TupleNumber, skipFixed = false) {
    const { rows, columns, cells } = this.getBoundItemsInner(target, skipFixed);
    return {
      rows,
      columns,
      cells,
    };
  }

  getViewportItems(): TableItems {
    const table = this.table;
    const ctx = this.context;

    const viewport = this.getPlugin(_TableViewportPlugin)!;

    // 截取非fixed区域内容

    const x = Math.min(
      table.x() / this.table.zoom() + ctx.leftFixedWidth,
      viewport.contentWidth()
    );

    const y = Math.min(
      table.y() / this.table.zoom() + ctx.topFixedHeight,
      viewport.contentHeight()
    );

    const width = Math.max(
      this.table.width() / this.table.zoom() -
        ctx.rightFixedWidth -
        ctx.leftFixedWidth,
      0
    );

    const height = Math.max(
      this.table.height() / this.table.zoom() -
        ctx.bottomFixedHeight -
        ctx.topFixedHeight,
      0
    );

    const items = this.getBoundItemsInner(
      {
        left: x,
        top: y,
        width: width,
        height: height,
      },
      true
    );

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

    // 固定项处理, 由于已知当前区域的x/y轴开始结束索引, 所以按相同区域从fixed行和列中截取等量的数据即可

    const push = this.cellMergeHelper(cells);

    const lf = ctx.leftFixedList.map((index) => this.getColumn(index));
    const rf = ctx.rightFixedList.map((index) => this.getColumn(index));

    [...lf, ...rf].forEach((column) => {
      // 截取固定列中可见单元格
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cell = this.getCell(i, column.index);
        if (cell.row.isFixed) continue;
        if (push(cell)) continue;
        cells.push(cell);
      }
    });

    columns.unshift(...lf);
    columns.push(...rf);

    const tf = ctx.topFixedList.map((index) => this.getRow(index));
    const bf = ctx.bottomFixeList.map((index) => this.getRow(index));

    const temp: any[] = [];
    const push2 = this.cellMergeHelper(temp);

    [...tf, ...bf].forEach((row) => {
      // 截取固定行中可用单元格
      for (let i = startColumnIndex!; i <= endColumnIndex!; i++) {
        const cell = this.getCell(row.index, i);
        if (cell.column.isFixed) continue;
        if (push(cell)) continue;
        cells.push(cell);
      }

      // 添加四个角的固定项
      [...ctx.leftFixedList, ...ctx.rightFixedList].forEach((index) => {
        const cell = this.getCell(row.index, index);
        if (push2(cell)) return;
        temp.push(cell);
      });
    });

    rows.unshift(...tf);
    rows.push(...bf);
    cells.push(...temp);

    return {
      rows,
      columns,
      cells,
    };
  }

  /** 获取指定行的TableRow */
  getRow(index: number): TableRow {
    const ctx = this.context;
    const cache = ctx.rowCache[index];

    if (cache) return cache;

    const conf = this.config.rows![index] || {};
    const height = isNumber(conf.height) ? conf.height : this.config.rowHeight!;
    const data = this.config.data[index];

    const row: TableRow = {
      key: data[this.config.primaryKey],
      height,
      index,
      y: this.getBeforeSizeY(index),
      config: conf,
      data: this.config.data[index],
      isFixed: !!conf.fixed,
      isEven: this.getEven(index, true),
    };

    if (row.isFixed) {
      const tf = ctx.topFixedMap[index];
      if (tf) row.fixedOffset = tf.viewPortOffset;
      const bf = ctx.bottomFixedMap[index];
      if (bf) row.fixedOffset = bf.viewPortOffset;
    }

    ctx.rowCache[index] = row;

    return row;
  }

  /** 获取指定列的TableColumn */
  getColumn(index: number): TableColumn {
    const ctx = this.context;
    const cache = ctx.columnCache[index];

    if (cache) return cache;

    const conf = this.config.columns[index];
    const width = isNumber(conf.width) ? conf.width : this.config.columnWidth!;

    const column: TableColumn = {
      key: conf.key,
      width,
      index,
      x: this.getBeforeSizeX(index),
      config: conf,
      isFixed: !!conf.fixed,
      isEven: this.getEven(index, false),
    };

    if (column.isFixed) {
      const lf = ctx.leftFixedMap[index];
      if (lf) column.fixedOffset = lf.viewPortOffset;
      const rf = ctx.rightFixedMap[index];
      if (rf) column.fixedOffset = rf.viewPortOffset;
    }

    ctx.columnCache[index] = column;

    return column;
  }

  /** 获取指定行, 列坐标对应的TableCell */
  getCell(rowIndex: number, columnIndex: number): TableCell {
    const key = `${rowIndex}_${columnIndex}`;

    const ctx = this.context;
    const cache = ctx.cellCache[key];

    if (cache) return cache;

    const row = this.getRow(rowIndex);
    const column = this.getColumn(columnIndex);
    const config = this.config.cells![key] || {};

    const cell: TableCell = {
      row,
      column,
      key,
      config,
      dom: null as any, // late
      isMount: false,
      text: "",
      isFixed: column.isFixed || row.isFixed,
      isCrossFixed: column.isFixed && row.isFixed,
      isLastX:
        columnIndex === ctx.lastColumnIndex ||
        columnIndex === ctx.lastFixedColumnIndex ||
        !!ctx.lastMergeXMap[key],
      isLastY:
        rowIndex === ctx.lastRowIndex ||
        rowIndex === ctx.lastFixedRowIndex ||
        !!ctx.lastMergeYMap[key],
      state: {},
    };

    this.initCellDom(cell);

    ctx.cellCache[key] = cell;

    return cell;
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
    dom.className = "m78-table_cell";

    dom.style.width = `${width}px`;
    dom.style.height = `${height}px`;

    // 边缘边框处理
    if (cell.isFixed) {
      dom.style.zIndex = cell.isCrossFixed ? "20" : "10";

      if (ctx.rightFixedList[0] === column.index) {
        _addCls(dom, "m78-table_rf-first");
      }
      if (ctx.bottomFixeList[0] === row.index) {
        _addCls(dom, "m78-table_bf-first");
      }
    }

    if (cell.isLastX) {
      dom.style.borderRight = "none";
    }

    if (cell.isLastY) {
      dom.style.borderBottom = "none";
    }

    cell.dom = dom;
  }

  /** 处理merge项, 防止cell列表重复推入相同项, 并在确保cell中包含被合并项的父项, 回调返回true时表示以处理, 需要跳过后续流程 */
  cellMergeHelper(list: TableCell[]): (cell: TableCell) => boolean {
    const existCache: any = {};

    return (cell: TableCell) => {
      const key = `${cell.row.index}_${cell.column.index}`;
      if (existCache[key]) return true;
      existCache[key] = true;

      // 跳过被合并项, 并确保被合并项的主单元格存在
      if (this.getMergeData(cell)) {
        list.push(cell);
        return true;
      }

      const merged = this.getMergedData(cell);

      if (merged) {
        list.push(this.getCell(merged[0], merged[1]));
        return true;
      }

      return false;
    };
  }

  /** 检测是否是合并项 */
  getMergeData(cell: TableCell) {
    const key = `${cell.row.index}_${cell.column.index}`;
    return this.context.mergeMapMain[key];
  }

  /** 检测是否是被合并项 */
  getMergedData(cell: TableCell) {
    const key = `${cell.row.index}_${cell.column.index}`;
    return this.context.mergeMapSub[key];
  }

  /** 获取指定列左侧的距离 */
  getBeforeSizeX(index: number) {
    const fixedLeft = this.context.leftFixedMap[index];

    if (fixedLeft) {
      return fixedLeft.offset;
    }

    const fixedRight = this.context.rightFixedMap[index];

    if (fixedRight) {
      return fixedRight.offset;
    }

    const { columns, columnWidth } = this.config;
    const max = Math.min(index, columns.length);

    // 预测左侧使用宽度, 乘索引数量是因为, 比如当前索引为2, 那前面实际是有0, 1两个索引的
    let x = columnWidth! * index + this.context.leftFixedWidth;

    for (let i = 0; i < max; i++) {
      const cur = columns[i];

      if (cur.width && !cur.fixed) {
        x = x + cur.width - columnWidth!;
      }

      // 固定项尺寸已在前面计算, 这里扣除掉
      if (cur.fixed) {
        x = x - (isNumber(cur.width) ? cur.width : columnWidth!);
      }
    }

    return x;
  }

  /** 获取指定行上方的距离 */
  getBeforeSizeY(index: number) {
    const fixedTop = this.context.topFixedMap[index];

    if (fixedTop) {
      return fixedTop.offset;
    }

    const fixedBottom = this.context.bottomFixedMap[index];

    if (fixedBottom) {
      return fixedBottom.offset;
    }

    const { rows, rowHeight } = this.config;

    let y = rowHeight! * index + this.context.topFixedHeight;

    // 对配置了高度的项进行修正
    this.context.rowConfigNumberKeys.forEach((ind) => {
      if (ind >= index) return;

      const cur = rows![ind];

      if (cur.height && !cur.fixed) {
        y = y + cur.height - rowHeight!;
      }

      // 固定项尺寸已在前面计算, 这里扣除掉
      if (cur.fixed) {
        y = y - (isNumber(cur.height) ? cur.height : rowHeight!);
      }
    });

    return y;
  }

  /** 获取行/列是否为奇偶项(需要处理中间穿插的固定项, 直接用index不准确) */
  getEven(index: number, isRow: boolean) {
    const ctx = this.context;

    const allFixed = isRow
      ? [...ctx.topFixedList, ...ctx.bottomFixeList]
      : [...ctx.leftFixedList, ...ctx.rightFixedList];

    // 前方的固定项
    const beforeFixed = isRow ? ctx.topFixedList : ctx.leftFixedList;

    // 是左侧固定项时
    const beforeInd = beforeFixed.indexOf(index);
    if (beforeInd !== -1) return beforeInd % 2 === 0;

    // 后方的固定项
    const afterFixed = isRow ? ctx.bottomFixeList : ctx.rightFixedList;

    // 除fixed项外左侧总长度
    const allLeftLength = isRow
      ? this.config.data.length - afterFixed.length
      : this.config.columns.length - afterFixed.length;

    // 是右侧固定项时
    const afterInd = afterFixed.indexOf(index);
    if (afterInd !== -1) return (afterInd + allLeftLength) % 2 === 0;

    const diff = allFixed.filter((i) => i < index).length;

    // 当前索引 + 左侧固定项数 - 该项之前的项的固定项数
    return (index + beforeFixed.length - diff) % 2 === 0;
  }

  /** 二分查找, 包含了对无效项的处理 */
  binarySearch(
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

  getRealDataIndex(ind: number): number {
    return this.context.dataFixedSortList[ind];
  }

  getRealColumnsIndex(ind: number) {
    return this.context.columnsFixedSortList[ind];
  }
}
