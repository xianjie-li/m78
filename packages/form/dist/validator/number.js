import { isInt, isNumber, isWeakNumber } from "@m78/utils";
export var numberValidatorKey = "VerifyNumber";
/**
 * 数字验证器
 * */ export var number = function(option) {
    var numberValidator = function(param) {
        var value = param.value, config = param.config;
        var pack = config.languagePack.number;
        var checker = (option === null || option === void 0 ? void 0 : option.allowNumberString) ? isWeakNumber : isNumber;
        if (!checker(value)) return {
            errorTemplate: pack.notExpected,
            interpolateValues: option || {}
        };
        if (!option) return;
        // 确保后续操作为数值
        var numValue = parseFloat(value);
        if (option.integer && !isInt(numValue)) return {
            errorTemplate: pack.notInteger,
            interpolateValues: option
        };
        if (isNumber(option.size) && numValue !== option.size) return {
            errorTemplate: pack.size,
            interpolateValues: option
        };
        if (isNumber(option.max) && numValue > option.max) return {
            errorTemplate: pack.max,
            interpolateValues: option
        };
        if (isNumber(option.min) && numValue < option.min) return {
            errorTemplate: pack.min,
            interpolateValues: option
        };
    };
    numberValidator.key = numberValidatorKey;
    return numberValidator;
};
