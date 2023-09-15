/**
 * * * * * * * * * * * * * * * * * * * * *
 * 全局配置
 *
 * config本身是一个seed, 可以使用seed的所有api
 * * * * * * * * * * * * * * * * * * * * *
 * */

import { createSeed } from "../seed/index.js";
import { M78SeedConfig } from "./types.js";
import { _darkModeHandle, _i18nHandle } from "./handle.js";

const m78Config = createSeed<M78SeedConfig>({
  state: {
    darkMode: false,
    empty: {},
    picture: {},
    formAdaptors: [],
  },
});

/**
 * 某些配置变更时, 我们需要做一些处理, 统一在这里进行
 * */
m78Config.subscribe((changes) => {
  _darkModeHandle(changes.darkMode);

  _i18nHandle(changes.i18n);
});

export { m78Config };
