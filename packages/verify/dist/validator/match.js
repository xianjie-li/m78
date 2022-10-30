import { string } from "./string";
export var matchValidatorKey = "verifyMatch";
/**
 * 将字符串值与给的字符串或正则匹配, 如果字符串值包含给定的字符或正则模式则视为通过
 * */ export function match(keyword) {
    var matchValidator = function(meta) {
        var tpl = meta.config.languagePack.match;
        var e = string()(meta);
        if (e) return e;
        // 先进行字符匹配, 因为().会对匹配结果造成干扰, 字符不能匹配时 才走正则匹配
        if (meta.value.includes(keyword)) return;
        var reg = new RegExp(keyword);
        if (reg.test(meta.value)) return;
        return {
            errorTemplate: tpl,
            interpolateValues: {
                keyword: keyword
            }
        };
    };
    matchValidator.key = matchValidatorKey;
    return matchValidator;
}
