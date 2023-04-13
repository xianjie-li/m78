import {
  TableRow,
  TableColumn,
  TableCell,
  TableConfig,
  TableInstance,
  TablePluginContext,
} from "./types.js";
import { AnyObject, isFunction } from "@m78/utils";

export interface TableInitInterceptor {
  /** 可在此处改写row实例 */
  row?: (row: TableRow) => TableRow;
  /** 可在此处改写column实例 */
  column?: (column: TableColumn) => TableColumn;
  /** 可在此处改写cell实例 */
  cell?: (cell: TableCell) => TableCell;
}

export class TablePlugin {
  /** table实例 */
  table: TableInstance;
  /** 当前注册的所有plugin */
  plugins: TablePlugin[];
  /** 同table.config */
  config: TableConfig;

  /** 排序, 越大的越靠后挂载, 默认挂载顺序为插件在参数数组中的顺序 */
  static sort?: number;

  /** 用来挂载自定义字段 */
  state: AnyObject = {};

  /** 在不同插件间共享的上下文对象 */
  context: TablePluginContext = {} as any;

  constructor(config: {
    table: TablePlugin["table"];
    plugins: TablePlugin["plugins"];
    context: TablePlugin["context"];
  }) {
    this.table = config.table;
    this.plugins = config.plugins;
    this.config = config.table.config;
    this.context = config.context;
  }

  /**
   * 初始化阶段调用, 此时table实例还未创建完成, 可在此时改写配置/实例, 或返回用于更改row/cell/column构造行为的函数
   * */
  init?(): TableInitInterceptor | void;

  /**
   * 初始化完成, 此时拥有完整的table实例
   * */
  initialized?(): void;

  /**
   * 首次渲染后
   * */
  mount?(): void;

  /**
   * 每次渲染完成后调用
   * */
  rendered?(): void;

  /**
   * 卸载前调用
   * */
  beforeDestroy?(): void;

  /** 工具函数, 将当对象上的指定函数映射到指定对象上 */
  methodMapper<T extends object = AnyObject>(obj: T, methods: (keyof T)[]) {
    methods.forEach((m) => {
      // @ts-ignore
      if (isFunction(this[m])) {
        // @ts-ignore
        obj[m] = (...args: any[]) => this[m](...args);
      }
    });
  }

  /** 获取指定插件类的实例 */
  getPlugin<T extends TablePlugin = any>(
    pluginClass: new (...args: any[]) => T
  ): T | null {
    const ins = this.plugins.find((p) => p instanceof pluginClass) || null;
    return ins as T;
  }
}
