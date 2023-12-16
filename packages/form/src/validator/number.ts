import { isInt, isNumber, isWeakNumber } from "@m78/utils";

import { FormValidator } from "../types.js";

interface Opt {
  max?: number;
  min?: number;
  size?: number;
  /** 只能是整形 */
  integer?: boolean;
  /** 允许字符数字 */
  allowNumberString?: boolean;
}

export const numberValidatorKey = "VerifyNumber";

/**
 * 数字验证器
 * */
export const number = (option?: Opt) => {
  const numberValidator: FormValidator = ({ value, config }) => {
    const pack = config.languagePack.number;

    const checker = option?.allowNumberString ? isWeakNumber : isNumber;

    if (!checker(value))
      return {
        errorTemplate: pack.notExpected,
        interpolateValues: option || {},
      };

    if (!option) return;

    // 确保后续操作为数值
    const numValue = parseFloat(value);

    if (option.integer && !isInt(numValue))
      return {
        errorTemplate: pack.notInteger,
        interpolateValues: option!,
      };

    if (isNumber(option.size) && numValue !== option.size)
      return {
        errorTemplate: pack.size,
        interpolateValues: option!,
      };

    if (isNumber(option.max) && numValue > option.max)
      return {
        errorTemplate: pack.max,
        interpolateValues: option!,
      };

    if (isNumber(option.min) && numValue < option.min)
      return {
        errorTemplate: pack.min,
        interpolateValues: option!,
      };
  };

  numberValidator.key = numberValidatorKey;

  return numberValidator;
};
