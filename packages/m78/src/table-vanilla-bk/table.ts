import { TablePlugin } from "./plugin.js";
import { TableConfig, TableInstance } from "./types.js";
import { _TableInitPlugin } from "./plugins/init.js";
import { _TableViewportPlugin } from "./plugins/viewport.js";

import "./index.scss";
import { _TableZoomPlugin } from "./plugins/zoom.js";
import { getNamePathValue, setNamePathValue } from "@m78/utils";
import { _privateInstanceKey } from "./common.js";
import { _TableLifeController } from "./plugins/life-controller.js";
import { _TableGetter } from "./plugins/getter.js";

export function createTable(config: TableConfig): TableInstance {
  const defaultConfig: Partial<TableConfig> = {
    data: [],
    columns: [],
    rows: {},
    cells: {},
    plugins: [],
    rowHeight: 32,
    columnWidth: 100,
    autoSize: true,
  };

  // 根据dom上挂载的私有实例信息判断是否需要创建实例, 防止热重载等场景下反复创建
  const ins: TableInstance | undefined = getNamePathValue(
    config.el,
    _privateInstanceKey
  );

  // 已存在实例时, 直接返回
  if (ins) {
    ins.render();
    return ins as TableInstance;
  }

  const conf = { ...defaultConfig, ...config };

  const context: any = {};

  // 不完整的实例
  const instance = {} as any as TableInstance;

  // 插件创建配置
  const pluginConfig = {
    table: instance,
    plugins: [] as TablePlugin[],
    context,
    config: conf,
  };

  // 内置插件
  const plugins = [
    new _TableInitPlugin(pluginConfig),
    new _TableViewportPlugin(pluginConfig),
    new _TableZoomPlugin(pluginConfig),
    new _TableLifeController(pluginConfig),
    new _TableGetter(pluginConfig),
  ];

  pluginConfig.plugins.push(...plugins);

  // 用户插件
  const customPlugins = conf.plugins!.map((Plugin) => {
    return new Plugin(pluginConfig);
  });

  pluginConfig.plugins.push(...customPlugins);

  /* # # # # # # # init # # # # # # # */
  pluginConfig.plugins.forEach((plugin) => {
    plugin.init?.();
  });

  console.log(context);

  /* # # # # # # # initialized # # # # # # # */
  pluginConfig.plugins.forEach((plugin) => {
    plugin.initialized?.();
  });

  instance.render();

  /* # # # # # # # mount # # # # # # # */
  pluginConfig.plugins.forEach((plugin) => {
    plugin.mount?.();
  });

  instance.reload = (...arg: any) => {
    pluginConfig.plugins.forEach((plugin) => {
      plugin.reload?.(...arg);
    });
  };

  instance.destroy = () => {
    setNamePathValue(config.el, _privateInstanceKey, undefined);

    /* # # # # # # # beforeDestroy # # # # # # # */
    pluginConfig.plugins.forEach((plugin) => {
      setNamePathValue(config.el, _privateInstanceKey, undefined);
      plugin.beforeDestroy?.();
    });
  };

  // 在节点上添加实例信息, 防止热重载等场景下反复创建实例
  setNamePathValue(config.el, _privateInstanceKey, instance);

  return instance;
}
