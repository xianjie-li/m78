import { array } from "./array.js";
export var ListValidatorType;
(function(ListValidatorType) {
    ListValidatorType["contain"] = "contain";
    ListValidatorType["equal"] = "equal";
})(ListValidatorType || (ListValidatorType = {}));
export var listValidatorKey = "VerifyList";
/**
 * 检测两个集合的覆盖类型, 比如数组值是否包含另list中的所有项, 是否与list完全相等
 * */ export function list(opt) {
    var listValidator = function(meta) {
        var tpl = meta.config.languagePack.list;
        var e = array()(meta);
        if (e) return e;
        var ls = opt.collector ? meta.value.map(opt.collector) : meta.value;
        var miss = opt.list.filter(function(i) {
            return ls.indexOf(i) === -1;
        });
        if (opt.type === ListValidatorType.contain) {
            if (miss.length) {
                return {
                    errorTemplate: tpl.miss,
                    interpolateValues: {
                        miss: miss
                    }
                };
            }
        }
        if (opt.type === ListValidatorType.equal) {
            if (ls.length !== opt.list.length) {
                return tpl.diffLength;
            }
            // 长度相等的情况下, 只会少于不会多于
            if (miss.length) {
                return {
                    errorTemplate: tpl.miss,
                    interpolateValues: {
                        miss: miss
                    }
                };
            }
        }
    };
    listValidator.key = listValidatorKey;
    return listValidator;
}
