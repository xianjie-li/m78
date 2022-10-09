import { padSingleNumber } from "./format.js";
import { DATE_TIME_FORMAT } from "./consts.js";
import { throwError } from "./lang.js";

/**
 * Receive a date string, timestamp (ms), date object, and return it after converting it into a date object, or return null if the conversion fail
 *  */
export function parseDate(date: any): Date | null {
  let d = date;
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
 * format the date into readable date string, support YY | YYYY | MM | DD | HH | mm | ss
 * @param date - new Date() | any time val (string/date object/timestamp etc.) that can be parsed by parseDate(), default current time
 * @param format - 'YYYY-MM-DD HH:mm:ss' | custom format
 * @return - formatted date string, if date is invalid, return an empty string
 * @example
 datetime(); // => 2020-06-01 18:45:57
 datetime('2020-06-01 15:30:30', 'hh时mm分 YYYY年MM月'); // => 15时30分 2020年06月
 datetime(1591008308782, 'YY年MM月DD日'); // => 21年06月01日
 datetime('1591008308782'); // => ''
 datetime('hello'); // => ''
 datetime(new Date()); // => 2020-06-01 18:46:39
 */
export function formatDate(date: any = new Date(), format = DATE_TIME_FORMAT) {
  const d = parseDate(date);

  if (!d) {
    return "";
  }

  const fn = (d) => {
    return ("0" + d).slice(-2);
  };

  const formats = {
    YY: String(d.getFullYear() + 1).slice(2),
    YYYY: d.getFullYear(),
    MM: fn(d.getMonth() + 1),
    DD: fn(d.getDate()),
    HH: fn(d.getHours()),
    mm: fn(d.getMinutes()),
    ss: fn(d.getSeconds()),
  };

  return format.replace(/([a-z])\1+/gi, (a) => {
    return formats[a] || a;
  });
}

const oneMS = 100;
const oneS = oneMS * 10;
const oneM = 60 * oneS;
const oneH = 60 * oneM;
const oneD = 24 * oneH;

/**
 * get d day, h hour, m minute, s second, ms millisecond between the current time and the specified time. If the current time exceeds the incoming time, all return to '00' and timeOut is true
 * @param date - any time that can be parsed by parseDate()
 * @return count data
 */
export function getDateCountDown(date?: any) {
  const dt = parseDate(date);

  if (!dt) {
    return {
      ms: "00",
      s: "00",
      m: "00",
      h: "00",
      d: "00",
      timeOut: true,
    };
  }

  const start = Date.now();
  const end = dt.getTime();

  const diff = end - start;

  if (diff < 0) {
    return getDateCountDown();
  }

  const fr = Math.floor;

  // h、m、s 用单位总数取余就是该单位对应的ms，除单位总数获得单位
  const d = fr(diff / oneD);
  const h = fr((diff % oneD) / oneH);
  const m = fr((diff % oneH) / oneM);
  const s = fr((diff % oneM) / oneS);
  const ms = fr(diff % oneMS);

  return {
    d: padSingleNumber(d),
    h: padSingleNumber(h),
    m: padSingleNumber(m),
    s: padSingleNumber(s),
    ms: padSingleNumber(ms),
    timeOut: false,
  };
}

/**
 * return true if date is between targetDate
 * */
export function isBetweenDate(opt: {
  /** start time, default current, receive all time formats supported by parseDate() */
  startDate: any;
  /** end time, default current, receive all time formats supported by parseDate() */
  endDate: any;
  /** target time, default current, receive all time formats supported by parseDate() */
  targetDate: any;
  /** true | include startDate = targetDate  */
  startSame?: boolean;
  /** true | include endDate = targetDate */
  endSame?: boolean;
}) {
  const { startSame = true, endSame = true } = opt;

  const s = parseDate(opt.startDate);
  const e = parseDate(opt.endDate);
  const t = parseDate(opt.targetDate) || new Date();

  if (!s || !e) return false;

  const start = s.getTime();
  const end = e.getTime();
  const target = t.getTime();

  if (startSame && endSame) {
    return target <= end && target >= start;
  }

  if (!startSame && !endSame) {
    return target < end && target > start;
  }

  if (startSame) {
    return target < end && target >= start;
  } else {
    return target <= end && target > start;
  }
}

export interface IsAfterAndBeforeOption {
  /** time to be comparing, receive all time formats supported by parseDate() */
  date: any;
  /** target time, default current, receive all time formats supported by parseDate() */
  targetDate?: any;
  /** when date = targetDate, return true */
  same?: boolean;
}

/**
 * return true if date is after targetDate
 * */
export function isAfterDate(opt: IsAfterAndBeforeOption): boolean {
  return isAfterOrBeforeHelper(opt);
}

/**
 * return true if date is before targetDate
 * */
export function isBeforeDate(opt: IsAfterAndBeforeOption): boolean {
  return isAfterOrBeforeHelper(opt, true);
}

/**
 * create a time Reviser according to the specified time for revise the difference between local time and server time
 * */
export function createDateReviser(date: any) {
  const d = parseDate(date);

  if (!d) {
    throwError(`${date} cannot be safety covert to Date`);
  }

  const diff = d.getTime() - new Date().getTime();

  return {
    /** argument date */
    date: d,
    /** local date and arg date diff (ms) */
    diff,
    /** revised current date */
    getReviseCurrent() {
      return this.getReviseDate(new Date());
    },
    /** revise specify date */
    getReviseDate(d: any) {
      const _date = parseDate(d);
      if (!_date) {
        throwError(`${d} cannot be safety covert to Date`);
      }
      _date.setTime(_date.getTime() + diff);
      return _date;
    },
  };
}

/**
 * isAfterDate and isBeforeDate common logic
 * */
function isAfterOrBeforeHelper(
  opt: IsAfterAndBeforeOption,
  isBefore?: boolean
): boolean {
  const date = parseDate(opt.date);
  if (!date) return false;
  const targetDate = parseDate(opt.targetDate) || new Date();

  if (opt.same) {
    if (isBefore) return date.getTime() <= targetDate.getTime();
    return date.getTime() >= targetDate.getTime();
  }

  if (isBefore) return date.getTime() < targetDate.getTime();
  return date.getTime() > targetDate.getTime();
}
