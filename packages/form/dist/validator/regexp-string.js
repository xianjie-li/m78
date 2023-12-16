import { isRegExp, isString } from "@m78/utils";
export var regexpStringValidatorKey = "VerifyRegexpString";
/**
 * 是否为有效的Regexp字符或RegExp
 * */ export var regexpString = function() {
    var regexpStringValidator = function(param) {
        var value = param.value, config = param.config;
        if (!isString(value)) return config.languagePack.regexpString;
        if (!isRegExp(new RegExp(value))) return config.languagePack.regexpString;
    };
    regexpStringValidator.key = regexpStringValidatorKey;
    return regexpStringValidator;
};
