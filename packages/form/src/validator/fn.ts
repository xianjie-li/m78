import { isFunction } from "@m78/utils";

import { FormValidator } from "../types.js";

export const fnValidatorKey = "VerifyFn";

/**
 * 是否为function
 * */
export const fn = () => {
  const fnValidator: FormValidator = ({ value, config }) => {
    if (!isFunction(value)) return config.languagePack.fn;
  };

  fnValidator.key = fnValidatorKey;

  return fnValidator;
};
