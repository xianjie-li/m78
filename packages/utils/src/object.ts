import { isArray, isEmpty, isNumber, isObject, isString } from "./is.js";

/**
 * Delete all empty values (except 0) of the object/array
 * @param source - Target object/array
 * @return - Processed original object/array
 *
 * empty values: undefined, null ,'', NaN, [], {}
 */
export function shakeEmpty(source: any): any {
  if (isArray(source)) {
    const res = source.filter((i) => !isEmpty(i) || i === 0 || i === false);
    source.length = 0;

    source.splice(0, 0, ...res);

    return source;
  }

  Object.keys(source).forEach((key) => {
    const i = source[key];

    if (isEmpty(i) && i !== 0 && i !== false) {
      delete source[key];
    }
  });
  return source;
}

/**
 * Recursion delete all empty values of the object/array, use shakeEmpty() internally, return the processed original object/array
 * */
export function recursionShakeEmpty(source: any): any {
  const handle = (i: any) => {
    if (isObject(i) || isArray(i)) {
      recursionShakeEmpty(i);
    }
  };

  if (isArray(source)) {
    source.forEach(handle);
  }

  if (isObject(source)) {
    Object.keys(source).forEach((k) => handle(source[k]));
  }

  return shakeEmpty(source);
}

function pickOrOmit(obj: any, props: string | string[], isPick = false): any {
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
export function omit(obj: any, props: string | string[]): any {
  return pickOrOmit(obj, props);
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

export type NameItem = string | number;

/**
 * Represents the character or character array of name. usage for get chain value, such as: ['user', 'address']、['1', 'name']、['list', '4', 'name']
 *
 * 表示name的字符或字符数组，用于链式取值，如: ['user', 'address']、[1, 'name']、['list', 4, 'name']
 * */
export type NamePath = NameItem | NameItem[];

/** Get value on obj through NamePath */
export function getNamePathValue(obj: any, name: NamePath) {
  if (!(obj instanceof Object)) return undefined; // 过滤掉数字/字符串等

  if (isString(name) || isNumber(name)) {
    return obj?.[name];
  }

  if (isArray(name) && name.length) {
    return name.reduce((p, i) => {
      return p?.[i];
    }, obj);
  }
}

/** Convert NamePath to string */
export function stringifyNamePath(name: NamePath) {
  if (isString(name) || isNumber(name)) return String(name);

  return name.reduce((p: string, i) => {
    if (isNumber(i)) {
      return p.length ? `${p}[${i}]` : String(i);
    }

    if (isString(i)) {
      return p.length ? `${p}.${i}` : i;
    }

    return p;
  }, "");
}

/**
 * Set value on obj through NamePath, if skipExist is passed in, the value will be skipped if it already exists
 *
 * 通过NamePath在obj上设置值, 如果传入skipExist, 在值已存在时会跳过
 * */
export function setNamePathValue(
  obj: any,
  name: NamePath,
  val: any,
  skipExist?: boolean
) {
  if (isString(name) || isNumber(name)) {
    obj[name] = val;
    return;
  }

  if (isArray(name) && name.length) {
    const [lastObj, n] = getLastObj(obj, name);

    if (skipExist && lastObj[n] !== undefined) return;
    lastObj[n] = val;
  }
}

/**
 * Delete value on obj through NamePath
 *
 * 通过NamePath在obj上删除值
 * */
export function deleteNamePathValue(obj: any, name: NamePath) {
  if (isString(name)) {
    delete obj[name];
    return;
  }

  if (isNumber(name)) {
    obj.splice(name, 1);
    return;
  }

  if (isArray(name) && name.length) {
    const [lastObj, n] = getLastObj(obj, name);
    isNumber(n) ? lastObj.splice(n, 1) : delete lastObj[n];
  }
}

/** 从对象中获取用于设置值的对象, 和最后一个name */
function getLastObj(obj: any, names: NameItem[]): [any, NameItem] {
  let lastObj = obj;

  for (let i = 0; i < names.length; i++) {
    const n = names[i]; // 当前name
    const nextN = names[i + 1]; // 下一个name
    const hasNextN = nextN !== undefined; // 是否有下个

    if (!hasNextN) {
      return [lastObj, n];
    }

    // 确保要操作的对象存在
    if (isNumber(nextN)) {
      if (!isArray(lastObj[n])) {
        lastObj[n] = [];
      }
      // 不是数字的话则为对象
    } else if (!isObject(lastObj[n])) {
      lastObj[n] = {};
    }

    lastObj = lastObj[n];
  }

  throw new Error("Names can't be empty");
}
