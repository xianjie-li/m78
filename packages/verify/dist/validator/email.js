function isEmail(email) {
    return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email);
}
export var emailValidatorKey = "verifyEmail";
/**
 * 是否为有效email
 * */ export var email = function() {
    var emailValidator = function(param) {
        var value = param.value, config = param.config;
        if (!isEmail(value)) return config.languagePack.email;
    };
    emailValidator.key = emailValidatorKey;
    return emailValidator;
};
