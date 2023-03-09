import _defaultsDeep from "lodash/defaultsDeep.js";
import { defaultConfig } from "./default-config.js";
import { getCheckApi } from "./check.js";
import { simplifiedChinese, english } from "./language-pack.js";
function createVerify(config) {
    var conf = _defaultsDeep({
        languagePack: config === null || config === void 0 ? void 0 : config.extendLanguagePack
    }, config, defaultConfig);
    var verify = {
        languagePack: conf.languagePack
    };
    return Object.assign(verify, getCheckApi(conf, verify));
}
export { simplifiedChinese, english, createVerify };
export * from "./types.js";
export * from "./error.js";
export * from "./validator/index.js";
