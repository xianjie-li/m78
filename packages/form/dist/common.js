import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { ensureArray, isNumber, stringifyNamePath, simplyEqual as isEqual, isArray } from "@m78/utils";
/** 获取指定name的state, 状态对象还不存在时会自动进行创建 */ export function _getState(ctx, name) {
    var nameKey = stringifyNamePath(name);
    var st = ctx.state[nameKey];
    if (!st) {
        st = {
            name: name,
            errors: []
        };
        ctx.state[nameKey] = st;
    }
    return st;
}
/** 遍历已存在的所有state */ export function _eachState(ctx, cb) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.keys(ctx.state)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var key = _step.value;
            cb(ctx.state[key] || {});
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
/** 根据values递归为其设置或初始化state */ /**
 * 用于创建update/change事件回调的过滤器, 只在name对应的值发生变化时才会触发回调,
 * 若传入deps, deps中指定的值发生变化时也会触发回调
 * */ export function _notifyFilter(name, notify) {
    var deps = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : [];
    // 触发规则, 值更新时, 其所有上级/下级都会触发
    var np = ensureArray(name);
    return function(triggerName, relation) {
        if (!triggerName) {
            notify(triggerName, relation);
            return;
        }
        var np2 = ensureArray(triggerName);
        var names = [
            np
        ].concat(_to_consumable_array(deps.map(ensureArray)));
        if (relation) {
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = names[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var n = _step.value;
                    // 需要更新关联值
                    if (_isRelationName(n, np2)) {
                        notify(triggerName, relation);
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        } else {
            var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
            try {
                for(var _iterator1 = names[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                    var n1 = _step1.value;
                    // 不关联, 直接对比
                    if (isEqual(n1, np2)) {
                        notify(triggerName, relation);
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError1 = true;
                _iteratorError1 = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                        _iterator1.return();
                    }
                } finally{
                    if (_didIteratorError1) {
                        throw _iteratorError1;
                    }
                }
            }
        }
    };
}
/** 数组1是否与数组2的左侧相等或完全相等 */ export function _isLeftEqualName(arr1, arr2) {
    if (arr1.length > arr2.length) return false;
    for(var i = 0; i < arr1.length; i++){
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}
// 检测两个name是否是另一个的子级/父级/自身
export function _isRelationName(n, n2) {
    var min = Math.min(n.length, n2.length);
    var arr1 = n.slice(0, min);
    var arr2 = n2.slice(0, min);
    return isEqual(arr1, arr2);
}
/** 从listState中获取指定name的子级, 每次命中会触发回调, 也可以使用返回值 */ export function _getListChild(ctx, name, eachCB) {
    var listState = ctx.listState;
    var child = [];
    Object.keys(listState).forEach(function(key) {
        var current = listState[key];
        var currentName = ensureArray(current.name);
        var arrName = ensureArray(name);
        if (currentName.length === arrName.length) return;
        if (_isLeftEqualName(arrName, currentName)) {
            child.push(currentName);
            eachCB === null || eachCB === void 0 ? void 0 : eachCB(key, currentName);
        }
    });
    return child;
}
/** 移除当前name和其子级的所有listState, 触发关联更新 */ export function _clearChildAndSelf(ctx, name) {
    var listState = ctx.listState;
    delete listState[stringifyNamePath(name)];
    _getListChild(ctx, name, function(nameString) {
        delete listState[nameString];
    });
}
/** 同步指定list下所有关联的list项name索引, newIndex为当前索引到新索引的映射, 比如[0,2,1]表示, 原本索引2的元素移动到中间 */ export function _syncListIndex(ctx, name, newIndex) {
    // 需要进行同步调整的子级list索引
    var needChangeIndex = ensureArray(name).length;
    var cloneListState = _object_spread({}, ctx.listState);
    // 临时存放新的listState, 反正项之间的存在前后索引相同, 比如索引2的新位置为索引1的元素
    var temp = {};
    _getListChild(ctx, name, function(childNameString, childName) {
        var childNameArr = ensureArray(childName);
        var newName = _to_consumable_array(childNameArr);
        // 原索引
        var ind = childNameArr[needChangeIndex];
        if (!isNumber(ind)) return;
        // 新索引
        var newInd = newIndex.indexOf(ind);
        if (newInd === -1) return;
        newName[needChangeIndex] = newInd;
        var newNameString = stringifyNamePath(newName);
        temp[newNameString] = cloneListState[childNameString];
        temp[newNameString].name = newName;
        delete ctx.listState[childNameString];
    });
    Object.assign(ctx.listState, temp);
}
/** 检测是否为根name, undefined 或 [] 或 `[]` */ export function isRootName(name) {
    return name === undefined || name === "[]" || isArray(name) && name.length === 0;
}
