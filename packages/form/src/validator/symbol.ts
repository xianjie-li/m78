import { isSymbol } from "@m78/utils";

import { FormValidator } from "../types.js";

export const symbolValidatorKey = "VerifySymbol";

/**
 * 是否为symbol
 * */
export const symbol = () => {
  const symbolValidator: FormValidator = ({ value, config }) => {
    if (!isSymbol(value)) return config.languagePack.symbol;
  };

  symbolValidator.key = symbolValidatorKey;

  return symbolValidator;
};
