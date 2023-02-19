import { isArray, isFunction, isObject } from "@m78/utils";
import {
  AsyncValidator,
  ErrorTemplateInterpolate,
  Schema,
  Validator,
} from "./types.js";

/** 根schema的默认name */
export const SOURCE_ROOT_NAME = "M78_VERIFY_ROOT_NAME";

/** 格式化并返回验证器数组 */
export function fmtValidator(validator: Schema["validator"], isEmpty: boolean) {
  if (isFunction(validator)) {
    // 需要进行空校验或非空时
    if (validator.checkEmpty || !isEmpty) {
      return [validator];
    }
    return [];
  }

  if (isArray(validator)) {
    return validator.filter((i) => {
      if (!i) return false;
      return i.checkEmpty || !isEmpty;
    }) as Array<Validator | AsyncValidator>;
  }

  return [];
}

/** 是否为ErrorTemplateInterpolate对象 */
export function isErrorTemplateInterpolate(
  obj: any
): obj is ErrorTemplateInterpolate {
  return isObject(obj) && "errorTemplate" in obj && "interpolateValues" in obj;
}
