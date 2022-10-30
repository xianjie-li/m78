import { isBoolean } from "@m78/utils";
import { Meta, Validator } from "../types";

export const boolValidatorKey = "verifyBool";

/**
 * 是否为boolean值
 * */
export const bool = () => {
  const boolValidator: Validator = ({ value, config }: Meta) => {
    if (!isBoolean(value)) return config.languagePack.bool;
  };

  boolValidator.key = boolValidatorKey;

  return boolValidator;
};
