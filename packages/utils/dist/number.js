import { isNumber, isWeakNumber } from "./is.js";
/**
 * 获取指定区间内的随机数(双开区间)
 * @param min - 最小值
 * @param max - 最大值
 * @return - 随机数
 *  */ export function getRandRange(min, max) {
    return Math.round((max - min) * Math.random() + min);
}
/**
 * 以指定精度锐化浮点数
 * @param num - 待处理的数字
 * @param precision - 1 | 精度
 * @return - 四舍五入到指定进度的小数
 * */ export function decimalPrecision(num) {
    var precision = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
    var mid = +"1".concat(Array.from({
        length: precision
    }).map(function() {
        return "0";
    }).join(""));
    return Math.round(num * mid) / mid;
}
/** 将一组数字或类数字相加、非数字视为0 */ export function sum() {
    for(var _len = arguments.length, nums = new Array(_len), _key = 0; _key < _len; _key++){
        nums[_key] = arguments[_key];
    }
    return nums.reduce(function(p, i) {
        return p + (isWeakNumber(i) ? Number(i) : 0);
    }, 0);
}
/** 将一组数字或类数字相减 */ export function subtract() {
    for(var _len = arguments.length, nums = new Array(_len), _key = 0; _key < _len; _key++){
        nums[_key] = arguments[_key];
    }
    return nums.reduce(function(p, i) {
        if (p === null) return i;
        if (!isWeakNumber(i)) return p;
        return p - i;
    }, null);
}
/** 将弱数字转为数字，数字会原样返回 */ export function weakNumber(arg) {
    return isWeakNumber(arg) ? Number(arg) : null;
}
/** 将数值限定到指定区间 */ export function clamp(val, min, max) {
    if (isNumber(min) && val < min) return min;
    if (isNumber(max) && val > max) return max;
    return val;
}
