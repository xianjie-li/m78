import moment, { Moment } from 'moment';
import { DateLimiter, DatesProps, DateType, TimeLimiter, ShareMetas } from './type';
export declare const DATE_FORMAT_YEAR = "YYYY";
export declare const DATE_FORMAT_MONTH = "YYYY-MM";
export declare const DATE_FORMAT_DATE = "YYYY-MM-DD";
export declare const DATE_FORMAT_TIME = "HH:mm:ss";
export declare const DATE_FORMAT_DATE_TIME: string;
export declare const DATE_DEFAULT_PARSE: string[];
export declare const formatMap: {
    date: string;
    month: string;
    year: string;
    time: string;
};
export declare const placeholderMaps: {
    year: string;
    month: string;
    date: string;
    time: string;
};
/** 根据年、月获取用于显示的moment列表 */
export declare function getDates(year: number, month: number): moment.Moment[];
/** 根据年获取用于显示的月moment列表 */
export declare function getMonths(year: number): moment.Moment[];
/** 根据年获取与该年相邻的前4年和后7年和对应区间的可读字符 */
export declare function getYears(year: number): readonly [moment.Moment[], string];
/** 获取用于渲染的时间列表 */
export declare function getTimes(): {
    h: number[];
    m: number[];
    s: number[];
};
export declare function formatDate(m: Moment, format: string): string;
/** 将一个时间串 HH:mm:ss 以当前日期拼接为一个完整moment对象并返回 */
export declare function concatTimeToMoment(tStr: string): moment.Moment;
/** 用于将传入的DisabledTime/DisabledTime或数组组成严格化为数组并与内置处理器合并 */
export declare function disabledHandlerFormat<T>(handler?: Array<T> | T, builtIn?: Array<T>): Array<T> | undefined;
/** 接收DisabledTime或DisabledDate组成的数组并进行验证，如果有任意一个返回了true则返回true */
export declare function checkDisabled(handler: Array<DateLimiter> | Array<TimeLimiter>, ...args: any): boolean;
/** 决定了如何从value字符串中解析cValueMoment/endValueMoment */
export declare function parseValue({ value, type, props, self }: ShareMetas): void;
/** 根据大小屏切换选择器的展示方式 */
export declare function pickerTypeWrap(state: ShareMetas['state'], setState: ShareMetas['setState']): () => () => void;
/** 格式化value到input中用于显示 */
export declare const defaultFormat: NonNullable<DatesProps['format']>;
/** 预设的时间段 */
export declare const timePreset: {
    day: ({
        hour?: undefined;
        minute?: undefined;
        second?: undefined;
    } | {
        hour: number;
        minute: number;
        second: number;
    })[];
    morning: {
        hour: number;
    }[];
    midday: {
        hour: number;
    }[];
    afternoon: {
        hour: number;
    }[];
    evening: {
        hour: number;
    }[];
};
