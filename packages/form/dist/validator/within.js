export var withinValidatorKey = "verifyWithin";
/**
 * 值必须在给定列表中, 建议仅用于基础类型
 * */ export var within = function(list) {
    var withinValidator = function(param) {
        var value = param.value, config = param.config;
        if (!list.includes(value)) return {
            errorTemplate: config.languagePack.within,
            interpolateValues: {
                within: list.join(", ")
            }
        };
    };
    withinValidator.key = withinValidatorKey;
    return withinValidator;
};
