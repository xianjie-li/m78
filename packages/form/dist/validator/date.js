import { formatDate, parseDate } from "@m78/utils";
export var dateValidatorKey = "VerifyDate";
/**
 * 必须是有效的日期对象或能被解析的日期值(时间戳、日期字符串等)
 * - 进行时间对比时, 如果日期值未指定时间, 会使用Date对象默认的时间, 比如 new Date('2022-05-05') 默认时间为8点: Thu May 05 2022 08:00:00 GMT+0800 (中国标准时间)
 * 由于此原因, 进行时间对比时, 如果 max/min/at/对比的value 任意一个包含时间, 则必须每一项都包含时间.
 * 也可以传入ignoreTime来忽略每个日期值的时间
 * */ export var date = function(option) {
    var dateValidator = function(param) {
        var value = param.value, config = param.config;
        var pack = config.languagePack.date;
        var d = parseDate(value);
        if (d === null) return {
            errorTemplate: pack.notExpected,
            interpolateValues: option || {}
        };
        if (!option) return;
        var at = parseDate(option.at);
        var max = parseDate(option.max);
        var min = parseDate(option.min);
        if (option.ignoreTime) {
            d.setHours(0, 0, 0, 0);
            at !== null && at.setHours(0, 0, 0, 0);
            max !== null && max.setHours(0, 0, 0, 0);
            min !== null && min.setHours(0, 0, 0, 0);
        }
        var interpolateValues = {
            at: formatDate(at) || at,
            max: formatDate(max) || max,
            min: formatDate(min) || min
        };
        if (at !== null && d.getTime() !== at.getTime()) return {
            errorTemplate: pack.at,
            interpolateValues: interpolateValues
        };
        if (max !== null && min !== null && (d.getTime() > max.getTime() || d.getTime() < min.getTime())) {
            return {
                errorTemplate: pack.between,
                interpolateValues: interpolateValues
            };
        }
        if (max !== null && d.getTime() > max.getTime()) return {
            errorTemplate: pack.max,
            interpolateValues: interpolateValues
        };
        if (min !== null && d.getTime() < min.getTime()) return {
            errorTemplate: pack.min,
            interpolateValues: interpolateValues
        };
    };
    dateValidator.key = dateValidatorKey;
    return dateValidator;
};
