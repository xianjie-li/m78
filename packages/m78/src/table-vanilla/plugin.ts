import {
  AnyObject,
  isArray,
  isFunction,
  isString,
  throwError,
} from "@m78/utils";
import { _prefix } from "./common.js";
import { TablePluginContext } from "./types/context.js";
import { TableConfig } from "./types/config.js";
import { TableInstance } from "./types/instance.js";

import { TableCellWithDom } from "./types/items.js";
import { TableReloadLevel, TableReloadOptions } from "./plugins/life.js";
import { TableRenderCtx } from "./types/base-type.js";

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

  /** 初始化前调用 */
  beforeInit?(): void;

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
  mounted?(): void;

  /** 渲染中, 本阶段内部渲染基本上已完成, 可以再次附加自定义的渲染 */
  rendering?(): void;

  /** 每次渲染完成后 */
  rendered?(): void;

  /** 重载表格时 */
  reload?(opt: TableReloadOptions): void;

  /**
   * 在reload/初始化的不同级别操作(TableReloadLevel): 开始前/完成后 触发, isBefore可用于识别是在操作前还是操作后
   * - 注意, isBefore = false 触发的时机是每个阶段对应的代码完成后, full是在其对应的操作完成后, index开始前, 而不是整个full完成后
   * */
  loadStage?(level: TableReloadLevel, isBefore: boolean): void;

  /**
   * 卸载前调用
   * */
  beforeDestroy?(): void;

  /** 定制单元格渲染, 与TableConfig.render具有相同的方法签名, 渲染顺序为 [conf.render, plugin1Render, plugin2Render..., defaultRender] */
  cellRender?(cell: TableCellWithDom, ctx: TableRenderCtx): void;

  /**
   * 工具函数, 将当对象上的指定函数映射到指定对象上
   * - 默认情况下, 将methods的每一项同名方法映射到table实例上, 可通过数组指定别名, 如: [['conf', 'config']] 表示将conf方法映射到config上
   * */
  methodMapper<T extends object = AnyObject>(
    obj: T,
    methods: (keyof T | [string, keyof T])[]
  ) {
    methods.forEach((m) => {
      let methodName = ""; // 方法名
      let aliseName = ""; // 别名

      if (isString(m)) {
        methodName = m;
        aliseName = m;
      } else if (isArray(m)) {
        methodName = m[1] as string;
        aliseName = m[0];
      }

      // @ts-ignore
      if (isFunction(this[aliseName])) {
        // @ts-ignore
        obj[methodName] = this[aliseName].bind(this);
      }
    });
  }

  /** 获取指定插件类的实例, 不存在对应类型的插件时, 抛出异常 */
  getPlugin<T extends TablePlugin = any>(
    pluginClass: new (...args: any[]) => T
  ): T {
    const ins = this.plugins.find((p) => p instanceof pluginClass);

    if (!ins) {
      throwError(`No plugin of type ${pluginClass.name} was found.`, _prefix);
    }

    return ins as T;
  }
}
