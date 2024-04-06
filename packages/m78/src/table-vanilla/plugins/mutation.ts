import { TablePlugin } from "../plugin.js";
import {
  AnyObject,
  createRandString,
  simplyDeepClone,
  deleteNamePathValue,
  ensureArray,
  getNamePathValue,
  isArray,
  isObject,
  isString,
  isTruthyOrZero,
  NamePath,
  recursionShakeEmpty,
  setNamePathValue,
  throwError,
  uniq,
  clearObject,
} from "@m78/utils";
import { TableReloadLevel, TableReloadOptions } from "./life.js";
import { TablePersistenceConfig } from "../types/config.js";
import {
  TableColumnFixed,
  TableColumnFixedUnion,
  TableKey,
  TableRowFixed,
  TableRowFixedUnion,
} from "../types/base-type.js";
import {
  TableCell,
  TableColumn,
  TableItems,
  TableRow,
} from "../types/items.js";
import { _getCellKey, _getCellKeysByStr, _prefix } from "../common.js";
import { _TableSortColumnPlugin } from "./sort-column.js";
import { _TableFormPlugin } from "./form/form.js";

/**
 * config/data变更相关的操作, 变异操作尽量集中在此处并需要新增和触发 TableMutationDataType 事件/处理操作历史等
 *
 * 配置变更/单元格值编辑/增删行列/行列排序/隐藏列
 *
 * 其他: soft-remove.ts 由于并不会直接操作数据, 在单独插件维护, 但仍触发mutation事件
 * */
export class _TableMutationPlugin extends TablePlugin {
  /** 每一次配置变更将变更的key记录, 通过记录来判断是否有变更项 */
  private changedConfigKeys: (keyof TablePersistenceConfig)[] = [];

  sortColumn: _TableSortColumnPlugin;

  form: InstanceType<typeof _TableFormPlugin>;

  // 对已经过clone的row.data进行标记
  clonedFlag = new Map<TableKey, boolean>();

  // 记录变更过的行
  private changedRows: Record<string, boolean> = {};

  init() {
    this.form = this.getPlugin(_TableFormPlugin);

    this.sortColumn = this.getPlugin(_TableSortColumnPlugin);
  }

  beforeInit() {
    this.methodMapper(this.table, [
      "getChangedConfigKeys",
      "getPersistenceConfig",
      "setPersistenceConfig",
      "addRow",
      "removeRow",
      "moveRow",
      "moveColumn",
      "setValue",
      "getValue",
      "setRowValue",
    ]);
  }

  reload(opt: TableReloadOptions = {}) {
    if (opt.level === TableReloadLevel.full) {
      this.changedConfigKeys = [];
      this.clonedFlag = new Map();
    }
  }

  /**
   * 设置ctx.persistenceConfig中的项, 并自动生成历史记录, 设置后, 原有值会被备份(引用类型会深拷贝), 并在执行undo操作时还原
   * */
  setPersistenceConfig: TableMutation["setPersistenceConfig"] = (
    key: NamePath,
    newValue: any,
    actionName?: string
  ) => {
    const conf = this.context.persistenceConfig;
    let old = getNamePathValue(conf, key);

    if (typeof old === "object") {
      old = simplyDeepClone(old);
    }

    const keyList = ensureArray(key);
    const first: any = keyList[0];

    const highlightItems = this.getHighlightKeys(key, newValue);

    const redo = () => {
      setNamePathValue(conf, key, newValue);

      let value = getNamePathValue(conf, first);

      if (typeof value === "object") {
        value = recursionShakeEmpty(simplyDeepClone(value));
      }

      const event: TableMutationConfigEvent = {
        type: TableMutationType.config,
        key: first,
        value,
        detailKeys: key,
      };

      this.changedConfigKeys.push(first);

      this.table.event.mutation.emit(event);

      this.table.reloadSync({
        keepPosition: true,
        level: TableReloadLevel.index,
      });

      if (!this.table.isTaking()) {
        this.highlightHandler(highlightItems);
      }
    };

    const undo = () => {
      if (old === undefined) {
        deleteNamePathValue(conf, key);
      } else {
        setNamePathValue(conf, key, old);
      }

      let value = getNamePathValue(conf, first);

      if (typeof value === "object") {
        value = recursionShakeEmpty(simplyDeepClone(value));
      }

      const event: TableMutationConfigEvent = {
        type: TableMutationType.config,
        key: first,
        value,
        detailKeys: key,
      };

      // 删除变更记录, 可能有多项, 若包含同名key, 每次只应删除一项
      const ind = this.changedConfigKeys.indexOf(first);
      if (ind > -1) {
        this.changedConfigKeys.splice(ind, 1);
      }

      this.table.event.mutation.emit(event);

      this.table.reloadSync({
        keepPosition: true,
        level: TableReloadLevel.index,
      });

      if (!this.table.isTaking()) {
        this.highlightHandler(highlightItems);
      }
    };

    const action = {
      redo,
      undo,
      title: actionName,
    };

    this.table.history.redo(action);
  };

  /** 获取发生变更的持久化配置 */
  getChangedConfigKeys: TableMutation["getChangedConfigKeys"] = () => {
    return uniq(this.changedConfigKeys);
  };

  /** 获取当前持久化配置 */
  getPersistenceConfig: TableMutation["getPersistenceConfig"] = () => {
    return recursionShakeEmpty(simplyDeepClone(this.context.persistenceConfig));
  };

  addRow: TableMutation["addRow"] = (data, to, insertAfter) => {
    let index = -1;

    if (!to) {
      // 常规项第一项
      index = this.context.topFixedList.length;
    } else {
      if (this.context.yHeaderKeys.includes(to)) {
        console.warn(`[${_prefix}] addRow: can't add row to header`);
        return;
      }

      const toRow: TableRow = { ...this.table.getRow(to) };

      if (toRow.isFixed) {
        console.warn(`[${_prefix}] addRow: can't add row to fixed row`);
        return;
      }

      index = toRow.realIndex;

      if (insertAfter) {
        index = index + 1;
      }
    }

    if (index < this.context.yHeaderKeys.length) {
      index = this.context.topFixedList.length;
    }

    if (index === -1) return;

    // 需要移动到的索引位置

    const list = ensureArray(data);

    const newData = list.map((i) => {
      if (!isObject(i)) i = {};
      const key = i[this.config.primaryKey];

      // 使用传入的key或随机分配一个
      const pKey = isTruthyOrZero(key) ? key : createRandString();

      this.context.getRowMeta(pKey).new = true;

      return {
        ...i,
        [this.config.primaryKey]: pKey,
      };
    });

    this.table.history.redo({
      title: this.context.texts["add row"],
      redo: () => {
        this.context.data.splice(index!, 0, ...newData);

        this.table.event.mutation.emit(
          _getBlankMutationDataEvent({
            changeType: TableMutationDataType.add,
            add: [...newData],
          })
        );

        this.table.reloadSync({
          keepPosition: true,
          level: TableReloadLevel.index,
        });

        if (!this.table.isTaking()) {
          this.table.highlightRow(
            newData.map((i) => this.table.getKeyByRowData(i))
          );
        }
      },
      undo: () => {
        this.context.data.splice(index!, newData.length);

        this.table.event.mutation.emit(
          _getBlankMutationDataEvent({
            changeType: TableMutationDataType.remove,
            remove: [...newData],
          })
        );

        this.table.reloadSync({
          keepPosition: true,
          level: TableReloadLevel.index,
        });
      },
    });
  };

  removeRow: TableMutation["removeRow"] = (key) => {
    const { list } = this.getIndexData(key);

    if (!list.length) return;

    const remove = list.map((i) => i.data);
    const rows = list.map((i) => i.ins);

    const rowKeys = rows.map((i) => i.key);
    const cellKeys = rows
      .map((i) => {
        return this.context.allColumnKeys.map((cKey) =>
          _getCellKey(i.key, cKey)
        );
      })
      .flat();

    this.table.history.redo({
      title: this.context.texts["remove row"],
      redo: () => {
        // 移除删除项的选中状态
        this.table.unselectRows(rowKeys);
        this.table.unselectCells(cellKeys);

        for (let i = list.length - 1; i >= 0; i--) {
          const cur = list[i];

          this.context.data.splice(cur.index, 1);
        }

        this.table.event.mutation.emit(
          _getBlankMutationDataEvent({
            changeType: TableMutationDataType.remove,
            remove,
          })
        );

        this.table.reloadSync({
          keepPosition: true,
          level: TableReloadLevel.index,
        });
      },
      undo: () => {
        for (let i = 0; i < list.length; i++) {
          const cur = list[i];

          this.context.data.splice(cur.index, 0, cur.data);
        }

        this.table.event.mutation.emit(
          _getBlankMutationDataEvent({
            changeType: TableMutationDataType.add,
            add: remove,
          })
        );

        this.table.reloadSync({
          keepPosition: true,
          level: TableReloadLevel.index,
        });

        if (!this.table.isTaking()) {
          this.table.highlightRow(rows.map((i) => i.key));
        }
      },
    });
  };

  // 难点在于固定项/常规项间的转换, 以及固定项虚拟项的处理
  moveRow: TableMutation["moveRow"] = (key, to, insertAfter) => {
    if (this.context.yHeaderKeys.includes(to)) {
      console.warn(`[${_prefix}] moveRow: can't move row to header`);
      return;
    }

    this.moveCommon(key, to, true, insertAfter);
  };

  getValue: TableMutation["getValue"] = (a, b?: any) => {
    const [cell] = this.valueActionGetter(a, b);

    if (!cell) return;

    return getNamePathValue(cell.row.data, cell.column.config.originalKey);
  };

  setValue: TableMutation["setValue"] = (a, b, c?: any) => {
    // eslint-disable-next-line prefer-const
    let [cell, value] = this.valueActionGetter(a, b, c);

    if (!cell) return;

    if (!this.form.validCheck(cell)) return;

    if (isString(value)) {
      value = value.trim();
    }

    const { row, column } = cell;

    // 若行未变更过, 将其完全clone, 避免更改原数据
    this.ensureCloneAndSetRowData(row);

    const ov = getNamePathValue(row.data, column.config.originalKey);

    const oldValue = typeof ov === "object" ? simplyDeepClone(ov) : ov;

    this.table.history.redo({
      redo: () => {
        setNamePathValue(row.data, column.config.originalKey, value);

        const event: TableMutationValueEvent = {
          type: TableMutationType.value,
          cell: cell!,
          value,
          oldValue,
        };

        this.table.event.mutation.emit(event);

        this.table.render();

        this.table.highlight(event.cell.key, false);
      },
      undo: () => {
        if (oldValue === undefined) {
          deleteNamePathValue(row.data, column.config.originalKey);
        } else {
          setNamePathValue(row.data, column.config.originalKey, oldValue);
        }

        const event: TableMutationValueEvent = {
          type: TableMutationType.value,
          cell: cell!,
          value: oldValue,
          oldValue: value,
        };

        this.table.event.mutation.emit(event);

        this.table.render();

        this.table.highlight(event.cell.key, false);
      },
      title: this.context.texts["set value"],
    });
  };

  setRowValue: TableMutation["setRowValue"] = (row, data) => {
    let _row: TableRow;

    if (this.table.isRowLike(row)) {
      _row = row;
    } else {
      _row = this.table.getRow(row);
    }

    // 若行未变更过, 将其完全clone, 避免更改原数据
    this.ensureCloneAndSetRowData(_row);

    let oldValue: any;

    this.table.history.redo({
      redo: () => {
        oldValue = clearObject(_row.data);

        Object.assign(_row.data, data, {
          [this.config.primaryKey]: _row.key,
        });

        const event: TableMutationRowValueEvent = {
          type: TableMutationType.rowValue,
          row: _row,
          value: data,
          oldValue,
        };

        this.table.event.mutation.emit(event);

        this.table.render();

        this.table.highlightRow(_row.key, true);
      },
      undo: () => {
        clearObject(_row.data);

        Object.assign(_row.data, oldValue, {
          [this.config.primaryKey]: _row.key,
        });

        const event: TableMutationRowValueEvent = {
          type: TableMutationType.rowValue,
          row: _row,
          value: oldValue,
          oldValue: data,
        };

        this.table.event.mutation.emit(event);

        this.table.render();

        this.table.highlightRow(_row.key, true);
      },
      title: this.context.texts["set value"],
    });
  };

  /** 克隆并重新设置row的data, 防止变更原数据, 主要用于写时clone, 可以在数据量较大时提升初始化速度, 若行数据已经过克隆则忽略  */
  private ensureCloneAndSetRowData(row: TableRow) {
    if (this.clonedFlag.get(row.key)) return;

    const cloneData = simplyDeepClone(row.data);
    const ind = this.context.dataKeyIndexMap[row.key];

    row.data = cloneData;
    this.context.data[ind] = cloneData;

    this.clonedFlag.set(row.key, true);
  }

  /** 处理setValue/getValue的不同参数, 并返回cell和value */
  private valueActionGetter(a: any, b: any, c?: any) {
    let cell: TableCell | null = null;
    let value: any;

    if (this.table.isCellLike(a)) {
      cell = a;
      value = b;
    } else if (this.table.isRowLike(a) && this.table.isColumnLike(b)) {
      cell = this.table.getCell(a.key, b.key);
      value = c;
    } else if (this.table.isTableKey(a) && this.table.isTableKey(b)) {
      cell = this.table.getCell(a, b);
      value = c;
    }

    if (!cell) return [cell, value] as const;

    if (cell.row.isHeader || cell.column.isHeader)
      return [null, value] as const;

    return [cell, value] as const;
  }

  private moveColumn: TableMutation["moveColumn"] = (key, to, insertAfter) => {
    if (this.context.xHeaderKey === to) {
      console.warn(`[${_prefix}] moveColumn: can't move column to header`);
      return;
    }

    if (this.context.hasMergeHeader) {
      console.warn(
        `[${_prefix}] persistenceConfig.sortColumns: Can not sort column when has merge header`
      );
      return;
    }

    this.moveCommon(key, to, false, insertAfter);
  };

  /** move的通用逻辑, isRow控制是row还是column */
  private moveCommon(
    key: TableKey | TableKey[],
    to: TableKey,
    isRow: boolean,
    insertAfter?: boolean
  ) {
    const { list } = this.getIndexData(key, isRow);

    if (!list.length) return;

    const toIns = isRow
      ? { ...this.table.getRow(to) }
      : { ...this.table.getColumn(to) };

    const toFixedConf = toIns.config.fixed;

    // 是否是固定项
    const isToFixed = toIns.isFixed;

    // 插入到数据中的目标索引
    let toIndex = toIns.realIndex + (insertAfter ? 1 : 0);

    // 小于目标位置的项总数, 用来修正最终的目标位置
    let lessCount = 0;

    // 目标项在实际数据中的位置
    let toDataIndex = toIns.dataIndex + (insertAfter ? 1 : 0);

    // 小于目标在数据中实际位置的总数
    let lessToDataCount = 0;

    // 需要移除的项 (倒序)
    const removeList: _DataIndexInfo[] = [];

    // 所有待移动的项
    const moveList: _DataIndexInfo[] = [];

    for (let i = 0; i < list.length; i++) {
      const cur = list[i];

      // 每一个在前方的删除项都使目标索引修正减一
      if (cur.index < toIndex) {
        lessCount++;
      }

      // dataIndex可以排除非数据的改动
      if (cur.ins.dataIndex < toDataIndex) {
        lessToDataCount++;
      }

      // 需要从大到小排序,方便删除时不打乱索引
      removeList.unshift(cur);

      moveList.push(cur);
    }

    // 修正目标索引
    toIndex -= lessCount;
    toDataIndex -= lessToDataCount;

    // 参与操作的数据源
    const dataList = isRow ? this.context.data : this.context.columns;

    // 所有新增项
    const addList: _MoveItem[] = [];

    // 用于事件通知的列表
    const eventList: _MoveItem[] = [];

    // 生成addList列表, 处理toFixed项的占位项
    moveList.forEach((i, ind) => {
      // 由fixed项转换为常规项
      const itemIsToFixed = !i.ins.isFixed && toIns.isFixed;

      // 由fixed项转换为常规项
      const isToNormal = i.ins.isFixed && !toIns.isFixed;

      // 固定项到固定项
      const isFixedToFixed = i.ins.isFixed && toIns.isFixed;

      const oData: _MoveItem = {
        data: i.originalData,
        formIndex: i.index,
        index: toIndex + ind,
        key: i.ins.key,
        isToNormal,
        isFixedToFixed,
        isToFixed: itemIsToFixed,
        dataFrom: i.ins.dataIndex,
        dataTo: toDataIndex + ind,
        fixedConf: i.ins.config.fixed,
      };

      addList.push(oData);

      eventList.push(oData);
    });

    // 按索引顺序排序
    addList.sort((a, b) => a.index - b.index);

    // 通知autoMove
    if (isRow) {
      this.autoMoveHandle();
    }

    const redo = () => {
      this.table.takeover(() => {
        // 移除项
        for (let i = 0; i < removeList.length; i++) {
          const cur = removeList[i];
          dataList.splice(cur.index, 1);
        }

        for (let ind = 0; ind < addList.length; ind++) {
          const i = addList[ind];

          // 添加到list
          dataList.splice(i.index, 0, i.data);

          // 更新fixed为目标配置
          if (isToFixed || i.isToNormal) {
            // 同步固定项配置
            this.table.history.ignore(() => {
              this.setPersistenceConfig(
                [isRow ? "rows" : "columns", i.key, "fixed"],
                i.isToNormal // 转为常规项时, 为防止项本身配置为fixed, 通过传入none覆盖
                  ? toFixedConf || TableColumnFixed.none
                  : toFixedConf
              );
            });
          }

          const meta = isRow
            ? this.context.getRowMeta(i.key)
            : this.context.getColumnMeta(i.key);

          // 更新meta信息

          // 转换为fixed项
          if (isToFixed) {
            meta.fixed = true;
          }

          // fixed项转换为常规项
          if (i.isToNormal) {
            meta.fixed = false;
          }
        }

        // 行变更进行事件通知, 列变更同步sortColumns
        if (isRow) {
          this.table.event.mutation.emit(
            _getBlankMutationDataEvent({
              changeType: TableMutationDataType.move,
              move: eventList.map((mi) => ({
                from: mi.formIndex,
                to: mi.index,
                dataFrom: mi.dataFrom,
                dataTo: mi.dataTo,
                data: mi.data,
              })),
            })
          );
        } else {
          this.table.history.ignore(() => {
            this.setPersistenceConfig(
              "sortColumns",
              this.sortColumn.getColumnSortKeys()
            );
          });
        }

        this.table.reloadSync({
          keepPosition: true,
          level: TableReloadLevel.index,
        });
      });

      if (!this.table.isTaking()) {
        isRow
          ? this.table.highlightRow(eventList.map((i) => i.key))
          : this.table.highlightColumn(eventList.map((i) => i.key));
      }
    };

    const undo = () => {
      this.table.takeover(() => {
        // 移除添加项
        for (let ind = addList.length - 1; ind >= 0; ind--) {
          const i = addList[ind];

          // 从list移除
          dataList.splice(i.index, 1);

          // 非占位项且fixed有变更, 还原fixed配置
          if (isToFixed || i.isToNormal) {
            // 同步固定项配置
            this.table.history.ignore(() => {
              this.setPersistenceConfig(
                [isRow ? "rows" : "columns", i.key, "fixed"],
                i.fixedConf
              );
            });
          }

          const meta = isRow
            ? this.context.getRowMeta(i.key)
            : this.context.getColumnMeta(i.key);

          // 更新meta信息

          // 从fixed项还原为普通项
          if (isToFixed) {
            meta.fixed = false;
          }

          // 常规项还原为固定项
          if (i.isToNormal) {
            meta.fixed = true;
          }
        }

        // 恢复移除
        for (let i = removeList.length - 1; i >= 0; i--) {
          const cur = removeList[i];
          dataList.splice(cur.index, 0, cur.data);
        }

        // 行变更进行事件通知, 列变更同步sortColumns
        if (isRow) {
          this.table.event.mutation.emit(
            _getBlankMutationDataEvent({
              changeType: TableMutationDataType.move,
              move: eventList.map((mi) => ({
                from: mi.index,
                to: mi.formIndex,
                dataFrom: mi.dataTo,
                dataTo: mi.dataFrom,
                data: mi.data,
              })),
            })
          );
        } else {
          this.table.history.ignore(() => {
            this.setPersistenceConfig(
              "sortColumns",
              this.sortColumn.getColumnSortKeys()
            );
          });
        }

        this.table.reloadSync({
          keepPosition: true,
          level: TableReloadLevel.index,
        });
      });

      if (!this.table.isTaking()) {
        isRow
          ? this.table.highlightRow(eventList.map((i) => i.key))
          : this.table.highlightColumn(eventList.map((i) => i.key));
      }
    };

    this.table.history.redo({
      redo,
      undo,
      title: isRow
        ? this.context.texts["move row"]
        : this.context.texts["move column"],
    });
  }

  /** 获取方便用于删除/移动等操作的索引数据信息 */
  private getIndexData(key: TableKey | TableKey[], isRow = true) {
    const list = ensureArray(key);

    list.forEach((key) => {
      if (isRow && !this.table.isRowExist(key)) {
        throwError(`Row ${key} not exist`, _prefix);
      }

      if (!isRow && !this.table.isColumnExist(key)) {
        throwError(`Column ${key} not exist`, _prefix);
      }
    });

    // 相关项信息, 用于简化后续的增删操作
    const dataList: _DataIndexInfo[] = [];

    // 防止重复
    const existMap: any = {};

    // 查找出所有相关的项
    list.forEach((i) => {
      const ins = isRow ? this.table.getRow(i) : this.table.getColumn(i);

      const realData = isRow ? (ins as any).data : ins.config;

      if (existMap[ins.realIndex]) return;

      existMap[ins.realIndex] = true;

      dataList.push({
        index: ins.realIndex,
        data: realData,
        originalData: realData,
        ins,
        key: ins.key,
      });
    });

    // 根据索引排序
    dataList.sort((a, b) => a.index - b.index);

    return {
      /** 根据index排序后的列表 */
      list: dataList,
    };
  }

  /** 快速获取fixed虚拟项的index, 由于修改后的数据尚未同步缓存和索引, 所以需要此方法 */
  private getFixedIndex(
    key: TableKey,
    fixed: TableRowFixed | TableColumnFixed
  ) {
    const isRow = fixed === TableRowFixed.top || fixed === TableRowFixed.bottom;

    const list = isRow ? this.context.data : this.context.columns;

    for (let i = 0; i < list.length; i++) {
      const cur = list[i];

      const k = isRow ? this.table.getKeyByRowData(cur) : cur.key;

      if (key === k) {
        return i;
      }
    }

    return -1;
  }

  /** 根据setPersistenceConfig入参 "尽可能合理" 的方式获取需要高亮的项 */
  private getHighlightKeys(key: NamePath, newValue: any): TableItems {
    const rows: TableRow[] = [];
    const columns: TableColumn[] = [];
    const cells: TableCell[] = [];

    const keys = ensureArray(key);

    const first = keys[0];

    if (first === "columns" && keys.length > 1) {
      columns.push(this.table.getColumn(keys[1]));
    }

    if (first === "rows" && keys.length > 1) {
      rows.push(this.table.getRow(keys[1]));
    }

    if (first === "cells" && keys.length > 1) {
      const _keys = _getCellKeysByStr(String(keys[1]));

      if (_keys.length === 2) {
        cells.push(this.table.getCell(_keys[0], _keys[1]));
      }
    }

    // sortColumns变更时, 定位到第一个变更的列
    if (first === "sortColumns" && isArray(newValue) && newValue.length) {
      const old = getNamePathValue(this.context.persistenceConfig, first);

      if (isArray(old) && old.length) {
        for (let i = 0; i < old.length; i++) {
          const cur = old[i];
          const nCur = newValue[i];
          if (nCur === undefined) break;
          if (cur !== nCur) {
            columns.push(this.table.getColumn(nCur));
            break;
          }
        }
      }
    }

    // hideColumns变更时, 将原本隐藏但不再隐藏的列高亮
    if (first === "hideColumns" && isArray(newValue)) {
      const old = getNamePathValue(this.context.persistenceConfig, first);

      if (isArray(old) && old.length) {
        old.forEach((i) => {
          const exist = newValue.find((it) => it === i);
          if (!exist) {
            columns.push(this.table.getColumn(i));
          }
        });
      }
    }

    return { rows, columns, cells };
  }

  /** 对传入的items执行高亮 */
  private highlightHandler = (items: TableItems) => {
    const { rows, columns, cells } = items;

    if (cells.length) {
      this.table.highlight(cells.map((i) => i.key));
      return;
    }

    if (rows.length) {
      this.table.highlightRow(rows.map((i) => i.key));
      return;
    }

    if (columns.length) {
      this.table.highlightColumn(columns.map((i) => i.key));
      return;
    }
  };

  /** 处理和触发auto move mutation, 即被自动移动的fixed项,  */
  private autoMoveHandle() {
    const autoList = this.context.autoMovedRows;

    if (!autoList.length) return;

    this.table.event.mutation.emit(
      _getBlankMutationDataEvent({
        changeType: TableMutationDataType.move,
        move: autoList.map((i) => {
          const row = this.table.getRow(i.key);

          return {
            from: row.index, // 数据位置在初始化时已固定, 无需通知
            to: row.index,
            dataFrom: i.from,
            dataTo: row.dataIndex,
            data: row.data,
          };
        }),
        isAutoMove: true,
      })
    );

    this.context.autoMovedRows = [];
  }
}

export enum TableMutationType {
  /** 持久化配置变更 */
  config = "config",
  /** 记录变更, 通常表示新增/删除/排序 */
  data = "data",
  /** 单元格值变更 */
  value = "value",
  /** 整行值发生变更 */
  rowValue = "rowValue",
}

/** TableMutationType.data变更的相关类型 */
export enum TableMutationDataType {
  /** 新增行 */
  add = "add",
  /** 删除行 */
  remove = "remove",
  /** 移动行 */
  move = "move",
  /** 软删除行 */
  softRemove = "softRemove",
  /** 恢复软删除 */
  restoreSoftRemove = "restoreSoftRemove",
}

export type TableMutationEvent =
  | TableMutationConfigEvent
  | TableMutationDataEvent
  | TableMutationValueEvent
  | TableMutationRowValueEvent;

/** 持久化配置变更事件 */
export interface TableMutationConfigEvent {
  /** 事件类型 */
  type: TableMutationType.config;
  /** 变更的key */
  key: keyof TablePersistenceConfig;
  /** 变更后的值 */
  value: any;
  /** 如果设置的是更深层的配置项, 此字段为变更项的key路径, 否则与key相同 */
  detailKeys: NamePath;
}

/** 持久化配置data变更事件 */
export interface TableMutationDataEvent {
  /** 事件类型 */
  type: TableMutationType.data;
  /** 变更类型 */
  changeType: TableMutationDataType;
  /** 新增的项 */
  add: AnyObject[];
  /** 删除的项 */
  remove: AnyObject[];
  /** 移动的项 */
  move: Array<{
    /** 移动前的index */
    from: number;
    /** 移动后的index */
    to: number;
    /** 在源数据中的from */
    dataFrom: number;
    /** 在源数据中的to */
    dataTo: number;
    /** 移动的行数据 */
    data: AnyObject;
  }>;
  /** 软删除的行或从软删除恢复的行 */
  soft: AnyObject[];
  /** 是否是自动触发的move操作, (被设置为fixed的项会在手动执行move操作前自动触发一次move) */
  isAutoMove: boolean;
}

/** 单元格值变更事件 */
export interface TableMutationValueEvent {
  /** 事件类型 */
  type: TableMutationType.value;
  /** 变更的单元格 */
  cell: TableCell;
  /** 变更前的值 */
  oldValue: any;
  /** 变更后的值 */
  value: any;
}

/** 行data变更事件 */
export interface TableMutationRowValueEvent {
  /** 事件类型 */
  type: TableMutationType.rowValue;
  /** 变更的行 */
  row: TableRow;
  /** 变更前的值 */
  oldValue: any;
  /** 变更后的值 */
  value: any;
}

export interface TableMutation {
  /** 获取发生了变更的持久化配置 */
  getChangedConfigKeys(): (keyof TablePersistenceConfig)[];

  /** 清理配置变更状态, 清理后getChangedConfigKeys()的返回将被重置为空, 不影响已变更的配置 */
  resetConfigState(): void;

  /** 获取当前持久化配置 */
  getPersistenceConfig(): TablePersistenceConfig;

  /**
   * 更新persistenceConfig配置, 并自动生成历史记录, 传入能够描述该操作的actionName有助于在撤销/重做事显示更友好的提示
   *
   * **example**
   * setPersistenceConfig("hideColumns", ["name", "age"]);  // 基本用法
   * setPersistenceConfig(["rows", "id18", "fixed"], true);  // 嵌套用法, 相当于设置 row["id18"].fixed = true
   * */
  setPersistenceConfig(key: NamePath, newValue: any, actionName?: string): void;

  /**
   * 新增记录
   * @param data - 新增的数据, 若数据不包含primaryKey, 会为其分配一个随机的key
   * @param to - 新增到的位置, 该位置的原有项后移; 不传时, 新增到表格顶部; to不能为固定行或表头
   * @param insertAfter - 为true时数据将移动到指定key的后方 */
  addRow(data: any | any[], to?: TableKey, insertAfter?: boolean): void;

  /** 删除指定的记录 */
  removeRow(key: TableKey | TableKey[]): void;

  /**
   * 将项移动到指定项的位置
   * @param from - 移动项的key
   * @param to - 移动到key指定的位置, 并将该位置的原有项后移
   * @param insertAfter - 为true时数据将移动到指定key的后方 */
  moveRow(
    from: TableKey | TableKey[],
    to: TableKey,
    insertAfter?: boolean
  ): void;

  /**
   * 将列移动到指定项的位置, 包含分组表头时, 无法进行此操作
   * @param from - 移动项的key
   * @param to - 移动到key指定的位置, 并将该位置的原有项后移
   * @param insertAfter - 为true时数据将移动到指定key的后方 */
  moveColumn(
    from: TableKey | TableKey[],
    to: TableKey,
    insertAfter?: boolean
  ): void;

  /** 设置单元格值 */
  setValue(cell: TableCell, value: any): void;

  /** 根据 row & column 设置单元格值 */
  setValue(row: TableRow, column: TableColumn, value: any): void;

  /** 根据row.key & column.key 设置单元格值 */
  setValue(rowKey: TableKey, columnKey: TableKey, value: any): void;

  /** 设置指定行的所有值 */
  setRowValue(rowKey: TableKey | TableRow, data: AnyObject): void;

  /** 获取单元格值 */
  getValue(cell: TableCell): any;

  /** 根据row&column获取单元格值 */
  getValue(row: TableRow, column: TableColumn): any;

  /** 根据row&column key获取单元格值 */
  getValue(rowKey: TableKey, columnKey: TableKey): any;
}

export function _getBlankMutationDataEvent(
  opt: Partial<TableMutationDataEvent>
) {
  return {
    type: TableMutationType.data,
    add: [],
    remove: [],
    soft: [],
    move: [],
    isAutoMove: false,
    ...opt,
  } as TableMutationDataEvent;
}

// 进行索引相关操作时, 包含一些必要信息的对象
export interface _DataIndexInfo {
  // 索引
  index: number;
  // 数据, 如果是column则为列配置本身
  data: any;
  // 数据, 如果是column则为列配置本身, 替身项为其指向的真实数据
  originalData: any;
  // 对应行/列实例, 替身项为其真实项的对应实例
  ins: TableRow | TableColumn;
  /** 该项的key, 替身项的key为替身key */
  key: TableKey;
}

// 包含移动项信息的对象
type _MoveItem = {
  key: TableKey;
  // 数据源
  data: any;
  /** ctx.data移动前的索引 */
  formIndex: number;
  // 索引
  index: number;
  /** 是否是fixed项转换为固定项 */
  isToNormal: boolean;
  /** 是否是fixed项移动倒固定项 */
  isFixedToFixed: boolean;
  /** 该项是否是由常规项转换为fixed项 */
  isToFixed: boolean;
  /** 从元数据中移动的位置 */
  dataFrom: number;
  /** 移动到的元数据指定位置 */
  dataTo: number;
  /** 项的fixed配置 */
  fixedConf: TableColumnFixedUnion | TableRowFixedUnion | undefined;
};
