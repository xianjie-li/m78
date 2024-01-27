var n = 0;
var charNum = 65;
var char = String.fromCharCode(charNum);
/** 获取相对该浏览器页签/node进程生命周期的唯一id */ export function createTempID() {
    var s = "".concat(char).concat(n);
    n++;
    if (n >= Number.MAX_VALUE) {
        charNum++;
        char = String.fromCharCode(charNum);
    }
    return s;
}
