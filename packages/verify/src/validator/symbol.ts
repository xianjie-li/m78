import { isSymbol } from "@m78/utils";
import { Meta, Validator } from "../types";

export const symbolValidatorKey = "verifySymbol";

/**
 * 是否为symbol
 * */
export const symbol = () => {
  const symbolValidator: Validator = ({ value, config }: Meta) => {
    if (!isSymbol(value)) return config.languagePack.symbol;
  };

  symbolValidator.key = symbolValidatorKey;

  return symbolValidator;
};
