function isUrl(url) {
    return /^((https?|ftp|git|ws):\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/.test(url);
}
export var urlValidatorKey = "VerifyUrl";
/**
 * 是否为有效url
 * */ export var url = function() {
    var urlValidator = function(param) {
        var value = param.value, config = param.config;
        if (!isUrl(value)) return config.languagePack.url;
    };
    urlValidator.key = urlValidatorKey;
    return urlValidator;
};
