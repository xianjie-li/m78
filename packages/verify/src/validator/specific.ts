import { Meta, Validator } from "../types";

export const specificValidatorKey = "verifySpecific";

/**
 * 是否为指定的值, 只能是通过Object.is对比的常规值
 * */
export const specific = (val: any) => {
  const specificValidator: Validator = ({ value, config }: Meta) => {
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
