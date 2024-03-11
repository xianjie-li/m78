import { FormRejectMetaItem, FormVerifyInstance } from "@m78/form";
import { TableKey } from "../../types/base-type.js";
import { _SchemaData } from "./types.js";
import { _TableInteractivePlugin } from "../interactive.js";
import { _TableSoftRemovePlugin } from "../soft-remove.js";
import { AnyObject } from "@m78/utils";

export class _MixinProperty {
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
  schemaDatas = new Map<TableKey, _SchemaData>();

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
}
