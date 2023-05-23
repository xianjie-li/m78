import { TablePlugin } from "./plugin.js";
import { TableConfig, TableInstance } from "./types.js";
import { _TableInitPlugin } from "./plugins/init.js";
import { _TableViewportPlugin } from "./plugins/viewport.js";

import "./index.scss";
import { _TableZoomPlugin } from "./plugins/zoom.js";
import { getNamePathValue } from "@m78/utils";
import { _privateInstanceKey } from "./common.js";
import { _TableLifePlugin } from "./plugins/life.js";
import { _TableGetterPlugin } from "./plugins/getter.js";
import { _TableEventPlugin } from "./plugins/event.js";
import { _TableHeaderPlugin } from "./plugins/header.js";
import { _TableHistoryPlugin } from "./plugins/history.js";
import { _TableScrollMarkPlugin } from "./plugins/scroll-mark.js";
import { _TableAutoResizePlugin } from "./plugins/auto-resize.js";
import { _TableConfigPlugin } from "./plugins/config.js";
import { _TableSelectPlugin } from "./plugins/select.js";

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
    stripe: true,
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
  // 注意: 在实现上, 鉴于完整功能的复杂度, 内部插件之间并不是完全解耦的, 插件之间会互相访问状态/方法
  // 比如初始化阶段, 不同插件可能都需要对配置和数据进行遍历, 预计算等, 这些操作应该在单次完成, 避免重复计算.
  const plugins = [
    _TableInitPlugin,
    _TableLifePlugin,
    _TableGetterPlugin,
    _TableHistoryPlugin,
    _TableConfigPlugin,
    _TableEventPlugin,
    _TableHeaderPlugin,
    _TableViewportPlugin,
    _TableZoomPlugin,
    _TableScrollMarkPlugin,
    _TableSelectPlugin,
    _TableAutoResizePlugin,
  ].map((Plugin) => {
    return new Plugin(pluginConfig);
  });

  const cusPlugins = conf.plugins!.map((Plugin) => {
    return new Plugin(pluginConfig);
  });

  // 用户插件
  pluginConfig.plugins.push(...plugins, ...cusPlugins);

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

  return instance;
}
