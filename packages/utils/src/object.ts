import { isString, isArray, isNumber, isWeakNumber, isObject } from "./is.js";

/**
 * Delete all falsy values of the object (except 0)
 * @param source - Target object
 * @return - Processed original object
 */
export const shakeFalsy = (source: object): object => {
  Object.keys(source).forEach((key) => {
    const val = source[key];
    if (!val && val !== 0) {
      delete source[key];
    }
  });
  return source;
};

function pickOrOmit(obj: any, props: string | string[], isPick = false) {
  if (isString(props)) {
    props = props.split(",").map((key) => key.trim());
  }
  const keys = Object.keys(obj);
  const result = {};
  keys.forEach((item) => {
    const cond = isPick
      ? props.indexOf(item) !== -1
      : props.indexOf(item) === -1;
    if (cond) {
      result[item] = obj[item];
    }
  });
  return result;
}

/**
 * Deletes the specified key value from the target object
 * @param obj - Target object
 * @param props - Key to be removed, comma separated string or string array
 * @return - New object after removal
 * */
export function omit<R>(obj: any, props: string | string[]): R {
  return pickOrOmit(obj, props) as R;
}

/**
 * Pick the specified key value from the target object
 * @param obj - Target object
 * @param props - Key to be selected, comma separated string or string array
 * @return - A new object containing the selection key value
 * */
export function pick<R>(obj: any, props: string | string[]): R {
  return pickOrOmit(obj, props, true) as R;
}

/**
 * Represents the character or character array of name. The array usage is used for chain value, such as: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 *
 * 表示name的字符或字符数组，数组用法用于链式取值，如: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 * */
export type NamePath = string | number | (string | number)[];

/**
 * Get value on obj through NamePath
 *
 * 通过NamePath在obj上获取值
 * */
export function getNamePathValue(obj, name) {
  if (isString(name)) {
    return obj?.[name];
  }

  if (isArray(name) && name.length) {
    return name.reduce((p, i) => {
      return p?.[i];
    }, obj);
  }
}

/**
 * Convert NamePath to character form
 *
 * 将NamePath转换为字符形式
 * */
export function stringifyNamePath(name) {
  if (isString(name)) return name;

  return name.reduce((p, i) => {
    if (isNumber(Number(i))) {
      return `${p}[${i}]`;
    }

    if (isString(i)) {
      return p.length ? `${p}.${i}` : i;
    }

    return p;
  }, "");
}

/**
 * Set value on obj through NamePath
 *
 * 通过NamePath在obj上设置值
 * */
export function setNamePathValue(obj, name, val) {
  if (isString(name)) {
    obj[name] = val;
  }

  if (isArray(name) && name.length) {
    let lastObj = obj;

    for (let i = 0; i < name.length; i++) {
      const n = name[i]; // 当前name
      const nextN = name[i + 1]; // 下一个name
      const hasNextN = nextN !== undefined; // 是否有下个

      if (!hasNextN) {
        lastObj[n] = val;
        return;
      }

      // 确保要操作的对象存在
      if (isWeakNumber(nextN)) {
        if (!isArray(lastObj[n])) {
          lastObj[n] = [];
        }
        // 不是数字的话则为对象
      } else if (!isObject(lastObj[n])) {
        lastObj[n] = {};
      }

      lastObj = lastObj[n];
    }
  }
}
