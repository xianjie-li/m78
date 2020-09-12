---
title: Nnum - 数字
group:
  title: 展示组件
  path: /view
  order: 4000
---

# Num 数字

一个专门用来显示数字的组件，支持格式化、填充、动画等。

## 示例

<code src="./demo.tsx" />

## API

**`props`**
```tsx | pure
interface NumProps extends ComponentBaseProps {
  /** 数字动画 */
  transition?: boolean;
  /** 2 | 保留指定的小数位 */
  precision?: number;
  /** 格式为 `1,2,3,4` 规则的模式字符，数字两端可包含空格 */
  pattern?: string;
  /** ', ' | 分割符 */
  delimiter?: string;
  /** 当字符长度超过pattern可匹配到的长度时，重复以当前pattern对剩余字符进行格式化 */
  repeat?: boolean;
  /** 当字符长度超过pattern可匹配到的长度时，重复以当前pattern的最后一位对剩余字符进行格式化 */
  lastRepeat?: boolean;
  /** 数字或字符数字 */
  children?: number | string;
  /** 当长度不足时，先左侧填充0到指定长度 */
  padLeftZero?: number;
  /** 即将用于渲染的最终数字字符，可通过此函数执行渲染前的自定义转换 */
  format?: (numStr: string) => string;
}
```
