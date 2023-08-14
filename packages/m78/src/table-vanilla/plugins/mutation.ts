import { TablePlugin } from "../plugin.js";
import {
  ActionHistoryItem,
  AnyObject,
  createRandString,
  deepClone,
  deleteNamePathValue,
  ensureArray,
  getNamePathValue,
  isArray,
  isNumber,
  isObject,
  isString,
  NamePath,
  recursionShakeEmpty,
  setNamePathValue,
  throwError,
  uniq,
} from "@m78/utils";
import { TableReloadLevel, TableReloadOptions } from "./life.js";
import { TablePersistenceConfig } from "../types/config.js";
import {
  _TablePrivateProperty,
  TableColumnFixed,
  TableKey,
  TableRowFixed,
} from "../types/base-type.js";
import {
  TableCell,
  TableColumn,
  TableItems,
  TableRow,
} from "../types/items.js";
import { _getCellKeysByStr, _prefix } from "../common.js";
import { _TableSortColumnPlugin } from "./sort-column.js";
import { _TableFormPlugin } from "./form.js";

/**
 * 所有config/data变更相关的操作, 变异操作应统一使用此处提供的api, 方便统一处理, 自动生成和处理历史等
 *
 * 配置变更/单元格值编辑/增删行列/行列排序/隐藏列
 * */
export class _TableMutationPlugin extends TablePlugin {
  /** 每一次配置变更将变更的key记录, 通过记录来判断是否有变更项 */
  private changedConfigKeys: (keyof TablePersistenceConfig)[] = [];

  sortColumn: _TableSortColumnPlugin;

  form: _TableFormPlugin;

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
    ]);
  }

  reload(opt: TableReloadOptions = {}) {
    if (opt.level === TableReloadLevel.full) {
      this.changedConfigKeys = [];
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
      old = deepClone(old);
    }

    const keyList = ensureArray(key);
    const first: any = keyList[0];

    const highlightItems = this.getHighlightKeys(key, newValue);

    const redo = () => {
      setNamePathValue(conf, key, newValue);

      let value = getNamePathValue(conf, first);

      if (typeof value === "object") {
        value = recursionShakeEmpty(deepClone(value));
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
        value = recursionShakeEmpty(deepClone(value));
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
    return recursionShakeEmpty(deepClone(this.context.persistenceConfig));
  };

  addRow: TableMutation["addRow"] = (data, to, insertAfter) => {
    let index = -1;

    if (!to) {
      index = this.context.topFixedList.length;
    } else {
      if (this.context.yHeaderKeys.includes(to)) {
        console.warn(`[${_prefix}] addRow: can't add row to header`);
        return;
      }

      const toRow: TableRow = { ...this.table.getRow(to) };

      index = toRow.isFixed
        ? this.context.dataKeyIndexMap[
            `${toRow.key}${_TablePrivateProperty.ref}`
          ]
        : toRow.realIndex;

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

    const beforeItem = this.context.data[index];

    if (beforeItem) {
      const beforeKey = beforeItem[this.config.primaryKey];

      const row = this.table.getRow(beforeKey);

      // 目标索引为fixed时,
      if (row && row.isFixed) {
        const isFixedTop = this.context.topFixedMap[beforeKey];
        const isFixedBottom = this.context.bottomFixedMap[beforeKey];

        if (isFixedTop) {
          index = this.context.topFixedList.length;
        }

        if (isFixedBottom) {
          index = this.context.data.length - this.context.bottomFixeList.length;
        }
      }
    }

    const newData = list.map((i) => {
      if (!isObject(i)) i = {};
      const key = i[this.config.primaryKey];
      if (!key) {
        return {
          ...i,
          [this.config.primaryKey]: createRandString(),
        };
      }
      return i;
    });

    this.table.history.redo({
      title: this.context.texts.addRow,
      redo: () => {
        this.context.data.splice(index!, 0, ...newData);

        this.table.event.mutation.emit({
          type: TableMutationType.data,
          changeType: TableMutationDataType.add,
          add: [...newData],
          remove: [],
          move: [],
        });

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

        this.table.event.mutation.emit({
          type: TableMutationType.data,
          changeType: TableMutationDataType.remove,
          add: [],
          remove: [...newData],
          move: [],
        });

        this.table.reload({
          keepPosition: true,
          level: TableReloadLevel.index,
        });
      },
    });
  };

  removeRow: TableMutation["removeRow"] = (key) => {
    const { list } = this.getIndexData(key);

    if (!list.length) return;

    const remove = list.filter((i) => !i.ignore).map((i) => i.data);
    const rows = list.map((i) => i.ins);

    this.table.history.redo({
      title: this.context.texts.removeRow,
      redo: () => {
        for (let i = list.length - 1; i >= 0; i--) {
          const cur = list[i];

          this.context.data.splice(cur.index, 1);
        }

        this.table.event.mutation.emit({
          type: TableMutationType.data,
          changeType: TableMutationDataType.remove,
          add: [],
          remove,
          move: [],
        });

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

        this.table.event.mutation.emit({
          type: TableMutationType.data,
          changeType: TableMutationDataType.add,
          add: remove,
          remove: [],
          move: [],
        });

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

  // 记录变更过的行
  private changedRows: Record<string, boolean> = {};

  setValue: TableMutation["setValue"] = (a, b, c?: any) => {
    // eslint-disable-next-line prefer-const
    let [cell, value] = this.valueActionGetter(a, b, c);

    if (!cell) return;

    if (!this.form.validCheck(cell)) return;

    if (isString(value)) {
      value = value.trim();
    }

    const { row, column } = cell;

    // 行未变更过, 将其完全clone, 避免更改原数据
    if (!this.changedRows[row.key]) {
      this.cloneAndSetRowData(row);
    }

    const oldValue = deepClone(
      getNamePathValue(row.data, column.config.originalKey)
    );

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
        setNamePathValue(row.data, column.config.originalKey, oldValue);

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
      title: this.context.texts.setValue,
    });
  };

  /** 克隆并重新设置row的data, 防止变更原数据, 主要用于延迟clone, 可以在数据量较大时提升初始化速度  */
  private cloneAndSetRowData(row: TableRow) {
    const cloneData = deepClone(row.data);
    const ind = this.context.dataKeyIndexMap[row.key];

    row.data = cloneData;
    this.context.data[ind] = cloneData;
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
    const indexData = this.getIndexData(key, isRow);

    if (!indexData.list.length) return;

    const moveList = this.getMoveData(indexData, to, isRow, insertAfter);

    if (!moveList) return;

    // 过滤掉ignore项
    const moveFilterData = moveList.filter((i) => !i.cur.ignore);

    const moveFilterIns = moveFilterData.map((i) => i.cur.ins);

    // 事件对象的move数据
    const moveEventData = moveFilterData.map((i) => ({
      from: i.from,
      to: i.to,
      data: i.data,
      dataFrom: i.dataFrom,
      dataTo: i.dataTo,
    }));

    const action: ActionHistoryItem = {
      redo: () => {
        const data = isRow ? this.context.data : this.context.columns;

        this.table.takeover(() => {
          // 删除
          for (let i = moveList.length - 1; i >= 0; i--) {
            const cur = moveList[i];

            data.splice(cur.from, 1);
          }

          // 添加
          for (let i = 0; i < moveList.length; i++) {
            const cur = moveList[i];

            // 虚拟项不操作
            if (isNumber(cur.cur.refIndex)) continue;

            data.splice(cur.to, 0, cur.data);
          }

          // 执行每个项的redo操作
          moveList.forEach((i) => i.redo());

          // 同步sortColumns
          if (!isRow) {
            this.table.history.ignore(() => {
              this.setPersistenceConfig(
                "sortColumns",
                this.sortColumn.getColumnSortKeys()
              );
            });
          }

          this.table.event.mutation.emit({
            type: TableMutationType.data,
            changeType: TableMutationDataType.move,
            add: [],
            remove: [],
            move: [...moveEventData],
          });

          this.table.reloadSync({
            keepPosition: true,
            level: TableReloadLevel.index,
          });
        });

        if (!this.table.isTaking()) {
          isRow
            ? this.table.highlightRow(moveFilterIns.map((i) => i.key))
            : this.table.highlightColumn(moveFilterIns.map((i) => i.key));
        }
      },
      undo: () => {
        const data = isRow ? this.context.data : this.context.columns;

        this.table.takeover(() => {
          // 执行每个项的undo操作
          moveList
            .slice()
            .reverse()
            .forEach((i) => i.undo());

          // 删除添加的项
          for (let i = moveList.length - 1; i >= 0; i--) {
            const cur = moveList[i];

            // 虚拟项不操作
            if (isNumber(cur.cur.refIndex)) continue;

            data.splice(cur.to, 1);
          }

          // 恢复删除的项
          for (let i = 0; i < moveList.length; i++) {
            const cur = moveList[i];

            data.splice(cur.from, 0, cur.data);
          }

          // 同步sortColumns
          if (!isRow) {
            this.table.history.ignore(() => {
              this.setPersistenceConfig(
                "sortColumns",
                this.sortColumn.getColumnSortKeys()
              );
            });
          }

          this.table.event.mutation.emit({
            type: TableMutationType.data,
            changeType: TableMutationDataType.move,
            add: [],
            remove: [],
            move: [...moveEventData].map((i) => ({
              from: i.to,
              to: i.from,
              data: i.data,
              dataFrom: i.dataTo,
              dataTo: i.dataFrom,
            })),
          });

          this.table.reloadSync({
            keepPosition: true,
            level: TableReloadLevel.index,
          });
        });

        if (!this.table.isTaking()) {
          isRow
            ? this.table.highlightRow(moveFilterIns.map((i) => i.key))
            : this.table.highlightColumn(moveFilterIns.map((i) => i.key));
        }
      },
      title: isRow ? this.context.texts.moveRow : this.context.texts.moveColumn,
    };

    this.table.history.redo(action);
  }

  /** 获取便于move操作的结构 */
  private getMoveData(
    { list }: ReturnType<typeof this.getIndexData>,
    to: TableKey,
    isRow = true,
    insertAfter?: boolean
  ) {
    const toIns = isRow
      ? { ...this.table.getRow(to) }
      : { ...this.table.getColumn(to) };

    const indexMap = isRow
      ? this.context.dataKeyIndexMap
      : this.context.columnKeyIndexMap;

    const data = isRow ? this.context.data : this.context.columns;

    // 需要移动到的索引位置
    let index = toIns.isFixed
      ? indexMap[`${toIns.key}${_TablePrivateProperty.ref}`]
      : toIns.realIndex;

    if (!isNumber(index)) {
      console.warn(
        `[${_prefix}] move${isRow ? "Row" : "Columns"}: Key ${to} is not found`
      );
      return;
    }

    if (insertAfter) {
      index += 1;
    }

    // 小于to的所有项
    const less = list.filter((i) => i.index < index);

    const toConf = { ...toIns.config };

    const toIndex = index - less.length;
    let toDataIndex = toIns.dataIndex - less.length;

    if (insertAfter) {
      toDataIndex += 1;
    }

    // 处理isToFixed时, 添加的虚拟项索引
    let toFixedIndex = -1;

    // 小于目标索引的所有虚拟项
    const lessRemove = less.filter((i) => isNumber(i.refIndex));

    return list.map((i, ind) => {
      const conf = { ...i.ins.config };

      const hasFixed = !!toConf.fixed || !!conf.fixed;
      const fixedEqual = toConf.fixed === conf.fixed;

      // 由常规项转换为fixed项
      const isToFixed = hasFixed && !conf.fixed;
      // 由fixed项转换为常规项
      const isToNormal = hasFixed && !toConf.fixed;
      // 固定项到固定项
      const isFixedToFixed = !!conf.fixed && !!toConf.fixed;

      // 保留之前的ignore状态
      const prevIgnore = getNamePathValue(i.data, _TablePrivateProperty.ignore);

      // 备份添加的虚拟项索引, 在undo时删除
      let toFixedIndexBackup = -1;

      return {
        // 索引数据
        cur: i,
        // 源索引
        from: i.index,
        // 在源数据中的from
        dataFrom: i.ins.dataIndex,
        // 目标索引
        to: toIndex + ind - lessRemove.length,
        // 在源数据中的to
        dataTo: toDataIndex + ind,
        // 数据/列配置
        data: i.data,
        // 保持fixed配置与目标项一致, 并在常规项和fixed项间移动时生成和清理fixed ref项
        // 需要在执行完move操作后执行
        redo: () => {
          // 虚拟项不操作
          if (isNumber(i.refIndex)) return;

          // 保持fixed一致
          if (hasFixed && !fixedEqual) {
            this.table.history.ignore(() => {
              this.setPersistenceConfig(
                [isRow ? "rows" : "columns", i.ins.key, "fixed"],
                toConf.fixed
              );
            });
          }

          // 转为fixed项或固定项到固定项
          if (isToFixed || isFixedToFixed) {
            // 添加虚拟fixed项, 确定需要添加到的索引位置
            if (toFixedIndex === -1) {
              toFixedIndex = this.getFixedIndex(
                toIns.key,
                toConf.fixed as TableRowFixed
              );

              if (insertAfter) {
                toFixedIndex += 1;
              }
            }

            const cloneData = { ...i.data };

            // 防止之前为ignore
            deleteNamePathValue(cloneData, _TablePrivateProperty.ignore);

            data.splice(toFixedIndex, 0, {
              ...cloneData,
              fixed: toConf.fixed,
              [_TablePrivateProperty.fake]: true,
            });

            toFixedIndexBackup = toFixedIndex;

            // 确保当前为ignore
            setNamePathValue(i.data, _TablePrivateProperty.ignore, true);

            toFixedIndex++;
          }

          // 转为常规项
          if (isToNormal) {
            deleteNamePathValue(i.data, _TablePrivateProperty.ignore);
          }
        },
        // 还原配置
        // 需要在move操作撤销前倒序执行
        undo: () => {
          toFixedIndex = -1;

          // 虚拟项在转换fixed为常规项时将其还原为fake
          if (isNumber(i.refIndex)) {
            if (isToNormal) {
              setNamePathValue(i.data, _TablePrivateProperty.fake, true);
            }

            return;
          }

          // 还原fixed
          if (hasFixed && !fixedEqual) {
            this.table.history.ignore(() => {
              this.setPersistenceConfig(
                [isRow ? "rows" : "columns", i.ins.key, "fixed"],
                conf.fixed
              );
            });
          }

          if (isToFixed || isFixedToFixed) {
            // 清理添加的虚拟项
            data.splice(toFixedIndexBackup, 1);

            // 还原ignore
            if (prevIgnore) {
              setNamePathValue(i.data, _TablePrivateProperty.ignore, true);
            } else {
              deleteNamePathValue(i.data, _TablePrivateProperty.ignore);
            }
          }

          if (isToNormal) {
            setNamePathValue(i.data, _TablePrivateProperty.ignore, true);
          }
        },
      };
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
    const dataList: {
      // 索引
      index: number;
      // 如果是固定项, 此项为其ref项的索引
      refIndex?: number;
      // 数据, 如果是column则为列配置本身
      data: any;
      // 对应行/列实例
      ins: TableRow | TableColumn;
      // 在进行事件通知时是否应忽略, 通常表示fixed项的ref项
      ignore?: boolean;
    }[] = [];

    // 防止重复
    const existMap: any = {};

    const indexMap = isRow
      ? this.context.dataKeyIndexMap
      : this.context.columnKeyIndexMap;

    const data = isRow ? this.context.data : this.context.columns;

    // 查找出所有相关的项
    list.forEach((i) => {
      const ins = isRow ? this.table.getRow(i) : this.table.getColumn(i);

      const _ins = { ...ins };

      let refInd: number | undefined;

      // 固定项需要查找其关联的原始项
      if (ins.isFixed) {
        const refIndex = indexMap[`${ins.key}${_TablePrivateProperty.ref}`];

        if (isNumber(refIndex)) {
          const cur = data[refIndex];

          if (existMap[refIndex]) return;

          existMap[refIndex] = true;

          if (cur) {
            refInd = refIndex;

            dataList.push({
              index: refIndex,
              data: { ...cur },
              ins: _ins,
              ignore: true,
            });
          }
        }
      }

      if (existMap[ins.realIndex]) return;

      existMap[ins.realIndex] = true;

      dataList.push({
        index: ins.realIndex,
        data: isRow ? { ...(ins as any).data } : ins.config,
        ins: _ins,
        refIndex: refInd,
      });
    });

    // 根据索引排序
    dataList.sort((a, b) => a.index - b.index);

    return {
      /** 根据index排序后的列表 */
      list: dataList,
    };
  }

  /** 快速获取fixed虚拟项的index */
  private getFixedIndex(
    key: TableKey,
    fixed: TableRowFixed | TableColumnFixed
  ) {
    const ctx = this.context;

    const isRow = fixed === TableRowFixed.top || fixed === TableRowFixed.bottom;

    const list = isRow ? ctx.data : ctx.columns;

    if (fixed === TableRowFixed.top || fixed === TableColumnFixed.left) {
      for (let i = 0; i < list.length; i++) {
        const cur = list[i];
        if (!getNamePathValue(cur, _TablePrivateProperty.fake)) return -1;
        if (isRow && this.table.getKeyByRowData(cur) === key) return i;
        if (!isRow && cur.key === key) return i;
      }
    }

    if (fixed === TableRowFixed.bottom || fixed === TableColumnFixed.right) {
      for (let i = list.length - 1; i >= 0; i--) {
        const cur = list[i];
        if (!getNamePathValue(cur, _TablePrivateProperty.fake)) return -1;
        if (isRow && this.table.getKeyByRowData(cur) === key) return i;
        if (!isRow && cur.key === key) return i;
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
}

export enum TableMutationType {
  /** 持久化配置变更 */
  config = "config",
  /** 记录变更, 通常表示新增/删除/排序 */
  data = "data",
  /** 单元格值变更 */
  value = "value",
}

/** TableMutationType.data变更类型 */
export enum TableMutationDataType {
  add = "add",
  remove = "remove",
  move = "move",
}

export type TableMutationEvent =
  | TableMutationConfigEvent
  | TableMutationDataEvent
  | TableMutationValueEvent;

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

export interface TableMutation {
  /** 获取发生了变更的持久化配置 */
  getChangedConfigKeys(): (keyof TablePersistenceConfig)[];

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
   * @param data - 新增的数据
   * @param to - 新增到的位置, 该位置的原有项后移; 不传时, 新增到表格顶部; key不能为固定项, 若传入固定项, 会根据固定位置添加到常规项的开头/结尾
   * @param insertAfter - 为true时数据将移动到指定key的后方 */
  addRow(data: any | any[], to?: TableKey, insertAfter?: boolean): void;

  /** 移除指定的记录 */
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

  /** 根据row&column设置单元格值 */
  setValue(row: TableRow, column: TableColumn, value: any): void;

  /** 根据row&column key设置单元格值 */
  setValue(rowKey: TableKey, columnKey: TableKey, value: any): void;

  /** 获取单元格值 */
  getValue(cell: TableCell): any;

  /** 根据row&column获取单元格值 */
  getValue(row: TableRow, column: TableColumn): any;

  /** 根据row&column key获取单元格值 */
  getValue(rowKey: TableKey, columnKey: TableKey): any;
}
