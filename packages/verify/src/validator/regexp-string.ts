import { isRegExp, isString } from "@m78/utils";
import { Meta, Validator } from "../types";

export const regexpStringValidatorKey = "verifyRegexpString";

/**
 * 是否为有效的Regexp字符或RegExp
 * */
export const regexpString = () => {
  const regexpStringValidator: Validator = ({ value, config }: Meta) => {
    if (!isString(value)) return config.languagePack.regexpString;
    if (!isRegExp(new RegExp(value))) return config.languagePack.regexpString;
  };

  regexpStringValidator.key = regexpStringValidatorKey;

  return regexpStringValidator;
};
