import { isEmpty } from "@m78/utils";
export var requiredValidatorKey = "VerifyRequired";
/**
 * 是否是verify认定的空值
 * */ export var isVerifyEmpty = function(value) {
    if (isEmpty(value) && value !== 0 && value !== false) return true;
    return typeof value === "string" && value.trim() === "";
};
/**
 * 必需项，值不能为 undefined, null ,'', NaN, [], {}, 空白字符 中的任意一项
 * */ export var required = function() {
    var requiredValidator = function(param) {
        var isEmpty = param.isEmpty, config = param.config;
        var msg = config.languagePack.required;
        if (isEmpty) return msg;
    };
    requiredValidator.key = requiredValidatorKey;
    requiredValidator.checkEmpty = true;
    return requiredValidator;
};
