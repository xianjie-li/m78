import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { getNamePathValue, isArray, isObject, simplyEqual as isEqual } from "@m78/utils";
import { _eachState, _getState, isRootName } from "./common.js";
export function _implState(ctx) {
    var instance = ctx.instance;
    instance.getChanged = function(name) {
        if (isRootName(name)) return instance.getFormChanged();
        var cur = getNamePathValue(ctx.values, name);
        var def = getNamePathValue(ctx.defaultValue, name);
        // 这里开始做一些空值处理, 如果默认值本身为undefined, 且新增值也是无效值("", [], {}等), 则认为其未改变
        // 跳过字符串
        if (cur === "" && def === undefined) return false;
        // 跳过空数组
        if (isArray(cur) && cur.length === 0 && def === undefined) return false;
        // 跳过空对象
        if (isObject(cur) && Object.keys(cur).length === 0 && def === undefined) return false;
        return !isEqual(cur, def);
    };
    // form本身值是否变更
    instance.getFormChanged = function() {
        return !isEqual(ctx.values, ctx.defaultValue);
    };
    instance.getTouched = function(name) {
        if (isRootName(name)) return instance.getFormTouched();
        var st = _getState(ctx, name);
        return st && !!st.touched;
    };
    instance.setTouched = function(name, touched) {
        if (isRootName(name)) {
            instance.setFormTouched(touched);
            return;
        }
        var st = _getState(ctx, name);
        st.touched = touched;
        if (!ctx.lockNotify) {
            instance.events.update.emit(name);
        }
    };
    // 获取form的touched状态
    instance.getFormTouched = function() {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = Object.keys(ctx.state)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var key = _step.value;
                var cur = ctx.state[key];
                if (cur.touched) return true;
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
        return false;
    };
    // 设置form的touched状态
    instance.setFormTouched = function(touched) {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = Object.keys(ctx.state)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var key = _step.value;
                var cur = ctx.state[key];
                if (cur) {
                    cur.touched = touched;
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
        if (!ctx.lockNotify) {
            instance.events.update.emit();
        }
    };
    instance.getErrors = function(name) {
        if (isRootName(name)) {
            var errors = [];
            _eachState(ctx, function(st) {
                var _st_errors;
                if ((_st_errors = st.errors) === null || _st_errors === void 0 ? void 0 : _st_errors.length) {
                    var _errors;
                    (_errors = errors).push.apply(_errors, _to_consumable_array(st.errors));
                }
            });
            return errors;
        }
        var st = _getState(ctx, name);
        return st.errors || [];
    };
}
