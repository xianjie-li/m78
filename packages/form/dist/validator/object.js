import { isObject } from "@m78/utils";
export var objectValidatorKey = "VerifyObject";
/**
 * 必须是严格的对象类型 [Object objcet], 如果是[Object regexp]等特殊内置对象则不会通过检测
 * */ export var object = function() {
    var objectValidator = function(param) {
        var value = param.value, config = param.config;
        if (!isObject(value)) return config.languagePack.object;
    };
    objectValidator.key = objectValidatorKey;
    return objectValidator;
};
