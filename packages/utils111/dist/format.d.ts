/**
 * 将小于10且大于0的数字转为填充0的字符 如 '01' '05', 小于1的数字始终返回'00'
 * @param {number} number
 */
export declare function padSingleNumber(number: number): string;
export declare const validateFormatString: RegExp;
interface FormatStringOption {
    /** ' ' | 分隔符 */
    delimiter?: string;
    /** false | 当字符长度超过pattern可匹配到的长度时，重复以当前pattern对剩余字符进行格式化 */
    repeat?: boolean;
    /** false | 当字符长度超过pattern可匹配到的长度时，重复以当前pattern的最后一位对剩余字符进行格式化 */
    lastRepeat?: boolean;
    /** false | 反转字符串后再进行操作 */
    reverse?: boolean;
}
/**
 * 根据传入的模式对字符进行格式化
 * @param str {string} - 需要进行格式化的字符
 * @param pattern {string} - 格式为 `1,2,3,4` 规则的模式字符，数字两端可包含空格
 * @param options - 配置对象
 */
export declare function formatString(str: any, pattern: any, options?: {}): any;
/**
 * 对被`format()`过的字符进行反格式化, 除了str, 其他参数必须与执行`format()`时传入的一致
 * @param str {string} - 需要进行反格式化的字符
 * @param pattern {string} - 格式为 `1,2,3,4` 规则的模式字符，数字两端可包含空格
 * @param options - 配置对象
 */
export declare function unFormatString(str: string, pattern: string, options?: FormatStringOption): any;
/** 返回入参中第一个truthy值或0, 用于代替 xx || xx2 || xx3 */
export declare function getFirstTruthyOrZero(...args: any[]): any;
/** 当左边的值不为truthy或0时，返回feedback */
export declare function vie(arg: any, feedback?: string): any;
export {};
//# sourceMappingURL=format.d.ts.map