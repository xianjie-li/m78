import _defaultsDeep from "lodash/defaultsDeep";
import { Config, Verify } from "./types";
import { defaultConfig } from "./default-config";
import { getCheckApi } from "./check";
import { simplifiedChinese, english } from "./language-pack";

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

export * from "./types";
export * from "./validator/required";
export * from "./validator/object";
export * from "./validator/bool";
export * from "./validator/string";
export * from "./validator/array";
export * from "./validator/fn";
export * from "./validator/number";
export * from "./validator/symbol";
export * from "./validator/regexp";
export * from "./validator/regexp-string";
export * from "./validator/pattern";
export * from "./validator/specific";
export * from "./validator/equality";
export * from "./validator/within";
export * from "./validator/without";
export * from "./validator/url";
export * from "./validator/email";
export * from "./validator/date";
export * from "./validator/match";
export * from "./validator/list";
