import { _MixinBase } from "./base.js";
import { TableKey } from "../../types/base-type.js";
import { TableCell, TableRow } from "../../types/items.js";
import { requiredValidatorKey } from "@m78/form/validator/index.js";
import { _syncListNode } from "../../common.js";
import { ensureArray, setCacheValue, stringifyNamePath } from "@m78/utils";
import { _MixinSchema } from "./schema.js";
import { _MixinStatus } from "./status.js";

export interface _MixinRenders extends _MixinBase, _MixinStatus, _MixinSchema {}

/** 渲染各种form标记 */
export class _MixinRenders {
  /* # # # # # # # 与schema相关的标记渲染, editable & valid # # # # # # # */

  // 更新单元格的可编辑/无效标记 渲染前调用
  prepareSchemasMark() {
    if (!this.config.interactiveMark) return;

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

      // 根据isInteractive来判断是否是可编辑(交互)状态, 可能是仅 Interactive 项, 但不影响
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
  updateSchemasMark() {
    if (!this.config.interactiveMark) return;

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

  /* # # # # # # # cell error render # # # # # # # */

  /** 获取指定单元格最后一次参与验证后的错误字符串 */
  getCellError(cell: TableCell) {
    const rec = this.cellErrors.get(cell.row.key);

    if (!rec) return "";

    const cur = rec.get(cell.column.config.key);

    if (!cur) return "";

    return cur.message;
  }

  // 更新行的变更/错误标记 渲染前调用
  prepareErrors() {
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
  updateErrors() {
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

  // 更新行的变更/错误标记 渲染前调用
  prepareRowMark() {
    if (!this.config.rowMark) return;

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
  updateRowMark() {
    if (!this.config.rowMark) return;

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

  // 更新用于标识变更单元格的列表 渲染前调用
  prepareChangedCell() {
    if (!this.config.cellChangedMark) return;

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
  updateChangedCell() {
    if (!this.config.cellChangedMark) return;

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
}
