---
title: Input - 输入框
group:
  title: 数据录入
  path: /form
  order: 3000
---

# Input 输入框

最基础、最重要的输入单元

## 示例

<code src="./demo.tsx" />

## 格式化输入

### 美化输入

<code src="./demo-format.tsx" />

### 限制输入

<code src="./demo-format-parser.tsx" />

## textArea

<code src="./demo-format-textarea.tsx" />

## props

**`Input`**

```tsx | pure
export interface InputProps
  extends FormLikeWithExtra<string, React.ChangeEvent<HTMLInputElement>>,
    InputPropsExtends {
  /**
   * 'text' | 输入框类型
   *  text - 可输入任何内容
   *  number - 可输入整数、浮点数
   *  integer - 可输入整数
   *  password - 密码框
   *  general - 只能输入常规字符`A-Za-z0-9_`
   * */
  type?: 'text' | 'number' | 'integer' | 'password' | 'general';
  /** 设置加载状态 */
  loading?: boolean;
  /** 设置阻塞型加载 */
  blockLoading?: boolean;
  /** true | 当value存在时出现清空图标 */
  allowClear?: boolean;
  /** 输入框状态，不同状态会以不同的功能色展示 */
  status?: Status;
  /** 组件尺寸 */
  size?: Size | 'big';
  /** 无边框 */
  notBorder?: boolean;
  /** 只有下边框 */
  underline?: boolean;
  /** 预设的格式化类型 */
  format?: 'phone' | 'idCard' | 'money' | 'bankCard';
  /** 格式化规则的模式字符，如format=phone的模式为为 `3,4,4`, 数字两端可包含空格 */
  formatPattern?: string;
  /** ' ' | 自定义格式化分隔符 */
  formatDelimiter?: string;
  /** 当字符长度超过pattern可匹配到的长度时，重复以当前pattern对剩余字符进行格式化 */
  formatRepeat?: boolean;
  /** 当字符长度超过pattern可匹配到的长度时，重复以当前pattern的最后一位对剩余字符进行格式化 */
  formatLastRepeat?: boolean;
  /** 将value格式化为特定格式，用于优化Input的显示 */
  formatter?: (value: string) => string;
  /**
   * 将formatter后的值进行还原, 当使用了formatter后，必须传此函数进行反向解析, 否则会导致Input值与内部值不一致
   * 也可以单独用于格式化串，如：限制长度、限制数字等 (此函数也可代替formatter使用， 但是formatter存在的原因是，实际提交的值和显示值应该分开，否则会影响验证、上传结果等, 如果你不关心这些，可以直接使用parser)
   * */
  parser?: (value: string) => string;
  /** 前置图标 */
  prefix?: React.ReactNode;
  /** 后置图标 */
  suffix?: React.ReactNode;
  /** 前置按钮 */
  prefixBtn?: React.ReactElement<ButtonProps>;
  /** 后置按钮 */
  suffixBtn?: React.ReactElement<ButtonProps>;
  /** false | 设置为搜索框, 出现搜索按钮 */
  search?: boolean;
  /** 点击搜索按钮/回车/清空时，触发 */
  onSearch?: (value: string) => void;
  /** 多行输入 */
  textArea?: boolean;
  /** true | textArea模式下，自动计算高度 */
  autoSize?: boolean;
  /** textArea ? true : false | 显示字符数统计 */
  charCount?: boolean;
  /** 按下回车的回调 */
  onPressEnter?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
```

**`相关接口`**

```tsx | pure
/**
 * 表单组件的统一接口， 包含额外参数
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * */
export interface FormLikeWithExtra<T, Ext = any> {
  value?: T;
  onChange?: (value: T, extra: Ext) => void;
  defaultValue?: T;
}
```
