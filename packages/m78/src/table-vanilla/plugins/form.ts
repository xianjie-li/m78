import {
  createForm,
  FormInstance,
  FormSchema,
  FormRejectMeta,
  FormValidator,
} from "@m78/form";
import { requiredValidatorKey } from "@m78/form/validator/required.js";
import {
  AnyFunction,
  AnyObject,
  deleteNamePathValue,
  ensureArray,
  getNamePathValue,
  isEmpty,
  NamePath,
  setNamePathValue,
  stringifyNamePath,
} from "@m78/utils";
import { _TablePrivateProperty, TableKey } from "../types/base-type.js";
import { TablePlugin } from "../plugin.js";
import { TableCell, TableColumn, TableRow } from "../types/items.js";
import {
  TableMutationDataEvent,
  TableMutationDataType,
  TableMutationEvent,
  TableMutationType,
  TableMutationValueEvent,
} from "./mutation.js";
import { TableReloadLevel } from "./life.js";
import { TableAttachData } from "./getter.js";
import { removeNode } from "../../common/index.js";
import { _getCellKey, _syncListNode } from "../common.js";
import { _TableInteractiveCorePlugin } from "./interactive-core.js";
import { FORM_LANG_PACK_NS, i18n } from "../../i18n/index.js";
import { _TableSoftRemovePlugin } from "./soft-remove.js";

export class _TableFormPlugin extends TablePlugin implements TableForm {
  wrapNode: HTMLElement;

  // 以key存储行表单实例
  formInstances: Record<string, FormInstance | void> = {};

  // 以key存储行表单错误信息
  errors: Record<string, FormRejectMeta | void> = {};

  // 以行为单位存储单元格错误信息 { rowKey: { cellKey: "err msg" } }
  cellErrors: Record<string, Record<string, string | void> | void> = {};

  // 记录行是否变动
  rowChanged: Record<string, boolean> = {};

  // 用于显示错误反馈的节点
  errorNodes: HTMLElement[] = [];

  // 用于显示行变动标识的节点
  rowChangedNodes: HTMLElement[] = [];

  // 记录单元格是否变动
  cellChanged: Record<string, TableCell> = {};

  // 用于显示单元格变动标识的节点
  cellChangedNodes: HTMLElement[] = [];

  // 记录编辑/必填状态
  editStatus: {
    required: boolean;
    // 表头单元格
    cell: TableCell;
  }[] = [];

  // 用于开始查找editStatus
  editStatusMap: Record<
    string,
    {
      required: boolean;
      // 表头单元格
      cell: TableCell;
    } | void
  > = {};

  editStatusNodes: HTMLElement[] = [];

  // 无效状态
  invalidCellMap: Record<string, TableCell[] | undefined> = {};
  invalidStatusMap: Record<string, boolean> = {};
  invalidStatus: TableCell[] = [];
  invalidNodes: HTMLElement[] = [];

  // 记录新增的数据
  addRecordMap = new Map<TableKey, boolean>();

  // 记录移除的数据
  removeRecordMap = new Map<TableKey, AnyObject>();

  // 记录移除的数据, 不进行 addRecordMap 的检测, 即 removeRecordMap 不会记录新增行的删除
  allRemoveRecordMap = new Map<TableKey, AnyObject>();

  // 记录发生或排序变更的项信息
  sortRecordMap = new Map<
    TableKey,
    {
      /** 原索引 */
      originIndex: number;
      /** 当前索引 */
      currentIndex: number;
    }
  >();

  interactive: _TableInteractiveCorePlugin;
  softRemove: _TableSoftRemovePlugin;

  beforeInit() {
    this.interactive = this.getPlugin(_TableInteractiveCorePlugin);
    this.softRemove = this.getPlugin(_TableSoftRemovePlugin);
    this.wrapNode = document.createElement("div");
    this.wrapNode.className = "m78-table_form-wrap";

    this.methodMapper(this.table, [
      "verify",
      "verifyRow",
      "verifyChanged",
      "getData",
      "getChanged",
      "getTableChanged",
      "resetFormState",
    ]);
  }

  mounted() {
    this.table.event.mutation.on(this.mutation);
    this.context.viewContentEl.appendChild(this.wrapNode);
  }

  beforeDestroy() {
    this.table.event.mutation.off(this.mutation);

    this.editStatus = [];
    this.editStatusMap = {};

    this.reset();
    this.resetDataRecords();

    removeNode(this.wrapNode);
  }

  loadStage(level: TableReloadLevel, isBefore: boolean) {
    if (level === TableReloadLevel.full && isBefore) {
      this.reset();
      this.resetDataRecords();
    }

    if (level === TableReloadLevel.base && !isBefore) {
      this.updateEditStatus();
    }
  }

  mutation = (e: TableMutationEvent) => {
    if (e.type === TableMutationType.value) {
      this.valueMutation(e);
    }

    if (e.type === TableMutationType.data) {
      this.dataMutation(e);
    }
  };

  rendering() {
    const showRowsMap: Record<string, boolean | undefined> = {};

    const showRows = this.context.lastViewportItems?.rows || [];

    this.invalidCellMap = {};
    this.updateValidRelate();

    // 动态创建form实例
    showRows.forEach((row) => {
      showRowsMap[row.key] = true;

      this.initForm(row);
      this.updateValidStatus(row);
    });

    this.updateValidRelate();

    // 渲染编辑/必填状态
    if (this.editStatus.length) {
      this.editStatus.forEach(({ cell, required }, ind) => {
        // if (!cell.isMount) return;

        const node = this.editStatusNodes[ind];
        const position = this.table.getAttachPosition(cell);

        node.style.backgroundColor = required
          ? "var(--m78-color-warning)"
          : "var(--m78-color-opacity-lg)";
        node.style.transform = `translate(${position.left}px, ${position.top}px)`;
        node.style.width = `${position.width}px`;
        node.style.zIndex = position.zIndex;
      });
    }

    if (isEmpty(this.formInstances)) return;

    // 渲染无效状态
    if (this.invalidStatus.length) {
      this.invalidStatus.forEach((cell, ind) => {
        const node = this.invalidNodes[ind];
        const position = this.table.getAttachPosition(cell);

        node.style.height = `${position.height + 1}px`;
        node.style.width = `${position.width + 1}px`;
        node.style.transform = `translate(${position.left - 1}px, ${
          position.top - 1
        }px)`;
        node.style.zIndex = String(Number(position.zIndex) + 2);
      });
    }

    // 渲染错误单元格标识/行变动标识/单元格变动标识

    const [errList, errorMap] = this.getErrorList();

    const changedList = this.getRowMarkList(showRowsMap, errorMap);

    const cellChangedList = this.getChangedList();

    changedList.forEach(({ attachPosition, row, hasError }, ind) => {
      const node = this.rowChangedNodes[ind];

      node.style.height = `${attachPosition.height + 1}px`;
      node.style.transform = `translate(${this.table.getX()}px, ${
        attachPosition.top
      }px)`;
      node.style.backgroundColor = hasError
        ? "var(--m78-color-error)"
        : "var(--m78-color)";
      node.style.zIndex = row.isFixed ? "31" : "11";
    });

    cellChangedList.forEach((pos, ind) => {
      const node = this.cellChangedNodes[ind];

      node.style.transform = `translate(${pos.left + pos.width - 8}px, ${
        pos.top + 2
      }px)`;
      node.style.zIndex = pos.zIndex;
    });

    errList.forEach(({ attachPosition }, ind) => {
      const node = this.errorNodes[ind];

      node.style.width = `${attachPosition.width + 1}px`;
      node.style.height = `${attachPosition.height + 1}px`;
      node.style.transform = `translate(${attachPosition.left}px, ${attachPosition.top}px)`;
      node.style.zIndex = String(Number(attachPosition.zIndex) + 1); // 比变动标记高一层
    });
  }

  // 值变更, 创建或获取form实例, 并同步值和校验状态
  valueMutation = (e: TableMutationValueEvent) => {
    const { cell, value } = e;

    const form = this.initForm(e);

    const name = cell.column.config.originalKey;

    form.setValue(name, value);

    const changed = form.getFormChanged();

    if (changed) {
      this.rowChanged[cell.row.key] = true;
    } else {
      delete this.rowChanged[cell.row.key];
    }

    if (form.getChanged(name)) {
      this.cellChanged[cell.key] = cell;
    } else {
      delete this.cellChanged[cell.key];
    }

    this.updateValidStatus(cell.row);
    this.updateValidRelate();

    form.debounceVerify(name, () => {
      const errors = form.getErrors();

      const newError: FormRejectMeta = [];
      const cellError: Record<string, string | void> = {};

      let hasCellError = false;

      errors.forEach((e) => {
        if (form.getTouched(e.namePath)) {
          newError.push(e);

          // 只取第一条错误
          if (!cellError[e.name]) {
            cellError[e.name] = e.message;
            hasCellError = true;
          }
        }
      });

      if (newError.length) {
        this.errors[cell.row.key] = newError;
      } else {
        delete this.errors[cell.row.key];
      }

      if (hasCellError) {
        this.cellErrors[cell.row.key] = cellError;
      } else {
        delete this.cellErrors[cell.row.key];
      }

      this.table.render();
    });
  };

  // data变更, 记录新增, 删除数据, 并且也将其计入getFormChanged变更状态
  dataMutation = (e: TableMutationDataEvent) => {
    if (e.changeType === TableMutationDataType.add) {
      e.add.forEach((d) => {
        const k = this.table.getKeyByRowData(d);
        if (!k) return;

        this.allRemoveRecordMap.delete(k);

        // 已经存在于删除列表中, 则不再计入新增列表
        if (this.removeRecordMap.delete(k)) return;

        this.addRecordMap.set(k, true);
      });
    }

    if (e.changeType === TableMutationDataType.remove) {
      e.remove.forEach((d) => {
        const k = this.table.getKeyByRowData(d);
        if (!k) return;

        this.allRemoveRecordMap.set(k, d);

        // 已经存在于新增列表中, 则不再计入删除列表
        if (this.addRecordMap.delete(k)) return;

        this.removeRecordMap.set(k, d);
      });
    }

    if (e.changeType === TableMutationDataType.move) {
      e.move.forEach((meta) => {
        const k = this.table.getKeyByRowData(meta.data);

        if (!k) return;

        let rec = this.sortRecordMap.get(k);

        if (!rec) {
          rec = {
            originIndex: meta.from, // 原索引, 应仅记录第一次时的值, 后续不再变更
            currentIndex: meta.to,
          };

          this.sortRecordMap.set(k, rec);
        }

        rec.currentIndex = meta.to;
      });
    }
  };

  // 是否允许编辑
  validCheck(cell: TableCell) {
    return !this.invalidStatusMap[cell.key];
  }

  getChanged(rowKey: TableKey, columnKey?: NamePath): boolean {
    // 新增行的检测均视为变更
    if (this.addRecordMap.has(rowKey)) return true;

    // 删除行的检测均视为变更
    if (this.removeRecordMap.has(rowKey)) return true;

    if (this.softRemove.isSoftRemove(rowKey)) return true;

    if (!columnKey) {
      return !!this.rowChanged[rowKey];
    }

    return !!this.cellChanged[
      _getCellKey(rowKey, stringifyNamePath(columnKey))
    ];
  }

  getTableChanged(): boolean {
    // 包含新增或删除的行
    if (this.addRecordMap.size || this.removeRecordMap.size) return true;

    const hasSorted = this.getSortedStatus();

    // 包含排序过的行
    if (hasSorted) return true;

    // 包含软删除数据
    if (this.softRemove.remove.hasSelected()) return true;

    // 包含变更数据
    return Object.keys(this.rowChanged).some((key) => this.rowChanged[key]);
  }

  /** 检测是否发生了数据排序 */
  getSortedStatus() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Array.from(this.sortRecordMap.entries()).some(([_, rec]) => {
      return rec.currentIndex !== rec.originIndex;
    });
  }

  getData() {
    const add: any[] = [];
    const change: any[] = [];
    const update: any[] = [];
    let remove: any[] = [];

    const all = this.eachData((data, key) => {
      // 跳过软删除项
      if (this.softRemove.isSoftRemove(key)) return false;

      const isAdd = this.addRecordMap.has(key);
      // 数据变更并且不是新增的数据
      const isChange = this.rowChanged[key] && !isAdd;

      if (isAdd) {
        // 删除虚拟主键, 防止数据传输到服务端时出错
        if (isAdd) {
          deleteNamePathValue(data, this.config.primaryKey);
        }

        add.push(data);
      }

      if (isChange) {
        change.push(data);
      }

      if (isAdd || isChange) {
        update.push(data);
      }
    });

    const rList = Array.from(this.removeRecordMap.values());

    if (rList) {
      remove = rList;
    }

    // 合并软删除项到remove
    if (this.softRemove.remove.hasSelected()) {
      this.softRemove.remove.getState().selected.forEach((k) => {
        if (this.removeRecordMap.has(k)) return; // 跳过已直接删除的项
        const rmRow = this.table.getRow(k);
        remove.push(rmRow.data);
      });
    }

    return {
      change,
      add,
      remove,
      update,
      all,
      sorted: this.getSortedStatus(),
    } as TableDataLists;
  }

  resetFormState() {
    this.reset();
    this.softRemove.restoreSoftRemove();
    this.table.render();
  }

  verify(): Promise<TableDataLists> {
    return this.verifyCommon(false) as Promise<TableDataLists>;
  }

  verifyRow(rowKey?: TableKey): Promise<AnyObject> {
    return this.verifyCommon(false, rowKey) as Promise<AnyObject>;
  }

  verifyChanged(): Promise<TableDataLists> {
    return this.verifyCommon(true) as Promise<TableDataLists>;
  }

  /** 获取指定单元格最后一次参与验证后的错误 */
  getCellError(cell: TableCell) {
    const rec = this.cellErrors[cell.row.key];

    if (!rec) return "";

    return rec[cell.column.config.key] || "";
  }

  /** 获取指定列的可编辑信息, 不可编辑时返回null */
  getEditStatus(col: TableColumn) {
    return this.editStatusMap[col.key] || null;
  }

  // 验证通用逻辑, 传入rowKey时仅验证指定的行, 单行验证时仅返回指定行
  private async verifyCommon(
    onlyChanged: boolean,
    rowKey?: TableKey
  ): Promise<AnyObject | TableDataLists> {
    let data: AnyObject[] = [];
    let dataLists: TableDataLists | null = null;

    if (rowKey) {
      data = [this.table.getRow(rowKey).data];
    } else {
      dataLists = this.getData();

      data = onlyChanged ? dataLists.update : dataLists.all;
    }

    const form = createForm({
      schemas: {
        eachSchema: {
          schema: this.config.schema,
        },
      },
      autoVerify: false,
      verifyFirst: true,
      languagePack: i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS),
    });

    form.setValues(data);

    return form
      .verify()
      .then(() => {
        return rowKey ? data[0] : dataLists!;
      })
      .catch((err) => {
        const namePath = err.rejects?.[0]?.namePath;

        // 对首个错误行单独执行验证, 并高亮指定行/单元格
        if (namePath) {
          const ind = namePath[0];
          const name = namePath[1];
          const curData = data[ind];

          const key = this.table.getKeyByRowData(curData);

          const cell = this.table.getCell(key, name);

          this.verifySpecifiedRow(this.table.getRow(key), cell);
        }

        throw err;
      });
  }

  // 验证指定行并更新对应ui, 传入cell时, 高亮指定cell
  private verifySpecifiedRow(row: TableRow, cell?: TableCell) {
    const form = this.initForm(row);

    form
      .verify()
      .then(() => {
        delete this.errors[row.key];
        delete this.cellErrors[row.key];
      })
      .catch((errors) => {
        if (errors?.rejects) {
          const rejList: FormRejectMeta = errors.rejects;

          this.errors[row.key] = rejList;

          const cellError: Record<string, string | void> = {};

          let hasCellError = false;

          rejList.forEach((e) => {
            if (form.getTouched(e.namePath)) {
              // 只取第一条错误
              if (!cellError[e.name]) {
                cellError[e.name] = e.message;
                hasCellError = true;
              }
            }
          });

          if (hasCellError) {
            this.cellErrors[row.key] = cellError;
          } else {
            delete this.cellErrors[row.key];
          }
        }
      })
      .finally(() => {
        this.table.render();

        this.table.highlightRow(row.key);

        if (cell) {
          this.table.highlight(cell.key);
          this.table.selectCells(cell.key);
        }
      });
  }

  // 重置行数据的记录状态
  private resetDataRecords() {
    this.addRecordMap = new Map();
    this.removeRecordMap = new Map();
    this.allRemoveRecordMap = new Map();
    this.sortRecordMap = new Map();
  }

  // 重置状态
  private reset() {
    this.cellChanged = {};
    this.rowChanged = {};
    this.errors = {};
    this.cellErrors = {};
    this.formInstances = {};
    this.invalidCellMap = {};

    this.updateValidRelate();
  }

  // 更新可编辑状态
  private updateEditStatus() {
    const hKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];
    const firstRowKey = this.context.allRowKeys[0];

    this.editStatus = [];
    this.editStatusMap = {};

    if (!firstRowKey) {
      // 清空
      _syncListNode({
        wrapNode: this.wrapNode,
        list: [],
        nodeList: this.editStatusNodes,
      });
      return;
    }

    let requireKeys: string[] = [];

    // 是否包含必填验证器
    if (!isEmpty(this.config.schema)) {
      requireKeys = this.config
        .schema!.filter((i) => {
          const validator: FormValidator[] = ensureArray(i.validator);

          return validator.some((i) => i?.key === requiredValidatorKey);
        })
        .map((i) => stringifyNamePath(i.name));
    }

    // 是否可编辑
    this.context.columns.forEach((col) => {
      if (getNamePathValue(col, _TablePrivateProperty.ignore)) return;

      const cell = this.table.getCell(hKey, col.key);
      // header cell 不能检测是否可编辑, 这里以第一行数据的可编译配置作为参照 (忽略单元格逐个配置的情况, 表单都是以列为单位启用)
      const firstRowCell = this.table.getCell(firstRowKey, col.key);

      if (this.interactive.isInteractive(firstRowCell)) {
        const item = {
          required: requireKeys.includes(col.key),
          cell,
        };

        this.editStatusMap[col.key] = item;

        this.editStatus.push(item);
      }
    });

    _syncListNode({
      wrapNode: this.wrapNode,
      list: this.editStatus,
      nodeList: this.editStatusNodes,
      createAction: (node) => {
        node.className = "m78-table_form-edit-status";
      },
    });
  }

  // 更新valid显示状态
  private updateValidStatus(row: TableRow) {
    if (row.isHeader) return;

    if (getNamePathValue(row.data, _TablePrivateProperty.ignore)) return;

    const form = this.formInstances[row.key];

    if (!form) return;

    if (isEmpty(this.config.schema)) {
      this.invalidCellMap = {};
      this.updateValidRelate();
      return;
    }

    const list: TableCell[] = [];

    this.config.schema!.map((s) => {
      const sc = form.getSchema(s.name) as FormSchema;

      if (sc?.valid === false) {
        const cell = this.table.getCell(row.key, sc.name);
        list.push(cell);
      }
    });

    if (list.length) {
      this.invalidCellMap[row.key] = list;
    } else {
      delete this.invalidCellMap[row.key];
    }
  }

  // 根据当前invalidCellMap更新相关状态
  private updateValidRelate() {
    this.invalidStatusMap = {};
    this.invalidStatus = [];

    Object.keys(this.invalidCellMap).forEach((key) => {
      const invalidCells = this.invalidCellMap[key];

      if (!invalidCells) return;

      invalidCells.forEach((cell) => {
        this.invalidStatusMap[cell.key] = true;
        this.invalidStatus.push(cell);
      });
    });

    _syncListNode({
      wrapNode: this.wrapNode,
      list: this.invalidStatus,
      nodeList: this.invalidNodes,
      createAction: (node) => {
        node.className = "m78-table_form-invalid";
      },
    });
  }

  // 获取用于展示错误的列表, 包含了渲染需要的各种必要信息
  private getErrorList() {
    const list: {
      /** 对应单元格 */
      cell: TableCell;
      /** 错误信息 */
      message: string;
      /** 单元格位置, 用于控制节点挂载位置 */
      attachPosition: TableAttachData;
    }[] = [];

    const rowErrorMap: Record<string, boolean | void> = {};

    Object.keys(this.errors).forEach((key) => {
      if (this.allRemoveRecordMap.has(key)) return false; // 删除行不显示

      const rowErrors = this.errors[key];

      if (rowErrors) {
        if (rowErrors.length) {
          rowErrorMap[key] = true;
        }

        rowErrors.forEach((item) => {
          const cell = this.table.getCell(key, item.name);
          const pos = this.table.getAttachPosition(cell);

          if (!cell.isMount) return;

          list.push({
            message: item.message,
            cell,
            attachPosition: pos,
          });
        });
      }
    });

    _syncListNode({
      wrapNode: this.wrapNode,
      list,
      nodeList: this.errorNodes,
      createAction: (node) => {
        node.className = "m78-table_form-error-feedback";
      },
    });

    return [list, rowErrorMap] as const;
  }

  // 获取用于展示变更/验证失败行列表, 包含了渲染需要的各种必要信息
  private getRowMarkList(
    showRowsMap: Record<string, boolean | undefined>,
    errorMap: Record<string, boolean | void>
  ) {
    const keyList = [...Object.keys(errorMap), ...Object.keys(this.rowChanged)];

    const checkedMap: any = {};

    const list = keyList
      .filter((i) => {
        if (checkedMap[i]) return false;
        if (this.allRemoveRecordMap.has(i)) return false; // 删除行不显示
        checkedMap[i] = true;
        return showRowsMap[i] && (errorMap[i] || this.rowChanged[i]);
      })
      .map((key) => {
        const row = this.table.getRow(key);
        const pos = this.table.getRowAttachPosition(row);

        return {
          row,
          attachPosition: pos,
          hasError: this.errors[key],
        };
      });

    _syncListNode({
      wrapNode: this.wrapNode,
      list,
      nodeList: this.rowChangedNodes,
      createAction: (node) => {
        node.className = "m78-table_form-changed-mark";
      },
    });

    return list;
  }

  // 获取用于展示变更单元格的列表, 包含了渲染需要的各种必要信息
  private getChangedList() {
    const list: TableAttachData[] = [];

    Object.keys(this.cellChanged).forEach((key) => {
      const cell = this.cellChanged[key];

      if (!cell || !cell.isMount) return;
      if (this.allRemoveRecordMap.has(cell.row.key)) return;

      const pos = this.table.getAttachPosition(cell);

      list.push(pos);
    });

    _syncListNode({
      wrapNode: this.wrapNode,
      list,
      nodeList: this.cellChangedNodes,
      createAction: (node) => {
        node.className = "m78-table_form-cell-changed-mark";
      },
    });

    return list;
  }

  // 若行form不存在则对其进行初始化
  initForm(arg: TableMutationValueEvent | TableCell | TableRow) {
    const isCellArg = this.table.isCellLike(arg);
    const isRowArg = this.table.isRowLike(arg);

    let row: TableRow;
    let cell: TableCell;

    if (isRowArg) {
      row = arg;
    } else if (isCellArg) {
      cell = arg;
      row = cell.row;
    } else {
      cell = arg.cell;
      row = cell.row;
    }

    let form = this.formInstances[row.key];

    if (form) return form;

    const defaultValue = { ...row.data };

    // 通过mutation触发时, 需要还原为旧值
    if (!isCellArg && !isRowArg) {
      setNamePathValue(
        defaultValue,
        cell!.column.config.originalKey,
        arg.oldValue
      );
    }

    const formCreator: typeof createForm =
      this.config.formCreator || createForm;

    form = formCreator({
      values: defaultValue,
      schemas: {
        schema: this.config.schema,
      },
      autoVerify: false,
      languagePack: i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS),
    }) as FormInstance;

    this.formInstances[row.key] = form;

    return form;
  }

  /** 遍历数据, 返回所有数据, 若cb返回false则将从返回list中过滤 */
  private eachData(cd: (i: any, k: TableKey) => void | false) {
    const list: any[] = [];

    this.context.data.forEach((i) => {
      const isFake = getNamePathValue(i, _TablePrivateProperty.fake);

      if (isFake) return;

      const key = this.table.getKeyByRowData(i);

      let data: any;

      const isIgnore = getNamePathValue(i, _TablePrivateProperty.ignore);

      // 是忽略项时, 获取其原始数据 (通常是其fixed项clone, 执行setValue时值保存在clone位置而不是原始备份记录)
      if (isIgnore) {
        const ind = this.table.getIndexByRowKey(key);

        data = Object.assign({}, this.context.data[ind]);

        deleteNamePathValue(data, _TablePrivateProperty.fake);
      } else {
        data = Object.assign({}, i);
      }

      const invalid = this.invalidCellMap[key];

      if (invalid?.length) {
        invalid.forEach((cell) => {
          const name = cell.column.config.originalKey;

          deleteNamePathValue(data, name);
        });
      }

      const res = cd(data, key);

      if (res !== false) list.push(data);
    });

    return list;
  }
}

/** table定制版的FormSchema */
export interface TableFormSchema extends Omit<FormSchema, "list"> {}

/** form相关配置 */
export interface TableFormConfig {
  /** 用于校验字段的schema */
  schema?: TableFormSchema[];
  /** 自定义form实例创建器 */
  formCreator?: AnyFunction;
}

/** 对外暴露的form相关方法 */
export interface TableForm {
  /** 执行校验, 未通过时会抛出VerifyError类型的错误, 这是使用者唯一需要处理的错误类型 */
  verify: () => Promise<TableDataLists>;

  /** 验证指定行 */
  verifyRow: (rowKey?: TableKey) => Promise<AnyObject>;

  /** 对变更行执行校验, 未通过时会抛出VerifyError类型的错误, 这是使用者唯一需要处理的错误类型 */
  verifyChanged: () => Promise<TableDataLists>;

  /**
   * 获取当前数据, 返回内容包含: 所有数据/新增/变更/删除数据
   *
   * 关于排序数据:
   * 除了手动的排序操作, 新增/删除数据也会导致数据排序变动, 预先记录的排序状态随着后续操作都会变得不准确, 如果要保存排序状态,
   * 通常由两种方式: 一是统一提交并通过TableDataLists.all获取最终的完整顺序. 二是在mutation事件中根据排序的变更实时进行保存.
   * */
  getData(): TableDataLists;

  /** 获取指定行或单元格的变更状态, 数据变更, 被新增/删除均视为变更, 数据排序变更不视为变更 */
  getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;

  /** 表格是否发生过数据变更, 排序, 增删数据 */
  getTableChanged(): boolean;

  /** 重置当前的错误信息/变更状态等 (仅清理状态, 不会还原变更值, 否则会和history api有冲突) */
  resetFormState(): void;
}

export interface TableDataLists<D = AnyObject> {
  /** 所有数据 */
  all: D[];
  /** 新增的行 */
  add: D[];
  /** 发生过变更的行(不含新增行) */
  change: D[];
  /** 新增和变更的行 */
  update: D[];
  /** 移除的行 */
  remove: D[];
  /** 是否发生了数据排序(不包含增删数据导致的索引变更) */
  sorted: boolean;
}
