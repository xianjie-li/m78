import { isFunction } from "@m78/utils";
export var fnValidatorKey = "verifyFn";
/**
 * 是否为function
 * */ export var fn = function() {
    var fnValidator = function(param) {
        var value = param.value, config = param.config;
        if (!isFunction(value)) return config.languagePack.fn;
    };
    fnValidator.key = fnValidatorKey;
    return fnValidator;
};
