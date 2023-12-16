import { stringifyNamePath, NamePath } from "@m78/utils";
import { FormValidator } from "../types.js";

export const equalityValidatorKey = "VerifyEquality";

/**
 * 必须与给定的name对应的值相等
 * */
export const equality = (name: NamePath, tpl?: string) => {
  const equalityValidator: FormValidator = ({
    value,
    config,
    getValueByName,
  }) => {
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
