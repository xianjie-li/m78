import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { deleteNamePathValues, getNamePathValue, isArray, isEmpty, isObject, isString, setNamePathValue, simplyDeepClone as clone, simplyEqual as isEqual } from "@m78/utils";
import { _clearChildAndSelf, isRootName } from "./common.js";
export function _implValue(ctx) {
    var instance = ctx.instance, config = ctx.config;
    instance.getValue = function(name) {
        if (isRootName(name)) return instance.getValues();
        return getNamePathValue(ctx.values, name);
    };
    // 获取经过处理后的当前值
    instance.getValues = function() {
        var _ctx_getFormatterValuesAndSchema = _sliced_to_array(ctx.getFormatterValuesAndSchema(), 2), values = _ctx_getFormatterValuesAndSchema[1];
        return values;
    };
    ctx.getFormatterValuesAndSchema = function(values) {
        var _ctx_getFormatterSchemas = _sliced_to_array(ctx.getFormatterSchemas(), 2), schemas = _ctx_getFormatterSchemas[0], names = _ctx_getFormatterSchemas[1];
        var cloneValues = clone(values === undefined ? ctx.values : values);
        // 移除invalid值
        deleteNamePathValues(cloneValues, names);
        return [
            schemas,
            cloneValues
        ];
    };
    if (!ctx.verifyOnly) {
        // 设置所有值
        instance.setValues = function(values) {
            ctx.values = values;
            if (!ctx.lockListState) {
                ctx.listState = {};
            }
            if (!ctx.lockNotify) {
                instance.events.change.emit();
                instance.events.update.emit();
            }
            if (config.autoVerify) {
                instance.verify();
            }
        };
        instance.setValue = function(name, val) {
            if (isRootName(name)) {
                instance.setValues(val);
                return;
            }
            setNamePathValue(ctx.values, name, val);
            if (!ctx.lockListState) {
                _clearChildAndSelf(ctx, name);
            }
            ctx.lockNotify = true;
            instance.setTouched(name, true);
            ctx.lockNotify = false;
            if (!ctx.lockNotify) {
                instance.events.change.emit(name, true);
                instance.events.update.emit(name, true);
            }
            if (config.autoVerify) {
                ctx.isValueChangeTrigger = true;
                instance.debounceVerify(name);
            }
        };
        instance.getDefaultValues = function() {
            return ctx.defaultValue;
        };
        instance.setDefaultValues = function(values) {
            ctx.defaultValue = values;
        };
        instance.getChangedValues = function() {
            var changeProcess = // 递归处理和获取当前values的变更
            function changeProcess() {
                if (isObject(values)) {
                    var keys = Object.keys(values);
                    keys.forEach(function(key) {
                        var changed = instance.getChanged(key);
                        if (changed) {
                            if (cValues === null) cValues = {};
                            setNamePathValue(cValues, key, values[key]);
                        }
                    });
                    return;
                }
                if (isArray(values)) {
                    values.forEach(function(value, index) {
                        var changed = instance.getChanged(index);
                        if (changed) {
                            if (cValues === null) cValues = [];
                            setNamePathValue(cValues, index, value);
                        }
                        if (isArray(cValues)) {
                            // 过滤掉不连续索引
                            cValues = cValues.filter(function() {
                                return true;
                            });
                        }
                    });
                    return;
                }
            };
            var defaultValueProcess = // 处理从defaultValue中删除的元素
            function defaultValueProcess() {
                if (isObject(defaultValues)) {
                    var keys = Object.keys(defaultValues);
                    keys.forEach(function(key) {
                        var val = defaultValues[key];
                        var cVal = values[key];
                        // 包含在defaultValue中, 但是不包含在values中, 为其设置初始值
                        if (!isEmpty(val) && isEmpty(cVal)) {
                            // 字符串类型设置为空字符串, 其他类型设置为null
                            if (isString(val)) {
                                setNamePathValue(cValues, key, "");
                            } else {
                                setNamePathValue(cValues, key, null);
                            }
                        }
                    });
                }
            };
            var values = instance.getValues();
            var defaultValues = instance.getDefaultValues();
            // 非数组和对象时, 直接比较
            if (!isObject(values) && !isArray(values)) {
                if (!isEqual(values, defaultValues)) {
                    return values;
                }
                return null;
            }
            // 变更或新增的值
            var cValues = null;
            changeProcess();
            defaultValueProcess();
            return cValues;
        };
    }
}
