import {
  isArray,
  isEmpty,
  isNumber,
  isObject,
  isString,
  isFunction,
} from "./is.js";
import { ensureArray } from "./array.js";

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

/** 清空对象的所有key/value, 并将清空后的key/value保存在一个新对象中返回 */
export function clearObject<T extends object>(obj: T): T {
  const keys = Object.keys(obj);
  const newObj = {} as T;

  keys.forEach((key) => {
    newObj[key] = obj[key];
    delete obj[key];
  });

  return newObj;
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

/**
 * Get value on obj through NamePath
 *
 * When name pass `[]`, will return obj directly
 * */
export function getNamePathValue<V = any>(obj: any, name: NamePath): V {
  if (!(obj instanceof Object)) return undefined as any; // 过滤掉数字/字符串等

  if (isString(name) || isNumber(name)) {
    return obj?.[name];
  }

  if (isArray(name)) {
    if (name.length) {
      return name.reduce((p, i) => {
        return p?.[i];
      }, obj);
    } else {
      return obj;
    }
  }

  return undefined as any;
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
 * If val is undefined, will delete the value specified by name like deleteNamePathValue() do
 * */
export function setNamePathValue(
  obj: any,
  name: NamePath,
  val: any,
  skipExist?: boolean
) {
  if (val === undefined) {
    deleteNamePathValue(obj, name);
    return;
  }

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
 * */
export function deleteNamePathValue(obj: any, name: NamePath) {
  let prevObj: any;
  let lastName: NameItem;

  const arrName = ensureArray(name).slice();

  if (arrName.length > 1) {
    lastName = arrName.pop()!;
    prevObj = getNamePathValue(obj, arrName);
  } else {
    lastName = arrName[0];
    prevObj = obj;
  }

  if (isObject(prevObj) && isString(lastName)) {
    delete prevObj[lastName];
    return;
  }

  if (isArray(prevObj) && isNumber(lastName)) {
    prevObj.splice(lastName, 1);
    return;
  }
}

const ROOT_KEY = "__DeleteNamePathValuesRootKey";

/** Delete multiple value on obj, through nameList, ensures no index misalignment when deleting the same array content multiple times */
export function deleteNamePathValues(obj: any, nameList: NamePath[]) {
  // 数组为了保证索引一致, 需要特殊处理
  const arrMap: {
    [key: string]: {
      /** 数组所在位置的name */
      name: NameItem[];
      /** 待删除索引 */
      indexes: number[];
    };
  } = {};

  nameList.forEach((name) => {
    const namePath = ensureArray(name).slice();
    const last = namePath.pop();

    if (last === undefined) return;

    // 记录数组
    if (isNumber(last)) {
      const k = namePath.length ? stringifyNamePath(namePath) : ROOT_KEY;

      let map = arrMap[k];

      if (!map) {
        map = {
          name: namePath,
          indexes: [],
        };
        arrMap[k] = map;
      }

      map.indexes.push(last);
    } else {
      deleteNamePathValue(obj, name);
    }
  });

  Object.entries(arrMap).map(([_, val]) => {
    let curObj: any;

    if (val.name.length === 0) {
      // 根对象
      curObj = obj;
    } else {
      curObj = getNamePathValue(obj, val.name);
    }

    if (!isArray(curObj) || curObj.length === 0) return;

    // 从大到小排序索引
    const sortIndexes = val.indexes.sort((c, d) => d - c);

    // 过滤重复索引
    const removeMark: any = {};

    sortIndexes.forEach((ind) => {
      if (removeMark[ind]) return;
      removeMark[ind] = true;
      curObj.splice(ind, 1);
    });
  });
}

/** 从对象中获取用于设置值的对象, 和最后一个name, 获取期间, 不存在的路径会自动创建 */
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
      // 不是则为对象
    } else if (!isObject(lastObj[n])) {
      lastObj[n] = {};
    }

    lastObj = lastObj[n];
  }

  throw new Error("Names can't be empty");
}

type Constructor = new (...args: any[]) => any;

/**
 * 将所有给出的混合类(mixins)混入到主类(main)中
 *
 * - 为了更好的可读性和可维护性, 若存在同名的属性/方法会抛出错误
 * - 主类/混合类的构造函数内均不能直接或间接的访问其他类的属性/方法, 因为尚未初始化完成
 * - 混合类不支持继承, 继承项会直接忽略
 * - 不会处理静态方法/属性, 应统一维护到主类
 *
 * 在typescript中如何保留类型?
 *
 * 1. 声明接口A, 在该接口中声明所有属性/方法
 * 2. 编写混合类或主类时, 在相邻的位置声明一个与该类同名的interface, 其继承接口A, 由于typescript的类型合并特性, 我们在类中可以正常访问到接口中声明的所有内容
 * */
export function applyMixins<C extends Constructor>(
  main: C,
  ...mixins: Constructor[]
): C {
  const list = [main, ...mixins];

  if (list.length < 2) return main as C;

  // 方法名: descriptor
  const methodMap: any = Object.create(null);

  list.forEach((Constr) => {
    Object.getOwnPropertyNames(Constr.prototype).forEach((name) => {
      if (methodMap[name]) {
        throw Error(
          `Mixin: Contains duplicate method declarations -> ${name}()`
        );
      }

      const cur = Object.getOwnPropertyDescriptor(Constr.prototype, name);

      if (!cur) return;

      if (
        name !== "constructor" &&
        (isFunction(cur.value) || isFunction(cur.get) || isFunction(cur.set))
      ) {
        methodMap[name] = cur;
      }
    });
  });

  // 记录写入过的属性
  const propertyExist: any = {};
  // 待合并的属性
  const propertyMap: any = {};

  class Mixin extends main {
    constructor(...args: any[]) {
      super(...args);

      mixins.forEach((Con) => {
        const ins = new Con(...args);

        Object.keys(ins).forEach((k) => {
          if (propertyExist[k]) {
            throw Error(
              `Mixin: Contains duplicate property declarations -> ${k}`
            );
          }

          if (k in this) {
            propertyExist[k] = true;
            return;
          }

          propertyMap[k] = ins[k];
          propertyExist[k] = true;
        });
      });

      Object.assign(this, propertyMap);
    }
  }

  Object.defineProperties(Mixin.prototype, methodMap);

  return Mixin as C;
}
