import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { TableReloadLevel, TableReloadOptions } from "./life.js";
import { SelectManager } from "@m78/utils";

/** 根据存储跟行或列数据相关的一些元信息 */
export interface _MetaData {
  /** 表示是由table注入的假数据 */
  fake?: boolean;
  /** 该数据应该在渲染时被忽略 */
  ignore?: boolean;
  /** 该对象关联的某个timer */
  timer?: any;
  /** 当前的reloadKey */
  reloadKey?: string;
  /** 挂载标记 */
  rendered?: boolean;
  /** 表示该数据为新增数据 */
  new?: boolean;
  /** 该项为固定项, 实际所在位置为ref指向的占位数据位置 */
  fixed?: boolean;
}

// 挂载到context上的方法
export interface _MetaMethods {
  /** 获取行元数据 */
  getRowMeta(key: TableKey): _MetaData;

  /** 获取列元数据 */
  getColumnMeta(key: TableKey): _MetaData;

  /** 判断是否是ignore行的快捷方法, 包含了对扩展ignore的处理, 可传入现有meta来避免重新查询 */
  isIgnoreRow(key: TableKey, meta?: _MetaData): boolean;

  /** 判断是否是ignore列的快捷方法, 包含了对扩展ignore的处理, 可传入现有meta来避免重新查询 */
  isIgnoreColumn(key: TableKey, meta?: _MetaData): boolean;
}

/**
 * 管理存储在行/列或其他数据中的元信息以及对应的key
 * */
export class _TableMetaDataPlugin extends TablePlugin implements _MetaMethods {
  /** 记录当前reloadKey */
  static RELOAD_KEY = "__M78TableReloadKey";

  /** 挂载渲染标记 */
  static RENDERED_KEY = "__M78TableRenderFlag";

  /** 与对象有关的某个timer */
  static TIMER_KEY = "__M78TableTimer";

  // 行元数据
  rowMeta = new Map<TableKey, _MetaData>();

  // 列元数据
  columnMeta = new Map<TableKey, _MetaData>();

  // 单元格元数据
  cellMeta = new Map<TableKey, _MetaData>();

  // 额外用于检测ignore的检测器, 用于放置不同功间共同管理ignore状态时冲突
  extraRowIgnoreChecker: SelectManager[] = [];

  // 额外用于检测ignore的检测器, 用于放置不同功间共同管理ignore状态时冲突
  extraColumnIgnoreChecker: SelectManager[] = [];

  beforeInit() {
    this.methodMapper(this.context, [
      "getRowMeta",
      "getColumnMeta",
      "isIgnoreRow",
      "isIgnoreColumn",
    ]);
  }

  reload(opt: TableReloadOptions) {
    if (opt.level === TableReloadLevel.full) {
      this.rowMeta.clear();
      this.columnMeta.clear();
    }
  }

  isIgnoreRow(key: TableKey, meta?: _MetaData): boolean {
    const _meta = meta || this.getRowMeta(key);
    const ignore = !!_meta.ignore;

    if (ignore) return true;

    for (let i = 0; i < this.extraRowIgnoreChecker.length; i++) {
      const checker = this.extraRowIgnoreChecker[i];
      if (checker.isSelected(key)) return true;
    }

    return false;
  }

  isIgnoreColumn(key: TableKey, meta?: _MetaData): boolean {
    const _meta = meta || this.getColumnMeta(key);
    const ignore = !!_meta.ignore;

    if (ignore) return true;

    for (let i = 0; i < this.extraColumnIgnoreChecker.length; i++) {
      const checker = this.extraColumnIgnoreChecker[i];
      if (checker.isSelected(key)) return true;
    }

    return false;
  }

  getRowMeta(key: TableKey) {
    let m = this.rowMeta.get(key);

    if (!m) {
      m = {};
      this.rowMeta.set(key, m);
    }

    return m;
  }

  getColumnMeta(key: TableKey) {
    let m = this.columnMeta.get(key);

    if (!m) {
      m = {};
      this.columnMeta.set(key, m);
    }

    return m;
  }
}
