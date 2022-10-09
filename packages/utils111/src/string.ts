/**
 * 替换html字符中的标签为指定字符
 * @param str - html文本
 * @param val - '' | 替换后的值
 * @return - 替换标签后的文本
 * */
export function replaceHtmlTags(str = "", val = "") {
  const reg = /(<\/?.+?\/?>|&nbsp;|&mdash;)/g;
  return str.replace(reg, val);
}

/**
 *  生成一段随机字符
 *  @param number - 随机串的长度倍数，默认1倍，随机字符长度为10为
 *  @return string
 *  */
export function createRandString(number = 1): string {
  return Array.from({ length: number }).reduce((prev) => {
    return prev + Math.random().toString(36).slice(2);
  }, "") as string;
}

interface Byte2Text {
  (byte: number, conf?: { precision: number }): string;

  KB: number;
  MB: number;
  GB: number;
  TB: number;
}

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;
const TB = GB * 1024;
const byte2textDefaultConfig = {
  precision: 1,
};

/**
 * 将字节转为适合人类阅读的字符串
 * @param byte - 待转换的字节
 * @param conf - 其他配置
 * @param conf.precision - 1 | 小数精度
 * @return - 用于展示的字符串
 * */
export const byte2text: Byte2Text = (byte, conf) => {
  const cf = {
    ...byte2textDefaultConfig,
    ...conf,
  };

  let s = "";

  if (byte >= TB) {
    s = `${(byte / TB).toFixed(cf.precision)}T`;
  } else if (byte >= GB) {
    s = `${(byte / GB).toFixed(cf.precision)}G`;
  } else if (byte >= MB) {
    s = `${(byte / MB).toFixed(cf.precision)}M`;
  } else {
    s = `${(byte / KB).toFixed(cf.precision)}K`;
  }

  return s;
};

byte2text.KB = KB;
byte2text.MB = MB;
byte2text.GB = GB;
byte2text.TB = TB;

const heightLightMatchStringDefaultConf = {
  color: "#F83D48",
};

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
export function heightLightMatchString(
  str: string,
  regExp: string | RegExp,
  conf?: { color?: string }
) {
  if (!str || !regExp) return str || "";
  const cf = {
    ...heightLightMatchStringDefaultConf,
    ...conf,
  };

  const reg = new RegExp(regExp, "g");

  return str.replace(reg, (s) => {
    return `<span style="color: ${cf.color}">${s}</span>`;
  });
}

/** get string first part. like YYYY-MM-DD hh:mm:ss to YYYY-MM-DD */
export function getStringFirst(string = "", separator = " ") {
  if (!string) return "";
  return string.split(separator)[0];
}

/** get string last part. like YYYY-MM-DD hh:mm:ss to hh:mm:ss */
export function getStringLast(string = "", separator = " ") {
  if (!string) return "";
  const ls = string.split(separator);
  return ls[ls.length - 1];
}
