import { padSingleNumber } from "./format.js";
import { DATE_TIME_FORMAT } from "./consts.js";
/**
 * Receive a date string, timestamp (ms), date object, and return it after converting it into a date object, or return null if the conversion fail
 *  */ export function parseDate(date) {
    var d = date;
    if (typeof date === "string") {
        d = date.replace(/-/g, "/"); // Safari无法解析 2020-01-01 格式的日期
    }
    d = new Date(d);
    // 处理Invalid Date
    if (d instanceof Date && isNaN(d.getTime())) {
        return null;
    }
    return d;
}
/**
 * format the date into readable date string, support Y | M | D | H | m | s
 * @param date - new Date() | any time(string/date object/timestamp etc.) that can be parsed by parseDate(), default current time
 * @param format - 'YYYY-MM-DD HH:mm:ss' | custom format
 * @return - formatted date string, if date is invalid, return an empty string
 * @example
 datetime(); // => 2020-06-01 18:45:57
 datetime('2020-06-01 15:30:30', 'hh时mm分 YYYY年MM月'); // => 15时30分 2020年06月
 datetime(1591008308782, 'YY年MM月DD日'); // => 21年06月01日
 datetime('1591008308782'); // => ''
 datetime('hello'); // => ''
 datetime(new Date()); // => 2020-06-01 18:46:39
 */ export function formatDate() {
    var date = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : new Date(), format = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : DATE_TIME_FORMAT;
    var d = parseDate(date);
    if (!d) {
        return "";
    }
    var fn = function(d) {
        return ("0" + d).slice(-2);
    };
    var formats = {
        YY: String(d.getFullYear() + 1).slice(2),
        YYYY: d.getFullYear(),
        MM: fn(d.getMonth() + 1),
        DD: fn(d.getDate()),
        HH: fn(d.getHours()),
        mm: fn(d.getMinutes()),
        ss: fn(d.getSeconds())
    };
    return format.replace(/([a-z])\1+/gi, function(a) {
        return formats[a] || a;
    });
}
var oneMS = 100;
var oneS = oneMS * 10;
var oneM = 60 * oneS;
var oneH = 60 * oneM;
var oneD = 24 * oneH;
/**
 * get d day, h hour, m minute, s second, ms millisecond between the current time and the specified time. If the current time exceeds the incoming time, all return to '00' and timeOut is true
 * @param date - any time that can be parsed by parseDate()
 * @return count data
 */ export function getDateCountDown(date) {
    var dt = parseDate(date);
    if (!dt) {
        return {
            ms: "00",
            s: "00",
            m: "00",
            h: "00",
            d: "00",
            timeOut: true
        };
    }
    var start = Date.now();
    var end = dt.getTime();
    var diff = end - start;
    if (diff < 0) {
        return getDateCountDown();
    }
    var fr = Math.floor;
    // h、m、s 用单位总数取余就是该单位对应的ms，除单位总数获得单位
    var d = fr(diff / oneD);
    var h = fr(diff % oneD / oneH);
    var m = fr(diff % oneH / oneM);
    var s = fr(diff % oneM / oneS);
    var ms = fr(diff % oneMS);
    return {
        d: padSingleNumber(d),
        h: padSingleNumber(h),
        m: padSingleNumber(m),
        s: padSingleNumber(s),
        ms: padSingleNumber(ms),
        timeOut: false
    };
}
/**
 * Whether the current time or the specified time is within a certain period of time
 * @param startDate - start time
 * @param endDate - end time
 * @param currentDate - mid time, default is now
 * @return - whether within a time period
 * */ export function isBetweenDate(startDate, endDate, currentDate) {
    var s = parseDate(startDate);
    var e = parseDate(endDate);
    if (!s || !e) return false;
    if (currentDate) {
        var c = parseDate(currentDate);
        if (!c) return false;
        return c <= e && c >= s;
    }
    var c1 = new Date();
    return c1 <= e && c1 >= s;
}
