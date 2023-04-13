import { TablePlugin } from "./plugin.js";
import { TableConfig, TableInstance } from "./types.js";
import { TableInitPlugin } from "./plugins/init.js";
import { TableViewportPlugin } from "./plugins/viewport.js";

import "./index.scss";
import { TableZoomPlugin } from "./plugins/zoom.js";

/* # # # # # # # # # # # # # # # # #
 * 不在渲染过程执行耗时操作/计算, 这些过程应放到初始化阶段
 * # # # # # # # # # # # # # # # # # */

export function createTable(config: TableConfig): TableInstance {
  const defaultConfig: Partial<TableConfig> = {
    data: [],
    columns: [],
    rows: {},
    plugins: [],
    rowHeight: 34,
    columnWidth: 100,
    autoSize: true,
    borderColor: "#8c8c8c",
    borderWidth: 0.5,
    backgroundColor: "#fff",
  };

  const conf = { ...defaultConfig, ...config };

  // @ts-ignore 根据dom上挂载的私有实例信息判断是否需要创建实例, 防止热重载等场景下反复创建
  const ins: TableInstance | undefined = config.el.__m78TableInstance;

  // 已存在实例时, 直接返回
  if (ins) {
    ins.config = conf;
    ins.render();
    return ins as TableInstance;
  }

  const table = {} as any as TableInstance;

  /** 初始化插件, 生成实例 */
  function boot() {
    const context: any = {};

    // 不完整的实例
    const instance = {
      config: conf,
    } as any as TableInstance;

    // 插件创建配置
    const pluginConfig = {
      table: instance,
      plugins: [] as TablePlugin[],
      context,
    };

    // 内置插件
    const initPlugin = [
      new TableInitPlugin(pluginConfig),
      new TableViewportPlugin(pluginConfig),
      new TableZoomPlugin(pluginConfig),
    ];

    pluginConfig.plugins.push(...initPlugin);

    // 用户插件
    const customPlugins = conf
      .plugins!.sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map((Plugin) => {
        return new Plugin(pluginConfig);
      });

    pluginConfig.plugins.push(...customPlugins);

    /* # # # # # # # init # # # # # # # */
    pluginConfig.plugins.forEach((plugin) => {
      // 在TableInitPlugin中已经执行过init则跳过
      if (plugin.state.initCalled) return;
      plugin.init?.();
    });

    /* # # # # # # # initialized # # # # # # # */
    pluginConfig.plugins.forEach((plugin) => {
      plugin.initialized?.();
    });

    instance.render();

    /* # # # # # # # mount # # # # # # # */
    pluginConfig.plugins.forEach((plugin) => {
      plugin.mount?.();
    });

    instance.destroy = () => {
      /* # # # # # # # mount # # # # # # # */
      pluginConfig.plugins.forEach((plugin) => {
        plugin.beforeDestroy?.();
      });
    };

    instance.reload = () => {
      instance.destroy();
      const newInstance = boot();

      Object.assign(table, newInstance);
    };

    return instance;
  }

  const instance = Object.assign(table, boot());

  // 在节点上添加实例信息, 防止热重载等场景下反复创建实例
  // @ts-ignore
  config.el.__m78TableInstance = instance;

  return instance;
}
