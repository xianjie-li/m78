import { isSymbol } from "@m78/utils";
export var symbolValidatorKey = "VerifySymbol";
/**
 * 是否为symbol
 * */ export var symbol = function() {
    var symbolValidator = function(param) {
        var value = param.value, config = param.config;
        if (!isSymbol(value)) return config.languagePack.symbol;
    };
    symbolValidator.key = symbolValidatorKey;
    return symbolValidator;
};
