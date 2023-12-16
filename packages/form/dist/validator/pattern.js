import { isRegExp, isString } from "@m78/utils";
export var patternValidatorKey = "VerifyPattern";
/**
 * 必须通过指定的正则校验, regexp可以是正则字符或正则对象
 * */ export var pattern = function(regexp, tpl) {
    var patternValidator = function(param) {
        var value = param.value, config = param.config;
        var reg = regexp;
        if (isString(reg)) {
            reg = new RegExp(reg);
        }
        if (!isRegExp(reg)) return;
        if (!reg.test(value)) {
            return {
                errorTemplate: tpl || config.languagePack.pattern,
                interpolateValues: {
                    regexp: reg.toString()
                }
            };
        }
    };
    patternValidator.key = patternValidatorKey;
    return patternValidator;
};
