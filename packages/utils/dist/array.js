import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { isArray } from "./is.js";
/**
 * swap index of two items in array.
 * if the index is exceeded, no action is performed.
 * return the original array after operation.
 * */ export function swap(arr, sourceInd, targetInd) {
    if (sourceInd < 0 || targetInd < 0) return arr;
    if (sourceInd > arr.length - 1 || targetInd > arr.length - 1) return arr;
    arr.splice(targetInd, 1, arr.splice(sourceInd, 1, arr[targetInd])[0]);
    return arr;
}
/**
 * move array item location `form -> to`, return the original array after operation.
 * */ export function move(array, form, to) {
    var _array;
    if (form < 0 || to < 0) return array;
    if (form > array.length - 1 || to > array.length - 1) return array;
    (_array = array).splice.apply(_array, [
        to,
        0
    ].concat(_to_consumable_array(array.splice(form, 1))));
    return array;
}
/**
 * receive T or T[], return T[]
 * */ export function ensureArray(val) {
    return isArray(val) ? val : [
        val
    ];
}
/**
 * array deduplication, use shallow compare
 * */ export function uniq(array) {
    var arr = [];
    array.forEach(function(it) {
        if (arr.indexOf(it) === -1) {
            arr.push(it);
        }
    });
    return arr;
}
/**
 * array deduplication, use comparator
 * */ export function uniqWith(array, comparator) {
    var arr = [];
    array.forEach(function(it) {
        var flag = false;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var item = _step.value;
                if (comparator(item, it)) {
                    flag = true;
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
        if (!flag) {
            arr.push(it);
        }
    });
    return arr;
}
