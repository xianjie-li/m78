import { stringifyNamePath } from "@m78/utils";
export var equalityValidatorKey = "VerifyEquality";
/**
 * 必须与给定的name对应的值相等
 * */ export var equality = function(name, tpl) {
    var equalityValidator = function(param) {
        var value = param.value, config = param.config, getValueByName = param.getValueByName;
        if (getValueByName(name) !== value) return {
            errorTemplate: tpl || config.languagePack.equality,
            interpolateValues: {
                targetLabel: stringifyNamePath(name)
            }
        };
    };
    equalityValidator.key = equalityValidatorKey;
    return equalityValidator;
};
