import { AnyFunction } from "./common-type";
declare type Primitive = null | undefined | boolean | number | string | symbol;
/**
 * 获取表示对象原始类型的字符串
 * @param {*} o - 需要查询的字符
 *  @returns {string}
 * */
export declare function getProtoStr(o: any): string;
/** 检测是否为数组 */
export declare function isArray(arg: any): arg is any[];
/** 数值且包含至少一项 */
export declare function isTruthyArray<T = any>(arg: any): arg is T[];
/**
 * 检测是否为数字且非NAN
 * @param {*} arg - 需待查询的对象
 * @returns {boolean}
 * */
export declare function isNumber(arg: any): arg is number;
export declare function isWeakNumber(arg: any): boolean;
/** 检测是否为字符串  */
export declare function isString(arg: any): arg is string;
/** 检测是否为整数 */
export declare function isInt(value: any): value is number;
/**
 * 检测是否为symbol
 * @param {*} arg - 需待查询的对象
 * @returns {boolean}
 * */
export declare function isSymbol(arg: any): arg is symbol;
/** 检测是不是原始类型, null、string、boolean、number、symbol、undefined */
export declare function isPrimitive(arg: any): arg is Primitive;
/**
 * 检测是否为Error对象
 * @param {*} e - 需待查询的对象
 * @returns {boolean}
 * */
export declare function isError(e: any): e is Error;
/**
 * 检测是否为对象
 * @param {*} arg - 需待查询的对象
 * @returns {boolean}
 * */
export declare function isObject(arg: any): arg is Object;
/**
 * 检测是否为DOM
 * @param {*} o - 需待查询的对象
 * @returns {boolean}
 * */
export declare function isDom(o: any): o is Node;
/**
 * 检测是否为正则
 * @param {*} arg - 需待查询的对象
 * @returns {boolean}
 * */
export declare function isRegExp(arg: any): arg is RegExp;
/**
 * 检测是否为数组
 * @param {*} arg - 需待查询的对象
 * @returns {boolean}
 * */
export declare function isFunction(arg: any): arg is AnyFunction;
/** 检测是否为日期对象 */
export declare function isDate(d: any): d is Date;
/** 检测是否为布尔值 */
export declare function isBoolean(arg: any): arg is boolean;
/** 检测是否为Null */
export declare function isNull(arg: any): arg is null;
/** 检测是否为undefined */
export declare function isUndefined(arg: any): arg is undefined;
/** 检测是否为null/undefined  */
export declare function isNullOrUndefined(arg: any): arg is null | undefined;
/** 检测传入对象是否为: undefined、null、''、NaN */
export declare function isTrueEmpty(obj: any): boolean;
export declare function isEmpty(obj: any): boolean;
/** 如果入参为truthy或0则返回true，否则返回false */
export declare function isTruthyOrZero(arg: any): boolean;
export {};
//# sourceMappingURL=is.d.ts.map