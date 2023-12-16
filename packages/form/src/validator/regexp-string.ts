import { isRegExp, isString } from "@m78/utils";

import { FormValidator } from "../types.js";

export const regexpStringValidatorKey = "VerifyRegexpString";

/**
 * 是否为有效的Regexp字符或RegExp
 * */
export const regexpString = () => {
  const regexpStringValidator: FormValidator = ({ value, config }) => {
    if (!isString(value)) return config.languagePack.regexpString;
    if (!isRegExp(new RegExp(value))) return config.languagePack.regexpString;
  };

  regexpStringValidator.key = regexpStringValidatorKey;

  return regexpStringValidator;
};
