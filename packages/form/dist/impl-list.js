import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { createRandString, ensureArray, isArray, isNumber, move, swap, stringifyNamePath } from "@m78/utils";
import { _syncListIndex, isRootName } from "./common.js";
export function _implList(ctx) {
    var instance = ctx.instance;
    /**
   * 更新指定name的listState并获取对应list, 若未在schema中开启, 则返回null,
   * 若list为`[]`, 则对根schema进行操作, 若指定name的值不是数组, 内部会确保获取到数组
   * */ function syncAndGetList(_name) {
        var _listState_sName;
        var name = ensureArray(_name);
        var isRoot = !name.length;
        var schema = isRoot ? instance.getSchemas().schemas : instance.getSchema(name);
        var listState = ctx.listState;
        if (!schema || !schema.list) return null;
        var sName = isRoot ? "[]" : stringifyNamePath(name);
        if (!isArray(listState === null || listState === void 0 ? void 0 : (_listState_sName = listState[sName]) === null || _listState_sName === void 0 ? void 0 : _listState_sName.keys)) {
            listState[sName] = {
                keys: [],
                name: isRoot ? [] : name
            };
        }
        var value = isRoot ? ctx.values : instance.getValue(name);
        if (!isArray(value) || !value.length) {
            listState[sName].keys = [];
            value = [];
        }
        var keys = listState[sName].keys;
        // 长度不相等时进行处理, 填充或移除key
        var diff = value.length - keys.length;
        if (diff > 0) {
            for(var i = 0; i < diff; i++){
                keys.push(createRandString(2));
            }
        }
        if (diff < 0) {
            keys.splice(diff, -diff);
        }
        value = _to_consumable_array(value);
        return {
            keys: keys,
            value: value,
            name: name,
            strName: sName,
            isRoot: isRoot
        };
    }
    /** 根据isRoot设置value, 并阻止重置值的list状态 */ function setValueHandle(value, name, isRoot) {
        ctx.lockListState = true;
        if (isRoot) {
            instance.setValues(value);
        } else {
            instance.setValue(name, value);
        }
        ctx.lockListState = false;
    }
    instance.getList = function(name) {
        var res = syncAndGetList(isRootName(name) ? [] : name);
        if (!res) return null;
        var keys = res.keys, value = res.value;
        return value.map(function(item, index) {
            return {
                key: keys[index] || "__UNEXPECTED_KEY__",
                item: item
            };
        });
    };
    instance.listAdd = function(name, items, index) {
        var _memoList, _value, _keys;
        var res = syncAndGetList(name);
        if (!res) return false;
        var keys = res.keys, value = res.value;
        var newItems = ensureArray(items);
        var start = isNumber(index) ? index : value.length;
        // 记录变更位置, 稍后根据此顺序的变更同步到listState
        var memoList = Array.from({
            length: value.length
        }).map(function(_, i) {
            return i;
        });
        var newMemoList = Array.from({
            length: newItems.length
        }).map(function(_, i) {
            return i + value.length;
        });
        (_memoList = memoList).splice.apply(_memoList, [
            start,
            0
        ].concat(_to_consumable_array(newMemoList)));
        (_value = value).splice.apply(_value, [
            start,
            0
        ].concat(_to_consumable_array(newItems)));
        (_keys = keys).splice.apply(_keys, [
            start,
            0
        ].concat(_to_consumable_array(newItems.map(function() {
            return createRandString(2);
        }))));
        // 同步子项位置
        _syncListIndex(ctx, name, memoList);
        setValueHandle(value, name, res.isRoot);
        return true;
    };
    instance.listRemove = function(name, index) {
        var res = syncAndGetList(name);
        if (!res) return false;
        var keys = res.keys, value = res.value;
        // 记录变更位置, 稍后根据此顺序的变更同步到listState
        var memoList = Array.from({
            length: value.length
        }).map(function(_, i) {
            return i;
        });
        memoList.splice(index, 1);
        value.splice(index, 1);
        keys.splice(index, 1);
        // 同步子项位置
        _syncListIndex(ctx, name, memoList);
        setValueHandle(value, name, res.isRoot);
        return true;
    };
    instance.listMove = function(name, from, to) {
        var res = syncAndGetList(name);
        if (!res) return false;
        var keys = res.keys, value = res.value;
        // 记录变更位置, 稍后根据此顺序的变更同步到listState
        var memoList = Array.from({
            length: value.length
        }).map(function(_, i) {
            return i;
        });
        move(memoList, from, to);
        move(value, from, to);
        move(keys, from, to);
        // 同步子项位置
        _syncListIndex(ctx, name, memoList);
        setValueHandle(value, name, res.isRoot);
        return true;
    };
    instance.listSwap = function(name, from, to) {
        var res = syncAndGetList(name);
        if (!res) return false;
        var keys = res.keys, value = res.value;
        // 记录变更位置, 稍后根据此顺序的变更同步到listState
        var memoList = Array.from({
            length: value.length
        }).map(function(_, i) {
            return i;
        });
        swap(memoList, from, to);
        swap(value, from, to);
        swap(keys, from, to);
        // 同步子项位置
        _syncListIndex(ctx, name, memoList);
        setValueHandle(value, name, res.isRoot);
        return true;
    };
}
