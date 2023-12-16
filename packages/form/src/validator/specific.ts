import { FormValidator } from "../types.js";

export const specificValidatorKey = "VerifySpecific";

/**
 * 是否为指定的值, 只能是通过Object.is对比的常规值
 * */
export const specific = (val: any) => {
  const specificValidator: FormValidator = ({ value, config }) => {
    if (val !== value)
      return {
        errorTemplate: config.languagePack.specific,
        interpolateValues: {
          specific: val,
        },
      };
  };

  specificValidator.key = specificValidatorKey;

  return specificValidator;
};
