import { isBoolean } from "@m78/utils";
export var boolValidatorKey = "VerifyBool";
/**
 * 是否为boolean值
 * */ export var bool = function() {
    var boolValidator = function(param) {
        var value = param.value, config = param.config;
        if (!isBoolean(value)) return config.languagePack.bool;
    };
    boolValidator.key = boolValidatorKey;
    return boolValidator;
};
