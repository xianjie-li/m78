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
import { _ROOT_SCHEMA_NAME, _syncListIndex } from "./common.js";

export function _implList(ctx: _Context) {
  const { instance } = ctx;

  /**
   * 更新指定name的listState并获取对应list, 若未在schema中开启, 则返回null,
   * 若list为`[]`, 则对根schema进行操作, 若指定name的值不是数组, 内部会确保获取到数组
   * */
  function syncAndGetList(name: NamePath) {
    const isRoot = isArray(name) && !name.length;
    const schema = isRoot ? { ...ctx.schema } : instance.getSchema(name);
    const listState = ctx.listState;

    if (!schema || !schema.list) return null;

    const sName = isRoot ? _ROOT_SCHEMA_NAME : stringifyNamePath(name);

    if (!isArray(listState?.[sName]?.keys)) {
      listState[sName] = {
        keys: [],
        name: isRoot ? _ROOT_SCHEMA_NAME : name,
      };
    }

    let value: any[] = isRoot ? ctx.values : instance.getValue(name);

    if (!isArray(value) || !value.length) {
      listState[sName].keys = [];
      value = [];
    }

    const keys = listState[sName].keys;

    // 长度不相等时进行处理, 填充或移除key
    const diff = value.length - keys.length;

    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        keys.push(createRandString(2));
      }
    }

    if (diff < 0) {
      keys.splice(diff, -diff);
    }

    value = [...value];

    return {
      keys,
      value,
      name,
      strName: sName,
      isRoot,
    };
  }

  /** 根据isRoot设置value, 并阻止重置值的list状态 */
  function setValueHandle(value: any, name: NamePath, isRoot: boolean) {
    ctx.lockListState = true;
    if (isRoot) {
      instance.setValues(value);
    } else {
      instance.setValue(name, value);
    }
    ctx.lockListState = false;
  }

  instance.getList = (name) => {
    const res = syncAndGetList(name);

    if (!res) return null;

    const { keys, value } = res;

    return value.map((item, index) => ({
      key: keys[index] || "__UNEXPECTED_KEY__",
      item,
    }));
  };

  instance.listAdd = (name, items, index) => {
    const res = syncAndGetList(name);

    if (!res) return false;

    const { keys, value } = res;

    const newItems = ensureArray(items);

    const start = isNumber(index) ? index : value.length;

    // 记录变更位置, 稍后根据此顺序的变更同步到listState
    const memoList = Array.from({ length: value.length }).map((_, i) => i);
    const newMemoList = Array.from({ length: newItems.length }).map(
      (_, i) => i + value.length
    );

    memoList.splice(start, 0, ...newMemoList);
    value.splice(start, 0, ...newItems);
    keys.splice(start, 0, ...newItems.map(() => createRandString(2)));

    // 同步子项位置
    _syncListIndex(ctx, name, memoList);

    setValueHandle(value, name, res.isRoot);

    return true;
  };

  instance.listRemove = (name, index) => {
    const res = syncAndGetList(name);

    if (!res) return false;

    const { keys, value } = res;

    // 记录变更位置, 稍后根据此顺序的变更同步到listState
    const memoList = Array.from({ length: value.length }).map((_, i) => i);

    memoList.splice(index, 1);
    value.splice(index, 1);
    keys.splice(index, 1);

    // 同步子项位置
    _syncListIndex(ctx, name, memoList);

    setValueHandle(value, name, res.isRoot);

    return true;
  };

  instance.listMove = (name, from, to) => {
    const res = syncAndGetList(name);

    if (!res) return false;

    const { keys, value } = res;

    // 记录变更位置, 稍后根据此顺序的变更同步到listState
    const memoList = Array.from({ length: value.length }).map((_, i) => i);

    move(memoList, from, to);
    move(value, from, to);
    move(keys, from, to);

    // 同步子项位置
    _syncListIndex(ctx, name, memoList);

    setValueHandle(value, name, res.isRoot);

    return true;
  };

  instance.listSwap = (name, from, to) => {
    const res = syncAndGetList(name);

    if (!res) return false;

    const { keys, value } = res;

    // 记录变更位置, 稍后根据此顺序的变更同步到listState
    const memoList = Array.from({ length: value.length }).map((_, i) => i);

    swap(memoList, from, to);
    swap(value, from, to);
    swap(keys, from, to);

    // 同步子项位置
    _syncListIndex(ctx, name, memoList);

    setValueHandle(value, name, res.isRoot);

    return true;
  };
}
