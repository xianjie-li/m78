import { isRegExp } from "@m78/utils";
export var regexpValidatorKey = "verifyRegexp";
/**
 * 是否为Regexp
 * */ export var regexp = function() {
    var regexpValidator = function(param) {
        var value = param.value, config = param.config;
        if (!isRegExp(value)) return config.languagePack.regexp;
    };
    regexpValidator.key = regexpValidatorKey;
    return regexpValidator;
};
