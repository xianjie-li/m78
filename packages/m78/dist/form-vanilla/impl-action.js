import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { VerifyError } from "@m78/verify";
import { ensureArray, isArray, isEmpty, stringifyNamePath } from "@m78/utils";
import clone from "lodash/cloneDeep.js";
import { _eachState, _getState, _isRelationName } from "./common.js";
export function _implAction(ctx) {
    var instance = ctx.instance;
    instance.verify = function() {
        var _ref = _async_to_generator(function(name) {
            var schema, isValueChangeTrigger, resetState, resetErrorAndTouch, e, reject, errors;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        schema = instance.getSchemas();
                        isValueChangeTrigger = ctx.isValueChangeTrigger;
                        ctx.isValueChangeTrigger = false;
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
                        resetErrorAndTouch = function() {
                            // 重置所有错误并在未指定name时设置touched状态
                            _eachState(ctx, resetState);
                            // 指定了项
                            if (name) {
                                var st = _getState(ctx, name);
                                resetState(st);
                            }
                        };
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            4,
                            5
                        ]);
                        return [
                            4,
                            instance.verifyInstance.asyncCheck(instance.getValues(), schema)
                        ];
                    case 2:
                        _state.sent();
                        resetErrorAndTouch();
                        return [
                            3,
                            5
                        ];
                    case 3:
                        e = _state.sent();
                        resetErrorAndTouch();
                        if (e instanceof VerifyError) {
                            reject = e.rejects;
                            if (isArray(reject)) {
                                errors = [];
                                // 将所有错误信息存储到state中, 并且根据是否传入name更新指定的touched
                                reject.forEach(function(meta) {
                                    var ref;
                                    var st = _getState(ctx, meta.namePath);
                                    if (!isEmpty(st.errors)) {
                                        st.errors = [];
                                    }
                                    (ref = st.errors) === null || ref === void 0 ? void 0 : ref.push(meta);
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
                                    throw new VerifyError(errors);
                                }
                            }
                        }
                        throw e;
                    case 4:
                        if (!ctx.lockNotify) {
                            instance.events.update.emit(name);
                        }
                        return [
                            7
                        ];
                    case 5:
                        return [
                            2
                        ];
                }
            });
        });
        return function(name) {
            return _ref.apply(this, arguments);
        };
    }();
    // 存放debounceVerify计时器
    var debounceVerifyTimerMap = {};
    // 防止debounceVerify在单次触发时执行两次
    var firstTriggerFlag = false;
    instance.debounceVerify = function(name, cb) {
        var key = stringifyNamePath(name || []) || "default";
        var isValueChangeTrigger = ctx.isValueChangeTrigger;
        ctx.isValueChangeTrigger = false;
        // 立即执行一次
        if (!debounceVerifyTimerMap[key]) {
            if (isValueChangeTrigger) {
                ctx.isValueChangeTrigger = true;
            }
            firstTriggerFlag = true;
            instance.verify(name).then(function() {
                cb === null || cb === void 0 ? void 0 : cb();
            }).catch(function(err) {
                cb === null || cb === void 0 ? void 0 : cb(err === null || err === void 0 ? void 0 : err.rejects);
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
                instance.verify(name).then(function() {
                    cb === null || cb === void 0 ? void 0 : cb();
                }).catch(function(err) {
                    cb === null || cb === void 0 ? void 0 : cb(err === null || err === void 0 ? void 0 : err.rejects);
                });
            }
        }, 200);
    };
    instance.submit = /*#__PURE__*/ _async_to_generator(function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        instance.verify()
                    ];
                case 1:
                    _state.sent();
                    instance.events.submit.emit();
                    return [
                        2
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
