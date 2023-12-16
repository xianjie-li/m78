import { isArray, isNumber } from "@m78/utils";
export var arrayValidatorKey = "VerifyArray";
/**
 * 数组验证器
 * */ export var array = function(option) {
    var arrayValidator = function(param) {
        var value = param.value, config = param.config;
        var pack = config.languagePack.array;
        if (!isArray(value)) return {
            errorTemplate: pack.notExpected,
            interpolateValues: option || {}
        };
        if (!option) return;
        if (isNumber(option.length) && value.length !== option.length) return {
            errorTemplate: pack.length,
            interpolateValues: option
        };
        if (isNumber(option.max) && value.length > option.max) return {
            errorTemplate: pack.max,
            interpolateValues: option
        };
        if (isNumber(option.min) && value.length < option.min) return {
            errorTemplate: pack.min,
            interpolateValues: option
        };
    };
    arrayValidator.key = arrayValidatorKey;
    return arrayValidator;
};
