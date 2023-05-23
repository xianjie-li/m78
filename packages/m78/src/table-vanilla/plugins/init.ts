import { TablePlugin } from "../plugin.js";
import {
  _TablePrivateProperty,
  TableColumnFixed,
  TableColumnLeafConfig,
  TableConfig,
  TableKey,
  TableRowFixed,
} from "../types.js";
import {
  getNamePathValue,
  isEmpty,
  isNumber,
  isString,
  setNamePathValue,
  throwError,
} from "@m78/utils";
import clsx from "clsx";
import {
  _getCellKey,
  _getCellKeysByStr,
  _prefix,
  _privateScrollerDomKey,
} from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import { _TableHeaderPlugin } from "./header.js";
import { addCls } from "../../common/index.js";

/**
 * 进行配置整理/预计算等
 * */
export class _TableInitPlugin extends TablePlugin {
  init() {
    this.methodMapper(this.table, [["conf", "config"]]);

    addCls(this.config.el, "m78-table");

    this.createDomElement();

    this.fullHandle();
  }

  conf(config?: Partial<TableConfig>) {
    if (config === undefined) return this.config;
    Object.assign(this.config, config);
  }

  fullHandle() {
    this.initDataAndColumn();

    this.getPlugin(_TableHeaderPlugin).process();

    this.fmtDataAndColumns();

    this.indexHandle();
  }

  /** 为当前ctx.data/columns创建索引, 对应TableReloadLevel.index */
  indexHandle() {
    this.updateKeyIndexMap();
    this.baseHandle();
  }

  /** 基础预处理, 减少后续渲染的计算工作, , 对应TableReloadLevel.base */
  baseHandle() {
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
  }

  /** 拷贝data/columns */
  initDataAndColumn() {
    const ctx = this.context;

    ctx.data = this.config.data.slice();
    ctx.columns = [];
    ctx.cells = {};
    ctx.rows = {};
  }

  /** 将data/columns进行预处理后拷贝到其对应的ctx.xxx, 并对固定性进行处理 */
  fmtDataAndColumns() {
    const ctx = this.context;
    const { columns, data, rows } = ctx;

    const listX: TableColumnLeafConfig[] = [];
    const listY: any[] = [];

    const lf: TableColumnLeafConfig[] = [];
    const rf: TableColumnLeafConfig[] = [];
    const tf: any[] = [];
    const bf: any[] = [];

    ctx.ignoreColumnLength = 0;
    ctx.ignoreDataLength = 0;

    // 从行头/表头开始, 拷贝并备份数据, 然后将fixed项移植首尾位置

    for (let i = 1; i < columns.length; i++) {
      const cur = columns[i];

      if (cur.fixed) {
        // 由于要注入私有属性, 这里需要将其克隆
        const clone = { ...cur };

        listX.push(clone);

        const nCur = {
          ...cur,
          [_TablePrivateProperty.fake]: true,
          [_TablePrivateProperty.ref]: clone,
        };

        setNamePathValue(clone, _TablePrivateProperty.ignore, true);
        setNamePathValue(clone, _TablePrivateProperty.ref, nCur);
        ctx.ignoreColumnLength++;

        if (cur.fixed === TableColumnFixed.left) {
          lf.push(nCur);
        } else {
          rf.push(nCur);
        }
      } else {
        listX.push(cur);
      }
    }

    for (let i = ctx.yHeaderKeys.length; i < data.length; i++) {
      const cur = data[i];
      const key = cur[this.config.primaryKey];
      const conf = rows[key];

      if (conf && conf.fixed) {
        // 由于要注入私有属性, 这里需要将其克隆
        const clone = { ...cur };

        listY.push(clone);

        const nCur = {
          ...cur,
          [_TablePrivateProperty.fake]: true,
          [_TablePrivateProperty.ref]: clone,
        };

        setNamePathValue(clone, _TablePrivateProperty.ignore, true);
        setNamePathValue(clone, _TablePrivateProperty.ref, nCur);
        ctx.ignoreDataLength++;

        if (conf.fixed === TableRowFixed.top) {
          tf.push(nCur);
        } else {
          bf.push(nCur);
        }
      } else {
        listY.push(cur);
      }
    }

    listX.unshift(...lf);
    // 推入行头
    listX.unshift(columns[0]);
    listX.push(...rf);

    listY.unshift(...tf);
    // 推入表头
    listY.unshift(...data.slice(0, ctx.yHeaderKeys.length));
    listY.push(...bf);

    ctx.data = listY;
    ctx.columns = listX;
  }

  /** 处理dataKeyIndexMap/columnKeyIndexMap */
  updateKeyIndexMap() {
    const ctx = this.context;

    ctx.ignoreXList = [];
    ctx.ignoreYList = [];
    ctx.allRowKeys = [];
    ctx.allColumnKeys = [];

    const dataMap: any = {};
    const columnMap: any = {};

    ctx.columns.forEach((cur, i) => {
      // 在此处确保所有key都是可用的, 后续代码中就可以直接安全取用了
      if (!isString(cur.key) && !isNumber(cur.key)) {
        throwError(
          `No key obtained in column. ${JSON.stringify(cur, null, 4)}`,
          _prefix
        );
      }

      if (!getNamePathValue(cur, _TablePrivateProperty.fake)) {
        ctx.allColumnKeys.push(cur.key);
      }

      const ignore = getNamePathValue(cur, _TablePrivateProperty.ignore);

      if (ignore) {
        ctx.ignoreXList.push(i);
        return;
      }

      columnMap[cur.key] = i;
    });

    ctx.data.forEach((cur, i) => {
      const k = cur[this.config.primaryKey];

      // 在此处确保所有key都是可用的, 后续代码中就可以直接安全取用了
      if (!isString(k) && !isNumber(k)) {
        throwError(
          `No key obtained in row. ${JSON.stringify(cur, null, 4)}`,
          _prefix
        );
      }

      if (!getNamePathValue(cur, _TablePrivateProperty.fake)) {
        ctx.allRowKeys.push(k);
      }

      const ignore = getNamePathValue(cur, _TablePrivateProperty.ignore);

      if (ignore) {
        ctx.ignoreYList.push(i);
        return;
      }
      dataMap[k] = i;
    });

    ctx.dataKeyIndexMap = dataMap;
    ctx.columnKeyIndexMap = columnMap;
  }

  /** 预处理尺寸/固定项相关信息 */
  preHandleSize() {
    const { columnWidth, rowHeight } = this.config;

    const ctx = this.context;

    const getter = this.getPlugin(_TableGetterPlugin);

    const { columns, rows, data } = ctx;

    let leftFixedWidth = 0;
    let rightFixedWidth = 0;

    let contentWidth = (columns.length - ctx.ignoreColumnLength) * columnWidth!;

    // x轴
    columns.forEach((c) => {
      if (getNamePathValue(c, _TablePrivateProperty.ignore)) return;

      const w = isNumber(c.width) ? c.width : columnWidth!;

      if (c.fixed) {
        if (c.fixed === TableColumnFixed.left) {
          ctx.leftFixedMap[c.key] = {
            offset: leftFixedWidth,
            viewPortOffset: leftFixedWidth,
            config: c,
          };
          leftFixedWidth += w;
          ctx.leftFixedList.push(c.key);
        }

        if (c.fixed === TableColumnFixed.right) {
          ctx.rightFixedMap[c.key] = {
            offset: rightFixedWidth,
            viewPortOffset: rightFixedWidth,
            config: c,
          };
          rightFixedWidth += w;
          ctx.rightFixedList.push(c.key);
        }
      }

      contentWidth -= columnWidth!;
      contentWidth += w;
    });

    ctx.leftFixedWidth = leftFixedWidth;
    ctx.rightFixedWidth = rightFixedWidth;
    ctx.contentWidth = contentWidth;

    const rowKeys = Object.keys(rows!).filter((key) => getter.isRowExist(key));

    let topFixedHeight = 0;
    let bottomFixedHeight = 0;
    let contentHeight = (data.length - ctx.ignoreDataLength) * rowHeight!;

    // y轴
    rowKeys.forEach((key) => {
      const cur = rows![key];

      const h = isNumber(cur.height) ? cur.height : rowHeight!;

      if (cur.fixed) {
        if (cur.fixed === TableRowFixed.top) {
          ctx.topFixedMap[key] = {
            offset: topFixedHeight,
            viewPortOffset: topFixedHeight,
            config: cur,
          };
          topFixedHeight += h;
          ctx.topFixedList.push(key);
        }

        if (cur.fixed === TableRowFixed.bottom) {
          ctx.bottomFixedMap[key] = {
            offset: bottomFixedHeight,
            viewPortOffset: bottomFixedHeight,
            config: cur,
          };
          bottomFixedHeight += h;
          ctx.bottomFixeList.push(key);
        }
      }

      contentHeight -= rowHeight!;
      contentHeight += h;
    });

    ctx.topFixedHeight = topFixedHeight;
    ctx.bottomFixedHeight = bottomFixedHeight;
    ctx.contentHeight = contentHeight;
    ctx.rowConfigNumberKeys = rowKeys;

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

  /** 末尾单元格相关信息计算 */
  preCalcLastInfo() {
    const ctx = this.context;

    ctx.lastFixedColumnKey = ctx.rightFixedList[ctx.rightFixedList.length - 1];
    ctx.lastFixedRowKey = ctx.bottomFixeList[ctx.bottomFixeList.length - 1];

    for (let i = ctx.columns.length - 1; i >= 0; i--) {
      const cur = ctx.columns[i];
      if (getNamePathValue(cur, _TablePrivateProperty.ignore)) continue;
      if (!ctx.rightFixedMap[cur.key]) {
        ctx.lastColumnKey = cur.key;
        break;
      }
    }

    for (let i = ctx.data.length - 1; i >= 0; i--) {
      const cur = ctx.data[i];
      if (getNamePathValue(cur, _TablePrivateProperty.ignore)) continue;
      const key = cur[this.config.primaryKey];
      if (!ctx.bottomFixedMap[key]) {
        ctx.lastRowKey = key;
        break;
      }
    }
  }

  /** 预处理合并项, 需要提前计算出合并后的单元格尺寸和被合并项的信息 */
  preHandleMerge() {
    const ctx = this.context;

    ctx.mergeMapMain = {};
    ctx.mergeMapSub = {};

    const { cells } = ctx;

    if (isEmpty(cells)) return;

    const getter = this.getPlugin(_TableGetterPlugin);

    Object.entries(cells!).forEach(([k, conf]) => {
      if (!conf.mergeX && !conf.mergeY) return;

      const keys = _getCellKeysByStr(k);

      if (keys.length !== 2) return;

      const [rowKey, columnKey] = keys;

      if (!getter.isRowExist(rowKey) || !getter.isColumnExist(columnKey)) {
        return;
      }

      const mergeMap: any = {};

      let columnMergeList: TableKey[] = [columnKey];
      let rowMergeList: TableKey[] = [rowKey];

      if (conf.mergeX) {
        const colMeta = this.getMergeRange(columnKey, conf.mergeX, false);
        columnMergeList = colMeta.mergeList;
        mergeMap.width = colMeta.size;
        mergeMap.xLength = columnMergeList.length;

        // 合并项尾项处理
        const last = columnMergeList[columnMergeList.length - 1];
        if (last === ctx.lastColumnKey || last === ctx.lastFixedColumnKey) {
          ctx.lastMergeXMap[k] = true;
        }
      }

      if (conf.mergeY) {
        const rowMeta = this.getMergeRange(rowKey, conf.mergeY, true);
        rowMergeList = rowMeta.mergeList;
        mergeMap.height = rowMeta.size;
        mergeMap.yLength = rowMergeList.length;

        // 合并项尾项处理
        const last = rowMergeList[rowMergeList.length - 1];
        if (last === ctx.lastRowKey || last === ctx.lastFixedRowKey) {
          ctx.lastMergeYMap[k] = true;
        }
      }

      ctx.mergeMapMain[k] = mergeMap;

      rowMergeList.forEach((rInd) => {
        columnMergeList.forEach((cInd) => {
          const cKey = _getCellKey(rInd, cInd);
          if (k !== cKey) {
            ctx.mergeMapSub[cKey] = [rowKey, columnKey];
          }
        });
      });
    });
  }

  /**
   * 合并信息计算, 固定项和普通项交叉时, 不同类的后方项会被忽略
   * - 返回的mergeList为被合并行/列的索引
   * */
  getMergeRange(start: TableKey, mergeNum: number, isRow: boolean) {
    const ctx = this.context;
    const { columnWidth, rowHeight } = this.config;
    const { columns, rows, data } = ctx;

    const getter = this.getPlugin(_TableGetterPlugin);

    const key = start;
    const originalInd = isRow
      ? getter.getIndexByRowKey(key)
      : getter.getIndexByColumnKey(key);

    const fixed = isRow ? rows![key]?.fixed : columns![originalInd]?.fixed;

    // 主项是否是固定项
    const isMainFixed = !!fixed;

    const mergeList: TableKey[] = [];
    let size = 0;
    let ind = originalInd;
    let fixedList: TableKey[] = [];

    if (isMainFixed) {
      if (fixed === TableRowFixed.top) fixedList = ctx.topFixedList;
      if (fixed === TableRowFixed.bottom) fixedList = ctx.bottomFixeList;
      if (fixed === TableColumnFixed.left) fixedList = ctx.leftFixedList;
      if (fixed === TableColumnFixed.right) fixedList = ctx.rightFixedList;
    }

    while (mergeNum > 0) {
      const _key = isRow
        ? getter.getKeyByRowIndex(ind)
        : getter.getKeyByColumnIndex(ind);

      const originalInd = isRow
        ? getter.getIndexByRowKey(_key)
        : getter.getIndexByColumnKey(_key);

      const cur = isRow ? data![originalInd] : columns![originalInd];

      if (getNamePathValue(cur, _TablePrivateProperty.ignore)) {
        ind++;
        continue;
      }

      const conf = isRow ? rows![_key] : columns![originalInd];

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

      mergeList.push(_key);

      size += s;
      mergeNum -= 1;

      if (isMainFixed) {
        const curInd = fixedList.indexOf(_key);

        if (curInd === fixedList.length - 1 || curInd === -1) break;

        const k = fixedList[curInd + 1];
        ind = isRow
          ? getter.getIndexByRowKey(k)
          : getter.getIndexByColumnKey(k);
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
