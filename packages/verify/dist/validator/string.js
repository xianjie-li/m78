import { isNumber, isString } from "@m78/utils";
export var stringValidatorKey = "verifyString";
/**
 * string验证器
 * */ export var string = function(option) {
    var stringValidator = function(param) {
        var value = param.value, config = param.config;
        var pack = config.languagePack.string;
        if (!isString(value)) return {
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
    stringValidator.key = stringValidatorKey;
    return stringValidator;
};
