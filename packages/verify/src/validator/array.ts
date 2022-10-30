import { isArray, isNumber } from "@m78/utils";
import { Meta, Validator } from "../types";

interface Opt {
  /** 最大长度 */
  max?: number;
  /** 最小长度 */
  min?: number;
  /** 指定长度 */
  length?: number;
}

export const arrayValidatorKey = "verifyArray";

/**
 * 数组验证器
 * */
export const array = (option?: Opt) => {
  const arrayValidator: Validator = ({ value, config }: Meta) => {
    const pack = config.languagePack.array;

    if (!isArray(value))
      return {
        errorTemplate: pack.notExpected,
        interpolateValues: option || {},
      };

    if (!option) return;

    if (isNumber(option.length) && value.length !== option.length)
      return {
        errorTemplate: pack.length,
        interpolateValues: option!,
      };

    if (isNumber(option.max) && value.length > option.max)
      return {
        errorTemplate: pack.max,
        interpolateValues: option!,
      };

    if (isNumber(option.min) && value.length < option.min)
      return {
        errorTemplate: pack.min,
        interpolateValues: option!,
      };
  };

  arrayValidator.key = arrayValidatorKey;

  return arrayValidator;
};
