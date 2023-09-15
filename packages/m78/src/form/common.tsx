import { isObject } from "@m78/utils";
import { FormAdaptor } from "./types.js";

/** 默认的表单 onChange 值获取器 */
export const _defaultValueGetter = (value: any) => {
  if (isObject(value) && "target" in value && "value" in value.target) {
    return value.target.value;
  }
  return value;
};

/** 默认适配器 */
export const _defaultAdaptor: FormAdaptor = (args) => {
  if (!args.element) return null;

  return args.binder(args.element, {
    ...args.element.props,
    ...args.bind,
  });
};

export const EMPTY_NAME = "__EMPTY_NAME__";
export const EMPTY_LIST_NAME = "__EMPTY_LIST_NAME__";
