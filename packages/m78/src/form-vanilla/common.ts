import {
  ensureArray,
  isArray,
  isEmpty,
  isNumber,
  isObject,
  NameItem,
  NamePath,
  stringifyNamePath,
} from "@m78/utils";
import { _Context, _State, FormNamesNotify } from "./types.js";
import isEqual from "lodash/isEqual.js";

/** 获取指定name的state, 状态对象还不存在时会自动进行创建 */
export function _getState(ctx: _Context, name: NamePath) {
  const nameKey = stringifyNamePath(name);
  let st = ctx.state[nameKey];

  if (!st) {
    st = {
      name,
      errors: [],
    };
    ctx.state[nameKey] = st;
  }

  return st;
}

/** 遍历已存在的所有state */
export function _eachState(ctx: _Context, cb: (st: _State) => void) {
  for (const key of Object.keys(ctx.state)) {
    cb(ctx.state[key] || {});
  }
}

/** 根据values递归为其设置或初始化state */

/**
 * 用于创建update/change事件回调的过滤器, 只在name对应的值发生变化时才会触发回调,
 * 若传入deps, deps中指定的值发生变化时也会触发回调
 * */
export function _notifyFilter(
  name: NamePath,
  notify: FormNamesNotify,
  deps: NamePath[] = []
): FormNamesNotify {
  // 触发规则, 值更新时, 其所有上级/下级都会触发

  const np = ensureArray(name);

  return (triggerName, relation) => {
    if (!triggerName) {
      notify(triggerName, relation);
      return;
    }

    const np2 = ensureArray(triggerName);
    const names = [np, ...deps.map(ensureArray)];

    if (relation) {
      for (const n of names) {
        // 需要更新关联值
        if (_isRelationName(n, np2)) {
          notify(triggerName, relation);
          break;
        }
      }
    } else {
      for (const n of names) {
        // 不关联, 直接对比
        if (isEqual(n, np2)) {
          notify(triggerName, relation);
          break;
        }
      }
    }
  };
}

/** 用于namePath路径的通配占位, 匹配eachSchema等没有name的层级 */
export const _ANY_NAME_PLACE_HOLD = "__ANY_NAME_PLACE_HOLD__";

/** 用于在某些情况作为根schema的name标注 */
export const _ROOT_SCHEMA_NAME = "__ROOT_SCHEMA_NAME__";

/** 递归删除指定的namePath值, 支持在namePath中使用ANY_NAME_PLACE_HOLD进行通配占位 */
export function _recursionDeleteNamePath(values: any, names: NamePath) {
  const name = ensureArray(names);

  if (!name.length || isEmpty(values)) return;

  const [currentName, ...rest] = name;

  const isArr = isArray(values);
  const isObj = isObject(values);

  if (!isArr && !isObj) return;

  if (name.length === 1) {
    if (isObj) {
      // 清理全部
      if (currentName === _ANY_NAME_PLACE_HOLD) {
        Object.keys(values).forEach((key) => delete values[key]);
        return;
      }
      delete values[currentName];
    }
    if (isArr) {
      // 清理全部
      if (currentName === _ANY_NAME_PLACE_HOLD) {
        values.splice(0, values.length);
        return;
      }

      if (isNumber(currentName)) {
        values.splice(currentName, 1);
      }
    }
    return;
  }

  if (currentName !== _ANY_NAME_PLACE_HOLD) {
    _recursionDeleteNamePath(values[currentName], rest);
    return;
  }

  if (isObj) {
    Object.keys(values).forEach((key) => {
      _recursionDeleteNamePath(values[key], rest);
    });
  }

  if (isArr) {
    values.forEach((v) => {
      _recursionDeleteNamePath(v, rest);
    });
  }
}

/** 数组1是否与数组2的左侧相等或完全相等 */
export function _isLeftEqualName(arr1: any[], arr2: any[]) {
  if (arr1.length > arr2.length) return false;

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  return true;
}

// 检测两个name是否是另一个的子级/父级/自身
export function _isRelationName(n: NameItem[], n2: NameItem[]) {
  const min = Math.min(n.length, n2.length);

  const arr1 = n.slice(0, min);
  const arr2 = n2.slice(0, min);

  return isEqual(arr1, arr2);
}

/** 从listState中获取指定name的子级, 每次命中会触发回调, 也可以使用返回值 */
export function _getListChild(
  ctx: _Context,
  name: NamePath,
  eachCB?: (nameString: string, name: NamePath) => void
) {
  const listState = ctx.listState;

  const child: NamePath[] = [];

  Object.keys(listState).forEach((key) => {
    const current = listState[key];

    const currentName = ensureArray(current.name);
    const arrName = ensureArray(name);

    if (currentName.length === arrName.length) return;

    if (_isLeftEqualName(arrName, currentName)) {
      child.push(currentName);
      eachCB?.(key, currentName);
    }
  });

  return child;
}

/** 移除当前name和其子级的所有listState, 触发关联更新 */
export function _clearChildAndSelf(ctx: _Context, name: NamePath) {
  const listState = ctx.listState;

  delete listState[stringifyNamePath(name)];

  _getListChild(ctx, name, (nameString) => {
    delete listState[nameString];
  });
}

/** 同步指定list下所有关联的list项name索引, newIndex为当前索引到新索引的映射, 比如[0,2,1]表示, 原本索引2的元素移动到中间 */
export function _syncListIndex(
  ctx: _Context,
  name: NamePath,
  newIndex: number[]
) {
  // 需要进行同步调整的子级list索引
  const needChangeIndex = ensureArray(name).length;
  const cloneListState = { ...ctx.listState };

  // 临时存放新的listState, 反正项之间的存在前后索引相同, 比如索引2的新位置为索引1的元素
  const temp: any = {};

  _getListChild(ctx, name, (childNameString, childName) => {
    const childNameArr = ensureArray(childName);
    const newName = [...childNameArr];

    // 原索引
    const ind = childNameArr[needChangeIndex];

    if (!isNumber(ind)) return;

    // 新索引
    const newInd = newIndex.indexOf(ind);

    if (newInd === -1) return;

    newName[needChangeIndex] = newInd;

    const newNameString = stringifyNamePath(newName);

    temp[newNameString] = cloneListState[childNameString];
    temp[newNameString].name = newName;
    delete ctx.listState[childNameString];
  });

  Object.assign(ctx.listState, temp);
}
