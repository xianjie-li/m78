import { isBoolean } from "@m78/utils";

import { FormValidator } from "../types.js";

export const boolValidatorKey = "VerifyBool";

/**
 * 是否为boolean值
 * */
export const bool = () => {
  const boolValidator: FormValidator = ({ value, config }) => {
    if (!isBoolean(value)) return config.languagePack.bool;
  };

  boolValidator.key = boolValidatorKey;

  return boolValidator;
};
