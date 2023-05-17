import {
  TableReloadOptions,
  TableConfig,
  TableInstance,
  TablePluginContext,
} from "./types.js";
import { AnyObject, isFunction } from "@m78/utils";

/**
 * 插件类, 用于扩展table的功能
 * - 注意: 在关键配置(data/columns/rows等)变更后, init/initialized/mount/beforeDestroy 是会被重新执行的, 整个表格生命周期并不是只有一次
 * */
export class TablePlugin {
  /** table实例 */
  table: TableInstance;
  /** 当前注册的所有plugin */
  plugins: TablePlugin[];
  /** 同table.config */
  config: TableConfig;

  /** 用来挂载自定义字段 */
  state: AnyObject = {};

  /** 在不同插件间共享的上下文对象 */
  context: TablePluginContext = {} as any;

  constructor(config: {
    table: TablePlugin["table"];
    plugins: TablePlugin["plugins"];
    context: TablePlugin["context"];
    config: TableConfig;
  }) {
    this.table = config.table;
    this.plugins = config.plugins;
    this.config = config.config;
    this.context = config.context;
  }

  /**
   * 初始化阶段调用, 此时table实例可能还未创建完成, 可在此时改写配置/实例
   * - 可以访问在当前插件之前注册插件挂载的实例属性或方法
   * */
  init?(): void;

  /**
   * 初始化完成
   * */
  initialized?(): void;

  /**
   * init完成, 并完成首次渲染
   * */
  mount?(): void;

  /**
   * 每次渲染完成后
   * */
  rendered?(): void;

  /** 重载表格时 */
  reload?(opt?: TableReloadOptions): void;

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
