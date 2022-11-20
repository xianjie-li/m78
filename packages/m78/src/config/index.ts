/**
 * * * * * * * * * * * * * * * * * * * * *
 * 全局配置
 *
 * config本身是一个seed, 可以使用seed的所有api
 * * * * * * * * * * * * * * * * * * * * *
 * */

import { createSeed } from "../seed";
import { M78SeedState } from "./types";
import { darkModeHandle, i18nHandle } from "./handle";

const m78Config = createSeed<M78SeedState>({
  state: {
    darkMode: false,
    empty: {},
    picture: {},
  },
});

/**
 * 某些配置变更时, 我们需要做一些处理, 统一在这里进行
 * */
m78Config.subscribe((changes) => {
  darkModeHandle(changes.darkMode);

  i18nHandle(changes.i18n);
});

export { m78Config };
