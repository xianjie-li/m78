import { _Context } from "./types.js";
import {
  createRandString,
  ensureArray,
  isArray,
  isNumber,
  move,
  swap,
  NamePath,
  stringifyNamePath,
} from "@m78/utils";
import { ROOT_SCHEMA_NAME } from "./common.js";

export function _implList(ctx: _Context) {
  const { instance } = ctx;

  /** 根据name分别获取listData(源数组)项和实际的value(拷贝), 若listData不存在, 返回null */
  function getListDataAndValue(name: NamePath) {
    const isRoot = name === ROOT_SCHEMA_NAME;
    const sName = isRoot ? ROOT_SCHEMA_NAME : stringifyNamePath(name);

    const current = ctx.listData[sName];

    if (!current) return null;

    let val: any[] = isRoot ? ctx.values : instance.getValue(name);

    if (!isArray(val)) {
      val = [];
    }

    val = [...val];

    return {
      keyList: current,
      value: val,
    };
  }

  /**
   * 根据当前记录的ctx.listNames同步listData配置, 确保所有项都被标注了key
   * */
  ctx.syncLists = () => {
    const listData = ctx.listData;

    ctx.listNames.forEach((name) => {
      const sName = stringifyNamePath(name);

      if (!isArray(listData[sName])) {
        listData[sName] = [];
      }

      const value =
        name === ROOT_SCHEMA_NAME ? ctx.values : instance.getValue(name);

      if (!isArray(value) || !value.length) {
        listData[sName] = [];
        return;
      }

      // 长度不相等时进行处理, 填充或移除key
      const diff = value.length - listData[sName].length;

      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          listData[sName].push(createRandString(2));
        }
      }

      if (diff < 0) {
        listData[sName].splice(diff, -diff);
      }
    });
  };

  instance.getList = (name) => {
    const res = getListDataAndValue(name);

    if (!res) return null;

    const { keyList, value } = res;

    return value.map((item, index) => ({
      key: keyList[index] || "__UNEXPECTED_KEY__",
      item,
    }));
  };

  instance.listAdd = (name, items, index) => {
    const res = getListDataAndValue(name);

    if (!res) return false;

    const { keyList, value } = res;

    const newItems = ensureArray(items);

    const start = isNumber(index) ? index : value.length;

    value.splice(start, 0, ...newItems);
    keyList.splice(start, 0, ...newItems.map(() => createRandString(2)));

    if (name === ROOT_SCHEMA_NAME) {
      ctx.setValuesInner(value, true);
    } else {
      ctx.setValueInner(name, value, true);
    }

    return true;
  };

  instance.listRemove = (name, index) => {
    const res = getListDataAndValue(name);

    if (!res) return false;

    const { keyList, value } = res;

    value.splice(index, 1);
    keyList.splice(index, 1);

    if (name === ROOT_SCHEMA_NAME) {
      ctx.setValuesInner(value, true);
    } else {
      ctx.setValueInner(name, value, true);
    }

    return true;
  };

  instance.listMove = (name, from, to) => {
    const res = getListDataAndValue(name);

    if (!res) return false;

    const { keyList, value } = res;

    move(value, from, to);
    move(keyList, from, to);

    if (name === ROOT_SCHEMA_NAME) {
      ctx.setValuesInner(value, true);
    } else {
      ctx.setValueInner(name, value, true);
    }

    return true;
  };

  instance.listSwap = (name, from, to) => {
    const res = getListDataAndValue(name);

    if (!res) return false;

    const { keyList, value } = res;

    swap(value, from, to);
    swap(keyList, from, to);

    if (name === ROOT_SCHEMA_NAME) {
      ctx.setValuesInner(value, true);
    } else {
      ctx.setValueInner(name, value, true);
    }

    return true;
  };
}
