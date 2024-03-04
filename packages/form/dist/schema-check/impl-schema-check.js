// 静态schema验证相关逻辑
import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { getNamePathValue, interpolate, isFunction, isString, stringifyNamePath } from "@m78/utils";
import { isVerifyEmpty } from "../validator/index.js";
import { _fmtValidator, _getExtraKeys, _isErrorTemplateInterpolate } from "./common.js";
/** 实现静态的schema check */ export function _implSchemaCheck(ctx) {
    var config = ctx.config;
    ctx.schemaCheck = function() {
        var _ref = _async_to_generator(function(values, rootSchema, extraMeta) {
            var rejectMeta, needBreak, getValueByName;
            function checkSchema(_schema, parentNamePath, isRootSchema) {
                return _checkSchema.apply(this, arguments);
            }
            function _checkSchema() {
                _checkSchema = // 对一项schema执行检测, 返回true时可按需跳过后续schema的验证
                // 如果传入parentNames，会将当前项作为指向并将parentNames与当前name拼接
                _async_to_generator(function(_schema, parentNamePath, isRootSchema) {
                    var _schema_schemas, schema, namePath, value, nameStr, label, isEmpty, validators, interpolateValues, currentPass, meta, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, validator, errorTemplate, result, err, err1, extraKeys, template;
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                if (!isRootSchema && !("name" in _schema)) return [
                                    2
                                ];
                                schema = _schema;
                                namePath = isRootSchema ? [] : _to_consumable_array(parentNamePath).concat([
                                    schema.name
                                ]);
                                value = isRootSchema ? values : getValueByName(namePath);
                                nameStr = isRootSchema ? "[]" : stringifyNamePath(namePath);
                                label = schema.label || nameStr;
                                // 预转换值
                                if (schema.transform) value = schema.transform(value);
                                isEmpty = isVerifyEmpty(value);
                                validators = _fmtValidator(schema.validator, isEmpty);
                                // 基础插值对象
                                interpolateValues = {
                                    name: nameStr,
                                    label: label,
                                    value: value,
                                    type: Object.prototype.toString.call(value)
                                };
                                // 当前schema是否通过验证, 未通过时其子级验证器不进行验证
                                currentPass = true;
                                meta = _object_spread({
                                    name: nameStr,
                                    namePath: namePath,
                                    label: label,
                                    value: value,
                                    values: values,
                                    schema: schema,
                                    rootSchema: rootSchema,
                                    isEmpty: isEmpty,
                                    parentNamePath: parentNamePath,
                                    getValueByName: getValueByName,
                                    config: config
                                }, extraMeta /* 扩展接口 */ );
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
                                if (isString(errorTemplate) && !!errorTemplate.trim()) {
                                    rejectMeta.push(_object_spread_props(_object_spread({}, meta), {
                                        message: interpolate(errorTemplate, interpolateValues)
                                    }));
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
                                if (!((_schema_schemas = schema.schemas) === null || _schema_schemas === void 0 ? void 0 : _schema_schemas.length)) return [
                                    3,
                                    13
                                ];
                                return [
                                    4,
                                    checkSchemas(schema.schemas, namePath.slice())
                                ];
                            case 12:
                                _state.sent();
                                _state.label = 13;
                            case 13:
                                return [
                                    2
                                ];
                        }
                    });
                // 经过schemaSpecialPropsHandle处理后, schema不会有eachSchema
                // if (schema.eachSchema) {}
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
                        // 验证器错误
                        rejectMeta = [];
                        // 为true时, 中断后续验证
                        needBreak = false;
                        getValueByName = function(name) {
                            return getNamePathValue(values, name);
                        };
                        return [
                            4,
                            checkSchema(rootSchema, [], true)
                        ];
                    case 1:
                        _state.sent();
                        if (rejectMeta.length) return [
                            2,
                            [
                                rejectMeta,
                                null
                            ]
                        ];
                        return [
                            2,
                            [
                                null,
                                values
                            ]
                        ];
                }
            });
        });
        return function(values, rootSchema, extraMeta) {
            return _ref.apply(this, arguments);
        };
    }();
}
