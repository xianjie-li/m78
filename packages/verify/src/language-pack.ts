export const simplifiedChinese = {
  required: "不能为空",
  object: "必须为常规对象",
  bool: "必须为布尔值",
  fn: "必须为函数",
  symbol: "必须为symbol值",
  regexp: "必须为正则对象",
  regexpString: "必须为有效的正则字符",
  url: "必须为有效的url",
  email: "必须为有效的邮箱地址",
  // 额外插值: regexp
  pattern: "格式错误",
  // 额外插值: specific
  specific: "只能是 {specific}",
  // 额外插值: targetLabel
  equality: "必须与 {targetLabel} 相同",
  // 额外插值: within
  within: "必须为 {within} 中的一项",
  // 额外插值: without
  without: "必须是 {without} 以外的值",
  // 额外插值: max, min, length
  string: {
    notExpected: "必须为字符串",
    max: "长度不能大于 {max}",
    min: "长度不能小于 {min}",
    length: "长度只能是 {length}",
  },
  // 额外插值: max, min, length
  array: {
    notExpected: "必须为数组",
    max: "不能多于 {max} 项",
    min: "不能少于 {min} 项",
    length: "必须为 {length} 项",
  },
  // 额外插值: max, min, size
  number: {
    notExpected: "必须为数字",
    notInteger: "必须为整数",
    max: "不能大于 {max}",
    min: "不能小于 {min}",
    size: "必须为 {size}",
  },
  // 除notExpected外的额外插值: max, min, at
  date: {
    notExpected: "必须是有效的日期",
    max: "不能在 {max} 之后",
    min: "不能在 {min} 之前",
    at: "必须是 {at}",
    between: "必须在 {min} ~ {max} 之间",
  },
  // match包含额外插值keyword,  list.miss包含额外插值miss, 表示缺少的项
  match: "没有与 {keyword} 匹配的内容",
  list: {
    miss: "缺少 {miss}",
    diffLength: "长度不符",
  },
};

export const english = {
  required: "Required",
  object: "Must be a regular object",
  bool: "Must be a Boolean value",
  fn: "Must be function",
  symbol: "Must be a symbol value",
  regexp: "Must be a regexp object",
  regexpString: "Must be a valid regular character",
  url: "Must be a valid url",
  email: "Must be a valid email",
  // 额外插值: regexp
  pattern: "Invalid format",
  // 额外插值: specific
  specific: "Only be a {specific}",
  // 额外插值: targetLabel
  equality: "Must be a the same as {targetLabel}",
  // 额外插值: within
  within: "Must be a member of {within}",
  // 额外插值: without
  without: "Must be a value other than {without}",
  // 额外插值: max, min, length
  string: {
    notExpected: "Must be a string",
    max: "Length cannot be greater than {max}",
    min: "Length cannot be less than {min}",
    length: "The length can only be {length}",
  },
  // 额外插值: max, min, length
  array: {
    notExpected: "Must be a array",
    max: "No more than {max} items",
    min: "No less than {min} items",
    length: "Must be {length} items",
  },
  // 额外插值: max, min, size
  number: {
    notExpected: "Must be a number",
    notInteger: "Must be a integer",
    max: "Cannot be greater than {max}",
    min: "Cannot be less than {min}",
    size: "Must be {size}",
  },
  // 除notExpected外的额外插值: max, min, at
  date: {
    notExpected: "Must be a valid date",
    max: "Cannot be after {max}",
    min: "Cannot be before {min}",
    at: "Must be {at}",
    between: "Must be between {min} ~ {max}",
  },
  // match包含额外插值keyword,  list.miss包含额外插值miss, 表示缺少的项
  match: "No content matching {keyword}",
  list: {
    miss: "Missing {miss}",
    diffLength: "Length does not match",
  },
};
