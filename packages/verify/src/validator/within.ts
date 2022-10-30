import { Meta, Validator } from "../types";

export const withinValidatorKey = "verifyWithin";

/**
 * 值必须在给定列表中, 建议仅用于基础类型
 * */
export const within = (list: any[]) => {
  const withinValidator: Validator = ({ value, config }: Meta) => {
    if (!list.includes(value))
      return {
        errorTemplate: config.languagePack.within,
        interpolateValues: {
          within: list.join(", "),
        },
      };
  };

  withinValidator.key = withinValidatorKey;

  return withinValidator;
};
