import { isEmpty } from "@m78/utils";
import { FormValidator } from "../types.js";

export const requiredValidatorKey = "VerifyRequired";

/**
 * 是否是verify认定的空值
 * */
export const isVerifyEmpty = (value: any) => {
  if (isEmpty(value) && value !== 0 && value !== false) return true;
  return typeof value === "string" && value.trim() === "";
};

/**
 * 必需项，值不能为 undefined, null ,'', NaN, [], {}, 空白字符 中的任意一项
 * */
export const required = () => {
  const requiredValidator: FormValidator = ({ isEmpty, config }) => {
    const msg = config.languagePack.required;

    if (isEmpty) return msg;
  };

  requiredValidator.key = requiredValidatorKey;
  requiredValidator.checkEmpty = true;

  return requiredValidator;
};
