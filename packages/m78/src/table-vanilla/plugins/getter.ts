import { TablePlugin } from "../plugin.js";
import {
  BoundSize,
  getNamePathValue,
  isArray,
  isNumber,
  throwError,
  TupleNumber,
} from "@m78/utils";
import {
  _TablePrivateProperty,
  TableCell,
  TableColumn,
  TableGetter,
  TableItems,
  TableItemsFull,
  TableKey,
  TablePointInfo,
  TablePosition,
  TableRow,
  TableRowFixed,
} from "../types.js";
import { _TableViewportPlugin } from "./viewport.js";
import { _getBoundByPoint, _getCellKey, _prefix } from "../common.js";
import clamp from "lodash/clamp.js";

export class _TableGetterPlugin extends TablePlugin implements TableGetter {
  init() {
    // 映射实现方法
    this.methodMapper(this.table, [
      "getBoundItems",
      "getViewportItems",
      "getAreaBound",
      "transformViewportPoint",
      "transformContentPoint",
      "getRow",
      "getColumn",
      "getCell",
      "getKeyByRowIndex",
      "getKeyByColumnIndex",
      "getIndexByRowKey",
      "getIndexByColumnKey",
      "isRowExist",
      "isColumnExist",
    ]);
  }

  transformViewportPoint([x, y]: TablePosition): TablePointInfo {
    const ctx = this.context;

    // 需要处理缩放, 缩放后, 实际显示的内容变多了, 但我们节点的绝对坐标是一样的, 将缩放后的点转换为正常尺寸点再参与计算即可
    const zoom = this.table.zoom();

    x = x / zoom;
    y = y / zoom;

    const lStart = 0;
    const lEnd = lStart + ctx.leftFixedWidth;

    const tStart = 0;
    const tEnd = tStart + ctx.topFixedHeight;

    const bEnd = this.table.height() / zoom;
    const bStart = bEnd - ctx.bottomFixedHeight;

    const rEnd = this.table.width() / zoom;
    const rStart = rEnd - ctx.rightFixedWidth;

    const isFixedLeft = x >= lStart && x <= lEnd;
    const isFixedTop = y >= tStart && y <= tEnd;
    const isFixedBottom = y >= bStart && y <= bEnd;
    const isFixedRight = x >= rStart && x <= rEnd;

    let realX = x + this.table.x() / zoom;
    let realY = y + this.table.y() / zoom;

    if (isFixedLeft) {
      realX = x;
    }

    if (isFixedRight) {
      const diffW = rEnd - x;
      realX = this.table.contentWidth() - diffW;
    }

    if (isFixedTop) {
      realY = y;
    }

    if (isFixedBottom) {
      const diffH = bEnd - y;
      realY = this.table.contentHeight() - diffH;
    }

    return {
      leftFixed: isFixedLeft,
      topFixed: isFixedTop,
      rightFixed: isFixedRight,
      bottomFixed: isFixedBottom,
      x: realX,
      y: realY,
      xy: [realX, realY],
    };
  }

  transformContentPoint(pos: TablePosition): TablePointInfo {
    const contW = this.table.contentWidth();
    const contH = this.table.contentHeight();

    const zoom = this.table.zoom();

    // 基础位置, 限制在可用区域内
    const x = clamp(pos[0], 0, contW) / zoom;
    const y = clamp(pos[1], 0, contH) / zoom;

    const lStart = 0;
    const lEnd = this.context.leftFixedWidth;
    const tStart = 0;
    const tEnd = this.context.topFixedHeight;
    const rStart = contW - this.context.rightFixedWidth;
    const rEnd = contW / zoom;
    const bStart = contH - this.context.bottomFixedHeight;
    const bEnd = contH / zoom;

    const isFixedLeft = x >= lStart && x <= lEnd;
    const isFixedTop = y >= tStart && y <= tEnd;
    const isFixedRight = x >= rStart && x <= rEnd;
    const isFixedBottom = y >= bStart && y <= bEnd;

    let realX = x - this.table.x() / zoom;
    let realY = y - this.table.y() / zoom;

    if (isFixedLeft) {
      realX = x;
    }

    if (isFixedRight) {
      const diffW = rEnd - x;
      realX = this.table.width() - diffW;
    }

    if (isFixedTop) {
      realY = y;
    }

    if (isFixedBottom) {
      const diffH = bEnd - y;
      realY = this.table.height() - diffH;
    }

    return {
      leftFixed: isFixedLeft,
      topFixed: isFixedTop,
      rightFixed: isFixedRight,
      bottomFixed: isFixedBottom,
      x: realX,
      y: realY,
      xy: [realX, realY],
    };
  }

  getAreaBound(p1: TablePosition, p2?: TablePosition): TableItems {
    p2 = p2 || p1;

    return this.getBoundItems(_getBoundByPoint(p1, p2));
  }

  getBoundItems(
    target: BoundSize | TablePosition,
    skipFixed = false
  ): TableItems {
    const { rows, columns, cells } = this.getBoundItemsInner(target, skipFixed);
    return {
      rows,
      columns,
      cells,
    };
  }

  /**
   * 内部使用的getBoundItems, 包含了startRowIndex等额外返回
   * - 注意, 返回的index均对应dataFixedSortList/columnsFixedSortList而不是配置中的data
   * */
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

    // 这里使用二分搜索先查找到可见的第一个行和列, 然后对它们后方的项进行遍历, 取所有可见节点, 避免循环整个列表

    let startRow: TableRow | undefined;
    let startColumn: TableColumn | undefined;

    const { data, columns } = this.context;

    // 对行或列执行二分搜索
    const binarySearchHandle = (isRow: boolean) => {
      return (item: any, index: number) => {
        const key = isRow ? item[this.config.primaryKey] : item.key;
        const cur: any = isRow ? this.getRow(key) : this.getColumn(key);

        const xORy = isRow ? y : x;

        if (getNamePathValue(item, _TablePrivateProperty.ignore)) return null;

        if (skipFixed && cur.isFixed) return null;

        const offset = isRow ? cur.y : cur.x;
        const size = isRow ? cur.height : cur.width;

        const rangStart = xORy - size;

        // 视口边缘 - 尺寸 到 视口边缘的范围内视为第一项
        if (offset >= rangStart && offset <= xORy) {
          if (isRow) {
            startRowIndex = index;
            endRowIndex = startRowIndex;
            startRow = cur;
          } else {
            startColumnIndex = index;
            endColumnIndex = startColumnIndex;
            startColumn = cur;
          }
          return 0;
        }

        if (offset > xORy) return 1;
        if (offset < xORy) return -1;
        return null;
      };
    };

    // 最小可见行
    this.binarySearch(data, binarySearchHandle(true));

    // 最小可见列
    this.binarySearch(columns, binarySearchHandle(false));

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
      for (let i = startRowIndex; i < data.length; i++) {
        const key = this.getKeyByRowIndex(i);
        const row = this.getRow(key);

        if (getNamePathValue(data[i], _TablePrivateProperty.ignore)) continue;

        if (skipFixed && row.isFixed) continue;

        if (row.y > y + height) break;

        rowList.push(row);
        endRowIndex = i;
      }
    }

    if (startColumn) {
      for (let i = startColumnIndex; i < columns.length; i++) {
        const key = this.getKeyByColumnIndex(i);
        const column = this.getColumn(key);

        if (getNamePathValue(columns[i], _TablePrivateProperty.ignore))
          continue;

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
        if (getNamePathValue(columns[i], _TablePrivateProperty.ignore))
          continue;
        slice.push(this.getCell(row.key, this.getKeyByColumnIndex(i)));
      }

      slice.forEach((cell) => {
        if (getNamePathValue(cell.row.data, _TablePrivateProperty.ignore))
          return;

        // 固定项单独处理
        if (skipFixed && (cell.row.isFixed || cell.column.isFixed)) return;

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

  getViewportItems(): TableItems {
    const table = this.table;
    const ctx = this.context;

    const viewport = this.getPlugin(_TableViewportPlugin);

    // 截取非fixed区域内容

    // ZOOM: #6  缩放时, 元素的实际尺寸发生了改变, 但是我们记录的位置是不变的, 所以只需要把要显示的内容区域和滚动位置进行伸守计算
    const zoom = this.table.zoom();

    const x = Math.min(
      table.x() / zoom + ctx.leftFixedWidth,
      viewport.contentWidth()
    );

    const y = Math.min(
      table.y() / zoom + ctx.topFixedHeight,
      viewport.contentHeight()
    );

    const width = Math.max(
      this.table.width() / zoom - ctx.rightFixedWidth - ctx.leftFixedWidth,
      0
    );

    const height = Math.max(
      this.table.height() / zoom - ctx.bottomFixedHeight - ctx.topFixedHeight,
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

    const lf = ctx.leftFixedList.map((key) => this.getColumn(key));
    const rf = ctx.rightFixedList.map((key) => this.getColumn(key));

    [...lf, ...rf].forEach((column) => {
      // 截取固定列中可见单元格
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cell = this.getCell(this.getKeyByRowIndex(i), column.key);
        if (cell.row.isFixed) continue;
        if (push(cell)) continue;
        cells.push(cell);
      }
    });

    columns.unshift(...lf);
    columns.push(...rf);

    const tf = ctx.topFixedList.map((key) => this.getRow(key));
    const bf = ctx.bottomFixeList.map((key) => this.getRow(key));

    const temp: any[] = [];
    const push2 = this.cellMergeHelper(temp);

    [...tf, ...bf].forEach((row) => {
      // 截取固定行中可用单元格
      for (let i = startColumnIndex!; i <= endColumnIndex!; i++) {
        const cell = this.getCell(row.key, this.getKeyByColumnIndex(i));
        if (cell.column.isFixed) continue;
        if (push(cell)) continue;
        cells.push(cell);
      }

      // 添加四个角的固定项
      [...ctx.leftFixedList, ...ctx.rightFixedList].forEach((key) => {
        const cell = this.getCell(row.key, key);
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
  getRow(key: TableKey): TableRow {
    const ctx = this.context;
    const cache = ctx.rowCache[key];

    if (cache) return cache;

    const index = ctx.dataKeyIndexMap[key];

    const conf = ctx.rows![key] || {};
    const height = isNumber(conf.height) ? conf.height : this.config.rowHeight!;
    const data = ctx.data[index];

    const beforeIgnoreLength = ctx.ignoreYList.filter((i) => i < index).length;

    const realIndex = index - beforeIgnoreLength;

    const row: TableRow = {
      key: data[this.config.primaryKey],
      height,
      index: realIndex,
      y: this.getBeforeSizeY(index),
      config: conf,
      data,
      isFixed: !!conf.fixed,
      isEven: realIndex % 2 === 0,
      isHeader: ctx.yHeaderKeys.includes(key),
    };

    if (row.isFixed) {
      const tf = ctx.topFixedMap[key];
      if (tf) row.fixedOffset = tf.viewPortOffset;
      const bf = ctx.bottomFixedMap[key];
      if (bf) row.fixedOffset = bf.viewPortOffset;
    }

    ctx.rowCache[key] = row;

    return row;
  }

  getColumn(key: TableKey): TableColumn {
    const ctx = this.context;
    const cache = ctx.columnCache[key];

    if (cache) return cache;

    const index = ctx.columnKeyIndexMap[key];

    const conf = ctx.columns[index];
    const width = isNumber(conf.width) ? conf.width : this.config.columnWidth!;

    const beforeIgnoreLength = ctx.ignoreXList.filter((i) => i < index).length;

    const realIndex = index - beforeIgnoreLength;

    const column: TableColumn = {
      key: conf.key,
      width,
      index: realIndex,
      x: this.getBeforeSizeX(index),
      config: conf,
      isFixed: !!conf.fixed,
      isEven: realIndex % 2 === 0,
      isHeader: ctx.xHeaderKey === key,
    };

    if (column.isFixed) {
      const lf = ctx.leftFixedMap[key];
      if (lf) column.fixedOffset = lf.viewPortOffset;
      const rf = ctx.rightFixedMap[key];
      if (rf) column.fixedOffset = rf.viewPortOffset;
    }

    ctx.columnCache[key] = column;

    return column;
  }

  /** 获取指定行, 列坐标对应的TableCell */
  getCell(rowKey: TableKey, columnKey: TableKey): TableCell {
    const key = _getCellKey(rowKey, columnKey);

    const ctx = this.context;
    const cache = ctx.cellCache[key];

    if (cache) return cache;

    const row = this.getRow(rowKey);
    const column = this.getColumn(columnKey);
    const config = ctx.cells![key] || {};

    const cell: TableCell = {
      row,
      column,
      key,
      config,
      isMount: false,
      text: "",
      isFixed: column.isFixed || row.isFixed,
      isCrossFixed: column.isFixed && row.isFixed,
      isLastX:
        columnKey === ctx.lastColumnKey ||
        columnKey === ctx.lastFixedColumnKey ||
        !!ctx.lastMergeXMap[key],
      isLastY:
        rowKey === ctx.lastRowKey ||
        rowKey === ctx.lastFixedRowKey ||
        !!ctx.lastMergeYMap[key],
      state: {},
    };

    ctx.cellCache[key] = cell;

    return cell;
  }

  /** 获取指定列左侧的距离 */
  getBeforeSizeX(index: number) {
    const { columns } = this.context;
    const cur = columns[index];
    const key = cur.key;

    const fixedLeft = this.context.leftFixedMap[key];

    if (fixedLeft) {
      return fixedLeft.offset;
    }

    const fixedRight = this.context.rightFixedMap[key];

    if (fixedRight) {
      return fixedRight.offset;
    }

    const { columnWidth } = this.config;

    const max = Math.min(index, columns.length);

    const leftIgnoreLength = this.context.ignoreXList.filter(
      (i) => i < index
    ).length;

    // 预测左侧使用宽度
    let x = columnWidth! * (index - leftIgnoreLength);

    for (let i = 0; i < max; i++) {
      const cur = columns[i];

      if (getNamePathValue(cur, _TablePrivateProperty.ignore)) continue;

      if (cur.width) {
        x = x + cur.width - columnWidth!;
      }
    }

    return x;
  }

  /** 获取指定行上方的距离 */
  getBeforeSizeY(index: number) {
    const key = this.getKeyByRowIndex(index);

    const fixedTop = this.context.topFixedMap[key];

    if (fixedTop) {
      return fixedTop.offset;
    }

    const fixedBottom = this.context.bottomFixedMap[key];

    if (fixedBottom) {
      return fixedBottom.offset;
    }

    const { rowHeight } = this.config;
    const { rows } = this.context;

    const topIgnoreLength = this.context.ignoreYList.filter(
      (i) => i < index
    ).length;

    let y = rowHeight! * (index - topIgnoreLength);

    // 对配置了高度的项进行修正
    this.context.rowConfigNumberKeys.forEach((k) => {
      const cur = rows![k];

      if (getNamePathValue(cur, _TablePrivateProperty.ignore)) return;

      const ind = this.getIndexByRowKey(k);

      // 大于当前行或非顶部固定项跳过
      if (ind >= index && cur.fixed !== TableRowFixed.top) return;

      if (cur.height) {
        y = y + cur.height - rowHeight!;
      }
    });

    return y;
  }

  /** 二分查找, 包含了对无效项的处理, 返回分别表示:  小于, 等于, 大于, 无效 , 当处于无效项时, 需要向前左/右选区第一个有效项后继续 */
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

  getKeyByRowIndex(ind: number): TableKey {
    const cur = this.context.data[ind];
    const key = cur[this.config.primaryKey];
    if (key === undefined) {
      console.warn(
        `[Table] primaryKey: ${this.config.primaryKey} does not exist in data on row ${ind}`
      );
    }
    return key;
  }

  getKeyByColumnIndex(ind: number): TableKey {
    const cur = this.context.columns[ind];
    const key = cur.key;
    if (key === undefined) {
      console.warn(`[Table] key: No key with index ${ind} exists`);
    }
    return key;
  }

  getIndexByRowKey(key: TableKey): number {
    const ind = this.context.dataKeyIndexMap[key];
    if (key === undefined) {
      console.warn(
        `[Table]: row key ${key} does not have a corresponding index`
      );
    }
    return ind;
  }

  getIndexByColumnKey(key: TableKey): number {
    const ind = this.context.columnKeyIndexMap[key];
    if (key === undefined) {
      console.warn(
        `[Table]: column key ${key} does not have a corresponding index`
      );
    }
    return ind;
  }

  getKeyByRowData(cur: any): string {
    const key = cur[this.config.primaryKey];

    if (key === undefined || key === null) {
      throwError(`No key obtained. ${JSON.stringify(cur, null, 4)}`, _prefix);
    }

    return key;
  }

  isColumnExist(key: TableKey): boolean {
    return this.context.columnKeyIndexMap[key] !== undefined;
  }

  isRowExist(key: TableKey): boolean {
    return this.context.dataKeyIndexMap[key] !== undefined;
  }

  /** 处理merge项, 防止cell列表重复推入相同项, 并在确保cell中包含被合并项的父项, 回调返回true时表示以处理, 需要跳过后续流程 */
  cellMergeHelper(list: TableCell[]): (cell: TableCell) => boolean {
    const existCache: any = {};

    return (cell: TableCell) => {
      if (existCache[cell.key]) return true;
      existCache[cell.key] = true;

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

  /** 获取合并信息, 若有返回则表示是一个合并项 */
  getMergeData(cell: TableCell) {
    return this.context.mergeMapMain[cell.key];
  }

  /** 获取被合并信息, 若有返回则表示是一个被合并项 */
  getMergedData(cell: TableCell) {
    return this.context.mergeMapSub[cell.key];
  }
}
