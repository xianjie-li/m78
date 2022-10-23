/**
 * Receive a date string, timestamp (ms), date object, and return it after converting it into a date object, or return null if the conversion fail
 *  */
export declare function parseDate(date: any): Date | null;
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
export declare function formatDate(date?: any, format?: string): string;
/**
 * get d day, h hour, m minute, s second, ms millisecond between the current time and the specified time. If the current time exceeds the incoming time, all return to '00' and timeOut is true
 * @param date - any time that can be parsed by parseDate()
 * @return count data
 */
export declare function getDateCountDown(date?: any): any;
/**
 * return true if date is between targetDate
 * */
export declare function isBetweenDate(opt: {
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
}): boolean;
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
export declare function isAfterDate(opt: IsAfterAndBeforeOption): boolean;
/**
 * return true if date is before targetDate
 * */
export declare function isBeforeDate(opt: IsAfterAndBeforeOption): boolean;
/**
 * create a time Reviser according to the specified time for revise the difference between local time and server time
 * */
export declare function createDateReviser(date: any): {
    /** argument date */
    date: Date;
    /** local date and arg date diff (ms) */
    diff: number;
    /** revised current date */
    getReviseCurrent(): Date;
    /** revise specify date */
    getReviseDate(d: any): Date;
};
//# sourceMappingURL=date.d.ts.map