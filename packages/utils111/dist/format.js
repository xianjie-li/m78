import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { isTruthyOrZero } from "./is.js";
/**
 * 将小于10且大于0的数字转为填充0的字符 如 '01' '05', 小于1的数字始终返回'00'
 * @param {number} number
 */ export function padSingleNumber(number) {
    if (number < 1) {
        return "00";
    }
    if (number < 10) {
        return "0" + String(number);
    }
    return String(number);
}
/* 以指定规则格式化字符 */ export var validateFormatString = /^(\s?\d\s?,?)+$/;
var defaultConfig = {
    delimiter: " ",
    repeat: false,
    lastRepeat: false,
    reverse: false
};
function getPatterns(str, pattern) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var ref = _object_spread({}, defaultConfig, options), repeat = ref.repeat, lastRepeat = ref.lastRepeat, reverse = ref.reverse;
    if (!validateFormatString.test(pattern)) {
        console.warn("invalid pattern: ".concat(pattern, ", must match the /^[\\s?\\d\\s?,?]+$/ rule"));
        return;
    }
    // 生成模式数组
    var patterns = pattern.split(",").map(function(p) {
        return p.trim();
    }).filter(function(p) {
        return !!p;
    });
    if (!patterns.length) return;
    // 字符转为数组方便操作
    var strArr = reverse ? str.split("").reverse() : str.split("");
    // repeat处理
    if (repeat || lastRepeat) {
        // 传入模式能匹配到的最大长度
        var maxLength = patterns.reduce(function(prevIndex, index) {
            return prevIndex + Number(index);
        }, 0);
        // 需要额外填充的模式长度
        var fillLength;
        // 模式组最后一位，用于lastRepeat
        var lastPatter = Number(patterns[patterns.length - 1]);
        if (repeat) {
            // (字符长度 - 最大匹配长度) / 最大匹配长度
            fillLength = Math.ceil((strArr.length - maxLength) / maxLength);
        }
        if (lastRepeat) {
            // (字符长度 - 最大匹配长度) / 最后一位匹配符能匹配的长度
            fillLength = Math.ceil((strArr.length - maxLength) / lastPatter);
        }
        var originArr = lastRepeat ? [
            lastPatter
        ] : _to_consumable_array(patterns);
        Array.from({
            length: fillLength
        }).forEach(function() {
            patterns = _to_consumable_array(patterns).concat(_to_consumable_array(originArr));
        });
    }
    return {
        patterns: patterns,
        strArr: strArr
    };
}
/**
 * 根据传入的模式对字符进行格式化
 * @param str {string} - 需要进行格式化的字符
 * @param pattern {string} - 格式为 `1,2,3,4` 规则的模式字符，数字两端可包含空格
 * @param options - 配置对象
 */ export function formatString(str, pattern) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var opt = _object_spread({}, defaultConfig, options);
    var patternMeta = getPatterns(str, pattern, opt);
    if (!patternMeta) return;
    var patterns = patternMeta.patterns, strArr = patternMeta.strArr;
    patterns.reduce(function(prevPattern, _pattern, ind) {
        var currentIndex = prevPattern + Number(_pattern);
        // 替换位置为 前面所有pattern + 当前pattern + 已匹配次数
        var replaceIndex = currentIndex + ind;
        if (replaceIndex < strArr.length) {
            strArr.splice(replaceIndex, 0, opt.delimiter);
        }
        return currentIndex;
    }, 0);
    return opt.reverse ? strArr.reverse().join("") : strArr.join("");
}
/**
 * 对被`format()`过的字符进行反格式化, 除了str, 其他参数必须与执行`format()`时传入的一致
 * @param str {string} - 需要进行反格式化的字符
 * @param pattern {string} - 格式为 `1,2,3,4` 规则的模式字符，数字两端可包含空格
 * @param options - 配置对象
 */ export function unFormatString(str, pattern) {
    var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var opt = _object_spread({}, defaultConfig, options);
    var delimiter = opt.delimiter;
    var patternMeta = getPatterns(str, pattern, opt);
    if (!patternMeta) return;
    var patterns = patternMeta.patterns, strArr = patternMeta.strArr;
    patterns.reduce(function(prev, pt) {
        var index = Number(pt) + prev;
        /* 只在字符首位匹配时才执行替换, 在某些场景会有用（fr的input处理双向绑定时） */ if (strArr[index] === delimiter[0]) {
            strArr.splice(index, delimiter.length);
        }
        return index;
    }, 0);
    return opt.reverse ? strArr.reverse().join("") : strArr.join("");
}
/** 返回入参中第一个truthy值或0, 用于代替 xx || xx2 || xx3 */ export function getFirstTruthyOrZero() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var arg = _step.value;
            if (isTruthyOrZero(arg)) {
                return arg;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return false;
}
/** 当左边的值不为truthy或0时，返回feedback */ export function vie(arg) {
    var feedback = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "-";
    return isTruthyOrZero(arg) ? arg : feedback;
}
