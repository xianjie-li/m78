import { isFunction } from "@m78/utils";
import { Meta, Validator } from "../types";

export const fnValidatorKey = "verifyFn";

/**
 * 是否为function
 * */
export const fn = () => {
  const fnValidator: Validator = ({ value, config }: Meta) => {
    if (!isFunction(value)) return config.languagePack.fn;
  };

  fnValidator.key = fnValidatorKey;

  return fnValidator;
};
