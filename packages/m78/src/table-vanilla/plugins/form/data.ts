import { _MixinBase } from "./base.js";
import { TableDataLists } from "./types.js";
import { TableKey } from "../../types/base-type.js";
import {
  deleteNamePathValue,
  deleteNamePathValues,
  simplyDeepClone,
} from "@m78/utils";
import { _MixinStatus } from "./status.js";
import { TableRow } from "../../types/items.js";
import { _MixinSchema } from "./schema.js";

export interface _MixinData extends _MixinBase, _MixinStatus, _MixinSchema {}

export class _MixinData {
  getData() {
    return this.innerGetData() as Promise<TableDataLists>;
  }

  // getData的内部版本, 可在每一次遍历时回调, 可以选择跟eachData一样中断或跳过数据, cb与this.eachData的cb一致
  // innerGetData和eachData在回调中为加入异步行为时才会异步执行, 本身是同步的, 使用promise api仅是为了兼容更多用法
  async innerGetData(
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
        if (this.addRecordMap.has(k)) return; // 跳过新增的项
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

  /** 遍历所有数据(不包含fake/软删除数据)并返回其clone版本
   *
   * - 若cb返回false则跳过并将该条数据从返回list中过滤, 返回0时, 停止遍历, 返回已遍历的值
   * - 数据会对invalid的值进行移除处理, 可通过 handleInvalid 控制
   * */
  async eachData(
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

  // 获取处理invalid项后的data, data会经过clone
  getFmtData(row: TableRow | TableKey, data: any) {
    const invalid = this.getSchemas(row).invalidNames;

    data = simplyDeepClone(data);

    if (invalid?.length) {
      deleteNamePathValues(data, invalid);
    }

    return data;
  }
}
