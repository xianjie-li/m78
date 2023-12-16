import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { ensureArray, isEmpty, stringifyNamePath } from "@m78/utils";
import clone from "lodash/cloneDeep.js";
import { _eachState, _getState, _isRelationName } from "./common.js";
export function _implAction(ctx) {
    var instance = ctx.instance;
    instance.verify = function() {
        var _ref = _async_to_generator(function(name, extraMeta) {
            var isValueChangeTrigger, resetState, resetErrorAndTouch, rejects, errors;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
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
                        return [
                            4,
                            ctx.schemaCheck(instance.getValues(), extraMeta)
                        ];
                    case 1:
                        rejects = _state.sent();
                        resetErrorAndTouch();
                        if (rejects) {
                            errors = [];
                            // 将所有错误信息存储到state中, 并且根据是否传入name更新指定的touched
                            rejects.forEach(function(meta) {
                                var ref;
                                var st = ctx.verifyOnly ? {} : _getState(ctx, meta.namePath);
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
                            }
                            if (!ctx.lockNotify) {
                                instance.events.update.emit(name);
                            }
                            return [
                                2,
                                errors.length ? errors : null
                            ];
                        } else {
                            if (!ctx.lockNotify) {
                                instance.events.update.emit(name);
                            }
                            return [
                                2,
                                null
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
        var reject;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        instance.verify()
                    ];
                case 1:
                    reject = _state.sent();
                    if (!reject) {
                        instance.events.submit.emit();
                    }
                    return [
                        2,
                        reject
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
