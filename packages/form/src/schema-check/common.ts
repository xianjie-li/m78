import {
  isArray,
  isFunction,
  isObject,
  NameItem,
  NamePath,
  stringifyNamePath,
} from "@m78/utils";
import {
  FormErrorTemplateInterpolate,
  FormSchema,
  FormSchemaWithoutName,
  FormValidator,
} from "../types.js";
import { _ROOT_SCHEMA_NAME } from "../common.js";

/** 去除无效项, 并处理empty后返回验证器数组 */
export function _fmtValidator(
  validator: FormSchema["validator"],
  isEmpty: boolean
) {
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
    }) as FormValidator[];
  }

  return [];
}

/** 是否为ErrorTemplateInterpolate对象 */
export function _isErrorTemplateInterpolate(
  obj: any
): obj is FormErrorTemplateInterpolate {
  return isObject(obj) && "errorTemplate" in obj && "interpolateValues" in obj;
}

/** 根据schema配置和传入值检测是否有schema配置之外的值存在, 返回额外值的key字符串数组 */
export function _getExtraKeys(
  name: NamePath,
  schema: FormSchema | FormSchemaWithoutName,
  value: any
): string[] {
  const extraKeys: string[] = [];

  // 如果是eachSchema或者未传入schema, 则不检测
  if (schema.eachSchema || !schema.schema?.length) return extraKeys;

  // 外部确保了name是数组
  if (!isArray(name)) return extraKeys;

  const isObjOrArr = isObject(value) || isArray(value);

  // 只对对象和数组进行检测
  if (!isObjOrArr) return extraKeys;

  const childSchema = schema.schema;

  let keys: NameItem[] = [];

  if (isArray(value)) {
    value.map((_, i) => keys.push(i));
  } else {
    keys = Object.keys(value);
  }

  // 去除占位用的根name
  const nameClone = name.slice();
  const ind = nameClone.indexOf(_ROOT_SCHEMA_NAME);

  if (ind !== -1) {
    nameClone.splice(ind, 1);
  }

  keys.forEach((key) => {
    const cur = childSchema.find((i) => {
      if (i.name === undefined) return true;
      return i.name === key;
    });

    if (!cur) {
      extraKeys.push(stringifyNamePath([...nameClone, key]));
    }
  });

  return extraKeys;
}
