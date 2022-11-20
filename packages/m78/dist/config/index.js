/**
 * * * * * * * * * * * * * * * * * * * * *
 * 全局配置
 *
 * config本身是一个seed, 可以使用seed的所有api
 * * * * * * * * * * * * * * * * * * * * *
 * */ import { createSeed } from "../seed";
import { darkModeHandle, i18nHandle } from "./handle";
var m78Config = createSeed({
    state: {
        darkMode: false,
        empty: {},
        picture: {}
    }
});
/**
 * 某些配置变更时, 我们需要做一些处理, 统一在这里进行
 * */ m78Config.subscribe(function(changes) {
    darkModeHandle(changes.darkMode);
    i18nHandle(changes.i18n);
});
export { m78Config };
