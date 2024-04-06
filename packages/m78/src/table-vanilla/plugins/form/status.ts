import { _MixinBase } from "./base.js";
import { TableKey } from "../../types/base-type.js";
import { _getCellKey } from "../../common.js";
import { NamePath } from "@m78/form";
import { stringifyNamePath } from "@m78/utils";
import { TableColumn } from "../../types/items.js";
import { TableDataStatus } from "./types.js";

export interface _MixinStatus extends _MixinBase {}

/** form状态相关 */
export class _MixinStatus {
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

  /** 获取当前显示的列的可编辑情况, 显示的所有行中任意一行的改列可编辑即视为可编辑 */
  getEditStatus(col: TableColumn) {
    return this.editStatusMap.get(col.key) || null;
  }

  getChangeStatus(): TableDataStatus {
    const ctx = this.context;
    let length = ctx.data.length - ctx.yHeaderKeys.length;

    length = length - this.softRemove.remove.getState().selected.length;

    let add = 0;

    this.addRecordMap.forEach((v, k) => {
      if (this.softRemove.isSoftRemove(k)) return; // 软删除的行不视为新增
      add++;
    });

    let change = 0;

    // 变更数量需排除掉新增行o
    this.rowChanged.forEach((v, k) => {
      if (this.addRecordMap.has(k)) return;
      change++;
    });

    let remove = this.removeRecordMap.size;

    if (this.softRemove.remove.hasSelected()) {
      this.softRemove.remove.getState().selected.forEach((k) => {
        if (this.removeRecordMap.has(k)) return; // 跳过已直接删除的项
        if (this.addRecordMap.has(k)) return; // 跳过新增的项
        remove++;
      });
    }

    return {
      length,
      add,
      change,
      update: add + change,
      remove,
      sorted: this.getSortedStatus(),
    };
  }
}
