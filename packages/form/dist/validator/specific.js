export var specificValidatorKey = "VerifySpecific";
/**
 * 是否为指定的值, 只能是通过Object.is对比的常规值
 * */ export var specific = function(val) {
    var specificValidator = function(param) {
        var value = param.value, config = param.config;
        if (val !== value) return {
            errorTemplate: config.languagePack.specific,
            interpolateValues: {
                specific: val
            }
        };
    };
    specificValidator.key = specificValidatorKey;
    return specificValidator;
};
