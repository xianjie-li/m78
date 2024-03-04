import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useState, useCallback, useRef } from "react";
/**
 * 实现类似react类组件的setState Api
 * @param initState - 初始状态
 * @return tuple
 * @return tuple[0] - 当前状态
 * @return tuple[1] - 类似类组件的setState，不支持回调
 *
 * - 如果新状态对象第一层的所有值与之前相等, 则不会重新触发render
 * */ export var useSetState = function() {
    var initState = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var _useState = _sliced_to_array(useState(initState), 2), state = _useState[0], set = _useState[1];
    var ref = useRef(state);
    var setState = useCallback(function(patch) {
        var newState = _object_spread({}, state, _instanceof(patch, Function) ? patch(ref.current) : patch);
        var newKeys = Object.keys(newState);
        // 第一层的所有key均相等
        var isEq = true;
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = newKeys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var key = _step.value;
                if (newState[key] !== ref.current[key]) {
                    isEq = false;
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
        ref.current = Object.assign(ref.current, newState);
        !isEq && set(newState);
    }, [
        set
    ]);
    return [
        ref.current,
        setState
    ];
};
