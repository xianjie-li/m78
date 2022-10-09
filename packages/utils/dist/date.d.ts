/**
 * Receive a date string, timestamp (ms), date object, and return it after converting it into a date object, or return null if the conversion fail
 *  */
export declare function parseDate(date: any): Date | null;
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
 */
export declare function formatDate(date?: Date, format?: string): string;
/**
 * get d day, h hour, m minute, s second, ms millisecond between the current time and the specified time. If the current time exceeds the incoming time, all return to '00' and timeOut is true
 * @param date - any time that can be parsed by parseDate()
 * @return count data
 */
export declare function getDateCountDown(date?: any): any;
/**
 * Whether the current time or the specified time is within a certain period of time
 * @param startDate - start time
 * @param endDate - end time
 * @param currentDate - mid time, default is now
 * @return - whether within a time period
 * */
export declare function isBetweenDate(startDate: any, endDate: any, currentDate: any): boolean;
//# sourceMappingURL=date.d.ts.map