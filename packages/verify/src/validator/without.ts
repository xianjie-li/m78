import { Meta, Validator } from "../types";

export const withoutValidatorKey = "verifyWithout";

/**
 * 值必须不在给定列表中, 建议仅用于基础类型
 * */
export const without = (list: any[]) => {
  const withoutValidator: Validator = ({ value, config }: Meta) => {
    if (list.includes(value))
      return {
        errorTemplate: config.languagePack.without,
        interpolateValues: {
          without: list.join(", "),
        },
      };
  };

  withoutValidator.key = withoutValidatorKey;

  return withoutValidator;
};
