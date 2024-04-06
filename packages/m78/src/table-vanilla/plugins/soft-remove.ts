import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { _TableDisablePlugin } from "./disable.js";
import { ensureArray, SelectManager } from "@m78/utils";
import { TableRow } from "../types/items.js";
import { removeNode } from "../../common/index.js";
import { TableReloadLevel, TableReloadOptions } from "./life.js";
import { TableAttachData } from "./getter.js";
import { _syncListNode } from "../common.js";
import {
  _getBlankMutationDataEvent,
  TableMutationDataType,
} from "./mutation.js";

/**
 * 实现软删除
 *
 * 触发mutation事件, 可在 getData().remove 等api中获取被删除项, 同时也应影响 getChanged 等api
 *
 * 也可视作数据变更, 应计入历史记录
 * */
export class _TableSoftRemovePlugin
  extends TablePlugin
  implements TableSoftRemove
{
  private wrapNode: HTMLElement;

  // 用于显示行删除标识的节点
  private rowMarkNodes: HTMLElement[] = [];

  // 记录删除状态的select
  remove = new SelectManager<TableKey>();

  beforeInit() {
    this.methodMapper(this.table, [
      "softRemove",
      "isSoftRemove",
      "restoreSoftRemove",
      "confirmSoftRemove",
    ]);
  }

  mounted() {
    this.wrapNode = document.createElement("div");
    this.wrapNode.className = "m78-table_soft-remove-wrap";
    this.context.viewContentEl.appendChild(this.wrapNode);
  }

  init() {
    const disablePlugin = this.getPlugin(_TableDisablePlugin);

    disablePlugin.rowChecker.push(this.remove);
  }

  reload(opt: TableReloadOptions) {
    if (opt.level === TableReloadLevel.full) {
      this.remove.unSelectAll();
    }
  }

  beforeDestroy() {
    this.remove.unSelectAll();
    removeNode(this.wrapNode);
  }

  rendering() {
    const list = this.getRemoveList();

    list.forEach((i, ind) => {
      const node = this.rowMarkNodes[ind];
      const position = i.attachPosition;

      node.style.transform = `translate(${position.left}px, ${position.top}px)`;
      node.style.height = `${position.height}px`;
      node.style.zIndex = position.zIndex;
    });
  }

  softRemove(key: TableKey | TableKey[]) {
    // 过滤掉不存在的项
    const rowsKeys = ensureArray(key).filter((k) => this.table.isRowExist(k));

    if (!rowsKeys.length) return;

    const rowsData = rowsKeys.map((k) => this.table.getRow(k).data);

    this.table.history.redo({
      title: this.context.texts["remove row"],
      redo: () => {
        // 移除删除项的选中状态
        this.table.unselectRows(rowsKeys);
        this.remove.selectList(ensureArray(key));

        this.table.event.mutation.emit(
          _getBlankMutationDataEvent({
            changeType: TableMutationDataType.softRemove,
            soft: rowsData,
          })
        );

        this.table.renderSync();
      },
      undo: () => {
        this.remove.unSelectList(ensureArray(key));

        this.table.event.mutation.emit(
          _getBlankMutationDataEvent({
            changeType: TableMutationDataType.restoreSoftRemove,
            soft: rowsData,
          })
        );

        this.table.renderSync();
      },
    });
  }

  isSoftRemove(key: TableKey): boolean {
    return this.remove.isSelected(key);
  }

  restoreSoftRemove(key?: TableKey | TableKey[]) {
    let keys: TableKey[] = ensureArray(key);

    if (keys.length) {
      keys = keys.filter((k) => this.table.isRowExist(k));
    } else {
      keys = this.remove.getState().selected;
    }

    this.table.history.redo({
      title: this.context.texts["restore row"],
      redo: () => {
        this.remove.unSelectList(keys);

        this.table.event.mutation.emit(
          _getBlankMutationDataEvent({
            changeType: TableMutationDataType.restoreSoftRemove,
          })
        );

        this.table.renderSync();
      },
      undo: () => {
        this.remove.selectList(keys);

        this.table.event.mutation.emit(
          _getBlankMutationDataEvent({
            changeType: TableMutationDataType.softRemove,
          })
        );

        this.table.renderSync();
      },
    });
  }

  confirmSoftRemove(): void {
    const cur = this.remove.getState().selected;

    this.table.history.batch(() => {
      this.table.history.redo({
        redo: () => {
          this.remove.unSelectAll();
          this.table.removeRow(cur);
        },
        undo: () => {
          this.remove.setAllSelected(cur);
          this.table.renderSync();
        },
      });
    }, this.context.texts["remove row"]);
  }

  // 获取用于展示删除状态的列表, 包含了渲染需要的各种必要信息
  private getRemoveList() {
    const list: {
      /** 对应单元格 */
      row: TableRow;
      /** 位置, 用于控制节点挂载位置 */
      attachPosition: TableAttachData;
    }[] = [];

    const keys = this.remove.getState().selected;

    keys.forEach((k) => {
      if (!this.table.isRowMount(k)) return;

      const row = this.table.getRow(k);
      const attachPosition = this.table.getRowAttachPosition(row);

      list.push({
        row,
        attachPosition,
      });
    });

    _syncListNode({
      wrapNode: this.wrapNode,
      list,
      nodeList: this.rowMarkNodes,
      createAction: (node) => {
        node.className = "m78-table_soft-remove-mark";
      },
    });

    return list;
  }
}

/** 软删除相关API */
export interface TableSoftRemove {
  /** 软删除数据, 删除数据不会从表格消失, 而是显示为禁用, 用户可以在保存前随时对其进行恢复 */
  softRemove(key: TableKey | TableKey[]): void;

  /** 检测记录是否被软删除 */
  isSoftRemove(key: TableKey): boolean;

  /** 恢复被软删除的行, 不传key时恢复全部 */
  restoreSoftRemove(key?: TableKey | TableKey[]): void;

  /** 将当前标记为软删除的行彻底删除 */
  confirmSoftRemove(): void;
}
