import { Meta, NamePath, Validator } from "../types";
import { stringifyNamePath } from "@m78/utils";

export const equalityValidatorKey = "verifyEquality";

/**
 * 必须与给定的name对应的值相等
 * */
export const equality = (name: NamePath, tpl?: string) => {
  const equalityValidator: Validator = ({
    value,
    config,
    getValueByName,
  }: Meta) => {
    if (getValueByName(name) !== value)
      return {
        errorTemplate: tpl || config.languagePack.equality,
        interpolateValues: {
          targetLabel: stringifyNamePath(name),
        },
      };
  };

  equalityValidator.key = equalityValidatorKey;

  return equalityValidator;
};
