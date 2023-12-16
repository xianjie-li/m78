export var withoutValidatorKey = "verifyWithout";
/**
 * 值必须不在给定列表中, 建议仅用于基础类型
 * */ export var without = function(list) {
    var withoutValidator = function(param) {
        var value = param.value, config = param.config;
        if (list.includes(value)) return {
            errorTemplate: config.languagePack.without,
            interpolateValues: {
                without: list.join(", ")
            }
        };
    };
    withoutValidator.key = withoutValidatorKey;
    return withoutValidator;
};
