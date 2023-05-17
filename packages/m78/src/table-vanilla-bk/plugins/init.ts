import { TablePlugin } from "../plugin.js";
import { TableColumnFixed, TableConfig, TableRowFixed } from "../types.js";
import { isEmpty, isNumber, setNamePathValue } from "@m78/utils";
import clsx from "clsx";
import { _addCls, _getStrCellKey, _privateScrollerDomKey } from "../common.js";

/**
 * 进行配置整理/实例对象创建等操作
 * */
export class _TableInitPlugin extends TablePlugin {
  init() {
    (this.table as any).config = this.conf.bind(this); // 映射conf方法到table.config

    _addCls(this.config.el, "m78-table");

    this.createDomElement();

    this.preHandle();
  }

  conf(config?: Partial<TableConfig>) {
    if (config === undefined) return this.config;
    Object.assign(this.config, config);
  }

  /** 预处理, 减少后续渲染的计算工作 */
  preHandle() {
    const ctx = this.context;

    ctx.zoom = 1;
    ctx.mergeMapMain = {};
    ctx.mergeMapSub = {};
    ctx.lastMergeXMap = {};
    ctx.lastMergeYMap = {};
    ctx.rowCache = {};
    ctx.columnCache = {};
    ctx.cellCache = {};
    ctx.topFixedMap = {};
    ctx.bottomFixedMap = {};
    ctx.leftFixedMap = {};
    ctx.rightFixedMap = {};
    ctx.topFixedList = [];
    ctx.bottomFixeList = [];
    ctx.leftFixedList = [];
    ctx.rightFixedList = [];

    this.preHandleSize();

    this.preCalcLastInfo();

    this.preHandleMerge();

    this.preHandleFixedSort();
  }

  /** 预处理尺寸/固定项相关信息 */
  preHandleSize() {
    const { columns, columnWidth, rows, rowHeight, data } = this.config;

    const ctx = this.context;
    let leftFixedWidth = 0;
    let rightFixedWidth = 0;

    let contentWidth = columns.length * columnWidth!;

    // x轴
    columns.forEach((c, index) => {
      const w = isNumber(c.width) ? c.width : columnWidth!;

      if (c.fixed) {
        if (c.fixed === TableColumnFixed.left) {
          ctx.leftFixedMap[index] = {
            offset: leftFixedWidth,
            viewPortOffset: leftFixedWidth,
            config: c,
          };
          leftFixedWidth += w;
          ctx.leftFixedList.push(index);
        }

        if (c.fixed === TableColumnFixed.right) {
          ctx.rightFixedMap[index] = {
            offset: rightFixedWidth,
            viewPortOffset: rightFixedWidth,
            config: c,
          };
          rightFixedWidth += w;
          ctx.rightFixedList.push(index);
        }
      }

      contentWidth -= columnWidth!;
      contentWidth += w;
    });

    ctx.leftFixedWidth = leftFixedWidth;
    ctx.rightFixedWidth = rightFixedWidth;
    ctx.contentWidth = contentWidth;

    const numKeys = Object.keys(rows!).map(Number);

    let topFixedHeight = 0;
    let bottomFixedHeight = 0;
    let contentHeight = data.length * rowHeight!;

    // y轴
    numKeys.forEach((index) => {
      const cur = rows![index];

      const h = isNumber(cur.height) ? cur.height : rowHeight!;

      if (cur.fixed) {
        if (cur.fixed === TableRowFixed.top) {
          ctx.topFixedMap[index] = {
            offset: topFixedHeight,
            viewPortOffset: topFixedHeight,
            config: cur,
          };
          topFixedHeight += h;
          ctx.topFixedList.push(index);
        }

        if (cur.fixed === TableRowFixed.bottom) {
          ctx.bottomFixedMap[index] = {
            offset: bottomFixedHeight,
            viewPortOffset: bottomFixedHeight,
            config: cur,
          };
          bottomFixedHeight += h;
          ctx.bottomFixeList.push(index);
        }
      }

      contentHeight -= rowHeight!;
      contentHeight += h;
    });

    ctx.topFixedHeight = topFixedHeight;
    ctx.bottomFixedHeight = bottomFixedHeight;
    ctx.contentHeight = contentHeight;
    ctx.rowConfigNumberKeys = numKeys;

    const rightFixedStart = this.config.el.offsetWidth - rightFixedWidth;
    const bottomFixedStart = this.config.el.offsetHeight - bottomFixedHeight;

    // 计算右/下固定项偏移信息

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(ctx.bottomFixedMap).forEach(([_, v]) => {
      v.offset = ctx.contentHeight - ctx.bottomFixedHeight + v.offset;
      v.viewPortOffset = bottomFixedStart + v.viewPortOffset;
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Object.entries(ctx.rightFixedMap).forEach(([_, v]) => {
      v.offset = ctx.contentWidth - ctx.rightFixedWidth + v.offset;
      v.viewPortOffset = rightFixedStart + v.viewPortOffset;
    });
  }

  /** 预处理合并项, 需要提前计算出合并后的单元格尺寸和被合并项的信息 */
  preHandleMerge() {
    const ctx = this.context;

    ctx.mergeMapMain = {};
    ctx.mergeMapSub = {};

    const { cells } = this.config;

    if (isEmpty(cells)) return;

    Object.entries(cells!).forEach(([k, conf]) => {
      if (!conf.mergeX && !conf.mergeY) return;

      const position = _getStrCellKey(k);
      if (position.length !== 2) return;

      const [row, column] = position;

      const mergeKey = `${row}_${column}`;

      const sizeMap: any = {};

      let columnMergeList: number[] = [column];
      let rowMergeList: number[] = [row];

      if (conf.mergeX) {
        const colMeta = this.getMergeRange(column, conf.mergeX, false);
        columnMergeList = colMeta.mergeList;
        sizeMap.width = colMeta.size;

        // 合并项尾项处理
        const last = columnMergeList[columnMergeList.length - 1];
        if (last === ctx.lastColumnIndex || last === ctx.lastFixedColumnIndex) {
          ctx.lastMergeXMap[mergeKey] = true;
        }
      }

      if (conf.mergeY) {
        const rowMeta = this.getMergeRange(row, conf.mergeY, true);
        rowMergeList = rowMeta.mergeList;
        sizeMap.height = rowMeta.size;

        // 合并项尾项处理
        const last = rowMergeList[rowMergeList.length - 1];
        if (last === ctx.lastRowIndex || last === ctx.lastFixedRowIndex) {
          ctx.lastMergeYMap[mergeKey] = true;
        }
      }

      ctx.mergeMapMain[mergeKey] = sizeMap;

      rowMergeList.forEach((rInd) => {
        columnMergeList.forEach((cInd) => {
          const cKey = `${rInd}_${cInd}`;
          if (mergeKey !== cKey) {
            ctx.mergeMapSub[cKey] = [row, column];
          }
        });
      });
    });
  }

  /** 末尾单元格相关信息计算 */
  preCalcLastInfo() {
    const ctx = this.context;
    const columns = this.config.columns;
    const data = this.config.data;
    ctx.lastFixedColumnIndex =
      ctx.rightFixedList[ctx.rightFixedList.length - 1];
    ctx.lastFixedRowIndex = ctx.bottomFixeList[ctx.bottomFixeList.length - 1];

    for (let i = columns.length - 1; i >= 0; i--) {
      if (!ctx.rightFixedMap[i]) {
        ctx.lastColumnIndex = i;
        break;
      }
    }

    for (let i = data.length - 1; i >= 0; i--) {
      if (!ctx.bottomFixedMap[i]) {
        ctx.lastRowIndex = i;
        break;
      }
    }
  }

  /** 将data/columns的fixed重新排序后映射到ctx.dataFixedSortList和ctx.columnsFixedSortList */
  preHandleFixedSort() {
    const ctx = this.context;

    const listX = this.config.columns.map((c, index) => index);
    const listY = this.config.data.map((c, index) => index);

    [...ctx.leftFixedList, ...ctx.rightFixedList].forEach((i) => {
      listX.splice(i, 1);
    });

    listX.unshift(...ctx.leftFixedList);
    listX.push(...ctx.rightFixedList);

    [...ctx.topFixedList, ...ctx.bottomFixeList].forEach((i) => {
      listY.splice(i, 1);
    });

    listY.unshift(...ctx.topFixedList);
    listY.push(...ctx.bottomFixeList);

    ctx.dataFixedSortList = listY;
    ctx.columnsFixedSortList = listX;
  }

  /**
   * 计算指定范围列的总尺寸, 固定项和普通项交叉时, 不同类的后方项会被忽略
   * - 返回的mergeList为被合并行/列的索引
   * */
  getMergeRange(start: number, mergeNum: number, isRow: boolean) {
    const { columns, rows, data, columnWidth, rowHeight } = this.config;
    const ctx = this.context;

    const isMainFixed = isRow
      ? !!rows![start]?.fixed
      : !!columns![start]?.fixed;

    const mergeList: number[] = [];
    let size = 0;
    let ind = start;
    let fixedList: number[] = [];

    if (isMainFixed) {
      const fixed = rows![start]?.fixed || columns![start]?.fixed;

      if (fixed === TableRowFixed.top) fixedList = ctx.topFixedList;
      if (fixed === TableRowFixed.bottom) fixedList = ctx.bottomFixeList;
      if (fixed === TableColumnFixed.left) fixedList = ctx.leftFixedList;
      if (fixed === TableColumnFixed.right) fixedList = ctx.rightFixedList;
    }

    while (mergeNum > 0) {
      const conf = isRow ? rows![ind] : columns![ind];

      // 根据主项是否是固定项做不同处理

      if (!isMainFixed) {
        const _isFixed = !!conf?.fixed;

        // 合并项不是fixed时, 跳过fixed的被合并项
        if (_isFixed) {
          ind += 1;
          continue;
        }

        if (isRow && ind >= data!.length) break;
        if (!isRow && ind >= columns!.length) break;
      }

      const cSize = isRow ? (conf as any)?.height : (conf as any)?.width;
      const defSize = isRow ? rowHeight : columnWidth;
      const s = isNumber(cSize) ? cSize : defSize!;

      mergeList.push(ind);

      size += s;
      mergeNum -= 1;

      if (isMainFixed) {
        const curInd = fixedList.indexOf(ind);
        if (curInd === fixedList.length - 1 || curInd === -1) break;

        ind = fixedList[curInd + 1];
      } else {
        ind += 1;
      }
    }

    return {
      size,
      mergeList,
    };
  }

  /** 基础容器创建&初始化 */
  createDomElement() {
    const ctx = this.context;

    // viewEl & viewContentEl
    if (!ctx.viewEl || !ctx.viewContentEl) {
      if (this.config.viewEl && this.config.viewContentEl) {
        // 传入配置时使用传入值
        ctx.viewEl = this.config.viewEl;
        ctx.viewContentEl = this.config.viewContentEl;
      } else {
        // 没有传入相关配置, 自动创建并渲染
        const el = document.createElement("div");

        setNamePathValue(el, _privateScrollerDomKey, true);

        // 预设配置时, 为其添加滚动样式和尺寸控制
        ctx.viewEl = el;

        const contEl = document.createElement("div");
        ctx.viewContentEl = contEl;

        ctx.viewEl.className = clsx(
          "m78-table_default-scroll m78-table_expand-size",
          ctx.viewEl.className
        );

        el.appendChild(contEl);
        this.config.el.appendChild(el);
      }

      const domContentEl = ctx.viewContentEl;

      if (!domContentEl.className.includes("m78-table_view-content")) {
        domContentEl.className = clsx(
          "m78-table_view-content",
          domContentEl.className
        );
      }
    }

    // 创建stage
    const stage = document.createElement("div");
    stage.className = "m78-table_stage";
    this.context.stageEL = stage;
    this.context.viewContentEl.appendChild(stage);
  }
}
