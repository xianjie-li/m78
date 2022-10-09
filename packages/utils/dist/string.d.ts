/**
 * 替换html字符中的标签为指定字符
 * @param str - html文本
 * @param val - '' | 替换后的值
 * @return - 替换标签后的文本
 * */
export declare function replaceHtmlTags(str?: string, val?: string): string;
/**
 *  生成一段随机字符
 *  @param number - 随机串的长度倍数，默认1倍，随机字符长度为10为
 *  @return string
 *  */
export declare function createRandString(number?: number): string;
interface Byte2Text {
    (byte: number, conf?: {
        precision: number;
    }): string;
    KB: number;
    MB: number;
    GB: number;
    TB: number;
}
/**
 * 将字节转为适合人类阅读的字符串
 * @param byte - 待转换的字节
 * @param conf - 其他配置
 * @param conf.precision - 1 | 小数精度
 * @return - 用于展示的字符串
 * */
export declare const byte2text: Byte2Text;
/**
 * 以指定的模式通过转html文本高亮字符中的所有被匹配字符
 * @param str - 目标字符串
 * @param regExp - 可以被new RegExp()接收的正则字符串或正则表达式
 * @param conf - 其他配置
 * @param conf.color - '#F83D48' | 高亮颜色
 * @return - 附加了html高亮标签的字符串
 * @example
 console.log(heightLightMatchString('你好吗，我很好。', '好'));
 console.log(heightLightMatchString('你好吗，我很好。', /好/));

 // 以上使用均输出:
 // => 你<span style="color: #F83D48">好</span>吗，我很<span style="color: #F83D48">好</span>。
 * */
export declare function heightLightMatchString(str: string, regExp: string | RegExp, conf?: {
    color?: string;
}): string;
/** get string first part. like YYYY-MM-DD hh:mm:ss to YYYY-MM-DD */
export declare function getStringFirst(string?: string, separator?: string): string;
/** get string last part. like YYYY-MM-DD hh:mm:ss to hh:mm:ss */
export declare function getStringLast(string?: string, separator?: string): string;
export {};
//# sourceMappingURL=string.d.ts.map