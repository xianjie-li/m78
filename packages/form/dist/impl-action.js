import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { ensureArray, isEmpty, stringifyNamePath, simplyDeepClone as clone } from "@m78/utils";
import { _eachState, _getState, _isRelationName, isRootName } from "./common.js";
export function _implAction(ctx) {
    var instance = ctx.instance;
    instance.verify = function() {
        var _ref = _async_to_generator(function(name, extraMeta) {
            var isValueChangeTrigger, resetState, resetErrorAndTouch, _ctx_getFormatterValuesAndSchema, schemas, values, _ref, rejects, _values, errors;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        isValueChangeTrigger = ctx.isValueChangeTrigger;
                        ctx.isValueChangeTrigger = false;
                        if (isRootName(name)) name = undefined;
                        resetState = function(st) {
                            if (name) {
                                // 含 name 时, 清理自身及子级/父级的 error 状态
                                var isRelationName = _isRelationName(ensureArray(name), ensureArray(st.name));
                                if (isRelationName) {
                                    st.errors = [];
                                }
                            } else {
                                st.errors = [];
                                st.touched = true;
                            }
                        };
                        // 需要在成功或失败后马上重置, 然后再执行后续处理, 防止多个verify产生的竞态问题
                        resetErrorAndTouch = function() {
                            // 重置所有错误并在未指定name时设置touched状态
                            _eachState(ctx, resetState);
                            // 指定了项
                            if (name) {
                                var st = _getState(ctx, name);
                                resetState(st);
                            }
                        };
                        _ctx_getFormatterValuesAndSchema = _sliced_to_array(ctx.getFormatterValuesAndSchema(), 2), schemas = _ctx_getFormatterValuesAndSchema[0], values = _ctx_getFormatterValuesAndSchema[1];
                        return [
                            4,
                            ctx.schemaCheck(values, schemas, extraMeta)
                        ];
                    case 1:
                        _ref = _sliced_to_array.apply(void 0, [
                            _state.sent(),
                            2
                        ]), rejects = _ref[0], _values = _ref[1];
                        resetErrorAndTouch();
                        if (rejects) {
                            errors = [];
                            // 将所有错误信息存储到state中, 并且根据是否传入name更新指定的touched
                            rejects.forEach(function(meta) {
                                var _st_errors;
                                var st = ctx.verifyOnly ? {} : _getState(ctx, meta.namePath);
                                if (!isEmpty(st.errors)) {
                                    st.errors = [];
                                }
                                (_st_errors = st.errors) === null || _st_errors === void 0 ? void 0 : _st_errors.push(meta);
                                if (name) {
                                    if (stringifyNamePath(name) === stringifyNamePath(meta.namePath)) {
                                        st.touched = true;
                                        errors.push(meta);
                                    }
                                } else {
                                    st.touched = true;
                                    errors.push(meta);
                                }
                            });
                            if (errors.length) {
                                instance.events.fail.emit(errors, isValueChangeTrigger);
                            }
                            if (!ctx.lockNotify) {
                                instance.events.update.emit(name);
                            }
                            if (errors.length) return [
                                2,
                                [
                                    errors,
                                    null
                                ]
                            ];
                            else return [
                                2,
                                [
                                    null,
                                    name ? instance.getValue(name) : _values
                                ]
                            ];
                        } else {
                            if (!ctx.lockNotify) {
                                instance.events.update.emit(name);
                            }
                            return [
                                2,
                                [
                                    null,
                                    _values
                                ]
                            ];
                        }
                        return [
                            2
                        ];
                }
            });
        });
        return function(name, extraMeta) {
            return _ref.apply(this, arguments);
        };
    }();
    // 存放debounceVerify计时器
    var debounceVerifyTimerMap = {};
    // 防止debounceVerify在单次触发时执行两次
    var firstTriggerFlag = false;
    instance.debounceVerify = function(name, cb) {
        var key = isRootName(name) ? "[]" : stringifyNamePath(name);
        var isValueChangeTrigger = ctx.isValueChangeTrigger;
        ctx.isValueChangeTrigger = false;
        // 立即执行一次
        if (!debounceVerifyTimerMap[key]) {
            if (isValueChangeTrigger) {
                ctx.isValueChangeTrigger = true;
            }
            firstTriggerFlag = true;
            instance.verify(name).then(function(param) {
                var _param = _sliced_to_array(param, 1), rejects = _param[0];
                if (rejects) {
                    cb === null || cb === void 0 ? void 0 : cb(rejects);
                } else {
                    cb === null || cb === void 0 ? void 0 : cb();
                }
            });
        } else {
            firstTriggerFlag = false;
        }
        if (debounceVerifyTimerMap[key]) {
            clearTimeout(debounceVerifyTimerMap[key]);
        }
        debounceVerifyTimerMap[key] = setTimeout(function() {
            if (isValueChangeTrigger) {
                ctx.isValueChangeTrigger = true;
            }
            delete debounceVerifyTimerMap[key];
            if (!firstTriggerFlag) {
                instance.verify(name).then(function(param) {
                    var _param = _sliced_to_array(param, 1), rejects = _param[0];
                    if (rejects) {
                        cb === null || cb === void 0 ? void 0 : cb(rejects);
                    } else {
                        cb === null || cb === void 0 ? void 0 : cb();
                    }
                });
            }
        }, 200);
    };
    instance.submit = /*#__PURE__*/ _async_to_generator(function() {
        var _ref, reject, values;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        instance.verify()
                    ];
                case 1:
                    _ref = _sliced_to_array.apply(void 0, [
                        _state.sent(),
                        2
                    ]), reject = _ref[0], values = _ref[1];
                    if (!reject) {
                        instance.events.submit.emit(values);
                    }
                    return [
                        2,
                        [
                            reject,
                            values
                        ]
                    ];
            }
        });
    });
    instance.reset = function() {
        ctx.values = clone(ctx.defaultValue);
        ctx.state = {};
        // 清空现有list信息, 并使用新的values进行一次刷新, 同步list
        ctx.listState = {};
        if (!ctx.lockNotify) {
            instance.events.change.emit();
            instance.events.update.emit();
        }
        instance.events.reset.emit();
    };
}
