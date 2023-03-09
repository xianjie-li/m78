import _defaultsDeep from "lodash/defaultsDeep.js";
import { Config, Verify } from "./types.js";
import { defaultConfig } from "./default-config.js";
import { getCheckApi } from "./check.js";
import { simplifiedChinese, english } from "./language-pack.js";

function createVerify(config?: Config): Verify {
  const conf = _defaultsDeep(
    { languagePack: config?.extendLanguagePack },
    config,
    defaultConfig
  ) as Required<Config>;

  const verify: Verify = {
    languagePack: conf.languagePack,
  } as Verify;

  return Object.assign(verify, getCheckApi(conf, verify));
}

export { simplifiedChinese, english, createVerify };

export * from "./types.js";
export * from "./error.js";
export * from "./validator/index.js";
