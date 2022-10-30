import { isRegExp, isString } from "@m78/utils";
import { Meta, Validator } from "../types";

export const patternValidatorKey = "verifyPattern";

/**
 * 必须通过指定的正则校验, regexp可以是正则字符或正则对象
 * */
export const pattern = (regexp: string | RegExp, tpl?: string) => {
  const patternValidator: Validator = ({ value, config }: Meta) => {
    let reg = regexp;

    if (isString(reg)) {
      reg = new RegExp(reg);
    }

    if (!isRegExp(reg)) return;

    if (!(reg as RegExp).test(value)) {
      return {
        errorTemplate: tpl || config.languagePack.pattern,
        interpolateValues: {
          regexp: reg.toString(),
        },
      };
    }
  };

  patternValidator.key = patternValidatorKey;

  return patternValidator;
};
