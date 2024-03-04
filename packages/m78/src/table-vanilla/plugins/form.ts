import {
  createVerify,
  FormRejectMeta,
  FormSchema,
  FormSchemaWithoutName,
  FormVerifyInstance,
  FormRejectOrValues,
  FormRejectMetaItem,
} from "@m78/form";
import { requiredValidatorKey } from "@m78/form/validator/required.js";
import {
  AnyFunction,
  AnyObject,
  deleteNamePathValue,
  deleteNamePathValues,
  ensureArray,
  isTruthyOrZero,
  NamePath,
  setNamePathValue,
  simplyDeepClone,
  simplyEqual,
  stringifyNamePath,
  setCacheValue,
} from "@m78/utils";
import { TableKey } from "../types/base-type.js";
import { TableLoadStage, TablePlugin } from "../plugin.js";
import { TableCell, TableColumn, TableRow } from "../types/items.js";
import {
  TableMutationDataEvent,
  TableMutationDataType,
  TableMutationEvent,
  TableMutationType,
  TableMutationValueEvent,
} from "./mutation.js";
import { TableAttachData } from "./getter.js";
import { removeNode, throwError } from "../../common/index.js";
import { _getCellKey, _syncListNode } from "../common.js";
import { _TableInteractivePlugin } from "./interactive.js";
import { FORM_LANG_PACK_NS, i18n } from "../../i18n/index.js";
import { _TableSoftRemovePlugin } from "./soft-remove.js";

export class _TableFormPlugin extends TablePlugin implements TableForm {
  wrapNode: HTMLElement;

  // 验证实例, 用于在未创建行form时复用
  verifyInstance: FormVerifyInstance;

  // 以行为单位存储单元格错误信息 { [rowKey]: { [columnKey]: "err msg" } }
  cellErrors = new Map<TableKey, Map<TableKey, FormRejectMetaItem>>();

  // 记录行是否变动
  rowChanged = new Map<TableKey, true>();

  // 记录单元格是否变动
  cellChanged = new Map<TableKey, true>();

  // 以行为key记录默认值
  defaultValues = new Map<TableKey, AnyObject>();

  // 以row key存储的改行的计算后schema
  schemaDatas = new Map<TableKey, SchemaData>();

  // 记录新增的数据
  addRecordMap = new Map<TableKey, boolean>();

  // 记录移除的数据
  removeRecordMap = new Map<TableKey, AnyObject>();

  // 记录移除的数据, 不进行 addRecordMap 的检测, 即 removeRecordMap 不会记录新增行的删除, 而 allRemoveRecordMap 会记录
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

  interactive: _TableInteractivePlugin;

  softRemove: _TableSoftRemovePlugin;

  beforeInit() {
    this.interactive = this.getPlugin(_TableInteractivePlugin);
    this.softRemove = this.getPlugin(_TableSoftRemovePlugin);

    this.methodMapper(this.table, [
      "verify",
      "verifyRow",
      "verifyUpdated",
      "getData",
      "getChanged",
      "getTableChanged",
    ]);
  }

  mounted() {
    this.table.event.mutation.on(this.mutation);

    // schemas配置变更时清理缓存的schema
    this.table.event.configChange.on((changeKeys, isChange) => {
      if (isChange("schemas")) {
        this.schemaConfigChange();
      }
    });

    this.initVerify();
    this.initNodeWrap();
  }

  beforeDestroy() {
    this.table.event.mutation.off(this.mutation);
    this.table.event.configChange.empty();

    this.reset();
  }

  loadStage(stage: TableLoadStage, isBefore: boolean) {
    if (stage === TableLoadStage.fullHandle && isBefore) {
      this.reset();
      this.initNodeWrap();
    }
  }

  beforeRender() {
    this.prepareChangedCell();
    this.prepareRowMark();
    this.prepareErrors();
    this.prepareSchemasMark();
  }

  rendering() {
    this.updateChangedCell();
    this.updateRowMark();
    this.updateErrors();
    this.updateSchemasMark();
  }

  // 数据发生变更时进行处理
  mutation = (e: TableMutationEvent) => {
    if (e.type === TableMutationType.value) {
      this.valueMutation(e);
    }

    if (e.type === TableMutationType.data) {
      this.dataMutation(e);
    }
  };

  // 值变更, 创建或获取form实例, 并同步值和校验状态
  valueMutation = (e: TableMutationValueEvent) => {
    const { cell } = e;

    const column = cell.column;
    const row = cell.row;

    // 默认值不存在, 将默认值写入
    if (!this.defaultValues.has(row.key)) {
      const rawData = simplyDeepClone(row.data);

      const name = column.config.originalKey;

      // 还原已变更的值
      setNamePathValue(rawData, name, e.oldValue);

      this.defaultValues.set(row.key, rawData);
    }

    const changed = !simplyEqual(row.data, this.defaultValues.get(row.key));

    if (changed) {
      this.rowChanged.set(row.key, true);
    } else {
      this.rowChanged.delete(row.key);
    }

    const valueChanged = !simplyEqual(e.value, e.oldValue);

    if (valueChanged) {
      this.cellChanged.set(cell.key, true);
    } else {
      this.cellChanged.delete(cell.key);
    }

    // 更新schema
    const schema = this.getSchemas(row, true);

    const fmtData = this.getFmtData(row, row.data);

    this.innerCheck({
      cell,
      values: fmtData,
      schemas: schema.rootSchema,
    }).then(() => this.table.render());
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

    // 除了自动触发的move外, 均记录到sortRecordMap
    if (e.changeType === TableMutationDataType.move && !e.isAutoMove) {
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

  // 获取单元格invalid状态
  validCheck(cell: TableCell) {
    const { invalid } = this.getSchemas(cell.row);

    if (!invalid) return true;

    return !invalid.get(cell.column.key);
  }

  getChanged(rowKey: TableKey, columnKey?: NamePath): boolean {
    // 检测已有状态
    if (columnKey) {
      const cellKey = _getCellKey(rowKey, stringifyNamePath(columnKey!));
      if (this.cellChanged.get(cellKey)) return true;
    } else {
      if (this.rowChanged.get(rowKey)) return true;
    }

    // 新增行的检测均视为变更
    if (this.addRecordMap.has(rowKey)) return true;

    // 删除行的检测均视为变更
    if (this.removeRecordMap.has(rowKey)) return true;

    if (this.softRemove.isSoftRemove(rowKey)) return true;

    // 排序变更
    const sortData = this.sortRecordMap.get(rowKey);

    if (sortData && sortData.currentIndex !== sortData.originIndex) return true;

    return false;
  }

  getTableChanged(): boolean {
    if (this.rowChanged.size !== 0) return true;

    // 包含新增或删除的行
    if (this.addRecordMap.size || this.removeRecordMap.size) return true;

    // 包含软删除数据
    if (this.softRemove.remove.hasSelected()) return true;

    const hasSorted = this.getSortedStatus();

    // 包含排序过的行
    if (hasSorted) return true;

    // 包含变更数据
    return false;
  }

  /** 检测是否发生了数据排序 */
  getSortedStatus() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Array.from(this.sortRecordMap.entries()).some(([_, rec]) => {
      return rec.currentIndex !== rec.originIndex;
    });
  }

  getData() {
    let res: TableDataLists;

    // innerGetData和eachData在回调中为加入异步行为时才会异步执行, 本身是通本的, 使用promise api仅是为了兼容更多用法
    this.innerGetData().then((data) => {
      res = data!;
    });

    return res!;
  }

  verify() {
    return this.verifyCommon(false);
  }

  verifyUpdated() {
    return this.verifyCommon(true);
  }

  verifyRow(rowKey: TableKey) {
    const row = this.table.getRow(rowKey);
    const data = this.getFmtData(row, row.data);
    const schemas = this.getSchemas(row);

    return this.innerCheck({
      row,
      values: data,
      schemas,
    });
  }

  /* # # # # # # # 与schema相关的标记渲染, editable & valid # # # # # # # */
  // 以列为key存储可编辑列的信息
  editStatusMap = new Map<
    TableKey,
    {
      required: boolean;
      // 表头单元格
      cell: TableCell;
    }
  >();
  // 无效单元格标记
  invalidList: {
    position: TableAttachData;
    cell: TableCell;
  }[] = [];
  // 处理两者的函数
  schemasMarkCB: AnyFunction;
  // 编辑/必填状态标识节点
  editStatusNodes: HTMLElement[] = [];
  // 无效反馈节点
  invalidNodes: HTMLElement[] = [];

  /** 获取当前显示的列的可编辑情况, 显示的所有行中任意一行的改列可编辑即视为可编辑 */
  getEditStatus(col: TableColumn) {
    return this.editStatusMap.get(col.key) || null;
  }

  // 更新单元格的可编辑/无效标记 渲染前调用
  private prepareSchemasMark() {
    this.editStatusMap = new Map();
    this.invalidList = [];

    // 以 { rowKey: { columnKey: true } } 缓存行的必填信息, 避免重复计算
    const requiredCache: Record<
      TableKey,
      Record<TableKey, boolean | undefined>
    > = {};

    this.schemasMarkCB = (cell: TableCell) => {
      if (cell.row.isHeader || cell.column.isHeader) return;
      if (this.allRemoveRecordMap.has(cell.row.key)) return false; // 删除行不显示

      // 根据isInteractive来判断是否是可编辑状态, 可能不完全准确, 但基本没影响
      const editable = this.interactive.isInteractive(cell);

      // 不可编辑时跳过, 后续的required/invalid检测都没有意义了
      if (!editable) return;

      const row = cell.row;
      const column = cell.column;

      let curRequiredCache = requiredCache[row.key];

      const schemas = this.getSchemas(row);

      // 缓存行的required检验
      if (!curRequiredCache) {
        curRequiredCache = {};
        requiredCache[row.key] = curRequiredCache;

        schemas.schemas.forEach((i) => {
          const validators = ensureArray(i.validator);

          const isRequired = validators.some(
            (v) => v?.key === requiredValidatorKey
          );

          if (isRequired) {
            curRequiredCache[stringifyNamePath(i.name)] = true;
          }
        });
      }

      let curCol = this.editStatusMap.get(column.key);

      const required = !!curRequiredCache[column.key];

      // 列未写入过时处理
      if (!curCol) {
        const hKey =
          this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];

        curCol = {
          cell: this.table.getCell(hKey, column.key), // 表头单元格
          required,
        };

        this.editStatusMap.set(column.key, curCol);
      }

      // 更新required
      if (required) {
        curCol.required = required;
      }

      // 更新invalid
      const invalid = !!schemas.invalid.get(column.key);

      if (invalid) {
        this.invalidList.push({
          position: this.table.getAttachPosition(cell),
          cell,
        });
      }
    };

    this.table.event.cellRendering.on(this.schemasMarkCB);
  }

  // 更新单元格的可编辑/无效标记
  private updateSchemasMark() {
    this.table.event.cellRendering.off(this.schemasMarkCB);

    const editStatusList = Array.from(this.editStatusMap.values());

    _syncListNode({
      wrapNode: this.wrapNode,
      list: editStatusList,
      nodeList: this.editStatusNodes,
      createAction: (node) => {
        node.className = "m78-table_form-edit-status";
      },
    });

    _syncListNode({
      wrapNode: this.wrapNode,
      list: this.invalidList,
      nodeList: this.invalidNodes,
      createAction: (node) => {
        node.className = "m78-table_form-invalid";
      },
    });

    // 渲染编辑/必填状态
    if (editStatusList.length) {
      editStatusList.forEach(({ cell, required }, ind) => {
        const node = this.editStatusNodes[ind];
        const position = this.table.getAttachPosition(cell);

        setCacheValue(
          node.style,
          "backgroundColor",
          required ? "var(--m78-color-warning)" : "var(--m78-color-opacity-lg)"
        );
        setCacheValue(
          node.style,
          "transform",
          `translate(${position.left}px, ${position.top}px)`
        );
        setCacheValue(node.style, "width", `${position.width}px`);
        setCacheValue(node.style, "zIndex", position.zIndex);
      });
    }

    // 渲染无效状态
    if (this.invalidList.length) {
      this.invalidList.forEach(({ position }, ind) => {
        const node = this.invalidNodes[ind];

        setCacheValue(node.style, "height", `${position.height + 1}px`);
        setCacheValue(node.style, "width", `${position.width + 1}px`);
        setCacheValue(
          node.style,
          "transform",
          `translate(${position.left - 1}px, ${position.top - 1}px)`
        );
        setCacheValue(
          node.style,
          "zIndex",
          String(Number(position.zIndex) + 2)
        );
      });
    }
  }

  /* # # # # # # # cell error # # # # # # # */

  // 用于updateErrors()的待展示列表
  private errorsList: {
    message: string;
    position: TableAttachData;
    cell: TableCell;
  }[] = [];
  // 存储错误信息的回调
  private updateErrorsCB: AnyFunction;
  // 用于显示错误标识的节点
  private errorsNodes: HTMLElement[] = [];

  /** 获取指定单元格最后一次参与验证后的错误字符串 */
  getCellError(cell: TableCell) {
    const rec = this.cellErrors.get(cell.row.key);

    if (!rec) return "";

    const cur = rec.get(cell.column.config.key);

    if (!cur) return "";

    return cur.message;
  }

  // 更新行的变更/错误标记 渲染前调用
  private prepareErrors() {
    this.errorsList = [];

    this.updateErrorsCB = (cell: TableCell) => {
      if (this.allRemoveRecordMap.has(cell.row.key)) return false; // 删除行不显示
      if (cell.row.isHeader || cell.column.isHeader) return;

      const rowErrors = this.cellErrors.get(cell.row.key);

      if (!rowErrors || rowErrors.size === 0) return;

      const err = rowErrors.get(cell.column.key);

      if (!err) return;

      this.errorsList.push({
        message: err.message,
        position: this.table.getAttachPosition(cell),
        cell,
      });
    };

    this.table.event.cellRendering.on(this.updateErrorsCB);
  }

  // 更新行的变更/错误标记
  private updateErrors() {
    this.table.event.cellRendering.off(this.updateErrorsCB);

    _syncListNode({
      wrapNode: this.wrapNode,
      list: this.errorsList,
      nodeList: this.errorsNodes,
      createAction: (node) => {
        node.className = "m78-table_form-error-feedback";
      },
    });

    this.errorsList.forEach(({ position }, ind) => {
      const node = this.errorsNodes[ind];

      setCacheValue(node.style, "width", `${position.width + 1}px`);
      setCacheValue(node.style, "height", `${position.height + 1}px`);
      setCacheValue(
        node.style,
        "transform",
        `translate(${position.left}px, ${position.top}px)`
      );
      setCacheValue(node.style, "zIndex", String(Number(position.zIndex) + 1));
    });
  }

  /* # # # # # # # row mark # # # # # # # */

  // 用于updateRowMark()的待展示列表
  private rowMarkList: {
    row: TableRow;
    position: TableAttachData;
    hasError: boolean;
  }[] = [];
  // 存储变更信息的回调
  private updateRowMarkCB: AnyFunction;
  // 用于显示行变动标识的节点
  private rowChangedNodes: HTMLElement[] = [];

  // 更新行的变更/错误标记 渲染前调用
  private prepareRowMark() {
    this.rowMarkList = [];

    this.updateRowMarkCB = (row: TableRow) => {
      if (this.allRemoveRecordMap.has(row.key)) return; // 删除行不显示
      if (row.isHeader) return;

      const errors = this.cellErrors.get(row.key);

      const hasError = !!errors && errors.size !== 0;

      if (!this.getChanged(row.key) && !hasError) return;

      this.rowMarkList.push({
        position: this.table.getRowAttachPosition(row),
        row,
        hasError,
      });
    };

    this.table.event.rowRendering.on(this.updateRowMarkCB);
  }

  // 更新行的变更/错误标记
  private updateRowMark() {
    this.table.event.rowRendering.off(this.updateRowMarkCB);

    _syncListNode({
      wrapNode: this.wrapNode,
      list: this.rowMarkList,
      nodeList: this.rowChangedNodes,
      createAction: (node) => {
        node.className = "m78-table_form-changed-mark";
      },
    });

    this.rowMarkList.forEach(({ position, row, hasError }, ind) => {
      const node = this.rowChangedNodes[ind];

      setCacheValue(node.style, "height", `${position.height + 1}px`);
      setCacheValue(
        node.style,
        "transform",
        `translate(${this.table.getX()}px, ${position.top}px)`
      );
      setCacheValue(
        node.style,
        "backgroundColor",
        hasError ? "var(--m78-color-error)" : "var(--m78-color)"
      );
      setCacheValue(node.style, "zIndex", row.isFixed ? "31" : "11");
    });
  }

  /* # # # # # # # changed cell mark # # # # # # # */

  // 用于updateChangedCell()的最终cell列表
  private changedCellList: TableAttachData[] = [];
  // 存储记录变更信息的回调
  private changedCellCB: AnyFunction;
  // 用于显示单元格变动标识的节点
  private cellChangedNodes: HTMLElement[] = [];

  // 更新用于标识变更单元格的列表 渲染前调用
  private prepareChangedCell() {
    this.changedCellList = [];

    this.changedCellCB = (cell: TableCell) => {
      if (this.allRemoveRecordMap.has(cell.row.key)) return;
      if (cell.row.isHeader || cell.column.isHeader) return;

      const isChanged = this.cellChanged.get(cell.key);

      if (!isChanged) return;

      const position = this.table.getAttachPosition(cell);

      this.changedCellList.push(position);
    };

    this.table.event.cellRendering.on(this.changedCellCB);
  }

  // 更新用于标识变更单元格的列表 渲染后调用
  private updateChangedCell() {
    this.table.event.cellRendering.off(this.changedCellCB);

    _syncListNode({
      wrapNode: this.wrapNode,
      list: this.changedCellList,
      nodeList: this.cellChangedNodes,
      createAction: (node) => {
        node.className = "m78-table_form-cell-changed-mark";
      },
    });

    this.changedCellList.forEach((pos, ind) => {
      const node = this.cellChangedNodes[ind];

      setCacheValue(
        node.style,
        "transform",
        `translate(${pos.left + pos.width - 8}px, ${pos.top + 2}px)`
      );
      setCacheValue(node.style, "zIndex", pos.zIndex);
    });
  }

  // 重置状态/数据内联内容等
  private reset() {
    this.addRecordMap = new Map();
    this.removeRecordMap = new Map();
    this.allRemoveRecordMap = new Map();
    this.sortRecordMap = new Map();
    this.defaultValues = new Map();
    this.schemaDatas = new Map();
    this.editStatusMap = new Map();
    this.cellChanged = new Map();
    this.rowChanged = new Map();
    this.cellErrors = new Map();

    this.invalidList = [];
    this.errorsList = [];
    this.changedCellList = [];
    this.rowMarkList = [];

    removeNode(this.wrapNode);

    this.errorsNodes = [];
    this.rowChangedNodes = [];
    this.cellChangedNodes = [];
    this.editStatusNodes = [];
    this.invalidNodes = [];
  }

  // verify/verifyChanged 验证通用逻辑, 逐行验证数据, 发生错误时停止并返回
  private async verifyCommon(
    onlyUpdated: boolean
  ): Promise<FormRejectOrValues> {
    let curError: FormRejectMeta | null = null;

    const res = await this.innerGetData(async (i, key, status) => {
      if (onlyUpdated && !status.update) return false;

      const row = this.table.getRow(key);
      const schema = this.getSchemas(row);

      const [rejects] = await this.innerCheck({
        row,
        values: i,
        schemas: schema,
      });

      // 包含错误时, 中断循环
      if (rejects) {
        curError = rejects;
        return 0;
      }
    });

    if (curError) {
      return [curError, null];
    }

    return [null, res];
  }

  // 接收处理后的values和schemas进行验证, 并更新行或单元格的错误信息, 包含错误时, 会选中并高亮首个错误单元格
  private innerCheck(arg: {
    row?: TableRow | TableKey;
    // 和row二选一, 传入时, 表示cell级别验证
    cell?: TableCell;
    values: any;
    schemas: FormSchemaWithoutName;
  }): Promise<FormRejectOrValues> {
    const { row: _row, cell, values, schemas } = arg;

    let row: TableRow | undefined;

    if (cell) {
      row = cell.row;
    } else if (isTruthyOrZero(_row)) {
      row = this.table.isRowLike(_row) ? _row : this.table.getRow(_row!);
    }

    if (!row) throwError("Unable to get row");

    const verify = this.getVerify();

    let cellError = this.cellErrors.get(row.key);

    if (!cellError) {
      cellError = new Map();
      this.cellErrors.set(row.key, cellError);
    }

    return verify.staticCheck(values, schemas).then((res) => {
      const [errors] = res;

      // 需要高亮的行
      let highlightColumn: TableKey | undefined;

      const existCheck: any = {};

      if (errors) {
        for (const e of errors) {
          // 对单元格验证和行验证采用不同的行为, cell验证仅写入对应列的错误

          if (cell) {
            // 单元格验证时, 只读取与单元格有关的第一条错误进行显示
            if (cell.column.key === e.name) {
              highlightColumn = cell.column.key;

              cellError!.set(e.name, e);
              break;
            }
          } else {
            // 每列只取第一条错误
            if (!existCheck[e.name]) {
              cellError!.set(e.name, e);
              existCheck[e.name] = true;

              if (!highlightColumn) {
                highlightColumn = e.name;
              }
            }
          }
        }
      }

      // 没有任意列被标记为错误, 单元格验证时, 清理单元格错误,  行验证时, 清理行错误
      if (!highlightColumn) {
        if (cell) {
          cellError!.delete(cell.column.key);
        } else if (!errors) {
          cellError!.clear();
        }
      }

      if (isTruthyOrZero(highlightColumn)) {
        const highlightCell =
          cell || this.table.getCell(row!.key, highlightColumn!);
        this.table.highlight(highlightCell.key);
        this.table.selectCells(highlightCell.key);
      }

      return res;
    });
  }

  /** 获取verify实例 */
  getVerify() {
    return this.verifyInstance;
  }

  // 获取指定行的schemas信息, 没有则创建, 可传入update来主动更新
  private getSchemas(row: TableRow | TableKey, update = false): SchemaData {
    const _row: TableRow = this.table.isRowLike(row)
      ? row
      : this.table.getRow(row);

    if (!update) {
      const cache = this.schemaDatas.get(_row.key);
      if (cache) return cache;
    }

    const verify = this.getVerify();

    return verify.withValues(_row.data, () => {
      const { schemas, invalidNames } = verify.getSchemas();

      const invalid = new Map<TableKey, true>();

      invalidNames.forEach((k) => invalid.set(stringifyNamePath(k), true));

      const data: SchemaData = {
        schemas: schemas.schemas || [],
        rootSchema: schemas,
        invalid,
        invalidNames,
      };

      this.schemaDatas.set(_row.key, data);

      return data;
    });
  }

  // 获取处理invalid项后的data, data会经过clone
  private getFmtData(row: TableRow | TableKey, data: any) {
    const invalid = this.getSchemas(row).invalidNames;

    data = simplyDeepClone(data);

    if (invalid?.length) {
      deleteNamePathValues(data, invalid);
    }

    return data;
  }

  /** 初始化verify实例 */
  private initVerify() {
    this.verifyInstance = createVerify({
      schemas: this.config.schemas?.length
        ? {
            schemas: this.config.schemas,
          }
        : {},
      autoVerify: false,
      languagePack: i18n.getResourceBundle(i18n.language, FORM_LANG_PACK_NS),
    });
  }

  /** 遍历所有数据(不包含fake/软删除数据)并返回其clone版本
   *
   * - 若cb返回false则跳过并将该条数据从返回list中过滤, 返回0时, 停止遍历, 返回已遍历的值
   * - 数据会对invalid的值进行移除处理, 可通过 handleInvalid 控制
   * - innerGetData和eachData在回调中为加入异步行为时才会异步执行, 本身是同步的, 使用promise api仅是为了兼容更多用法
   * */
  private async eachData(
    cb: (
      i: any,
      k: TableKey,
      // 该数据的状态
      status: { add: boolean; change: boolean; update: boolean }
    ) => Promise<void | false | 0>,
    handleInvalid = true
  ) {
    const list: any[] = [];

    const d = this.context.data;

    for (let j = 0; j < d.length; j++) {
      const i = d[j];

      const key = this.table.getKeyByRowData(i);

      const meta = this.context.getRowMeta(key);

      if (meta.fake) continue;

      if (this.softRemove.isSoftRemove(key)) continue;

      const data = handleInvalid ? this.getFmtData(key, i) : simplyDeepClone(i);

      const isAdd = this.addRecordMap.has(key);

      // 新增数据删除虚拟主键, 防止数据传输到服务端时出错
      if (isAdd) {
        deleteNamePathValue(data, this.config.primaryKey);
      }

      // 变更过且不是新增的数据
      const isChange = !isAdd && this.getChanged(key);

      const isUpdate = isAdd || isChange;

      const res = await cb(data, key, {
        add: isAdd,
        change: isChange,
        update: isUpdate,
      });

      if (res === 0) break;

      if (res === false) continue;

      list.push(data);
    }

    return list;
  }

  // getData的内部版本, 可在每一次遍历时回调, 可以选择跟eachData一样中断或跳过数据, cb与this.eachData的cb一致
  // innerGetData和eachData在回调中为加入异步行为时才会异步执行, 本身是通本的, 使用promise api仅是为了兼容更多用法
  private async innerGetData(
    cb?: (
      i: any,
      k: TableKey,
      status: { add: boolean; change: boolean; update: boolean }
    ) => Promise<void | false | 0>
  ): Promise<TableDataLists | null> {
    const add: any[] = [];
    const change: any[] = [];
    const update: any[] = [];
    let remove: any[] = [];

    let hasBreak = false;

    const all = await this.eachData(async (data, key, status) => {
      const push = () => {
        if (status.add) add.push(data);
        if (status.change) change.push(data);
        if (status.update) update.push(data);
      };

      if (!cb) {
        push();
        return;
      }

      const res = await cb(data, key, status);

      if (res === 0) hasBreak = true;

      if (res === 0 || res === false) return res; // 异常返回原样返回给eachData

      push();
    });

    if (hasBreak) return null;

    const rList = Array.from(this.removeRecordMap.values());

    if (rList) remove = rList;

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

  // 初始化wrapNode
  private initNodeWrap() {
    this.wrapNode = document.createElement("div");
    this.wrapNode.className = "m78-table_form-wrap";
    this.context.viewContentEl.appendChild(this.wrapNode);
  }

  // schema配置发生变更
  private schemaConfigChange() {
    this.schemaDatas = new Map();
    this.cellErrors = new Map();
    this.editStatusMap = new Map();
    this.invalidList = [];
    this.initVerify();
  }
}

/** form相关配置 */
export interface TableFormConfig {
  /**
   * 用于校验字段的schema
   *
   * 部分schema在table中会被忽略, 如 schema.list
   * */
  schemas?: FormSchema[];
  /** 自定义form实例创建器 */
  formCreator?: AnyFunction;
}

/** 对外暴露的form相关方法 */
export interface TableForm {
  /**
   * 执行校验, 返回元组: [错误, 当前数据信息]
   *
   * - 若包含错误, 校验会在首个错误行停止
   * */
  verify: () => Promise<FormRejectOrValues>;

  /** 校验指定行, 返回元组: [错误, 当前行数据] */
  verifyRow: (rowKey: TableKey) => Promise<FormRejectOrValues>;

  /**
   * 同verify, 但仅对新增和变更行执行校验, 返回元组: [错误, 被校验的行]
   *
   * - 若包含错误, 校验会在首个错误行停止
   * */
  verifyUpdated: () => Promise<FormRejectOrValues>;

  /** 获取当前数据相关的内容, 包含: 所有数据 / 新增 / 变更 / 删除的数据, 以及一些数据相关的状态 */
  getData(): TableDataLists;

  /**
   * 指定行或单元格数据是否变更
   *
   * - 值变更/新增/删除的行均视为变更, 行排序变更时, 行会视为变更, 行下单元格不会 */
  getChanged(rowKey: TableKey, columnKey?: NamePath): boolean;

  /**
   * 表格是否发生过数据变更
   *
   * - 被视为数据变更的场景: 值变更/新增/删除/排序
   * */
  getTableChanged(): boolean;
}

/** 数据变更相关的内容 */
export interface TableDataLists<D = AnyObject> {
  /** 所有数据 */
  all: D[];
  /** 新增的行 */
  add: D[];
  /** 发生过变更的行, 不含新增行 */
  change: D[];
  /** 新增和变更的行 */
  update: D[];
  /** 移除的行 */
  remove: D[];
  /** 发生了数据排序 (不包含增删数据导致的索引变更) */
  sorted: boolean;
}

// 缓存的schema信息
interface SchemaData {
  // 处理后的schema
  schemas: FormSchema[];
  // 处理后的schmea, 包含root schema
  rootSchema: FormSchemaWithoutName;
  // 记录无效的列, key为列标识
  invalid: Map<TableKey, true>;
  // 无效列的name
  invalidNames: NamePath[];
}
