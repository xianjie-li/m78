import { isRegExp } from "@m78/utils";
import { Meta, Validator } from "../types";

export const regexpValidatorKey = "verifyRegexp";

/**
 * 是否为Regexp
 * */
export const regexp = () => {
  const regexpValidator: Validator = ({ value, config }: Meta) => {
    if (!isRegExp(value)) return config.languagePack.regexp;
  };

  regexpValidator.key = regexpValidatorKey;

  return regexpValidator;
};
