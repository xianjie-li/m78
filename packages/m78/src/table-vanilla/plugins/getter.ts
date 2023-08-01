import { TablePlugin } from "../plugin.js";
import {
  BoundSize,
  getNamePathValue,
  isArray,
  isNumber,
  isString,
  isTruthyOrZero,
  setNamePathValue,
  throwError,
  TupleNumber,
} from "@m78/utils";
import {
  _getBoundByPoint,
  _getCellKey,
  _getCellKeysByStr,
  _prefix,
} from "../common.js";
import {
  _TablePrivateProperty,
  TableKey,
  TablePosition,
  TableRowFixed,
} from "../types/base-type.js";

import {
  TableCell,
  TableColumn,
  TableItems,
  TableItemsFull,
  TableRow,
} from "../types/items.js";
import { TableMergeData } from "../types/context.js";
import { _TableHidePlugin } from "./hide.js";
import { Position } from "../../common/index.js";

export class _TableGetterPlugin extends TablePlugin implements TableGetter {
  hide: _TableHidePlugin;

  beforeInit() {
    // 映射实现方法
    this.methodMapper(this.table, [
      "getX",
      "getY",
      "getXY",
      "getMaxX",
      "getMaxY",
      "getWidth",
      "getHeight",
      "getContentWidth",
      "getContentHeight",
      "getBoundItems",
      "getViewportItems",
      "getAreaBound",
      "getRow",
      "getColumn",
      "getCell",
      "getCellKey",
      "getCellByStrKey",
      "getNearCell",
      "getKeyByRowIndex",
      "getKeyByColumnIndex",
      "getIndexByRowKey",
      "getIndexByColumnKey",
      "getKeyByRowData",
      "getMergedData",
      "getMergeData",
      "getAttachPosition",
      "getColumnAttachPosition",
      "getRowAttachPosition",
    ]);
  }

  init() {
    this.hide = this.getPlugin(_TableHidePlugin);
  }

  getContentHeight(): number {
    if (this.config.autoSize) {
      return this.context.contentHeight;
    } else {
      // 见contentWidth()
      return Math.max(this.context.contentHeight, this.table.getHeight());
    }
  }

  getContentWidth(): number {
    if (this.config.autoSize) {
      return this.context.contentWidth;
    } else {
      // 无自动尺寸时, 内容尺寸不小于容器尺寸, 否则xy()等计算会出现问题
      return Math.max(this.context.contentWidth, this.table.getWidth());
    }
  }

  getMaxX(): number {
    return this.context.viewEl.scrollWidth - this.context.viewEl.clientWidth;
  }

  getMaxY(): number {
    return this.context.viewEl.scrollHeight - this.context.viewEl.clientHeight;
  }

  getHeight(): number {
    return this.config.el.clientHeight;
  }

  getWidth(): number {
    return this.config.el.clientWidth;
  }

  getX(): number {
    return this.context.viewEl.scrollLeft;
  }

  getY(): number {
    return this.context.viewEl.scrollTop;
  }

  getXY(): TablePosition {
    const ctx = this.context;
    const viewEl = ctx.viewEl;

    return [viewEl.scrollLeft, viewEl.scrollTop];
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
  private getBoundItemsInner(
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

        if (getNamePathValue(item, _TablePrivateProperty.ignore)) return null;

        const cur: any = isRow ? this.getRow(key) : this.getColumn(key);

        const xORy = isRow ? y : x;

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

        if (getNamePathValue(data[i], _TablePrivateProperty.ignore)) continue;

        const row = this.getRow(key);

        if (skipFixed && row.isFixed) continue;

        if (row.y > y + height) break;

        rowList.push(row);
        endRowIndex = i;
      }
    }

    if (startColumn) {
      for (let i = startColumnIndex; i < columns.length; i++) {
        const key = this.getKeyByColumnIndex(i);

        if (getNamePathValue(columns[i], _TablePrivateProperty.ignore))
          continue;

        const column = this.getColumn(key);

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

    // 截取非fixed区域内容

    const x = Math.min(
      table.getX() + ctx.leftFixedWidth,
      this.table.getContentWidth()
    );

    const y = Math.min(
      table.getY() + ctx.topFixedHeight,
      this.table.getContentHeight()
    );

    const width = Math.max(
      this.table.getWidth() - ctx.rightFixedWidth - ctx.leftFixedWidth,
      0
    );

    const height = Math.max(
      this.table.getHeight() - ctx.bottomFixedHeight - ctx.topFixedHeight,
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

    const lf = ctx.leftFixedList
      .map((key) => this.getColumn(key))
      .filter((i) => !getNamePathValue(i.config, _TablePrivateProperty.ignore));
    const rf = ctx.rightFixedList
      .map((key) => this.getColumn(key))
      .filter((i) => !getNamePathValue(i.config, _TablePrivateProperty.ignore));

    [...lf, ...rf].forEach((column) => {
      // 截取固定列中可见单元格
      for (let i = startRowIndex; i <= endRowIndex; i++) {
        const cell = this.getCell(this.getKeyByRowIndex(i), column.key);
        if (
          cell.row.isFixed ||
          getNamePathValue(cell.row.data, _TablePrivateProperty.ignore)
        )
          continue;
        if (push(cell)) continue;
        cells.push(cell);
      }
    });

    columns.unshift(...lf);
    columns.push(...rf);

    const tf = ctx.topFixedList.map((key) => this.getRow(key));
    const bf = ctx.bottomFixeList.map((key) => this.getRow(key));

    [...tf, ...bf].forEach((row) => {
      // 截取固定行中可用单元格
      for (let i = startColumnIndex!; i <= endColumnIndex!; i++) {
        const curConf = this.context.columns[i];
        if (getNamePathValue(curConf, _TablePrivateProperty.ignore)) continue;

        const cell = this.getCell(row.key, this.getKeyByColumnIndex(i));

        if (cell.column.isFixed) continue;
        if (push(cell)) continue;

        cells.push(cell);
      }

      // 添加四个角的固定项
      [...ctx.leftFixedList, ...ctx.rightFixedList].forEach((key) => {
        const cell = this.getCell(row.key, key);
        if (getNamePathValue(cell.column.config, _TablePrivateProperty.ignore))
          return;
        if (getNamePathValue(cell.row.data, _TablePrivateProperty.ignore))
          return;
        if (push(cell)) return;
        cells.push(cell);
      });
    });

    rows.unshift(...tf);
    rows.push(...bf);

    return {
      rows,
      columns,
      cells,
    };
  }

  /** 获取指定行的实例, useCache为false时会跳过缓存重新计算关键属性, 并将最新内容写入缓存 */
  getRow(key: TableKey, useCache = true): TableRow {
    const ctx = this.context;
    let row = ctx.rowCache[key];

    const lastKeyNotEqual =
      !!row &&
      getNamePathValue(row, _TablePrivateProperty.reloadKey) !==
        ctx.lastReloadKey;

    // 是否需要刷新缓存
    const needFresh = !useCache || lastKeyNotEqual;

    if (!row) {
      // 新建
      row = this.getFreshRow(key);
      ctx.rowCache[key] = row;
    } else if (needFresh) {
      // 更新缓存
      const fresh = this.getFreshRow(key);
      Object.assign(row, fresh);
    }

    setNamePathValue(row, _TablePrivateProperty.reloadKey, ctx.lastReloadKey);

    return row;
  }

  /** 跳过缓存获取最新的row */
  private getFreshRow(key: TableKey): TableRow {
    const ctx = this.context;

    const index = ctx.dataKeyIndexMap[key];

    if (!isNumber(index)) {
      throwError(`row key ${key} is invalid`, _prefix);
    }

    const conf = ctx.rows![key] || {};
    const height = isNumber(conf.height) ? conf.height : this.config.rowHeight!;
    const data = ctx.data[index];

    const isFixed = !!conf.fixed;
    const isHeader = ctx.yHeaderKeys.includes(key);

    const beforeIgnoreLength = this.getBeforeIgnoreY(index).length;

    const realIndex = index - beforeIgnoreLength;

    let dataIndex = index - ctx.topFixedList.length;

    const fIndex = ctx.dataKeyIndexMap[`${key}${_TablePrivateProperty.ref}`];

    if (isFixed) {
      if (isNumber(fIndex)) {
        dataIndex = fIndex - ctx.topFixedList.length;
      }
    }

    const hasRef = isNumber(fIndex);

    // 数据被标记为fake, 并且没有ref才视为fake数据, 因为对于用户来说, 包含ref数据指向一个有效数据
    const isFake =
      !!getNamePathValue(data, _TablePrivateProperty.fake) && !hasRef;

    const row: TableRow = {
      key: data[this.config.primaryKey],
      height,
      index: realIndex,
      dataIndex: isHeader ? -1 : dataIndex,
      realIndex: index,
      y: this.getBeforeSizeY(index),
      config: conf,
      data,
      isFixed,
      isEven: realIndex % 2 === 0,
      isHeader,
      isFake,
    };

    if (row.isFixed) {
      const tf = ctx.topFixedMap[key];
      if (tf) row.fixedOffset = tf.viewPortOffset;
      const bf = ctx.bottomFixedMap[key];
      if (bf) row.fixedOffset = bf.viewPortOffset;
    }

    return row;
  }

  /** 获取指定列的实例, useCache为false时会跳过缓存重新计算关键属性, 并将最新内容写入缓存 */
  getColumn(key: TableKey, useCache = true): TableColumn {
    const ctx = this.context;
    let column = ctx.columnCache[key];

    const lastKeyNotEqual =
      !!column &&
      getNamePathValue(column, _TablePrivateProperty.reloadKey) !==
        ctx.lastReloadKey;

    // 是否需要刷新缓存
    const needFresh = !useCache || lastKeyNotEqual;

    if (!column) {
      // 新建
      column = this.getFreshColumn(key);
      ctx.columnCache[key] = column;
    } else if (needFresh) {
      // 更新缓存
      const fresh = this.getFreshColumn(key);
      Object.assign(column, fresh);
    }

    setNamePathValue(
      column,
      _TablePrivateProperty.reloadKey,
      ctx.lastReloadKey
    );

    return column;
  }

  /** 跳过缓存获取最新的column */
  private getFreshColumn(key: TableKey): TableColumn {
    const ctx = this.context;

    const index = ctx.columnKeyIndexMap[key];

    if (!isNumber(index)) {
      throwError(`column key ${key} is invalid`, _prefix);
    }

    const conf = ctx.columns[index];

    const width = isNumber(conf.width) ? conf.width : this.config.columnWidth!;

    const beforeIgnoreLength = this.getBeforeIgnoreX(index).length;

    const isFixed = !!conf.fixed;

    const isHeader = ctx.xHeaderKey === key;

    const realIndex = index - beforeIgnoreLength;

    let dataIndex = index - ctx.leftFixedList.length;

    const fIndex = ctx.columnKeyIndexMap[`${key}${_TablePrivateProperty.ref}`];

    if (isFixed) {
      if (isNumber(fIndex)) {
        dataIndex = fIndex - ctx.leftFixedList.length;
      }
    }

    const hasRef = isNumber(fIndex);

    // 数据被标记为fake, 并且没有ref才视为fake数据, 因为对于用户来说, 包含ref数据指向一个有效数据
    const isFake =
      !!getNamePathValue(conf, _TablePrivateProperty.fake) && !hasRef;

    const column: TableColumn = {
      key: conf.key,
      width,
      index: realIndex,
      dataIndex: isHeader ? -1 : dataIndex,
      realIndex: index,
      x: this.getBeforeSizeX(index),
      config: conf,
      isFixed,
      isEven: realIndex % 2 === 0,
      isHeader: isHeader,
      isFake,
    };

    if (column.isFixed) {
      const lf = ctx.leftFixedMap[key];
      if (lf) column.fixedOffset = lf.viewPortOffset;
      const rf = ctx.rightFixedMap[key];
      if (rf) column.fixedOffset = rf.viewPortOffset;
    }

    return column;
  }

  getCellKey(rowKey: TableKey, columnKey: TableKey): string {
    return _getCellKey(rowKey, columnKey);
  }

  /** 根据单元格key获取cell */
  getCellByStrKey(key: string): TableCell {
    const keys = _getCellKeysByStr(key);

    if (keys.length !== 2) {
      throwError(`key ${key} is invalid`, _prefix);
    }

    return this.getCell(keys[0], keys[1]);
  }

  /** 根据单元格类型获取其文本 */
  getText(cell: TableCell) {
    const { row, column } = cell;

    let text: string;

    if (row.isHeader) {
      // 表头数据根据普通key注入
      text = row.data[column.key];
    } else if (column.isHeader) {
      text = String(cell.row.index - this.context.yHeaderKeys.length + 1);
    } else {
      text = getNamePathValue(row.data, column.config.originalKey);
    }

    if (isString(text)) return text;

    return String(isTruthyOrZero(text) ? text : "");
  }

  getCell(rowKey: TableKey, columnKey: TableKey, useCache = true): TableCell {
    const ctx = this.context;
    const key = _getCellKey(rowKey, columnKey);

    let cell = ctx.cellCache[key];

    const lastKeyNotEqual =
      !!cell &&
      getNamePathValue(cell, _TablePrivateProperty.reloadKey) !==
        ctx.lastReloadKey;

    // 是否需要刷新缓存
    const needFresh = !useCache || lastKeyNotEqual;

    if (!cell) {
      // 新建
      cell = this.getFreshCell(rowKey, columnKey, key) as TableCell;

      cell.state = {};

      ctx.cellCache[key] = cell;
    } else if (needFresh) {
      // 更新缓存
      const fresh = this.getFreshCell(rowKey, columnKey, key);
      Object.assign(cell, fresh);
    }

    setNamePathValue(cell, _TablePrivateProperty.reloadKey, ctx.lastReloadKey);

    return cell;
  }

  private getFreshCell(
    rowKey: TableKey,
    columnKey: TableKey,
    key: string
  ): Omit<TableCell, "state"> {
    const ctx = this.context;

    const row = this.getRow(rowKey);
    const column = this.getColumn(columnKey);
    const config = ctx.cells![key] || {};

    const mergeData = ctx.mergeMapMain[key];

    const width = mergeData ? mergeData.width : column.width;
    const height = mergeData ? mergeData.height : row.height;

    return {
      row,
      column,
      key,
      config,
      isMount: false,
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
      width,
      height,
      text: "",
    };
  }

  getNearCell(
    arg: Parameters<TableGetter["getNearCell"]>[0]
  ): TableCell | void {
    const { cell, position = Position.right, filter } = arg;

    const { columns, data } = this.context;

    // 是否垂直方向
    const isVertical =
      position === Position.top || position === Position.bottom;

    // 区分获取前方还是后方单元格
    const isPrev = position === Position.left || position === Position.top;

    let { row, column } = cell;

    let index = isVertical ? row.realIndex : column.realIndex;

    if (!isNumber(index)) return;

    const list = isVertical ? data : columns;

    // 由于进入循环后立即回获取下一项, 所以需要把索引边界扩大或减小1
    while (index <= list.length && index >= -1) {
      index = isPrev ? index - 1 : index + 1;

      const next = list[index];

      // 超出最后/前项时, 获取下一行或下一列
      if (!next) {
        const offset = isPrev ? -1 : 1;

        // 下一项相关信息
        let nextListIndex = isVertical ? column.realIndex : row.realIndex;
        let nextListKey: TableKey;
        let nextItem: TableRow | TableColumn | undefined;

        let isHideOrIgnore = false;

        try {
          // 处理隐藏项和忽略项
          do {
            nextListIndex = nextListIndex + offset;

            nextListKey = isVertical
              ? this.getKeyByColumnIndex(nextListIndex)
              : this.getKeyByRowIndex(nextListIndex);

            nextItem = isVertical
              ? this.table.getColumn(nextListKey)
              : this.table.getRow(nextListKey);

            // 在data/column中的实际项
            const cur = isVertical
              ? columns[nextListIndex]
              : data[nextListIndex];

            isHideOrIgnore =
              this.hide.isHideColumn(nextListKey) ||
              getNamePathValue(cur, _TablePrivateProperty.ignore);
          } while (
            // 隐藏或忽略项, 并且在有效索引内
            isHideOrIgnore &&
            nextListIndex < columns.length &&
            nextListIndex > 0
          );
        } catch (e) {
          // 忽略getKeyByColumnIndex/getRow等api的越界错误
        }

        // 包含下一行/列, 跳转都首个或末尾
        if (nextItem) {
          index = isPrev ? list.length : -1;

          if (isVertical) {
            column = nextItem as TableColumn;
          } else {
            row = nextItem as TableRow;
          }

          continue;
        }

        return;
      }

      if (getNamePathValue(next, _TablePrivateProperty.ignore)) continue;

      const key = isVertical ? this.table.getKeyByRowData(next) : next.key;

      const _cell = isVertical
        ? this.getCell(key, column.key)
        : this.getCell(row.key, key);

      // 单元格是被合并项
      if (this.context.mergeMapSub[_cell.key]) continue;

      const skip = filter && !filter(_cell);

      if (skip) continue;

      return _cell;
    }
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
      throwError(
        `primaryKey: ${this.config.primaryKey} does not exist in data on row ${ind}`,
        _prefix
      );
    }
    return key;
  }

  getKeyByColumnIndex(ind: number): TableKey {
    const cur = this.context.columns[ind];
    const key = cur.key;
    if (key === undefined) {
      throwError(`key: No key with index ${ind} exists`, _prefix);
    }
    return key;
  }

  getIndexByRowKey(key: TableKey): number {
    const ind = this.context.dataKeyIndexMap[key];
    if (ind === undefined) {
      throwError(`row key ${key} does not have a corresponding index`, _prefix);
    }
    return ind;
  }

  getIndexByColumnKey(key: TableKey): number {
    const ind = this.context.columnKeyIndexMap[key];
    if (ind === undefined) {
      throwError(
        `column key ${key} does not have a corresponding index`,
        _prefix
      );
    }
    return ind;
  }

  getKeyByRowData(cur: any): TableKey {
    const key = cur[this.config.primaryKey];

    if (key === undefined || key === null) {
      throwError(`No key obtained. ${JSON.stringify(cur, null, 4)}`, _prefix);
    }

    return key;
  }

  /** 处理merge项, 防止cell列表重复推入相同项, 并在确保cell中包含被合并项的父项, 回调返回true时表示以处理, 需要跳过后续流程 */
  private cellMergeHelper(list: TableCell[]): (cell: TableCell) => boolean {
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
        const parent = this.getCell(merged[0], merged[1]);
        if (parent && !existCache[parent.key]) {
          list.push(this.getCell(merged[0], merged[1]));
        }
        return true;
      }

      return false;
    };
  }

  getMergeData(cell: TableCell) {
    return this.context.mergeMapMain[cell.key];
  }

  getMergedData(cell: TableCell) {
    return this.context.mergeMapSub[cell.key];
  }

  /** 获取指定索引前的所有忽略项 */
  getBeforeIgnoreX(index: number): number[] {
    return this.context.ignoreXList.filter((i) => i < index);
  }

  /** 获取指定索引前的所有忽略项 */
  getBeforeIgnoreY(index: number): number[] {
    return this.context.ignoreYList.filter((i) => i < index);
  }

  getAttachPosition(cell: TableCell): TableAttachData {
    const rPos = this.getRowAttachPosition(cell.row);
    const cPos = this.getColumnAttachPosition(cell.column);

    let zIndex: string;

    if (!cell.isFixed) {
      zIndex = "5"; // 高于其所在单元格对应层index.scss
    } else if (cell.isCrossFixed) {
      zIndex = "21";
    } else {
      zIndex = "11";
    }

    return {
      left: cPos.left,
      top: rPos.top,
      width: cell.width,
      height: cell.height,
      zIndex,
    };
  }

  getColumnAttachPosition(column: TableColumn): TableAttachData {
    return {
      left: column.isFixed ? this.table.getX() + column.fixedOffset! : column.x,
      width: column.width,
      // 应高于交叉固定项的20或基础层的5
      zIndex: column.isFixed ? "21" : "5",
      // 以下均设为零值
      top: 0,
      height: 0,
    };
  }

  getRowAttachPosition(row: TableRow): TableAttachData {
    return {
      top: row.isFixed ? this.table.getY() + row.fixedOffset! : row.y,
      height: row.height,
      // 应高于交叉固定项的20或基础层的5
      zIndex: row.isFixed ? "21" : "5",
      // 以下均设为零值
      left: 0,
      width: 0,
    };
  }
}

/** 选择器 */
export interface TableGetter {
  /** 获取x */
  getX(): number;

  /** 获取y */
  getY(): number;

  /** 获取y */
  getXY(): TablePosition;

  /** 获取x最大值 */
  getMaxX(): number;

  /** 获取y最大值 */
  getMaxY(): number;

  /** 获取宽度 */
  getWidth(): number;

  /** 获取高度 */
  getHeight(): number;

  /** 内容区域宽度 */
  getContentWidth(): number;

  /** 内容区域高度 */
  getContentHeight(): number;

  /**
   * 获取指定区域的row/column/cell, 点的取值区间为[0, 内容总尺寸]
   * @param target - 可以是包含区域信息的bound对象, 也可以是表示[x, y]的位置元组
   * @param skipFixed - false | 是否跳过fixed项获取
   * */
  getBoundItems(
    target: BoundSize | TablePosition,
    skipFixed?: boolean
  ): TableItems;

  /**
   * 获取当前视口内可见的row/column/cell */
  getViewportItems(): TableItems;

  /** 获取两个点区间内的元素, 点的区间为: [0, 内容总尺寸] */
  getAreaBound(p1: TablePosition, p2?: TablePosition): TableItems;

  /** 获取指定行 */
  getRow(key: TableKey): TableRow;

  /** 获取指定列 */
  getColumn(key: TableKey): TableColumn;

  /** 获取指定单元格 */
  getCell(rowKey: TableKey, columnKey: TableKey): TableCell;

  /** 根据行和列的key生成cell key */
  getCellKey(rowKey: TableKey, columnKey: TableKey): TableKey;

  /** 根据单元格key获取cell */
  getCellByStrKey(key: TableKey): TableCell;

  /** 获取临近的单元格 */
  getNearCell(arg: {
    /** 目标单元格 */
    cell: TableCell;
    /** Position.right | 要获取的方向 */
    position?: Position;
    /** 过滤调无效单元格(返回false) */
    filter?: (cell: TableCell) => boolean;
  }): TableCell | void;

  /** 获取指定索引记录的key. 注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.data中项的索引 */
  getKeyByRowIndex(ind: number): TableKey;

  /** 获取指定column的key.  注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.columns中项的索引 */
  getKeyByColumnIndex(ind: number): TableKey;

  /** 获取key的row索引. 注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.data中项的索引 */
  getIndexByRowKey(key: TableKey): number;

  /** 获取key的column索引.  注意, 此处的索引为经过内部数据重铸后的索引, 并不是config.columns中项的索引 */
  getIndexByColumnKey(key: TableKey): number;

  /** 获取被合并信息, 若有返回则表示是一个被合并项 */
  getMergedData(cell: TableCell): [TableKey, TableKey] | undefined;

  /** 获取合并信息, 若有返回则表示是一个合并项 */
  getMergeData(cell: TableCell): TableMergeData | undefined;

  /** 从数据上获取key */
  getKeyByRowData(cur: any): TableKey;

  /** 获取cell所处画布位置, 需要在单元格位置挂载其他内容而不是挂载到单元格dom内部时非常有用 */
  getAttachPosition(cell: TableCell): TableAttachData;

  /** 获取column所处画布位置, 需要在列位置挂载其他内容而不是挂载到单元格dom内部时非常有用 */
  getColumnAttachPosition(column: TableColumn): TableAttachData;

  /** 获取row所处画布位置, 需要在列位置挂载其他内容而不是挂载到单元格dom内部时非常有用 */
  getRowAttachPosition(row: TableRow): TableAttachData;
}

export interface TableAttachData extends BoundSize {
  /** 应该挂载的zIndex层 */
  zIndex: string;
}
