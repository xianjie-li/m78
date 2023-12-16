import { isRegExp } from "@m78/utils";

import { FormValidator } from "../types.js";

export const regexpValidatorKey = "VerifyRegexp";

/**
 * 是否为Regexp
 * */
export const regexp = () => {
  const regexpValidator: FormValidator = ({ value, config }) => {
    if (!isRegExp(value)) return config.languagePack.regexp;
  };

  regexpValidator.key = regexpValidatorKey;

  return regexpValidator;
};
