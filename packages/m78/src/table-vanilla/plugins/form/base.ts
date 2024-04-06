import { TablePlugin } from "../../plugin.js";
import { FormRejectMetaItem, FormVerifyInstance } from "@m78/form";
import { TableKey } from "../../types/base-type.js";
import { _SchemaData } from "./types.js";
import { _TableInteractivePlugin } from "../interactive.js";
import { _TableSoftRemovePlugin } from "../soft-remove.js";
import { AnyFunction, AnyObject } from "@m78/utils";
import { TableCell, TableRow } from "../../types/items.js";
import { TableAttachData } from "../getter.js";

/** 在不同混合中可能都会用到的通用项 */
export interface _MixinBase extends TablePlugin {}

export class _MixinBase {
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

  /* # # # # # # # 与schema相关的标记渲染 End # # # # # # # */

  /* # # # # # # # cell error render # # # # # # # */

  // 用于updateErrors()的待展示列表
  errorsList: {
    message: string;
    position: TableAttachData;
    cell: TableCell;
  }[] = [];
  // 存储错误信息的回调
  updateErrorsCB: AnyFunction;
  // 用于显示错误标识的节点
  errorsNodes: HTMLElement[] = [];

  /* # # # # # # # cell error render End # # # # # # # */

  /* # # # # # # # row mark # # # # # # # */

  // 用于updateRowMark()的待展示列表
  rowMarkList: {
    row: TableRow;
    position: TableAttachData;
    hasError: boolean;
  }[] = [];
  // 存储变更信息的回调
  updateRowMarkCB: AnyFunction;
  // 用于显示行变动标识的节点
  rowChangedNodes: HTMLElement[] = [];

  /* # # # # # # # row mark End # # # # # # # */

  /* # # # # # # # changed cell mark # # # # # # # */

  // 用于updateChangedCell()的最终cell列表
  changedCellList: TableAttachData[] = [];
  // 存储记录变更信息的回调
  changedCellCB: AnyFunction;
  // 用于显示单元格变动标识的节点
  cellChangedNodes: HTMLElement[] = [];

  /* # # # # # # # changed cell End # # # # # # # */

  /** 获取verify实例 */
  getVerify() {
    return this.verifyInstance;
  }
}
