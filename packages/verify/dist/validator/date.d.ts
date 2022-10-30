import { Validator } from "../types";
interface Opt {
    /** 不大于此时间, 传入值为任何能被解析的时间(Date对象、时间戳、日期字符串等) */
    max?: any;
    /** 不小于此时间, 传入值为任何能被解析的时间(Date对象、时间戳、日期字符串等) */
    min?: any;
    /** 必须为指定时间, 传入值为任何能被解析的时间(Date对象、时间戳、日期字符串等) */
    at?: any;
    /** 进行对比时, 忽略时间值 */
    ignoreTime?: any;
}
export declare const dateValidatorKey = "verifyDate";
/**
 * 必须是有效的日期对象或能被解析的日期值(时间戳、日期字符串等)
 * - 进行时间对比时, 如果日期值未指定时间, 会使用Date对象默认的时间, 比如 new Date('2022-05-05') 默认时间为8点: Thu May 05 2022 08:00:00 GMT+0800 (中国标准时间)
 * 由于此原因, 进行时间对比时, 如果 max/min/at/对比的value 任意一个包含时间, 则必须每一项都包含时间.
 * 也可以传入ignoreTime来忽略每个日期值的时间
 * */
export declare const date: (option?: Opt) => Validator;
export {};
//# sourceMappingURL=date.d.ts.map