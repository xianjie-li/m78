import { isNumber } from "@m78/utils";
export var _number = function(param) {
    var str = param.str;
    if (str === "-") return str;
    var num = Number(str);
    if (isNaN(num)) return false;
    return str;
};
export var _integer = function(param) {
    var str = param.str;
    var ind = str.indexOf(".");
    if (ind !== -1) return false;
    return str;
};
export var _positive = function(param) {
    var str = param.str;
    var ind = str.indexOf("-");
    if (ind !== -1) return false;
    return str;
};
export var _numberRange = function(param) {
    var str = param.str, props = param.props;
    var num = Number(str);
    if (isNaN(num)) return str;
    if (isNumber(props.min) && num < props.min) {
        return String(props.min);
    }
    if (isNumber(props.max) && num > props.max) {
        return String(props.max);
    }
    return str;
};
