import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { getNamePathValue, isArray, isFunction, isObject, isString, stringifyNamePath, ensureArray, interpolate } from "@m78/utils";
import { fmtValidator, getExtraKeys, isErrorTemplateInterpolate, SOURCE_ROOT_NAME } from "./common.js";
import { isVerifyEmpty } from "./validator/required.js";
import { VerifyError } from "./error.js";
/**
 * 获取check api，verify此时还不可操作, 仅可作为引用传递
 * - 这里要注意的点是，同步和异步 check流程极为相似，为了最大程度的复用，在同步验证时这里通过syncCallBack来对检测结果进行同步回调
 * */ export function getCheckApi(conf, verify) {
    var baseCheck = function() {
        var _ref = _async_to_generator(function(args, syncCallback) {
            var isSync, _args, source, _rootSchema, _config, rootSchema, _tmp, _tmp1, rejectMeta, needBreak, getValueByName, _rejectMeta;
            function checkSchema(schema, parentNames) {
                return _checkSchema.apply(this, arguments);
            }
            function _checkSchema() {
                _checkSchema = // 对一项schema执行检测, 返回true时可按需跳过后续schema的验证
                // 如果传入parentNames，会将当前项作为指向并将parentNames与当前name拼接
                _async_to_generator(function(schema, parentNames) {
                    var ref, isRootSchema, parentNamePath, namePath, realNamePath, value, name, label, isEmpty, validators, interpolateValues, _tmp, currentPass, meta, _tmp1, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, validator, errorTemplate, result, _tmp2, err, _tmp3, _tmp4, err1, extraKeys, template, _schemas;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                isRootSchema = schema.name === SOURCE_ROOT_NAME;
                                parentNamePath = ensureArray(parentNames);
                                namePath = _to_consumable_array(parentNamePath).concat(_to_consumable_array(ensureArray(schema.name)));
                                realNamePath = isRootSchema ? [] : namePath;
                                value = isRootSchema ? source : getValueByName(namePath);
                                name = stringifyNamePath(namePath);
                                label = schema.label || name;
                                // 预转换值
                                if (schema.transform) value = schema.transform(value);
                                isEmpty = isVerifyEmpty(value);
                                validators = fmtValidator(schema.validator, isEmpty);
                                _tmp = {};
                                interpolateValues = (_tmp.name = name, _tmp.label = label, _tmp.value = value, _tmp.type = Object.prototype.toString.call(value), _tmp);
                                currentPass = true;
                                _tmp1 = {};
                                meta = _object_spread((_tmp1.verify = verify, _tmp1.name = name, _tmp1.label = label, _tmp1.value = value, _tmp1.values = source, _tmp1.schema = schema, _tmp1.rootSchema = rootSchema, _tmp1.getValueByName = getValueByName, _tmp1.config = conf, _tmp1.parentNamePath = parentNamePath, _tmp1.namePath = namePath, _tmp1.isEmpty = isEmpty, _tmp1), _config === null || _config === void 0 /* 扩展接口 */  ? void 0 : _config.extraMeta);
                                if (!(validators === null || validators === void 0 ? void 0 : validators.length)) return [
                                    3,
                                    13
                                ];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    11,
                                    12,
                                    13
                                ]);
                                _iterator = validators[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    10
                                ];
                                validator = _step.value;
                                errorTemplate = "";
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    7,
                                    ,
                                    8
                                ]);
                                if (!isSync) return [
                                    3,
                                    4
                                ];
                                _tmp2 = validator(meta);
                                return [
                                    3,
                                    6
                                ];
                            case 4:
                                return [
                                    4,
                                    validator(meta)
                                ];
                            case 5:
                                _tmp2 = _state.sent();
                                _state.label = 6;
                            case 6:
                                result = _tmp2;
                                // 不同的验证返回类型处理
                                if (isString(result)) errorTemplate = result;
                                if (isErrorTemplateInterpolate(result)) {
                                    errorTemplate = result.errorTemplate;
                                    Object.assign(interpolateValues, result.interpolateValues);
                                }
                                if (isFunction(result)) errorTemplate = result(meta);
                                return [
                                    3,
                                    8
                                ];
                            case 7:
                                err = _state.sent();
                                if (err.message) errorTemplate = err.message;
                                return [
                                    3,
                                    8
                                ];
                            case 8:
                                _tmp3 = {};
                                _tmp4 = {};
                                if (isString(errorTemplate) && !!errorTemplate.trim()) {
                                    rejectMeta.push(_object_spread_props(_object_spread(_tmp3, meta), (_tmp4.message = interpolate(errorTemplate, interpolateValues), _tmp4)));
                                    currentPass = false;
                                    return [
                                        3,
                                        10
                                    ];
                                }
                                _state.label = 9;
                            case 9:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
                                ];
                            case 10:
                                return [
                                    3,
                                    13
                                ];
                            case 11:
                                err1 = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err1;
                                return [
                                    3,
                                    13
                                ];
                            case 12:
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                                return [
                                    7
                                ];
                            case 13:
                                // 处理StrangeValue
                                if (!conf.ignoreStrangeValue) {
                                    extraKeys = getExtraKeys(namePath, schema, value);
                                    if (extraKeys.length) {
                                        template = conf.languagePack.commonMessage.strangeValue;
                                        extraKeys.forEach(function(nameKey) {
                                            var msg = interpolate(template, {
                                                name: nameKey
                                            });
                                            rejectMeta.push(_object_spread_props(_object_spread({}, meta), {
                                                message: msg,
                                                rand: Math.random()
                                            }));
                                        });
                                    }
                                }
                                // 检测是否需要中断后续验证
                                needBreak = !!(conf.verifyFirst && rejectMeta.length);
                                if (needBreak) return [
                                    2
                                ];
                                // 未通过验证时不再进行子级验证
                                if (!currentPass) return [
                                    2
                                ];
                                if (!((ref = schema.schema) === null || ref === void 0 ? void 0 : ref.length)) return [
                                    3,
                                    16
                                ];
                                if (!isSync) return [
                                    3,
                                    14
                                ];
                                checkSchemas(schema.schema, realNamePath).then();
                                return [
                                    3,
                                    16
                                ];
                            case 14:
                                return [
                                    4,
                                    checkSchemas(schema.schema, realNamePath)
                                ];
                            case 15:
                                _state.sent();
                                _state.label = 16;
                            case 16:
                                if (!schema.eachSchema) return [
                                    3,
                                    19
                                ];
                                _schemas = [];
                                if (isArray(value)) {
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                    _schemas = value.map(function(_, index) {
                                        return _object_spread_props(_object_spread({}, schema.eachSchema), {
                                            name: index
                                        });
                                    });
                                }
                                if (isObject(value)) {
                                    _schemas = Object.keys(value).map(function(key) {
                                        return _object_spread_props(_object_spread({}, schema.eachSchema), {
                                            name: key
                                        });
                                    });
                                }
                                if (!isSync) return [
                                    3,
                                    17
                                ];
                                checkSchemas(_schemas, realNamePath).then();
                                return [
                                    3,
                                    19
                                ];
                            case 17:
                                return [
                                    4,
                                    checkSchemas(_schemas, realNamePath)
                                ];
                            case 18:
                                _state.sent();
                                _state.label = 19;
                            case 19:
                                return [
                                    2
                                ];
                        }
                    });
                });
                return _checkSchema.apply(this, arguments);
            }
            function checkSchemas(_schemas, parentNames) {
                return _checkSchemas.apply(this, arguments);
            }
            function _checkSchemas() {
                _checkSchemas = // 检测一组schema
                _async_to_generator(function(_schemas, parentNames) {
                    var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, schema, err1;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    7,
                                    8,
                                    9
                                ]);
                                _iterator = _schemas[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    6
                                ];
                                schema = _step.value;
                                if (!isSync) return [
                                    3,
                                    3
                                ];
                                checkSchema(schema, parentNames).then();
                                if (needBreak) return [
                                    3,
                                    6
                                ];
                                return [
                                    3,
                                    5
                                ];
                            case 3:
                                return [
                                    4,
                                    checkSchema(schema, parentNames)
                                ];
                            case 4:
                                _state.sent();
                                if (needBreak) return [
                                    3,
                                    6
                                ];
                                _state.label = 5;
                            case 5:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
                                ];
                            case 6:
                                return [
                                    3,
                                    9
                                ];
                            case 7:
                                err1 = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err1;
                                return [
                                    3,
                                    9
                                ];
                            case 8:
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally{
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                                return [
                                    7
                                ];
                            case 9:
                                return [
                                    2
                                ];
                        }
                    });
                });
                return _checkSchemas.apply(this, arguments);
            }
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        isSync = !!syncCallback;
                        _args = _sliced_to_array(args, 3), source = _args[0], _rootSchema = _args[1], _config = _args[2];
                        _tmp = {};
                        _tmp1 = {};
                        rootSchema = _object_spread_props(_object_spread(_tmp, _rootSchema), (_tmp1.name = SOURCE_ROOT_NAME, _tmp1));
                        rejectMeta = [];
                        needBreak = false;
                        getValueByName = function(name) {
                            return getNamePathValue(source, name);
                        };
                        if (!isSync) return [
                            3,
                            1
                        ];
                        checkSchema(rootSchema, []).then();
                        return [
                            3,
                            3
                        ];
                    case 1:
                        return [
                            4,
                            checkSchema(rootSchema, [])
                        ];
                    case 2:
                        _state.sent();
                        _state.label = 3;
                    case 3:
                        _rejectMeta = rejectMeta.length ? rejectMeta : null;
                        if (isSync) {
                            syncCallback === null || syncCallback === void 0 ? void 0 : syncCallback(_rejectMeta);
                            return [
                                2,
                                null
                            ];
                        }
                        if (_rejectMeta) {
                            throw _rejectMeta;
                        }
                        return [
                            2
                        ];
                }
            });
        });
        return function baseCheck(args, syncCallback) {
            return _ref.apply(this, arguments);
        };
    }();
    var check = function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        var rejectMeta = null;
        baseCheck(args, function(_rejectMeta) {
            return rejectMeta = _rejectMeta;
        }).then();
        return rejectMeta;
    };
    var asyncCheck = function() {
        var _ref = _async_to_generator(function() {
            var _len, args, _key, e;
            var _arguments = arguments;
            return _ts_generator(this, function(_state) {
                switch(_state.label){
                    case 0:
                        for(_len = _arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                            args[_key] = _arguments[_key];
                        }
                        _state.label = 1;
                    case 1:
                        _state.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4,
                            baseCheck(args)
                        ];
                    case 2:
                        _state.sent();
                        return [
                            3,
                            4
                        ];
                    case 3:
                        e = _state.sent();
                        if (isArray(e)) {
                            throw new VerifyError(e);
                        } else {
                            throw new VerifyError([]);
                        }
                        return [
                            3,
                            4
                        ];
                    case 4:
                        return [
                            2
                        ];
                }
            });
        });
        return function asyncCheck() {
            return _ref.apply(this, arguments);
        };
    }();
    var getRejectMessage = function(e) {
        var msg = "";
        if (e instanceof VerifyError) {
            if (e.rejects.length) {
                msg = e.rejects[0].message;
            }
        }
        if (!msg) {
            msg = (e === null || e === void 0 ? void 0 : e.message) || VerifyError.defaultMessage;
        }
        return msg;
    };
    return {
        check: check,
        asyncCheck: asyncCheck,
        getRejectMessage: getRejectMessage
    };
}
