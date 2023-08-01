import {
  createForm,
  FormInstance,
  FormSchema,
} from "../../form-vanilla/index.js";
import {
  ensureArray,
  getNamePathValue,
  isEmpty,
  NamePath,
  setNamePathValue,
  stringifyNamePath,
} from "@m78/utils";
import { _TablePrivateProperty, TableKey } from "../types/base-type.js";
import { TablePlugin } from "../plugin.js";
import { TableCell } from "../types/items.js";
import {
  TableMutationEvent,
  TableMutationType,
  TableMutationValueEvent,
} from "./mutation.js";
import { RejectMeta, requiredValidatorKey } from "@m78/verify";
import { TableReloadLevel } from "./life.js";
import { TableAttachData } from "./getter.js";
import { removeNode } from "../../common/index.js";
import { _syncListNode } from "../common.js";
import { _TableInteractiveCorePlugin } from "./interactive-core.js";

// reload index后, 变更后的data失效, 需要调整index逻辑

export class _TableFormPlugin extends TablePlugin {
  wrapNode: HTMLElement;

  // 以key存储行表单实例
  formInstances: Record<string, FormInstance | void> = {};

  // 以key存储行表单错误信息
  errors: Record<string, RejectMeta | void> = {};

  // 记录行是否变动
  rowChanged: Record<string, boolean> = {};

  // 用于显示错误反馈的节点
  errorNodes: HTMLElement[] = [];

  // 用于显示行变动标识的节点
  rowChangedNodes: HTMLElement[] = [];

  // 记录行是否变动
  cellChanged: Record<string, TableCell> = {};

  // 用于显示单元格变动标识的节点
  cellChangedNodes: HTMLElement[] = [];

  // 记录编辑/必填状态
  editStatus: {
    required: boolean;
    cell: TableCell;
  }[] = [];

  editStatusNodes: HTMLElement[] = [];

  interactive: _TableInteractiveCorePlugin;

  beforeInit() {
    this.interactive = this.getPlugin(_TableInteractiveCorePlugin);
    this.wrapNode = document.createElement("div");
    this.wrapNode.className = "m78-table_form-wrap";
  }

  mounted() {
    this.table.event.mutation.on(this.mutation);
    this.context.viewContentEl.appendChild(this.wrapNode);
  }

  beforeDestroy() {
    this.table.event.mutation.off(this.mutation);
    this.reset();
    removeNode(this.wrapNode);
  }

  loadStage(level: TableReloadLevel, isBefore: boolean) {
    if (level === TableReloadLevel.full && isBefore) {
      this.reset();
    }

    if (level === TableReloadLevel.base && !isBefore) {
      this.updateEditStatus();
    }
  }

  reset = () => {
    this.formInstances = {};
    this.errors = {};
    this.rowChanged = {};
  };

  mutation = (e: TableMutationEvent) => {
    if (e.type !== TableMutationType.value) return;

    const { cell, value } = e;

    const form = this.initForm(e);

    const name = cell.column.config.originalKey;

    form.setValue(name, value);

    this.rowChanged[cell.row.key] = form.getFormChanged();

    if (form.getChanged(name)) {
      this.cellChanged[cell.key] = cell;
    } else {
      delete this.cellChanged[cell.key];
    }

    form.debounceVerify(undefined, (errors) => {
      this.errors[cell.row.key] = errors;
      this.table.render();
    });
  };

  rendering() {
    if (this.editStatus.length) {
      this.editStatus.forEach(({ cell, required }, ind) => {
        const node = this.editStatusNodes[ind];
        const position = this.table.getAttachPosition(cell);

        node.title = required
          ? this.context.texts.editableAndRequired
          : this.context.texts.editable;
        node.style.color = required
          ? "var(--m78-color-warning)"
          : "var(--m78-color-second)";
        node.style.transform = `translate(${position.left + 2}px, ${
          position.top + position.height - 8
        }px)`;
        node.style.zIndex = position.zIndex;
      });
    }

    if (isEmpty(this.formInstances)) return;

    const errList = this.getErrorList();

    const changedList = this.getRowChangedList();

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
      node.style.transform = `translate(${attachPosition.left - 1}px, ${
        attachPosition.top - 1
      }px)`;
      node.style.zIndex = String(Number(attachPosition.zIndex) + 1); // 比变动标记高一层
    });
  }

  // 更新可编辑状态
  updateEditStatus() {
    const hKey = this.context.yHeaderKeys[this.context.yHeaderKeys.length - 1];
    const firstRowKey = this.context.allRowKeys[0];

    this.editStatus = [];

    if (!firstRowKey) return;

    let requireKeys: string[] = [];

    // 是否包含必填验证器
    if (!isEmpty(this.config.schema)) {
      requireKeys = this.config
        .schema!.filter((i) => {
          const validator = ensureArray(i.validator);

          return validator.some((i) => i.key === requiredValidatorKey);
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
        this.editStatus.push({
          required: requireKeys.includes(col.key),
          cell,
        });
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

  // 获取用于展示错误的列表, 包含了渲染需要的各种必要信息
  getErrorList() {
    const list: {
      /** 对应单元格 */
      cell: TableCell;
      /** 错误信息 */
      message: string;
      /** 单元格位置, 用于控制节点挂载位置 */
      attachPosition: TableAttachData;
    }[] = [];

    Object.keys(this.errors).forEach((key) => {
      const rowErrors = this.errors[key];

      if (rowErrors) {
        rowErrors.forEach((item) => {
          const cell = this.table.getCell(key, item.name);
          const pos = this.table.getAttachPosition(cell);

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

    return list;
  }

  // 获取用于展示变更行列表, 包含了渲染需要的各种必要信息
  getRowChangedList() {
    const list = Object.keys(this.rowChanged)
      .filter((i) => {
        return this.rowChanged[i];
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
  getChangedList() {
    const list: TableAttachData[] = [];

    Object.keys(this.cellChanged).forEach((key) => {
      const cell = this.cellChanged[key];

      if (!cell) return;

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
  initForm({ cell, oldValue }: TableMutationValueEvent) {
    let form = this.formInstances[cell.row.key];

    if (form) return form;

    const defaultValue = { ...cell.row.data };

    setNamePathValue(defaultValue, cell.column.config.originalKey, oldValue);

    form = createForm({
      defaultValue,
      schemas: {
        schema: this.config.schema,
      },
      autoVerify: false,
    });

    this.formInstances[cell.row.key] = form;

    return form;
  }
}

/** table定制版的FormSchema */
export interface TableFormSchema extends Omit<FormSchema, "list"> {}

/** form相关配置 */
export interface TableFormConfig {
  /** 用于校验字段的schema */
  schema?: TableFormSchema[];
}

/** 对外暴露的form相关方法 */
export interface TableForm {
  /** 执行校验, 未通过时promise会reject包含VerifyError类型的错误 */
  verify: (rowKey?: TableKey) => Promise<void>;

  /** 获取发生过变更的行 */
  getChangedData(): any[];

  /** 获取当前数据 */
  getData(): any[];

  /** 指定行或单元格是否发生过变更 */
  getChanged(rowKey: TableKey, columnName?: NamePath): boolean;

  /** 整个表格的表单是否发生或变更 */
  getFormChanged(): boolean;

  resetFormState(): void;
}
