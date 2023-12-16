// 静态schema验证相关逻辑
import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
import { ensureArray, getNamePathValue, interpolate, isArray, isFunction, isObject, isString, stringifyNamePath } from "@m78/utils";
import { _ROOT_SCHEMA_NAME } from "../common.js";
import { isVerifyEmpty } from "../validator/index.js";
import { _fmtValidator, _getExtraKeys, _isErrorTemplateInterpolate } from "./common.js";
export function _implSchemaCheck(ctx) {
    var _instance = ctx.instance, config = ctx.config;
    var instance = _instance;
    ctx.schemaCheck = function() {
        var _ref = _async_to_generator(function(values, extraMeta) {
            var _rootSchema, rootSchema, _tmp, _tmp1, rejectMeta, needBreak, getValueByName;
            function checkSchema(schema, parentNames) {
                return _checkSchema.apply(this, arguments);
            }
            function _checkSchema() {
                _checkSchema = // 对一项schema执行检测, 返回true时可按需跳过后续schema的验证
                // 如果传入parentNames，会将当前项作为指向并将parentNames与当前name拼接
                _async_to_generator(function(schema, parentNames) {
                    var ref, isRootSchema, parentNamePath, namePath, realNamePath, value, name, label, isEmpty, validators, interpolateValues, _tmp, currentPass, meta, _tmp1, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, validator, errorTemplate, result, err, _tmp2, _tmp3, err1, extraKeys, template, _schemas;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                isRootSchema = schema.name === _ROOT_SCHEMA_NAME;
                                parentNamePath = ensureArray(parentNames);
                                namePath = _to_consumable_array(parentNamePath).concat(_to_consumable_array(ensureArray(schema.name)));
                                realNamePath = isRootSchema ? [] : namePath;
                                value = isRootSchema ? values : getValueByName(namePath);
                                name = stringifyNamePath(namePath);
                                label = schema.label || name;
                                // 预转换值
                                if (schema.transform) value = schema.transform(value);
                                isEmpty = isVerifyEmpty(value);
                                validators = _fmtValidator(schema.validator, isEmpty);
                                _tmp = {};
                                interpolateValues = (_tmp.name = name, _tmp.label = label, _tmp.value = value, _tmp.type = Object.prototype.toString.call(value), _tmp);
                                currentPass = true;
                                _tmp1 = {};
                                meta = _object_spread((_tmp1.name = name, _tmp1.namePath = namePath, _tmp1.label = label, _tmp1.value = value, _tmp1.values = values, _tmp1.schema = schema, _tmp1.rootSchema = rootSchema, _tmp1.isEmpty = isEmpty, _tmp1.parentNamePath = parentNamePath, _tmp1.getValueByName = getValueByName, _tmp1.config = config, _tmp1), extraMeta /* 扩展接口 */ );
                                if (!(validators === null || validators === void 0 ? void 0 : validators.length)) return [
                                    3,
                                    11
                                ];
                                _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                _state.label = 1;
                            case 1:
                                _state.trys.push([
                                    1,
                                    9,
                                    10,
                                    11
                                ]);
                                _iterator = validators[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    8
                                ];
                                validator = _step.value;
                                errorTemplate = "";
                                _state.label = 3;
                            case 3:
                                _state.trys.push([
                                    3,
                                    5,
                                    ,
                                    6
                                ]);
                                return [
                                    4,
                                    validator(meta)
                                ];
                            case 4:
                                result = _state.sent();
                                // 不同的验证返回类型处理
                                if (isString(result)) errorTemplate = result;
                                if (_isErrorTemplateInterpolate(result)) {
                                    errorTemplate = result.errorTemplate;
                                    Object.assign(interpolateValues, result.interpolateValues);
                                }
                                if (isFunction(result)) errorTemplate = result(meta);
                                return [
                                    3,
                                    6
                                ];
                            case 5:
                                err = _state.sent();
                                if (err.message) errorTemplate = err.message;
                                return [
                                    3,
                                    6
                                ];
                            case 6:
                                _tmp2 = {};
                                _tmp3 = {};
                                if (isString(errorTemplate) && !!errorTemplate.trim()) {
                                    rejectMeta.push(_object_spread_props(_object_spread(_tmp2, meta), (_tmp3.message = interpolate(errorTemplate, interpolateValues), _tmp3)));
                                    currentPass = false;
                                    return [
                                        3,
                                        8
                                    ];
                                }
                                _state.label = 7;
                            case 7:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
                                ];
                            case 8:
                                return [
                                    3,
                                    11
                                ];
                            case 9:
                                err1 = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err1;
                                return [
                                    3,
                                    11
                                ];
                            case 10:
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
                            case 11:
                                // 处理StrangeValue
                                if (!config.ignoreStrangeValue) {
                                    extraKeys = _getExtraKeys(namePath, schema, value);
                                    if (extraKeys.length) {
                                        template = config.languagePack.commonMessage.strangeValue;
                                        extraKeys.forEach(function(nameKey) {
                                            var msg = interpolate(template, {
                                                name: nameKey
                                            });
                                            rejectMeta.push(_object_spread_props(_object_spread({}, meta), {
                                                message: msg
                                            }));
                                        });
                                    }
                                }
                                // 检测是否需要中断后续验证
                                needBreak = !!(config.verifyFirst && rejectMeta.length);
                                if (needBreak) return [
                                    2
                                ];
                                // 未通过验证时不再进行子级验证
                                if (!currentPass) return [
                                    2
                                ];
                                if (!((ref = schema.schema) === null || ref === void 0 ? void 0 : ref.length)) return [
                                    3,
                                    13
                                ];
                                return [
                                    4,
                                    checkSchemas(schema.schema, realNamePath)
                                ];
                            case 12:
                                _state.sent();
                                _state.label = 13;
                            case 13:
                                if (!schema.eachSchema) return [
                                    3,
                                    15
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
                                return [
                                    4,
                                    checkSchemas(_schemas, realNamePath)
                                ];
                            case 14:
                                _state.sent();
                                _state.label = 15;
                            case 15:
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
                                    6,
                                    7,
                                    8
                                ]);
                                _iterator = _schemas[Symbol.iterator]();
                                _state.label = 2;
                            case 2:
                                if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                    3,
                                    5
                                ];
                                schema = _step.value;
                                return [
                                    4,
                                    checkSchema(schema, parentNames)
                                ];
                            case 3:
                                _state.sent();
                                if (needBreak) return [
                                    3,
                                    5
                                ];
                                _state.label = 4;
                            case 4:
                                _iteratorNormalCompletion = true;
                                return [
                                    3,
                                    2
                                ];
                            case 5:
                                return [
                                    3,
                                    8
                                ];
                            case 6:
                                err1 = _state.sent();
                                _didIteratorError = true;
                                _iteratorError = err1;
                                return [
                                    3,
                                    8
                                ];
                            case 7:
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
                            case 8:
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
                        _rootSchema = instance.getSchemas();
                        _tmp = {};
                        _tmp1 = {};
                        rootSchema = _object_spread_props(_object_spread(_tmp, _rootSchema), (_tmp1.name = _ROOT_SCHEMA_NAME, _tmp1));
                        rejectMeta = [];
                        needBreak = false;
                        getValueByName = function(name) {
                            return getNamePathValue(values, name);
                        };
                        return [
                            4,
                            checkSchema(rootSchema, [])
                        ];
                    case 1:
                        _state.sent();
                        return [
                            2,
                            rejectMeta.length ? rejectMeta : null
                        ];
                }
            });
        });
        return function(values, extraMeta) {
            return _ref.apply(this, arguments);
        };
    }();
}
