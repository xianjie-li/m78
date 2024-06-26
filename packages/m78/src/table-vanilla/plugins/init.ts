import { TableLoadStage, TablePlugin } from "../plugin.js";
import {
  simplyDeepClone,
  getNamePathValue,
  isEmpty,
  isNumber,
  isObject,
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
  tableDefaultTexts,
} from "../common.js";
import { _TableGetterPlugin } from "./getter.js";
import { addCls } from "../../common/index.js";
import {
  TableColumnFixed,
  TableKey,
  TableRowFixed,
} from "../types/base-type.js";

import { TableColumnLeafConfigFormatted } from "../types/items.js";
import { _TableHidePlugin } from "./hide.js";
import { _TableIsPlugin } from "./is.js";
import { _TableRenderPlugin } from "./render.js";

/**
 * 进行配置整理/预计算等
 * */
export class _TableInitPlugin extends TablePlugin {
  render: _TableRenderPlugin;

  init() {
    this.render = this.getPlugin(_TableRenderPlugin);

    addCls(this.config.el, "m78-table");

    this.createDom();

    this.mergeTexts();

    this.clonePersistenceConfigToCtx();

    this.fullHandle();
  }

  fullHandle() {
    this.stageEmit(TableLoadStage.fullHandle, true);
    this.stageEmit(TableLoadStage.initBaseInfo, true);

    this.initBaseInfo();

    this.stageEmit(TableLoadStage.initBaseInfo, false);
    this.stageEmit(TableLoadStage.formatBaseInfo, true);

    this.formatBaseInfo();

    this.stageEmit(TableLoadStage.formatBaseInfo, false);
    this.stageEmit(TableLoadStage.fullHandle, false);

    this.indexHandle();
  }

  /** 为当前ctx.data/columns创建索引, 并合并持久化配置 对应TableReloadLevel.index */
  indexHandle() {
    this.stageEmit(TableLoadStage.indexHandle, true);

    this.mergeTexts();

    this.stageEmit(TableLoadStage.mergePersistenceConfig, true);

    // 合并持久化配置, 注意, 在此之前对cell/column/row配置项的访问应通过 getRowMergeConfig/getColumnMergeConfig等api进行
    this.mergePersistenceConfig();

    this.stageEmit(TableLoadStage.mergePersistenceConfig, false);
    this.stageEmit(TableLoadStage.updateIndexAndMerge, true);

    this.updateIndexAndMerge();

    this.stageEmit(TableLoadStage.updateIndexAndMerge, false);

    this.indexEndHandle();

    this.stageEmit(TableLoadStage.indexHandle, false);

    this.baseHandle();
  }

  /** 基础预处理, 减少后续渲染的计算工作, , 对应TableReloadLevel.base */
  baseHandle() {
    this.stageEmit(TableLoadStage.baseHandle, true);
    this.stageEmit(TableLoadStage.resetCache, true);

    const ctx = this.context;

    ctx.mergeMapMain = {};
    ctx.mergeMapSub = {};
    ctx.lastMergeXMap = {};
    ctx.lastMergeYMap = {};
    ctx.topFixedMap = {};
    ctx.bottomFixedMap = {};
    ctx.leftFixedMap = {};
    ctx.rightFixedMap = {};
    ctx.topFixedList = [];
    ctx.bottomFixeList = [];
    ctx.leftFixedList = [];
    ctx.rightFixedList = [];

    this.stageEmit(TableLoadStage.resetCache, false);
    this.stageEmit(TableLoadStage.preHandleSize, true);

    this.preHandleSize();

    this.stageEmit(TableLoadStage.preHandleSize, false);

    this.preCalcLastInfo();

    this.preHandleMerge();

    this.stageEmit(TableLoadStage.baseHandle, false);
  }

  /** 拷贝data/columns/persistenceConfig等需要本地化的配置 */
  initBaseInfo() {
    const ctx = this.context;

    ctx.data = this.config.data.slice();

    ctx.rowCache = {};
    ctx.columnCache = {};
    ctx.cellCache = {};

    ctx.columns = [];
    ctx.cells = {};
    ctx.rows = {};

    ctx.backupRows = {};
    ctx.backupCells = {};
    ctx.backupColumns = {};
    ctx.backupFirstColumns = {};
    ctx.backupFirstRows = {};
    ctx.backupFirstCells = {};

    ctx.autoMovedRows = [];
  }

  /** 将data/columns进行预处理, 移动固定项到固定后位置, 并在原位置添加占位项 */
  formatBaseInfo() {
    const ctx = this.context;
    const { columns, data, rows } = ctx;

    const listX: TableColumnLeafConfigFormatted[] = [];
    const listY: any[] = [];

    const lf: TableColumnLeafConfigFormatted[] = [];
    const rf: TableColumnLeafConfigFormatted[] = [];
    const tf: any[] = [];
    const bf: any[] = [];

    // 添加获取合并项和配置项的方法

    // 从行头/表头开始, 拷贝并备份数据, 然后将fixed项移植首尾位置

    for (let i = 1; i < columns.length; i++) {
      let cur = columns[i];
      cur = ctx.getColumnMergeConfig(cur.key, cur);

      if (cur.fixed && cur.fixed !== TableColumnFixed.none) {
        const meta = ctx.getColumnMeta(cur.key);

        meta.fixed = true;

        if (cur.fixed === TableColumnFixed.left) {
          lf.push(cur);
        } else {
          rf.push(cur);
        }
      } else {
        listX.push(cur);
      }
    }

    for (let i = ctx.yHeaderKeys.length; i < data.length; i++) {
      const cur = data[i];
      const key = cur[this.config.primaryKey];
      let conf = rows[key];

      conf = ctx.getRowMergeConfig(key, conf);

      if (conf && conf.fixed && conf.fixed !== TableRowFixed.none) {
        const meta = ctx.getRowMeta(key);

        meta.fixed = true;

        // 记录移动前的位置
        ctx.autoMovedRows.push({
          key,
          from: i - ctx.yHeaderKeys.length,
        });

        if (conf.fixed === TableRowFixed.top) {
          tf.push(cur);
        } else {
          bf.push(cur);
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

  mergePersistenceConfig() {
    const ctx = this.context;

    const pConfig = ctx.persistenceConfig;

    // 合并持久化rows
    if (isObject(pConfig.rows)) {
      Object.entries(pConfig.rows).forEach(([key, value]) => {
        this.persistenceConfigHandle(
          ctx.rows,
          ctx.backupRows,
          ctx.backupFirstRows,
          key,
          value
        );
      });
    }

    // 合并持久化cells
    if (isObject(pConfig.cells)) {
      Object.entries(pConfig.cells).forEach(([key, value]) => {
        this.persistenceConfigHandle(
          ctx.cells,
          ctx.backupCells,
          ctx.backupFirstCells,
          key,
          value
        );
      });
    }

    // 合并持久化columns
    if (isObject(pConfig.columns)) {
      ctx.columns.forEach((cur, i) => {
        // 存在持久化配置时, 对其进行合并等操作
        const persistenceConf = getNamePathValue(pConfig.columns, cur.key);

        if (persistenceConf) {
          this.persistenceConfigHandle(
            ctx.columns,
            ctx.backupColumns,
            ctx.backupFirstColumns,
            cur.key,
            persistenceConf,
            i
          );
        }
      });
    }
  }

  /** 一些需要在updateIndexAndMerge完成之后进行的操作 */
  indexEndHandle() {
    const ctx = this.context;

    const rowHeaderConf = ctx.columns[0];

    // 同步行头尺寸
    if (
      rowHeaderConf &&
      rowHeaderConf.key === ctx.xHeaderKey &&
      isNumber(rowHeaderConf.width)
    ) {
      ctx.xHeaderWidth = rowHeaderConf.width;
    }
  }

  /** 处理dataKeyIndexMap/columnKeyIndexMap, 合并persistenceConfig.columns/rows/cells 至ctx上同名配置 */
  updateIndexAndMerge() {
    const ctx = this.context;

    ctx.ignoreXList = [];
    ctx.ignoreYList = [];

    ctx.allRowKeys = [];
    ctx.allColumnKeys = [];

    const dataMap: any = {};
    const columnMap: any = {};

    // 列索引/合并持久化配置
    ctx.columns.forEach((cur, i) => {
      // 在此处确保所有key都是可用的, 后续代码中就可以直接安全取用了
      if (!isString(cur.key) && !isNumber(cur.key)) {
        throwError(
          `No key obtained in column. ${JSON.stringify(cur, null, 4)}`,
          _prefix
        );
      }

      const meta = ctx.getColumnMeta(cur.key);

      const ignore = ctx.isIgnoreColumn(cur.key, meta);
      const fake = meta.fake;

      if (!fake && !ignore) {
        ctx.allColumnKeys.push(cur.key);
      }

      if (ignore) {
        ctx.ignoreXList.push(i);
      }

      columnMap[cur.key] = i;
    });

    // 行索引
    ctx.data.forEach((cur, i) => {
      const k = this.table.getKeyByRowData(cur);

      // 在此处确保所有key都是可用的, 后续代码中就可以直接安全取用了
      if (!isString(k) && !isNumber(k)) {
        throwError(
          `No key obtained in row. ${JSON.stringify(cur, null, 4)}`,
          _prefix
        );
      }

      const meta = ctx.getRowMeta(k);

      const fake = meta.fake;
      const ignore = ctx.isIgnoreRow(k, meta);

      if (!fake && !ignore) {
        ctx.allRowKeys.push(k);
      }

      if (ignore) {
        ctx.ignoreYList.push(i);
      }

      dataMap[k] = i;
    });

    ctx.dataKeyIndexMap = dataMap;
    ctx.columnKeyIndexMap = columnMap;
  }

  /**
   * row/cells持久化处理通用逻辑, 根据情况备份/还原/合并持久化配置到当前配置
   *
   * @param map 对应的配置, 比如ctx.rows/ctx.cells
   * @param backupMap 对应的备份配置, 比如ctx.backupRows/ctx.backupCells
   * @param backupFirstMap 对应的备份配置, 如backupFirstColumns
   * @param key 对应map中的key
   * @param conf 需要合并的持久化配置
   * @param index 对应map中的index, 如果map是一个数组
   * */
  persistenceConfigHandle(
    map: any,
    backupMap: any,
    backupFirstMap: any,
    key: TableKey,
    conf: any,
    index?: number
  ) {
    const indOrKey = isNumber(index) ? index : key;

    const backup = backupMap[key];

    if (map === this.context.columns) {
      if (this.context.isIgnoreColumn(key)) return;
    }

    if (!map[indOrKey]) {
      map[indOrKey] = {};
    }

    // 记录首个值
    if (!backupFirstMap[key]) {
      backupFirstMap[key] = { ...map[indOrKey] };
    }

    // 合并
    Object.assign(map[indOrKey], conf);

    // 清理无效配置, 若存在首个配置记录, 还原为首个配置
    if (backup) {
      this.persistenceConfigCleanHandle(
        map[indOrKey],
        backup,
        conf || {},
        backupFirstMap[key]
      );
    }

    backupMap[key] = { ...conf };
  }

  // 根据传入的最新current和历史backup配置, 从obj中清理backup中存在但current不存在的配置
  persistenceConfigCleanHandle(
    obj: any,
    backup: any,
    current: any,
    first: any
  ) {
    const backupKeys = Object.keys(backup);
    const currentKeys = Object.keys(current);

    const diffKeys = backupKeys.filter((k) => !currentKeys.includes(k));

    diffKeys.forEach((k) => {
      if (first[k] !== undefined) {
        obj[k] = first[k];
        return;
      }
      delete obj[k];
    });
  }

  /** 预处理尺寸/固定项相关信息 */
  preHandleSize() {
    const { columnWidth, rowHeight } = this.config;

    const ctx = this.context;

    const is = this.getPlugin(_TableIsPlugin);

    const { columns, rows, data } = ctx;

    const ignoreDataLength = ctx.ignoreYList.length;
    const ignoreColumnLength = ctx.ignoreXList.length;

    let leftFixedWidth = 0;
    let rightFixedWidth = 0;

    let contentWidth = (columns.length - ignoreColumnLength) * columnWidth!;

    // x轴
    columns.forEach((c) => {
      const meta = ctx.getColumnMeta(c.key);
      const ignore = ctx.isIgnoreColumn(c.key, meta);

      const w = isNumber(c.width) ? c.width : columnWidth!;

      if (c.fixed && c.fixed !== TableColumnFixed.none) {
        if (c.fixed === TableColumnFixed.left) {
          if (!ignore) {
            ctx.leftFixedMap[c.key] = {
              offset: leftFixedWidth,
              viewPortOffset: leftFixedWidth,
              config: c,
            };
            leftFixedWidth += w;
            ctx.leftFixedList.push(c.key);
          }
        }

        if (c.fixed === TableColumnFixed.right) {
          if (!ignore) {
            ctx.rightFixedMap[c.key] = {
              offset: rightFixedWidth,
              viewPortOffset: rightFixedWidth,
              config: c,
            };
            rightFixedWidth += w;
            ctx.rightFixedList.push(c.key);
          }
        }
      }

      if (!ignore) {
        contentWidth -= columnWidth!;
        contentWidth += w;
      }
    });

    ctx.leftFixedWidth = leftFixedWidth;
    ctx.rightFixedWidth = rightFixedWidth;
    ctx.contentWidth = contentWidth;

    const rowKeys = Object.keys(rows!)
      .filter((key) => is.isRowExist(key))
      .sort((a, b) => {
        const aIndex = ctx.dataKeyIndexMap[a];
        const bIndex = ctx.dataKeyIndexMap[b];

        return aIndex - bIndex;
      });

    let topFixedHeight = 0;
    let bottomFixedHeight = 0;
    let contentHeight = (data.length - ignoreDataLength) * rowHeight!;

    // y轴
    rowKeys.forEach((key) => {
      const cur = rows![key];

      const h = isNumber(cur.height) ? cur.height : rowHeight!;

      if (cur.fixed && cur.fixed !== TableRowFixed.none) {
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

    // 此处固定项尺寸已确定, 需要立即更新容器尺寸, 否则后续的clientWidth等信息计算会不准确
    this.render.updateWrapSize();

    const rightFixedStart = this.config.el.clientWidth - rightFixedWidth;
    const bottomFixedStart = this.config.el.clientHeight - bottomFixedHeight;

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
      if (ctx.isIgnoreColumn(cur.key)) continue;
      if (!ctx.rightFixedMap[cur.key]) {
        ctx.lastColumnKey = cur.key;
        break;
      }
    }

    for (let i = ctx.data.length - 1; i >= 0; i--) {
      const cur = ctx.data[i];
      const key = cur[this.config.primaryKey];
      if (ctx.isIgnoreRow(key)) continue;
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

    const is = this.getPlugin(_TableIsPlugin);

    Object.entries(cells!).forEach(([k, conf]) => {
      if (!conf.mergeX && !conf.mergeY) return;

      const keys = _getCellKeysByStr(k);

      if (keys.length !== 2) return;

      const [rowKey, columnKey] = keys;

      if (!is.isRowExist(rowKey) || !is.isColumnExist(columnKey)) {
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
    const is = this.getPlugin(_TableIsPlugin);
    const sortHide = this.getPlugin(_TableHidePlugin);

    const key = start;
    const originalInd = isRow
      ? getter.getIndexByRowKey(key)
      : getter.getIndexByColumnKey(key);

    const fixed = isRow ? rows![key]?.fixed : columns![originalInd]?.fixed;

    // 主项是否是固定项
    const isMainFixed = !!fixed && fixed !== TableColumnFixed.none;

    const mergeList: TableKey[] = [];
    let size = 0;
    let ind = originalInd;
    // let fixedList: TableKey[] = [];
    //
    // if (isMainFixed) {
    //   if (fixed === TableRowFixed.top) fixedList = ctx.topFixedList;
    //   if (fixed === TableRowFixed.bottom) fixedList = ctx.bottomFixeList;
    //   if (fixed === TableColumnFixed.left) fixedList = ctx.leftFixedList;
    //   if (fixed === TableColumnFixed.right) fixedList = ctx.rightFixedList;
    // }

    while (mergeNum > 0) {
      const exist = isRow
        ? is.isRowExistByIndex(ind)
        : is.isColumnExistByIndex(ind);

      if (!exist) break;

      const _key = isRow
        ? getter.getKeyByRowIndex(ind)
        : getter.getKeyByColumnIndex(ind);

      const originalInd = isRow
        ? getter.getIndexByRowKey(_key)
        : getter.getIndexByColumnKey(_key);

      const conf = isRow ? rows![_key] : columns![originalInd];

      const isFixed = !!conf?.fixed && conf.fixed !== TableColumnFixed.none;

      // 根据主项是否是固定项做不同处理

      if (!isMainFixed) {
        // 合并项不是fixed时, 跳过fixed的被合并项
        if (isFixed) {
          ind++;
          continue;
        }

        if (isRow && ind >= data!.length) break;
        if (!isRow && ind >= columns!.length) break;
      }

      const cSize = isRow ? (conf as any)?.height : (conf as any)?.width;
      const defSize = isRow ? rowHeight : columnWidth;
      const s = isNumber(cSize) ? cSize : defSize!;

      const isHideColumn = sortHide.isHideColumn(_key);

      const isIgnore = isRow ? ctx.isIgnoreRow(_key) : ctx.isIgnoreColumn(_key);

      if (isHideColumn) {
        // 跳过隐藏列, 不计入尺寸
        mergeNum--;
        mergeList.push(_key);
      } else if (isIgnore) {
        // 忽略ignore列

        ind++;
        continue;
      } else {
        mergeList.push(_key);

        size += s;
        mergeNum--;
      }

      ind += 1;

      if (isMainFixed) {
        const conf = isRow
          ? rows![getter.getKeyByRowIndex(ind)]
          : columns![ind];

        if (!conf || !conf.fixed || conf.fixed !== TableColumnFixed.none) break;

        // const curConf = this.

        // const curInd = fixedList.indexOf(_key);
        //
        // if (curInd === fixedList.length - 1) break;
        //
        // if (!isHideColumn && curInd === -1) break;
        //
        // const k = fixedList[curInd + 1];
        // ind = isRow
        //   ? getter.getIndexByRowKey(k)
        //   : getter.getIndexByColumnKey(k);
      }
    }

    return {
      size,
      mergeList,
    };
  }

  /** 基础容器创建&初始化 */
  createDom() {
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

    // 将相关dom节点关联到table instance
    this.table.el = this.config.el;
    this.table.viewEl = ctx.viewEl;
    this.table.viewContentEl = ctx.viewContentEl;
    this.table.stageEL = ctx.stageEL;
  }

  /** 合并消息文本 */
  mergeTexts() {
    this.context.texts = {
      ...tableDefaultTexts,
      ...this.config.texts,
    };
  }

  /** 克隆 config.persistenceConfig 到 context.persistenceConfig */
  clonePersistenceConfigToCtx() {
    this.context.persistenceConfig = isObject(this.config.persistenceConfig)
      ? simplyDeepClone(this.config.persistenceConfig)
      : {};
  }

  /** 触发插件loadStage不同阶段 */
  stageEmit(stage: TableLoadStage, isBefore: boolean) {
    this.plugins.forEach((plugin) => plugin.loadStage?.(stage, isBefore));
  }
}
