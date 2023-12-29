import { TablePlugin } from "../plugin.js";
import { TableKey } from "../types/base-type.js";
import { TableReloadLevel, TableReloadOptions } from "./life.js";

/** 根据存储跟行或列数据相关的一些元信息 */
export interface _MetaData {
  /** 表示是由table注入的假数据 */
  fake?: boolean;
  /** 表示对关联数据的引用 */
  ref?: TableKey;
  /** 该数据应该在渲染时被忽略 */
  ignore?: boolean;
  /** 该条数据需要在计算/渲染时被忽略, 用于区分与ignore不同的场景 */
  hide?: boolean;
  /** 该对象关联的某个timer */
  timer?: any;
  /** 当前的reloadKey */
  reloadKey?: string;
  /** 挂载标记 */
  rendered?: boolean;
  /** 表示该数据为新增数据 */
  new?: boolean;
  /** 该数据为替身数据, 实际所在位置为ref指向的占位数据位置 */
  substitute?: boolean;
}

export interface _MetaMethods {
  /** 获取行元数据 */
  getRowMeta(key: TableKey): _MetaData;

  /** 获取列元数据 */
  getColumnMeta(key: TableKey): _MetaData;

  /** 判断是否是ignore行的快捷方法 */
  isIgnoreRow(key: TableKey): boolean;

  /** 判断是否是ignore列的快捷方法 */
  isIgnoreColumn(key: TableKey): boolean;
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

  isIgnoreRow(key: TableKey): boolean {
    return !!this.getRowMeta(key).ignore;
  }

  isIgnoreColumn(key: TableKey): boolean {
    return !!this.getColumnMeta(key).ignore;
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
